import { describe, it, expect } from 'vitest';
import {
  calculateAcademicReadingBand,
  calculateListeningBand,
  calculateOverallBand,
  calculateCriteriaBand,
} from '../bandCalculator';
import { calculateSRS } from '../srs';

describe('IELTS Band Calculator', () => {
  it('calculates reading band score correctly', () => {
    expect(calculateAcademicReadingBand(39, 40)).toBe(9.0);
    expect(calculateAcademicReadingBand(30, 40)).toBe(7.0);
    expect(calculateAcademicReadingBand(27, 40)).toBe(6.5);
    expect(calculateAcademicReadingBand(23, 40)).toBe(6.0);
    expect(calculateAcademicReadingBand(15, 40)).toBe(5.0);
  });

  it('calculates listening band score correctly', () => {
    expect(calculateListeningBand(40, 40)).toBe(9.0);
    expect(calculateListeningBand(26, 40)).toBe(6.5);
    expect(calculateListeningBand(23, 40)).toBe(6.0);
    expect(calculateListeningBand(16, 40)).toBe(5.0);
  });

  it('implements official Cambridge overall band rounding correctly', () => {
    // 6.5 + 6.5 + 6.0 + 6.0 = 25.0 / 4 = 6.25 -> rounds UP to 6.5
    expect(calculateOverallBand(6.5, 6.5, 6.0, 6.0)).toBe(6.5);

    // 6.5 + 6.5 + 7.0 + 7.0 = 27.0 / 4 = 6.75 -> rounds UP to 7.0
    expect(calculateOverallBand(6.5, 6.5, 7.0, 7.0)).toBe(7.0);

    // 6.0 + 6.0 + 6.0 + 6.5 = 24.5 / 4 = 6.125 -> rounds to 6.0
    expect(calculateOverallBand(6.0, 6.0, 6.0, 6.5)).toBe(6.0);

    // 6.5 + 6.0 + 6.0 + 6.0 = 24.5 / 4 = 6.125 -> 6.0
    expect(calculateOverallBand(6.5, 6.0, 6.0, 6.0)).toBe(6.0);

    // 6.5 + 6.5 + 6.5 + 6.0 = 25.5 / 4 = 6.375 -> 6.5
    expect(calculateOverallBand(6.5, 6.5, 6.5, 6.0)).toBe(6.5);
  });

  it('calculates criteria band properly', () => {
    expect(calculateCriteriaBand(6, 6, 7, 7)).toBe(6.5);
    expect(calculateCriteriaBand(5, 5.5, 6, 6)).toBe(5.5);
  });
});

describe('SuperMemo SM-2 Spaced Repetition', () => {
  it('handles first successful review', () => {
    const res = calculateSRS({
      quality: 4,
      repetitions: 0,
      interval: 1,
      easeFactor: 2.5,
    }, new Date('2026-09-19'));

    expect(res.repetitions).toBe(1);
    expect(res.interval).toBe(1);
    expect(res.stage).toBe('learning');
  });

  it('progresses to 6-day interval on second successful review', () => {
    const res = calculateSRS({
      quality: 4,
      repetitions: 1,
      interval: 1,
      easeFactor: 2.5,
    }, new Date('2026-09-19'));

    expect(res.repetitions).toBe(2);
    expect(res.interval).toBe(6);
    expect(res.stage).toBe('review');
  });

  it('resets interval on failure (quality < 3)', () => {
    const res = calculateSRS({
      quality: 2,
      repetitions: 3,
      interval: 15,
      easeFactor: 2.5,
    }, new Date('2026-09-19'));

    expect(res.repetitions).toBe(0);
    expect(res.interval).toBe(1);
    expect(res.stage).toBe('learning');
  });
});
