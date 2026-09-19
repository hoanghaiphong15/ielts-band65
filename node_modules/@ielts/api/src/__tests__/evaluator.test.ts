import { describe, it, expect } from 'vitest';
import { evaluateWriting } from '../services/writingEvaluator';
import { evaluateSpeaking } from '../services/speakingEvaluator';
import { generateDailyStudyPlan } from '../services/studyPlanGenerator';

describe('Writing Evaluator', () => {
  it('detects common Vietnamese learner grammatical errors and suggests corrections', () => {
    const textWithErrors =
      'People is using technology more and more in world. Furthermore, there are many new informations and equipments available for students. The author discuss about this problem, however he does not provide solutions.';

    const result = evaluateWriting('TASK_2', textWithErrors, 'Discuss technology');

    expect(result.sentenceCorrections.length).toBeGreaterThan(0);
    const categories = result.sentenceCorrections.map((c) => c.errorCategory);
    expect(categories).toContain('subject_verb_agreement'); // "People is"
    expect(categories).toContain('word_choice'); // "informations" or "equipments"
    expect(categories).toContain('preposition'); // "discuss about"
  });

  it('evaluates word count and minimum length requirements', () => {
    const shortText = 'This is a very short essay that does not meet the minimum requirements.';
    const result = evaluateWriting('TASK_2', shortText, 'Discuss something');

    expect(result.taskRequirementsMet).toBe(false);
    expect(result.taskResponseScore).toBeLessThanOrEqual(5.0);
  });
});

describe('Speaking Evaluator', () => {
  it('identifies overused collocations and recommends Band 6.5+ alternatives', () => {
    const transcript =
      'Well, I think this topic is very interesting and very important for students. Um, it has a lot of benefits.';

    const result = evaluateSpeaking(1, transcript, 45, 'Education');

    expect(result.vocabularyRecommendations.length).toBeGreaterThan(0);
    const overused = result.vocabularyRecommendations.map((r) => r.overusedWord);
    expect(overused).toContain('very interesting');
    expect(overused).toContain('very important');
  });

  it('calculates speaking speed and filler word count', () => {
    const transcript = 'Um, I like playing badminton because it is, er, very exciting, you know.';
    const result = evaluateSpeaking(1, transcript, 30, 'Sport');

    expect(result.fillerWordCount).toBeGreaterThanOrEqual(2);
  });
});

describe('Study Plan Generator', () => {
  it('generates a compact plan for limited time (20 minutes)', () => {
    const plan = generateDailyStudyPlan(20, {
      listeningBand: 5.5,
      readingBand: 6.0,
      writingBand: 5.0,
      speakingBand: 5.0,
      dueVocabCount: 12,
      unresolvedMistakesCount: 3,
    });

    expect(plan.totalPlannedMinutes).toBeLessThanOrEqual(25);
    expect(plan.items.some((i) => i.skill === 'VOCABULARY')).toBe(true);
    expect(plan.items.some((i) => i.skill === 'WRITING' || i.skill === 'SPEAKING')).toBe(true);
  });

  it('generates a comprehensive plan for 45 minutes targeting weak areas', () => {
    const plan = generateDailyStudyPlan(45, {
      listeningBand: 5.0,
      readingBand: 6.0,
      writingBand: 4.5,
      speakingBand: 5.0,
      dueVocabCount: 15,
      unresolvedMistakesCount: 4,
    });

    expect(plan.items.length).toBeGreaterThanOrEqual(5);
    expect(plan.items.some((i) => i.skill === 'VOCABULARY')).toBe(true);
    expect(plan.items.some((i) => i.skill === 'READING')).toBe(true);
    expect(plan.items.some((i) => i.skill === 'SPEAKING')).toBe(true);
  });
});
