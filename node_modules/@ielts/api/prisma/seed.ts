import { PrismaClient } from '@prisma/client';
import { VOCAB_SEED_DATA } from './seedData/vocabData';
import { LISTENING_SEED_DATA } from './seedData/listeningData';
import { READING_SEED_DATA } from './seedData/readingData';
import { GRAMMAR_SEED_DATA } from './seedData/grammarData';
import { WRITING_SEED_DATA } from './seedData/writingData';
import { SPEAKING_SEED_DATA } from './seedData/speakingData';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting IELTS Band 6.5 Database Seed ---');

  // 1. Seed Default User Profile
  console.log('Seeding default user profile...');
  await prisma.userProfile.upsert({
    where: { id: 'default-user' },
    update: {},
    create: {
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

  // 2. Seed Vocabulary (100+ words across 14 topics)
  console.log(`Seeding ${VOCAB_SEED_DATA.length} vocabulary words...`);
  for (const v of VOCAB_SEED_DATA) {
    await prisma.vocabularyItem.upsert({
      where: { word: v.word },
      update: {},
      create: {
        word: v.word,
        ipa: v.ipa,
        pos: v.pos,
        meaningVi: v.meaningVi,
        definitionEn: v.definitionEn,
        exampleSentence: v.exampleSentence,
        exampleSentenceVi: v.exampleSentenceVi,
        collocationsJson: JSON.stringify(v.collocations),
        synonymsJson: JSON.stringify(v.synonyms),
        antonymsJson: JSON.stringify(v.antonyms),
        topic: v.topic,
        difficulty: v.difficulty,
        targetBand: v.targetBand,
      },
    });
  }

  // 3. Seed Listening Questions (20 questions)
  console.log(`Seeding ${LISTENING_SEED_DATA.length} listening questions...`);
  for (const l of LISTENING_SEED_DATA) {
    await prisma.question.create({
      data: {
        skill: 'LISTENING',
        section: l.section,
        topic: l.topic,
        questionType: l.questionType,
        difficulty: l.difficulty,
        targetBand: l.targetBand,
        audioUrl: l.audioUrl || null,
        transcript: l.transcript,
        transcriptVi: l.transcriptVi,
        instruction: l.instruction,
        instructionVi: l.instructionVi,
        questionText: l.questionText,
        questionTextVi: l.questionTextVi,
        optionsJson: l.options ? JSON.stringify(l.options) : null,
        correctAnswer: Array.isArray(l.correctAnswer)
          ? JSON.stringify(l.correctAnswer)
          : String(l.correctAnswer),
        explanationEn: l.explanationEn,
        explanationVi: l.explanationVi,
        evidenceQuote: l.evidenceQuote,
        distractorExplanationsJson: l.distractorExplanations
          ? JSON.stringify(l.distractorExplanations)
          : null,
        source: 'Original Practice Material',
      },
    });
  }

  // 4. Seed Reading Questions (30 questions across 3 passages)
  console.log(`Seeding ${READING_SEED_DATA.length} reading questions...`);
  for (const r of READING_SEED_DATA) {
    await prisma.question.create({
      data: {
        skill: 'READING',
        section: r.section,
        topic: r.topic,
        questionType: r.questionType,
        difficulty: r.difficulty,
        targetBand: r.targetBand,
        passageTitle: r.passageTitle,
        passageContent: r.passageContent,
        passageContentVi: r.passageContentVi,
        instruction: r.instruction,
        instructionVi: r.instructionVi,
        questionText: r.questionText,
        questionTextVi: r.questionTextVi,
        optionsJson: r.options ? JSON.stringify(r.options) : null,
        correctAnswer: Array.isArray(r.correctAnswer)
          ? JSON.stringify(r.correctAnswer)
          : String(r.correctAnswer),
        explanationEn: r.explanationEn,
        explanationVi: r.explanationVi,
        evidenceQuote: r.evidenceQuote,
        distractorExplanationsJson: r.distractorExplanations
          ? JSON.stringify(r.distractorExplanations)
          : null,
        source: 'Original Practice Material',
      },
    });
  }

  // 5. Seed Grammar Lessons and Exercises (13 lessons, 52 exercises)
  console.log(`Seeding ${GRAMMAR_SEED_DATA.length} grammar lessons...`);
  for (const g of GRAMMAR_SEED_DATA) {
    const lesson = await prisma.grammarLesson.upsert({
      where: { topicId: g.topicId },
      update: {},
      create: {
        topicId: g.topicId,
        title: g.title,
        titleVi: g.titleVi,
        bandTarget: g.bandTarget,
        explanationEn: g.explanationEn,
        explanationVi: g.explanationVi,
        keyRulesJson: JSON.stringify(g.keyRules),
        commonMistakesJson: JSON.stringify(g.commonMistakes),
      },
    });

    for (const ex of g.exercises) {
      await prisma.grammarExercise.create({
        data: {
          lessonId: lesson.id,
          instruction: ex.instruction,
          instructionVi: ex.instructionVi,
          prompt: ex.prompt,
          promptVi: ex.promptVi,
          optionsJson: ex.options ? JSON.stringify(ex.options) : null,
          correctAnswer: ex.correctAnswer,
          explanationEn: ex.explanationEn,
          explanationVi: ex.explanationVi,
          bandTrapNotes: ex.bandTrapNotes,
        },
      });
    }
  }

  // 6. Seed Writing Prompts (20 Task 1 + 20 Task 2)
  console.log(`Seeding ${WRITING_SEED_DATA.length} writing prompts...`);
  for (const w of WRITING_SEED_DATA) {
    await prisma.writingPrompt.create({
      data: {
        taskType: w.taskType,
        subType: w.subType,
        title: w.title,
        titleVi: w.titleVi,
        prompt: w.prompt,
        promptVi: w.promptVi,
        suggestedStructureJson: JSON.stringify(w.suggestedStructure),
        band65Sample: w.band65Sample,
        keyVocabularyJson: JSON.stringify(w.keyVocabulary),
      },
    });
  }

  // 7. Seed Speaking Prompts (30 Part 1 + 20 Part 2 + 20 Part 3)
  console.log(`Seeding ${SPEAKING_SEED_DATA.length} speaking prompts...`);
  for (const s of SPEAKING_SEED_DATA) {
    await prisma.speakingPrompt.create({
      data: {
        part: s.part,
        topic: s.topic,
        topicVi: s.topicVi,
        question: s.question,
        questionVi: s.questionVi,
        cuesJson: s.cues ? JSON.stringify(s.cues) : null,
        followUpsJson: s.followUps ? JSON.stringify(s.followUps) : null,
        usefulPhrasesJson: JSON.stringify(s.usefulPhrases),
        modelAnswer: s.modelAnswer,
      },
    });
  }

  console.log('--- Successfully completed IELTS Band 6.5 Database Seed! ---');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
