import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { calculateSRS } from '@ielts/shared';

const router = Router();
const prisma = new PrismaClient();

// List vocabulary with filters
router.get('/', async (req, res) => {
  try {
    const { topic, search, difficulty, limit, offset } = req.query;
    const where: any = {};

    if (topic) where.topic = String(topic);
    if (difficulty) where.difficulty = String(difficulty);
    if (search) {
      where.OR = [
        { word: { contains: String(search) } },
        { meaningVi: { contains: String(search) } },
        { definitionEn: { contains: String(search) } },
      ];
    }

    const items = await prisma.vocabularyItem.findMany({
      where,
      include: { userProgress: true },
      take: limit ? Number(limit) : 100,
      skip: offset ? Number(offset) : 0,
      orderBy: { word: 'asc' },
    });

    const parsed = items.map((item) => ({
      ...item,
      collocations: JSON.parse(item.collocationsJson),
      synonyms: JSON.parse(item.synonymsJson),
      antonyms: JSON.parse(item.antonymsJson),
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Get due vocabulary for SRS review
router.get('/review', async (req, res) => {
  try {
    const now = new Date();

    // 1. Get words with progress that are due
    const dueProgress = await prisma.userVocabProgress.findMany({
      where: {
        nextReviewAt: { lte: now },
      },
      include: { vocabulary: true },
      take: 30,
    });

    // 2. Also get some unstudied words if queue is small
    let unstudied: any[] = [];
    if (dueProgress.length < 15) {
      unstudied = await prisma.vocabularyItem.findMany({
        where: {
          userProgress: null,
        },
        take: 15 - dueProgress.length,
      });
    }

    const combined = [
      ...dueProgress.map((p) => ({
        ...p.vocabulary,
        collocations: JSON.parse(p.vocabulary.collocationsJson),
        synonyms: JSON.parse(p.vocabulary.synonymsJson),
        antonyms: JSON.parse(p.vocabulary.antonymsJson),
        userProgress: {
          srsStage: p.srsStage,
          interval: p.interval,
          repetitions: p.repetitions,
          easeFactor: p.easeFactor,
          nextReviewAt: p.nextReviewAt,
        },
      })),
      ...unstudied.map((item) => ({
        ...item,
        collocations: JSON.parse(item.collocationsJson),
        synonyms: JSON.parse(item.synonymsJson),
        antonyms: JSON.parse(item.antonymsJson),
        userProgress: {
          srsStage: 'new',
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReviewAt: new Date().toISOString(),
        },
      })),
    ];

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
});

// Submit flashcard review rating (0 to 5)
const reviewSchema = z.object({
  quality: z.number().min(0).max(5),
});

router.post('/review/:vocabId', async (req, res) => {
  try {
    const { quality } = reviewSchema.parse(req.body);
    const { vocabId } = req.params;

    let progress = await prisma.userVocabProgress.findUnique({
      where: { vocabId },
    });

    const currentRepetitions = progress ? progress.repetitions : 0;
    const currentInterval = progress ? progress.interval : 1;
    const currentEase = progress ? progress.easeFactor : 2.5;

    const srsResult = calculateSRS({
      quality,
      repetitions: currentRepetitions,
      interval: currentInterval,
      easeFactor: currentEase,
    });

    const isSuccess = quality >= 3;

    const updated = await prisma.userVocabProgress.upsert({
      where: { vocabId },
      create: {
        vocabId,
        srsStage: srsResult.stage,
        interval: srsResult.interval,
        easeFactor: srsResult.easeFactor,
        repetitions: srsResult.repetitions,
        nextReviewAt: new Date(srsResult.nextReviewAt),
        correctCount: isSuccess ? 1 : 0,
        wrongCount: isSuccess ? 0 : 1,
        lastReviewedAt: new Date(),
      },
      update: {
        srsStage: srsResult.stage,
        interval: srsResult.interval,
        easeFactor: srsResult.easeFactor,
        repetitions: srsResult.repetitions,
        nextReviewAt: new Date(srsResult.nextReviewAt),
        correctCount: isSuccess ? { increment: 1 } : undefined,
        wrongCount: !isSuccess ? { increment: 1 } : undefined,
        lastReviewedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to record vocabulary review', details: error });
  }
});

// Get vocabulary statistics
router.get('/stats', async (req, res) => {
  try {
    const totalWords = await prisma.vocabularyItem.count();
    const progressList = await prisma.userVocabProgress.findMany();

    let newCount = totalWords - progressList.length;
    let learningCount = 0;
    let reviewCount = 0;
    let masteredCount = 0;

    for (const p of progressList) {
      if (p.srsStage === 'learning') learningCount++;
      else if (p.srsStage === 'review') reviewCount++;
      else if (p.srsStage === 'mastered') masteredCount++;
      else newCount++;
    }

    const now = new Date();
    const dueCount = await prisma.userVocabProgress.count({
      where: { nextReviewAt: { lte: now } },
    });

    res.json({
      totalWords,
      newCount,
      learningCount,
      reviewCount,
      masteredCount,
      dueCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vocabulary stats' });
  }
});

export default router;
