"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bandCalculator_1 = require("../bandCalculator");
const srs_1 = require("../srs");
(0, vitest_1.describe)('IELTS Band Calculator', () => {
    (0, vitest_1.it)('calculates reading band score correctly', () => {
        (0, vitest_1.expect)((0, bandCalculator_1.calculateAcademicReadingBand)(39, 40)).toBe(9.0);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateAcademicReadingBand)(30, 40)).toBe(7.0);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateAcademicReadingBand)(27, 40)).toBe(6.5);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateAcademicReadingBand)(23, 40)).toBe(6.0);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateAcademicReadingBand)(15, 40)).toBe(5.0);
    });
    (0, vitest_1.it)('calculates listening band score correctly', () => {
        (0, vitest_1.expect)((0, bandCalculator_1.calculateListeningBand)(40, 40)).toBe(9.0);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateListeningBand)(26, 40)).toBe(6.5);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateListeningBand)(23, 40)).toBe(6.0);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateListeningBand)(16, 40)).toBe(5.0);
    });
    (0, vitest_1.it)('implements official Cambridge overall band rounding correctly', () => {
        // 6.5 + 6.5 + 6.0 + 6.0 = 25.0 / 4 = 6.25 -> rounds UP to 6.5
        (0, vitest_1.expect)((0, bandCalculator_1.calculateOverallBand)(6.5, 6.5, 6.0, 6.0)).toBe(6.5);
        // 6.5 + 6.5 + 7.0 + 7.0 = 27.0 / 4 = 6.75 -> rounds UP to 7.0
        (0, vitest_1.expect)((0, bandCalculator_1.calculateOverallBand)(6.5, 6.5, 7.0, 7.0)).toBe(7.0);
        // 6.0 + 6.0 + 6.0 + 6.5 = 24.5 / 4 = 6.125 -> rounds to 6.0
        (0, vitest_1.expect)((0, bandCalculator_1.calculateOverallBand)(6.0, 6.0, 6.0, 6.5)).toBe(6.0);
        // 6.5 + 6.0 + 6.0 + 6.0 = 24.5 / 4 = 6.125 -> 6.0
        (0, vitest_1.expect)((0, bandCalculator_1.calculateOverallBand)(6.5, 6.0, 6.0, 6.0)).toBe(6.0);
        // 6.5 + 6.5 + 6.5 + 6.0 = 25.5 / 4 = 6.375 -> 6.5
        (0, vitest_1.expect)((0, bandCalculator_1.calculateOverallBand)(6.5, 6.5, 6.5, 6.0)).toBe(6.5);
    });
    (0, vitest_1.it)('calculates criteria band properly', () => {
        (0, vitest_1.expect)((0, bandCalculator_1.calculateCriteriaBand)(6, 6, 7, 7)).toBe(6.5);
        (0, vitest_1.expect)((0, bandCalculator_1.calculateCriteriaBand)(5, 5.5, 6, 6)).toBe(5.5);
    });
});
(0, vitest_1.describe)('SuperMemo SM-2 Spaced Repetition', () => {
    (0, vitest_1.it)('handles first successful review', () => {
        const res = (0, srs_1.calculateSRS)({
            quality: 4,
            repetitions: 0,
            interval: 1,
            easeFactor: 2.5,
        }, new Date('2026-09-19'));
        (0, vitest_1.expect)(res.repetitions).toBe(1);
        (0, vitest_1.expect)(res.interval).toBe(1);
        (0, vitest_1.expect)(res.stage).toBe('learning');
    });
    (0, vitest_1.it)('progresses to 6-day interval on second successful review', () => {
        const res = (0, srs_1.calculateSRS)({
            quality: 4,
            repetitions: 1,
            interval: 1,
            easeFactor: 2.5,
        }, new Date('2026-09-19'));
        (0, vitest_1.expect)(res.repetitions).toBe(2);
        (0, vitest_1.expect)(res.interval).toBe(6);
        (0, vitest_1.expect)(res.stage).toBe('review');
    });
    (0, vitest_1.it)('resets interval on failure (quality < 3)', () => {
        const res = (0, srs_1.calculateSRS)({
            quality: 2,
            repetitions: 3,
            interval: 15,
            easeFactor: 2.5,
        }, new Date('2026-09-19'));
        (0, vitest_1.expect)(res.repetitions).toBe(0);
        (0, vitest_1.expect)(res.interval).toBe(1);
        (0, vitest_1.expect)(res.stage).toBe('learning');
    });
});
