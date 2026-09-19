import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get questions with filters
router.get('/', async (req, res) => {
  try {
    const { skill, section, topic, questionType, difficulty, limit, offset } = req.query;

    const where: any = {};
    if (skill) where.skill = String(skill).toUpperCase();
    if (section) where.section = Number(section);
    if (topic) where.topic = String(topic);
    if (questionType) where.questionType = String(questionType);
    if (difficulty) where.difficulty = String(difficulty);

    const questions = await prisma.question.findMany({
      where,
      take: limit ? Number(limit) : 50,
      skip: offset ? Number(offset) : 0,
      orderBy: { id: 'asc' },
    });

    const parsed = questions.map((q) => ({
      ...q,
      options: q.optionsJson ? JSON.parse(q.optionsJson) : [],
      distractorExplanations: q.distractorExplanationsJson ? JSON.parse(q.distractorExplanationsJson) : null,
      tags: q.tagsJson ? JSON.parse(q.tagsJson) : [],
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const parsed = {
      ...question,
      options: question.optionsJson ? JSON.parse(question.optionsJson) : [],
      distractorExplanations: question.distractorExplanationsJson ? JSON.parse(question.distractorExplanationsJson) : null,
      tags: question.tagsJson ? JSON.parse(question.tagsJson) : [],
    };

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

export default router;
