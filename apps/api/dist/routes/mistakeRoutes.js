"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// List mistakes with filters
router.get('/', async (req, res) => {
    try {
        const { skill, isResolved, limit, offset } = req.query;
        const where = {};
        if (skill)
            where.skill = String(skill).toUpperCase();
        if (isResolved !== undefined)
            where.isResolved = isResolved === 'true';
        const mistakes = await prisma.mistake.findMany({
            where,
            orderBy: { date: 'desc' },
            take: limit ? Number(limit) : 50,
            skip: offset ? Number(offset) : 0,
        });
        res.json(mistakes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch mistakes' });
    }
});
// Get mistake by ID
router.get('/:id', async (req, res) => {
    try {
        const mistake = await prisma.mistake.findUnique({
            where: { id: req.params.id },
        });
        if (!mistake)
            return res.status(404).json({ error: 'Mistake not found' });
        res.json(mistake);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch mistake' });
    }
});
// Update mistake status (e.g. mark resolved)
const updateMistakeSchema = zod_1.z.object({
    isResolved: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().optional(),
});
router.put('/:id', async (req, res) => {
    try {
        const data = updateMistakeSchema.parse(req.body);
        const updated = await prisma.mistake.update({
            where: { id: req.params.id },
            data,
        });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update mistake', details: error });
    }
});
// Re-practice mistake
router.post('/:id/re-practice', async (req, res) => {
    try {
        const { answer } = req.body;
        const mistake = await prisma.mistake.findUnique({
            where: { id: req.params.id },
        });
        if (!mistake)
            return res.status(404).json({ error: 'Mistake not found' });
        const isCorrect = String(answer).trim().toLowerCase() === mistake.correctAnswer.trim().toLowerCase();
        const updated = await prisma.mistake.update({
            where: { id: req.params.id },
            data: {
                reviewCount: { increment: 1 },
                lastPracticedAt: new Date(),
                isResolved: isCorrect,
            },
        });
        res.json({
            isCorrect,
            correctAnswer: mistake.correctAnswer,
            explanationEn: mistake.explanationEn,
            explanationVi: mistake.explanationVi,
            evidenceQuote: mistake.evidenceQuote,
            mistake: updated,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to re-practice mistake' });
    }
});
exports.default = router;
