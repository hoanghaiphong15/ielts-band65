import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getAIService } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// List speaking prompts
router.get('/prompts', async (req, res) => {
  try {
    const { part, topic } = req.query;
    const where: any = {};
    if (part) where.part = Number(part);
    if (topic) where.topic = String(topic);

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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch speaking prompts' });
  }
});

// Get prompt by ID
router.get('/prompts/:id', async (req, res) => {
  try {
    const prompt = await prisma.speakingPrompt.findUnique({
      where: { id: req.params.id },
    });

    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });

    res.json({
      ...prompt,
      cues: prompt.cuesJson ? JSON.parse(prompt.cuesJson) : [],
      followUps: prompt.followUpsJson ? JSON.parse(prompt.followUpsJson) : [],
      usefulPhrases: JSON.parse(prompt.usefulPhrasesJson),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch speaking prompt' });
  }
});

// Submit speaking evaluation
const submitSpeakingSchema = z.object({
  promptId: z.string(),
  part: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  transcript: z.string().min(5),
  durationSecs: z.number().min(1),
  audioPath: z.string().optional(),
});

router.post('/submissions', async (req, res) => {
  try {
    const { promptId, part, transcript, durationSecs, audioPath } =
      submitSpeakingSchema.parse(req.body);

    const prompt = await prisma.speakingPrompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });

    const apiKey = (req.headers['x-gemini-api-key'] as string) || (req.body as any)?.apiKey;
    const aiService = getAIService(apiKey);
    const evaluation = await aiService.evaluateSpeaking(
      part as 1 | 2 | 3,
      transcript,
      durationSecs,
      prompt.topic,
      apiKey
    );

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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch speaking submissions' });
  }
});

export default router;
