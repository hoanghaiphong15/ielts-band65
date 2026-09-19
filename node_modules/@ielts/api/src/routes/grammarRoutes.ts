import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// List all grammar lessons
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await prisma.grammarLesson.findMany({
      include: {
        _count: {
          select: { exercises: true },
        },
      },
      orderBy: { topicId: 'asc' },
    });

    const parsed = lessons.map((l) => ({
      id: l.id,
      topicId: l.topicId,
      title: l.title,
      titleVi: l.titleVi,
      bandTarget: l.bandTarget,
      explanationEn: l.explanationEn,
      explanationVi: l.explanationVi,
      exerciseCount: l._count.exercises,
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grammar lessons' });
  }
});

// Get detailed lesson with exercises
router.get('/lessons/:topicId', async (req, res) => {
  try {
    const lesson = await prisma.grammarLesson.findUnique({
      where: { topicId: req.params.topicId },
      include: { exercises: true },
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const parsed = {
      ...lesson,
      keyRules: JSON.parse(lesson.keyRulesJson),
      commonMistakes: JSON.parse(lesson.commonMistakesJson),
      exercises: lesson.exercises.map((e) => ({
        ...e,
        options: e.optionsJson ? JSON.parse(e.optionsJson) : [],
      })),
    };

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grammar lesson' });
  }
});

// Check grammar exercise answer
const checkExerciseSchema = z.object({
  exerciseId: z.string(),
  answer: z.string(),
});

router.post('/check', async (req, res) => {
  try {
    const { exerciseId, answer } = checkExerciseSchema.parse(req.body);

    const exercise = await prisma.grammarExercise.findUnique({
      where: { id: exerciseId },
      include: { lesson: true },
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const isCorrect =
      answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();

    // If incorrect, log to Mistake Book
    if (!isCorrect) {
      await prisma.mistake.create({
        data: {
          skill: 'GRAMMAR',
          questionText: exercise.prompt,
          questionType: 'sentence_completion',
          topic: exercise.lesson.title,
          userAnswer: answer,
          correctAnswer: exercise.correctAnswer,
          explanationEn: exercise.explanationEn,
          explanationVi: exercise.explanationVi,
          mistakeReason: exercise.bandTrapNotes,
        },
      });
    }

    res.json({
      isCorrect,
      correctAnswer: exercise.correctAnswer,
      explanationEn: exercise.explanationEn,
      explanationVi: exercise.explanationVi,
      bandTrapNotes: exercise.bandTrapNotes,
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to check grammar exercise', details: error });
  }
});

export default router;
