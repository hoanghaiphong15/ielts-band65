/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 */

export interface SRSInput {
  quality: number; // 0 to 5 rating
  repetitions: number;
  interval: number; // in days
  easeFactor: number; // default 2.5
}

export interface SRSResult {
  repetitions: number;
  interval: number;
  easeFactor: number;
  nextReviewAt: string; // ISO date string
  stage: 'new' | 'learning' | 'review' | 'mastered';
}

export function calculateSRS(input: SRSInput, fromDate: Date = new Date()): SRSResult {
  const { quality } = input;
  let { repetitions, interval, easeFactor } = input;

  // Quality 0-2 = failure, 3-5 = success
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + interval);

  // Determine stage
  let stage: 'new' | 'learning' | 'review' | 'mastered' = 'learning';
  if (repetitions === 0) {
    stage = 'learning';
  } else if (repetitions >= 5) {
    stage = 'mastered';
  } else if (repetitions >= 2) {
    stage = 'review';
  }

  return {
    repetitions,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    nextReviewAt: nextDate.toISOString(),
    stage,
  };
}
