"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const studyPlanGenerator_1 = require("../services/studyPlanGenerator");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get today's study plan
router.get('/', async (req, res) => {
    try {
        const profile = await prisma.userProfile.findUnique({
            where: { id: 'default-user' },
        });
        const targetMinutes = profile ? profile.dailyGoalMinutes : 45;
        // Count due vocab
        const dueVocabCount = await prisma.userVocabProgress.count({
            where: { nextReviewAt: { lte: new Date() } },
        });
        // Count unresolved mistakes
        const unresolvedMistakesCount = await prisma.mistake.count({
            where: { isResolved: false },
        });
        const plan = (0, studyPlanGenerator_1.generateDailyStudyPlan)(targetMinutes, {
            listeningBand: profile?.listeningBand || 5.0,
            readingBand: profile?.readingBand || 5.5,
            writingBand: profile?.writingBand || 4.5,
            speakingBand: profile?.speakingBand || 5.0,
            dueVocabCount,
            unresolvedMistakesCount,
        });
        res.json(plan);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate study plan' });
    }
});
// Generate study plan with custom duration
router.post('/generate', async (req, res) => {
    try {
        const { minutes } = req.body;
        const targetMinutes = Number(minutes) || 45;
        const profile = await prisma.userProfile.findUnique({
            where: { id: 'default-user' },
        });
        const dueVocabCount = await prisma.userVocabProgress.count({
            where: { nextReviewAt: { lte: new Date() } },
        });
        const unresolvedMistakesCount = await prisma.mistake.count({
            where: { isResolved: false },
        });
        const plan = (0, studyPlanGenerator_1.generateDailyStudyPlan)(targetMinutes, {
            listeningBand: profile?.listeningBand || 5.0,
            readingBand: profile?.readingBand || 5.5,
            writingBand: profile?.writingBand || 4.5,
            speakingBand: profile?.speakingBand || 5.0,
            dueVocabCount,
            unresolvedMistakesCount,
        });
        res.json(plan);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate study plan' });
    }
});
exports.default = router;
