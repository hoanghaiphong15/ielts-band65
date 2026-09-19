"use strict";
/**
 * Official Cambridge IELTS Band Calculation Utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAcademicReadingBand = calculateAcademicReadingBand;
exports.calculateListeningBand = calculateListeningBand;
exports.calculateOverallBand = calculateOverallBand;
exports.calculateCriteriaBand = calculateCriteriaBand;
/**
 * Raw score to Band conversion for Academic Reading (out of 40)
 */
function calculateAcademicReadingBand(rawScore, totalQuestions = 40) {
    if (totalQuestions <= 0)
        return 0;
    // Normalize if taking a mini test
    const normalizedScore = totalQuestions === 40 ? rawScore : Math.round((rawScore / totalQuestions) * 40);
    if (normalizedScore >= 39)
        return 9.0;
    if (normalizedScore >= 37)
        return 8.5;
    if (normalizedScore >= 35)
        return 8.0;
    if (normalizedScore >= 33)
        return 7.5;
    if (normalizedScore >= 30)
        return 7.0;
    if (normalizedScore >= 27)
        return 6.5;
    if (normalizedScore >= 23)
        return 6.0;
    if (normalizedScore >= 19)
        return 5.5;
    if (normalizedScore >= 15)
        return 5.0;
    if (normalizedScore >= 13)
        return 4.5;
    if (normalizedScore >= 10)
        return 4.0;
    if (normalizedScore >= 8)
        return 3.5;
    if (normalizedScore >= 6)
        return 3.0;
    if (normalizedScore >= 4)
        return 2.5;
    return 2.0;
}
/**
 * Raw score to Band conversion for Listening (out of 40)
 */
function calculateListeningBand(rawScore, totalQuestions = 40) {
    if (totalQuestions <= 0)
        return 0;
    // Normalize if taking a mini test
    const normalizedScore = totalQuestions === 40 ? rawScore : Math.round((rawScore / totalQuestions) * 40);
    if (normalizedScore >= 39)
        return 9.0;
    if (normalizedScore >= 37)
        return 8.5;
    if (normalizedScore >= 35)
        return 8.0;
    if (normalizedScore >= 32)
        return 7.5;
    if (normalizedScore >= 30)
        return 7.0;
    if (normalizedScore >= 26)
        return 6.5;
    if (normalizedScore >= 23)
        return 6.0;
    if (normalizedScore >= 18)
        return 5.5;
    if (normalizedScore >= 16)
        return 5.0;
    if (normalizedScore >= 13)
        return 4.5;
    if (normalizedScore >= 10)
        return 4.0;
    if (normalizedScore >= 8)
        return 3.5;
    if (normalizedScore >= 6)
        return 3.0;
    if (normalizedScore >= 4)
        return 2.5;
    return 2.0;
}
/**
 * Official IELTS overall band score rounding rules:
 * - Average of the four components (Listening, Reading, Writing, Speaking)
 * - If average ends in .25 -> round UP to the next half band (e.g. 6.25 -> 6.5)
 * - If average ends in .75 -> round UP to the next whole band (e.g. 6.75 -> 7.0)
 * - Otherwise round to nearest 0.5 (e.g., 6.1 -> 6.0, 6.6 -> 6.5, 6.375 -> 6.5)
 */
function calculateOverallBand(listening, reading, writing, speaking) {
    const avg = (listening + reading + writing + speaking) / 4;
    const integerPart = Math.floor(avg);
    const decimalPart = Math.round((avg - integerPart) * 1000) / 1000;
    if (decimalPart < 0.25) {
        // 0 and .125 round down to whole band
        return integerPart;
    }
    else if (decimalPart < 0.75) {
        // .25, .375, .5, and .625 round to .5
        return integerPart + 0.5;
    }
    else {
        // .75 and .875 round up to next whole band
        return integerPart + 1.0;
    }
}
/**
 * Calculate Writing or Speaking estimated band based on 4 criteria
 */
function calculateCriteriaBand(c1, c2, c3, c4) {
    const avg = (c1 + c2 + c3 + c4) / 4;
    // Round to nearest 0.5
    return Math.round(avg * 2) / 2;
}
