"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const aiService_1 = require("../services/aiService");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// List speaking prompts
router.get('/prompts', async (req, res) => {
    try {
        const { part, topic } = req.query;
        const where = {};
        if (part)
            where.part = Number(part);
        if (topic)
            where.topic = String(topic);
        const prompts = await prisma.speakingPrompt.findMany({
            where,
            orderBy: [{ part: 'asc' }, { id: 'asc' }],
        });
        const parsed = prompts.map((p) => ({
            ...p,
            cues: p.cuesJson ? JSON.parse(p.cuesJson) : [],
            followUps: p.followUpsJson ? JSON.parse(p.followUpsJson) : [],
            usefulPhrases: JSON.parse(p.usefulPhrasesJson),
        }));
        res.json(parsed);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch speaking prompts' });
    }
});
// Get prompt by ID
router.get('/prompts/:id', async (req, res) => {
    try {
        const prompt = await prisma.speakingPrompt.findUnique({
            where: { id: req.params.id },
        });
        if (!prompt)
            return res.status(404).json({ error: 'Prompt not found' });
        res.json({
            ...prompt,
            cues: prompt.cuesJson ? JSON.parse(prompt.cuesJson) : [],
            followUps: prompt.followUpsJson ? JSON.parse(prompt.followUpsJson) : [],
            usefulPhrases: JSON.parse(prompt.usefulPhrasesJson),
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch speaking prompt' });
    }
});
// Submit speaking evaluation
const submitSpeakingSchema = zod_1.z.object({
    promptId: zod_1.z.string(),
    part: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]),
    transcript: zod_1.z.string().min(5),
    durationSecs: zod_1.z.number().min(1),
    audioPath: zod_1.z.string().optional(),
});
router.post('/submissions', async (req, res) => {
    try {
        const { promptId, part, transcript, durationSecs, audioPath } = submitSpeakingSchema.parse(req.body);
        const prompt = await prisma.speakingPrompt.findUnique({
            where: { id: promptId },
        });
        if (!prompt)
            return res.status(404).json({ error: 'Prompt not found' });
        const apiKey = req.headers['x-gemini-api-key'] || req.body?.apiKey;
        const aiService = (0, aiService_1.getAIService)(apiKey);
        const evaluation = await aiService.evaluateSpeaking(part, transcript, durationSecs, prompt.topic, apiKey);
        const submission = await prisma.speakingSubmission.create({
            data: {
                promptId,
                part,
                audioPath,
                durationSecs,
                transcript,
                fluencyScore: evaluation.fluencyScore,
                lexicalScore: evaluation.lexicalScore,
                grammarScore: evaluation.grammarScore,
                pronunciationScore: evaluation.pronunciationScore,
                estimatedBand: evaluation.estimatedBand,
                evaluationJson: JSON.stringify(evaluation),
            },
        });
        // Update user profile speaking band
        await prisma.userProfile.update({
            where: { id: 'default-user' },
            data: {
                speakingBand: evaluation.estimatedBand,
            },
        });
        res.json({
            submissionId: submission.id,
            evaluation,
        });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to evaluate speaking submission', details: error });
    }
});
// Get user speaking submissions history
router.get('/submissions', async (req, res) => {
    try {
        const submissions = await prisma.speakingSubmission.findMany({
            include: { prompt: true },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        const parsed = submissions.map((s) => ({
            ...s,
            evaluation: JSON.parse(s.evaluationJson),
        }));
        res.json(parsed);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch speaking submissions' });
    }
});
exports.default = router;
