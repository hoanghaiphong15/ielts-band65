import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import {
  calculateAcademicReadingBand,
  calculateListeningBand,
  calculateOverallBand,
} from '@ielts/shared';

const router = Router();
const prisma = new PrismaClient();

const submitMockTestSchema = z.object({
  testType: z.enum(['FULL', 'SKILL', 'MINI']),
  skill: z.enum(['LISTENING', 'READING', 'WRITING', 'SPEAKING']).optional(),
  listeningRawScore: z.number().optional(),
  listeningTotal: z.number().optional(),
  readingRawScore: z.number().optional(),
  readingTotal: z.number().optional(),
  writingBand: z.number().optional(),
  speakingBand: z.number().optional(),
  timeSpentSecs: z.number().default(0),
  details: z.any().optional(),
});

router.post('/submit', async (req, res) => {
  try {
    const data = submitMockTestSchema.parse(req.body);

    let listeningBand: number | undefined = undefined;
    if (data.listeningRawScore !== undefined) {
      listeningBand = calculateListeningBand(data.listeningRawScore, data.listeningTotal || 40);
    }

    let readingBand: number | undefined = undefined;
    if (data.readingRawScore !== undefined) {
      readingBand = calculateAcademicReadingBand(data.readingRawScore, data.readingTotal || 40);
    }

    const writingBand = data.writingBand ?? 5.5;
    const speakingBand = data.speakingBand ?? 5.5;

    const finalListening = listeningBand ?? 5.5;
    const finalReading = readingBand ?? 5.5;

    const overallBand = calculateOverallBand(
      finalListening,
      finalReading,
      writingBand,
      speakingBand
    );

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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mock test history' });
  }
});

export default router;
