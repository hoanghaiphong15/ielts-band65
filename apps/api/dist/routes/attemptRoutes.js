"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const attemptSchema = zod_1.z.object({
    questionId: zod_1.z.string(),
    userResponse: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    timeSpentSecs: zod_1.z.number().default(0),
});
router.post('/', async (req, res) => {
    try {
        const { questionId, userResponse, timeSpentSecs } = attemptSchema.parse(req.body);
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        // Determine correctness
        let isCorrect = false;
        const normUser = Array.isArray(userResponse)
            ? userResponse.map((u) => u.trim().toLowerCase()).sort().join(',')
            : userResponse.trim().toLowerCase();
        // Check if correct answer is stored as JSON array or string
        let expectedAnswers = [];
        try {
            const parsed = JSON.parse(question.correctAnswer);
            expectedAnswers = Array.isArray(parsed) ? parsed : [String(parsed)];
        }
        catch {
            expectedAnswers = [question.correctAnswer];
        }
        const normExpected = expectedAnswers.map((a) => a.trim().toLowerCase()).sort().join(',');
        isCorrect = normUser === normExpected;
        // Record attempt
        const attempt = await prisma.attempt.create({
            data: {
                questionId,
                userResponse: Array.isArray(userResponse) ? JSON.stringify(userResponse) : userResponse,
                isCorrect,
                score: isCorrect ? 1.0 : 0.0,
                timeSpentSecs,
            },
        });
        // Auto-manage Mistake Book entry
        if (!isCorrect) {
            await prisma.mistake.create({
                data: {
                    skill: question.skill,
                    questionId: question.id,
                    questionText: question.questionText,
                    questionType: question.questionType,
                    topic: question.topic,
                    userAnswer: Array.isArray(userResponse) ? userResponse.join(', ') : userResponse,
                    correctAnswer: expectedAnswers.join(', '),
                    explanationEn: question.explanationEn,
                    explanationVi: question.explanationVi,
                    evidenceQuote: question.evidenceQuote,
                    isResolved: false,
                    reviewCount: 0,
                },
            });
        }
        else {
            // Mark existing unresolved mistakes for this question as resolved
            await prisma.mistake.updateMany({
                where: {
                    questionId: question.id,
                    isResolved: false,
                },
                data: {
                    isResolved: true,
                    reviewCount: { increment: 1 },
                    lastPracticedAt: new Date(),
                },
            });
        }
        // Update user streak if active today
        const today = new Date().toISOString().split('T')[0];
        const user = await prisma.userProfile.findUnique({ where: { id: 'default-user' } });
        if (user && user.lastActiveDate !== today) {
            await prisma.userProfile.update({
                where: { id: 'default-user' },
                data: {
                    streakDays: user.lastActiveDate === '' ? 1 : { increment: 1 },
                    lastActiveDate: today,
                },
            });
        }
        res.json({
            attemptId: attempt.id,
            isCorrect,
            userResponse,
            correctAnswer: expectedAnswers.join(', '),
            explanationEn: question.explanationEn,
            explanationVi: question.explanationVi,
            evidenceQuote: question.evidenceQuote,
            distractorExplanations: question.distractorExplanationsJson
                ? JSON.parse(question.distractorExplanationsJson)
                : null,
        });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to process attempt', details: error });
    }
});
exports.default = router;
