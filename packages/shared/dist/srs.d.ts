/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 */
export interface SRSInput {
    quality: number;
    repetitions: number;
    interval: number;
    easeFactor: number;
}
export interface SRSResult {
    repetitions: number;
    interval: number;
    easeFactor: number;
    nextReviewAt: string;
    stage: 'new' | 'learning' | 'review' | 'mastered';
}
export declare function calculateSRS(input: SRSInput, fromDate?: Date): SRSResult;
