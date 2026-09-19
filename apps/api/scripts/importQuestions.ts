import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImportQuestionData {
  skill: string;
  section?: number;
  topic?: string;
  questionType: string;
  difficulty?: string;
  band?: number;
  targetBand?: number;
  passageTitle?: string;
  passageContent?: string;
  passageContentVi?: string;
  audioUrl?: string;
  transcript?: string;
  transcriptVi?: string;
  instruction?: string;
  instructionVi?: string;
  question: string;
  questionVi?: string;
  options?: any[];
  answer: string | string[];
  explanation: string;
  explanationVi?: string;
  evidenceQuote?: string;
  distractorExplanations?: Record<string, { en: string; vi: string }>;
  tags?: string[];
  source?: string;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: tsx scripts/importQuestions.ts <path-to-json-file>');
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  const items: ImportQuestionData[] = JSON.parse(raw);

  console.log(`Importing ${items.length} questions from ${resolvedPath}...`);

  let count = 0;
  for (const item of items) {
    await prisma.question.create({
      data: {
        skill: item.skill.toUpperCase(),
        section: item.section || 1,
        topic: item.topic || 'General Academic',
        questionType: item.questionType,
        difficulty: item.difficulty || 'medium',
        targetBand: item.band || item.targetBand || 6.5,
        passageTitle: item.passageTitle || null,
        passageContent: item.passageContent || null,
        passageContentVi: item.passageContentVi || null,
        audioUrl: item.audioUrl || null,
        transcript: item.transcript || null,
        transcriptVi: item.transcriptVi || null,
        instruction: item.instruction || 'Answer the question based on the material provided.',
        instructionVi: item.instructionVi || 'Trả lời câu hỏi dựa trên tài liệu được cung cấp.',
        questionText: item.question,
        questionTextVi: item.questionVi || null,
        optionsJson: item.options ? JSON.stringify(item.options) : null,
        correctAnswer: Array.isArray(item.answer) ? JSON.stringify(item.answer) : String(item.answer),
        explanationEn: item.explanation,
        explanationVi: item.explanationVi || item.explanation,
        evidenceQuote: item.evidenceQuote || null,
        distractorExplanationsJson: item.distractorExplanations
          ? JSON.stringify(item.distractorExplanations)
          : null,
        tagsJson: item.tags ? JSON.stringify(item.tags) : null,
        source: item.source || 'Imported Practice Material',
      },
    });
    count++;
  }

  console.log(`Successfully imported ${count} questions!`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error importing questions:', err);
  process.exit(1);
});
