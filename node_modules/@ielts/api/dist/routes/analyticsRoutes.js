"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', async (req, res) => {
    try {
        const profile = await prisma.userProfile.findUnique({
            where: { id: 'default-user' },
        });
        // Fetch attempts
        const attempts = await prisma.attempt.findMany({
            include: { question: true },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        // Accuracy by skill
        const skillStats = {
            LISTENING: { total: 0, correct: 0 },
            READING: { total: 0, correct: 0 },
        };
        // Accuracy by question type
        const questionTypeStats = {};
        for (const a of attempts) {
            const skill = a.question.skill;
            if (skillStats[skill]) {
                skillStats[skill].total++;
                if (a.isCorrect)
                    skillStats[skill].correct++;
            }
            const qType = a.question.questionType;
            if (!questionTypeStats[qType]) {
                questionTypeStats[qType] = { total: 0, correct: 0 };
            }
            questionTypeStats[qType].total++;
            if (a.isCorrect)
                questionTypeStats[qType].correct++;
        }
        const accuracyBySkill = Object.entries(skillStats).map(([skill, stat]) => ({
            skill,
            accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
            totalAttempts: stat.total,
        }));
        const accuracyByQuestionType = Object.entries(questionTypeStats).map(([type, stat]) => ({
            type,
            accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
            totalAttempts: stat.total,
        }));
        // Vocabulary counts
        const totalVocab = await prisma.vocabularyItem.count();
        const masteredVocab = await prisma.userVocabProgress.count({
            where: { srsStage: 'mastered' },
        });
        const learningVocab = await prisma.userVocabProgress.count({
            where: { srsStage: { in: ['learning', 'review'] } },
        });
        // Mistake counts
        const totalMistakes = await prisma.mistake.count();
        const unresolvedMistakes = await prisma.mistake.count({
            where: { isResolved: false },
        });
        // Mock test count
        const mockTests = await prisma.mockTest.findMany({
            orderBy: { completedAt: 'asc' },
            select: {
                completedAt: true,
                overallBand: true,
                listeningBand: true,
                readingBand: true,
                writingBand: true,
                speakingBand: true,
            },
        });
        res.json({
            profile,
            accuracyBySkill,
            accuracyByQuestionType,
            vocabulary: {
                total: totalVocab,
                mastered: masteredVocab,
                learning: learningVocab,
            },
            mistakes: {
                total: totalMistakes,
                unresolved: unresolvedMistakes,
            },
            mockTestsHistory: mockTests,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
exports.default = router;
