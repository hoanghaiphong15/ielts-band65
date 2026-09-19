"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const shared_1 = require("@ielts/shared");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const submitMockTestSchema = zod_1.z.object({
    testType: zod_1.z.enum(['FULL', 'SKILL', 'MINI']),
    skill: zod_1.z.enum(['LISTENING', 'READING', 'WRITING', 'SPEAKING']).optional(),
    listeningRawScore: zod_1.z.number().optional(),
    listeningTotal: zod_1.z.number().optional(),
    readingRawScore: zod_1.z.number().optional(),
    readingTotal: zod_1.z.number().optional(),
    writingBand: zod_1.z.number().optional(),
    speakingBand: zod_1.z.number().optional(),
    timeSpentSecs: zod_1.z.number().default(0),
    details: zod_1.z.any().optional(),
});
router.post('/submit', async (req, res) => {
    try {
        const data = submitMockTestSchema.parse(req.body);
        let listeningBand = undefined;
        if (data.listeningRawScore !== undefined) {
            listeningBand = (0, shared_1.calculateListeningBand)(data.listeningRawScore, data.listeningTotal || 40);
        }
        let readingBand = undefined;
        if (data.readingRawScore !== undefined) {
            readingBand = (0, shared_1.calculateAcademicReadingBand)(data.readingRawScore, data.readingTotal || 40);
        }
        const writingBand = data.writingBand ?? 5.5;
        const speakingBand = data.speakingBand ?? 5.5;
        const finalListening = listeningBand ?? 5.5;
        const finalReading = readingBand ?? 5.5;
        const overallBand = (0, shared_1.calculateOverallBand)(finalListening, finalReading, writingBand, speakingBand);
        const mockTest = await prisma.mockTest.create({
            data: {
                testType: data.testType,
                listeningBand,
                readingBand,
                writingBand,
                speakingBand,
                overallBand,
                listeningRawScore: data.listeningRawScore,
                readingRawScore: data.readingRawScore,
                timeSpentSecs: data.timeSpentSecs,
                detailsJson: data.details ? JSON.stringify(data.details) : null,
            },
        });
        // Update user profile
        await prisma.userProfile.update({
            where: { id: 'default-user' },
            data: {
                currentBand: overallBand,
                listeningBand: listeningBand ?? undefined,
                readingBand: readingBand ?? undefined,
                writingBand,
                speakingBand,
            },
        });
        res.json({
            id: mockTest.id,
            testType: mockTest.testType,
            listeningBand,
            readingBand,
            writingBand,
            speakingBand,
            overallBand,
            completedAt: mockTest.completedAt,
        });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to record mock test', details: error });
    }
});
// Get past mock test results
router.get('/history', async (req, res) => {
    try {
        const history = await prisma.mockTest.findMany({
            orderBy: { completedAt: 'desc' },
            take: 20,
        });
        const parsed = history.map((h) => ({
            ...h,
            details: h.detailsJson ? JSON.parse(h.detailsJson) : null,
        }));
        res.json(parsed);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch mock test history' });
    }
});
exports.default = router;
