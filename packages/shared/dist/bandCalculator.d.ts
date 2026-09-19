/**
 * Official Cambridge IELTS Band Calculation Utilities
 */
/**
 * Raw score to Band conversion for Academic Reading (out of 40)
 */
export declare function calculateAcademicReadingBand(rawScore: number, totalQuestions?: number): number;
/**
 * Raw score to Band conversion for Listening (out of 40)
 */
export declare function calculateListeningBand(rawScore: number, totalQuestions?: number): number;
/**
 * Official IELTS overall band score rounding rules:
 * - Average of the four components (Listening, Reading, Writing, Speaking)
 * - If average ends in .25 -> round UP to the next half band (e.g. 6.25 -> 6.5)
 * - If average ends in .75 -> round UP to the next whole band (e.g. 6.75 -> 7.0)
 * - Otherwise round to nearest 0.5 (e.g., 6.1 -> 6.0, 6.6 -> 6.5, 6.375 -> 6.5)
 */
export declare function calculateOverallBand(listening: number, reading: number, writing: number, speaking: number): number;
/**
 * Calculate Writing or Speaking estimated band based on 4 criteria
 */
export declare function calculateCriteriaBand(c1: number, c2: number, c3: number, c4: number): number;
