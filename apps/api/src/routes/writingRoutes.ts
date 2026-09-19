import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getAIService } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// List writing prompts
router.get('/prompts', async (req, res) => {
  try {
    const { taskType, subType } = req.query;
    const where: any = {};
    if (taskType) where.taskType = String(taskType).toUpperCase();
    if (subType) where.subType = String(subType);

    const prompts = await prisma.writingPrompt.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const parsed = prompts.map((p) => ({
      ...p,
      suggestedStructure: JSON.parse(p.suggestedStructureJson),
      keyVocabulary: JSON.parse(p.keyVocabularyJson),
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch writing prompts' });
  }
});

// Get prompt by ID
router.get('/prompts/:id', async (req, res) => {
  try {
    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: req.params.id },
    });

    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });

    res.json({
      ...prompt,
      suggestedStructure: JSON.parse(prompt.suggestedStructureJson),
      keyVocabulary: JSON.parse(prompt.keyVocabularyJson),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch writing prompt' });
  }
});

// Submit writing essay
const submitWritingSchema = z.object({
  promptId: z.string(),
  taskType: z.enum(['TASK_1', 'TASK_2']),
  content: z.string().min(20),
  planNotes: z.string().optional(),
  timeSpentSecs: z.number().default(0),
});

router.post('/submissions', async (req, res) => {
  try {
    const { promptId, taskType, content, planNotes, timeSpentSecs } =
      submitWritingSchema.parse(req.body);

    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });

    // Evaluate writing
    const apiKey = (req.headers['x-gemini-api-key'] as string) || (req.body as any)?.apiKey;
    const aiService = getAIService(apiKey);
    const evaluation = await aiService.evaluateWriting(taskType, content, prompt.prompt, apiKey);

    // Save submission
    const submission = await prisma.writingSubmission.create({
      data: {
        promptId,
        taskType,
        content,
        planNotes,
        wordCount: evaluation.wordCount,
        timeSpentSecs,
        taskResponseScore: evaluation.taskResponseScore,
        coherenceScore: evaluation.coherenceScore,
        lexicalScore: evaluation.lexicalScore,
        grammarScore: evaluation.grammarScore,
        estimatedBand: evaluation.estimatedBand,
        evaluationJson: JSON.stringify(evaluation),
      },
    });

    // Update user profile writing band
    await prisma.userProfile.update({
      where: { id: 'default-user' },
      data: {
        writingBand: evaluation.estimatedBand,
      },
    });

    res.json({
      submissionId: submission.id,
      evaluation,
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to evaluate writing submission', details: error });
  }
});

// Get user writing submissions history
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await prisma.writingSubmission.findMany({
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
    res.status(500).json({ error: 'Failed to fetch writing submissions' });
  }
});

export default router;
