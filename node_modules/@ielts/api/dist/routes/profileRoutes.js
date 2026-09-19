"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get current user profile (or initialize default)
router.get('/', async (req, res) => {
    try {
        let profile = await prisma.userProfile.findUnique({
            where: { id: 'default-user' },
        });
        if (!profile) {
            profile = await prisma.userProfile.create({
                data: {
                    id: 'default-user',
                    name: 'Vietnamese Learner',
                    targetBand: 6.5,
                    currentBand: 5.0,
                    listeningBand: 5.0,
                    readingBand: 5.5,
                    writingBand: 4.5,
                    speakingBand: 5.0,
                    dailyGoalMinutes: 45,
                    streakDays: 1,
                    lastActiveDate: new Date().toISOString().split('T')[0],
                    hasCompletedPlacement: false,
                    language: 'vi',
                    theme: 'system',
                },
            });
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    targetBand: zod_1.z.number().min(1).max(9).optional(),
    currentBand: zod_1.z.number().min(1).max(9).optional(),
    listeningBand: zod_1.z.number().min(1).max(9).optional(),
    readingBand: zod_1.z.number().min(1).max(9).optional(),
    writingBand: zod_1.z.number().min(1).max(9).optional(),
    speakingBand: zod_1.z.number().min(1).max(9).optional(),
    dailyGoalMinutes: zod_1.z.number().min(10).max(300).optional(),
    examDate: zod_1.z.string().optional().nullable(),
    hasCompletedPlacement: zod_1.z.boolean().optional(),
    language: zod_1.z.enum(['en', 'vi']).optional(),
    theme: zod_1.z.enum(['light', 'dark', 'system']).optional(),
});
router.put('/', async (req, res) => {
    try {
        const data = updateProfileSchema.parse(req.body);
        const updated = await prisma.userProfile.upsert({
            where: { id: 'default-user' },
            update: data,
            create: {
                id: 'default-user',
                ...data,
            },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid profile data', details: error });
    }
});
// Reset progress
router.post('/reset', async (req, res) => {
    try {
        await prisma.attempt.deleteMany();
        await prisma.mistake.deleteMany();
        await prisma.userVocabProgress.deleteMany();
        await prisma.writingSubmission.deleteMany();
        await prisma.speakingSubmission.deleteMany();
        await prisma.mockTest.deleteMany();
        await prisma.studySession.deleteMany();
        const resetProfile = await prisma.userProfile.update({
            where: { id: 'default-user' },
            data: {
                currentBand: 5.0,
                listeningBand: 5.0,
                readingBand: 5.5,
                writingBand: 4.5,
                speakingBand: 5.0,
                streakDays: 1,
                hasCompletedPlacement: false,
            },
        });
        res.json({ message: 'Progress reset successfully', profile: resetProfile });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to reset progress' });
    }
});
exports.default = router;
