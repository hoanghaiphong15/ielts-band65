import { SpeakingEvaluation, SpeakingCollocationTip } from '@ielts/shared';

const FILLER_WORDS = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'sort of', 'kind of'];

const OVERUSED_COLLOCATIONS: Record<string, { alternatives: string[]; example: string }> = {
  'very interesting': {
    alternatives: ['fascinating', 'captivating', 'intriguing'],
    example: 'The lecture was absolutely fascinating rather than just very interesting.',
  },
  'very important': {
    alternatives: ['crucial', 'essential', 'paramount', 'vital'],
    example: 'Language proficiency plays a paramount role in academic success.',
  },
  'very difficult': {
    alternatives: ['demanding', 'formidable', 'challenging'],
    example: 'Preparing for the IELTS exam can be a demanding endeavor.',
  },
  'very good': {
    alternatives: ['exceptional', 'superb', 'advantageous', 'beneficial'],
    example: 'Developing a consistent study habit yields exceptional results.',
  },
  'very bad': {
    alternatives: ['detrimental', 'counterproductive', 'adverse'],
    example: 'Excessive screen time can have detrimental effects on sleep quality.',
  },
  'a lot of': {
    alternatives: ['a substantial number of', 'a multitude of', 'an abundance of'],
    example: 'There are a multitude of opportunities for university graduates.',
  },
  'I think': {
    alternatives: ['In my perspective,', 'From my standpoint,', 'I am convinced that'],
    example: 'From my standpoint, public transport investment is essential.',
  },
};

export function evaluateSpeaking(
  part: 1 | 2 | 3,
  transcript: string,
  durationSecs: number,
  topic: string
): SpeakingEvaluation {
  const cleanTranscript = transcript.trim();
  const words = cleanTranscript.length > 0 ? cleanTranscript.split(/\s+/) : [];
  const wordCount = words.length;

  // Words per minute (WPM)
  const minutes = durationSecs > 0 ? durationSecs / 60 : 1;
  const wpm = Math.round(wordCount / minutes);

  // Count fillers
  let fillerCount = 0;
  const lowerTranscript = cleanTranscript.toLowerCase();
  for (const filler of FILLER_WORDS) {
    const matches = lowerTranscript.match(new RegExp(`\\b${filler}\\b`, 'g'));
    if (matches) {
      fillerCount += matches.length;
    }
  }

  // --- 1. Fluency & Coherence (FC) ---
  let fcScore = 5.0;
  // Natural speaking rate is around 110-150 wpm
  if (wpm >= 110 && wpm <= 160 && fillerCount <= 3) {
    fcScore = 6.5;
  } else if (wpm >= 90 && fillerCount <= 6) {
    fcScore = 6.0;
  } else if (wpm >= 70) {
    fcScore = 5.5;
  } else {
    fcScore = 5.0;
  }

  // --- 2. Lexical Resource (LR) ---
  let lrScore = 5.0;
  const recommendations: SpeakingCollocationTip[] = [];

  for (const [phrase, info] of Object.entries(OVERUSED_COLLOCATIONS)) {
    if (lowerTranscript.includes(phrase)) {
      recommendations.push({
        overusedWord: phrase,
        suggestedAlternatives: info.alternatives,
        exampleSentence: info.example,
      });
    }
  }

  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, '')));
  const lexicalVariety = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  if (lexicalVariety >= 0.5 && recommendations.length <= 1) {
    lrScore = 6.5;
  } else if (lexicalVariety >= 0.4) {
    lrScore = 6.0;
  } else if (lexicalVariety >= 0.3) {
    lrScore = 5.5;
  } else {
    lrScore = 5.0;
  }

  // --- 3. Grammatical Range & Accuracy (GRA) ---
  let graScore = 5.5;
  const sentences = cleanTranscript.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
  const complexConnectors = ['because', 'although', 'since', 'which', 'who', 'while', 'if', 'when'];
  let complexCount = 0;

  for (const s of sentences) {
    const sLow = s.toLowerCase();
    if (complexConnectors.some((c) => sLow.includes(c))) {
      complexCount++;
    }
  }

  if (sentences.length > 0 && complexCount / sentences.length >= 0.4) {
    graScore = 6.5;
  } else if (sentences.length > 0 && complexCount / sentences.length >= 0.25) {
    graScore = 6.0;
  }

  // --- 4. Pronunciation (PR) ---
  // Heuristic based on rhythm and length consistency
  let prScore = 6.0;
  if (wpm >= 100 && wpm <= 150) {
    prScore = 6.5;
  } else if (wpm < 80 || wpm > 180) {
    prScore = 5.5;
  }

  const avg = (fcScore + lrScore + graScore + prScore) / 4;
  const estimatedBand = Math.round(avg * 2) / 2;

  // Observations
  let pauseObservations = '';
  if (wpm < 85) {
    pauseObservations = 'Speaking pace is slightly hesitant with extended pauses before expressing new ideas.';
  } else if (wpm > 165) {
    pauseObservations = 'Speech is very rapid, which might lead to dropped word endings (-s, -ed).';
  } else {
    pauseObservations = 'Good natural speaking pace with reasonable pauses between thought groups.';
  }

  const grammarNotes: string[] = [
    'Remember to maintain consistent past tense when describing personal memories or past events.',
    'Focus on using full compound and complex sentences rather than short disconnected statements.',
  ];

  const feedbackVi = `Đánh giá tổng quan: Bạn đạt ước tính Band ${estimatedBand.toFixed(1)}. Tốc độ nói của bạn đạt khoảng ${wpm} từ/phút với ${fillerCount} từ đệm (um/uh). Để nâng lên Band 6.5+, hãy thay thế các cụm từ cơ bản như "very interesting" bằng "fascinating", và chú ý phát âm rõ âm đuôi (ending sounds: /s/, /z/, /ed/) vốn là lỗi phổ biến của thí sinh Việt Nam.`;

  const modelAnswer = `Well, speaking of this topic, I would say it plays an indispensable part in my daily routine. For instance, whenever I face high pressure from my university coursework, engaging in this activity helps me unwind and regain focus. Furthermore, it has allowed me to broaden my horizon by connecting with people from diverse backgrounds. Looking back, I believe cultivating this habit has had a remarkably positive influence on my personal growth.`;

  return {
    fluencyScore: fcScore,
    lexicalScore: lrScore,
    grammarScore: graScore,
    pronunciationScore: prScore,
    estimatedBand,
    transcript: cleanTranscript,
    durationSecs,
    fillerWordCount: fillerCount,
    pauseObservations,
    vocabularyRecommendations: recommendations,
    grammarNotes,
    modelAnswer,
    feedbackVi,
  };
}
