"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const writingEvaluator_1 = require("../services/writingEvaluator");
const speakingEvaluator_1 = require("../services/speakingEvaluator");
const studyPlanGenerator_1 = require("../services/studyPlanGenerator");
(0, vitest_1.describe)('Writing Evaluator', () => {
    (0, vitest_1.it)('detects common Vietnamese learner grammatical errors and suggests corrections', () => {
        const textWithErrors = 'People is using technology more and more in world. Furthermore, there are many new informations and equipments available for students. The author discuss about this problem, however he does not provide solutions.';
        const result = (0, writingEvaluator_1.evaluateWriting)('TASK_2', textWithErrors, 'Discuss technology');
        (0, vitest_1.expect)(result.sentenceCorrections.length).toBeGreaterThan(0);
        const categories = result.sentenceCorrections.map((c) => c.errorCategory);
        (0, vitest_1.expect)(categories).toContain('subject_verb_agreement'); // "People is"
        (0, vitest_1.expect)(categories).toContain('word_choice'); // "informations" or "equipments"
        (0, vitest_1.expect)(categories).toContain('preposition'); // "discuss about"
    });
    (0, vitest_1.it)('evaluates word count and minimum length requirements', () => {
        const shortText = 'This is a very short essay that does not meet the minimum requirements.';
        const result = (0, writingEvaluator_1.evaluateWriting)('TASK_2', shortText, 'Discuss something');
        (0, vitest_1.expect)(result.taskRequirementsMet).toBe(false);
        (0, vitest_1.expect)(result.taskResponseScore).toBeLessThanOrEqual(5.0);
    });
});
(0, vitest_1.describe)('Speaking Evaluator', () => {
    (0, vitest_1.it)('identifies overused collocations and recommends Band 6.5+ alternatives', () => {
        const transcript = 'Well, I think this topic is very interesting and very important for students. Um, it has a lot of benefits.';
        const result = (0, speakingEvaluator_1.evaluateSpeaking)(1, transcript, 45, 'Education');
        (0, vitest_1.expect)(result.vocabularyRecommendations.length).toBeGreaterThan(0);
        const overused = result.vocabularyRecommendations.map((r) => r.overusedWord);
        (0, vitest_1.expect)(overused).toContain('very interesting');
        (0, vitest_1.expect)(overused).toContain('very important');
    });
    (0, vitest_1.it)('calculates speaking speed and filler word count', () => {
        const transcript = 'Um, I like playing badminton because it is, er, very exciting, you know.';
        const result = (0, speakingEvaluator_1.evaluateSpeaking)(1, transcript, 30, 'Sport');
        (0, vitest_1.expect)(result.fillerWordCount).toBeGreaterThanOrEqual(2);
    });
});
(0, vitest_1.describe)('Study Plan Generator', () => {
    (0, vitest_1.it)('generates a compact plan for limited time (20 minutes)', () => {
        const plan = (0, studyPlanGenerator_1.generateDailyStudyPlan)(20, {
            listeningBand: 5.5,
            readingBand: 6.0,
            writingBand: 5.0,
            speakingBand: 5.0,
            dueVocabCount: 12,
            unresolvedMistakesCount: 3,
        });
        (0, vitest_1.expect)(plan.totalPlannedMinutes).toBeLessThanOrEqual(25);
        (0, vitest_1.expect)(plan.items.some((i) => i.skill === 'VOCABULARY')).toBe(true);
        (0, vitest_1.expect)(plan.items.some((i) => i.skill === 'WRITING' || i.skill === 'SPEAKING')).toBe(true);
    });
    (0, vitest_1.it)('generates a comprehensive plan for 45 minutes targeting weak areas', () => {
        const plan = (0, studyPlanGenerator_1.generateDailyStudyPlan)(45, {
            listeningBand: 5.0,
            readingBand: 6.0,
            writingBand: 4.5,
            speakingBand: 5.0,
            dueVocabCount: 15,
            unresolvedMistakesCount: 4,
        });
        (0, vitest_1.expect)(plan.items.length).toBeGreaterThanOrEqual(5);
        (0, vitest_1.expect)(plan.items.some((i) => i.skill === 'VOCABULARY')).toBe(true);
        (0, vitest_1.expect)(plan.items.some((i) => i.skill === 'READING')).toBe(true);
        (0, vitest_1.expect)(plan.items.some((i) => i.skill === 'SPEAKING')).toBe(true);
    });
});
