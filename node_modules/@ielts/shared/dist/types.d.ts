export type SkillType = 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING' | 'VOCABULARY' | 'GRAMMAR';
export type QuestionType = 'mcq' | 'true_false_not_given' | 'yes_no_not_given' | 'matching_headings' | 'matching_information' | 'matching_features' | 'sentence_completion' | 'summary_completion' | 'note_completion' | 'table_completion' | 'form_completion' | 'map_labeling';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export interface UserProfile {
    id: string;
    name: string;
    targetBand: number;
    currentBand: number;
    listeningBand: number;
    readingBand: number;
    writingBand: number;
    speakingBand: number;
    dailyGoalMinutes: number;
    streakDays: number;
    lastActiveDate: string;
    examDate?: string | null;
    hasCompletedPlacement: boolean;
    language: 'en' | 'vi';
    theme: 'light' | 'dark' | 'system';
}
export interface QuestionOption {
    id: string;
    text: string;
    textVi?: string;
}
export interface Question {
    id: string;
    skill: SkillType;
    section?: number;
    topic: string;
    questionType: QuestionType;
    difficulty: DifficultyLevel;
    targetBand: number;
    passageTitle?: string;
    passageContent?: string;
    passageContentVi?: string;
    audioUrl?: string;
    transcript?: string;
    transcriptVi?: string;
    instruction: string;
    instructionVi?: string;
    questionText: string;
    questionTextVi?: string;
    options?: QuestionOption[];
    correctAnswer: string | string[];
    explanationEn: string;
    explanationVi: string;
    evidenceQuote?: string;
    distractorExplanations?: Record<string, {
        en: string;
        vi: string;
    }>;
    tags?: string[];
    source?: string;
}
export interface Attempt {
    id: string;
    questionId: string;
    userResponse: string | string[];
    isCorrect: boolean;
    score: number;
    timeSpentSecs: number;
    createdAt: string;
}
export interface Mistake {
    id: string;
    skill: SkillType;
    questionId: string;
    questionText: string;
    questionType: QuestionType;
    topic: string;
    userAnswer: string;
    correctAnswer: string;
    explanationEn: string;
    explanationVi: string;
    evidenceQuote?: string;
    mistakeReason?: string;
    date: string;
    reviewCount: number;
    isResolved: boolean;
    lastPracticedAt?: string;
}
export interface VocabularyItem {
    id: string;
    word: string;
    ipa: string;
    pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
    meaningVi: string;
    definitionEn: string;
    exampleSentence: string;
    exampleSentenceVi?: string;
    collocations: string[];
    synonyms: string[];
    antonyms: string[];
    topic: string;
    difficulty: DifficultyLevel;
    targetBand: number;
}
export interface UserVocabProgress {
    vocabId: string;
    srsStage: 'new' | 'learning' | 'review' | 'mastered';
    interval: number;
    easeFactor: number;
    repetitions: number;
    nextReviewAt: string;
    correctCount: number;
    wrongCount: number;
    lastReviewedAt?: string;
}
export interface GrammarExercise {
    id: string;
    instruction: string;
    instructionVi?: string;
    prompt: string;
    promptVi?: string;
    options?: string[];
    correctAnswer: string;
    explanationEn: string;
    explanationVi: string;
    bandTrapNotes?: string;
}
export interface GrammarLesson {
    id: string;
    topicId: string;
    title: string;
    titleVi: string;
    bandTarget: number;
    explanationEn: string;
    explanationVi: string;
    keyRules: Array<{
        ruleEn: string;
        ruleVi: string;
        example: string;
        exampleVi: string;
    }>;
    commonMistakes: Array<{
        incorrect: string;
        correct: string;
        explanation: string;
        explanationVi: string;
    }>;
    exercises: GrammarExercise[];
}
export interface SentenceCorrection {
    original: string;
    corrected: string;
    errorCategory: 'subject_verb_agreement' | 'article' | 'preposition' | 'tense' | 'word_choice' | 'run_on' | 'cohesion' | 'spelling';
    reasonEn: string;
    reasonVi: string;
    improvedBand65: string;
}
export interface WritingEvaluation {
    taskResponseScore: number;
    coherenceScore: number;
    lexicalScore: number;
    grammarScore: number;
    estimatedBand: number;
    wordCount: number;
    taskRequirementsMet: boolean;
    strengths: string[];
    weaknesses: string[];
    sentenceCorrections: SentenceCorrection[];
    band65ModelSample: string;
    actionableTips: string[];
}
export interface WritingPrompt {
    id: string;
    taskType: 'TASK_1' | 'TASK_2';
    subType: string;
    title: string;
    titleVi: string;
    prompt: string;
    promptVi: string;
    imageUrl?: string;
    suggestedStructure: {
        step: string;
        stepVi: string;
        tip: string;
    }[];
    band65Sample: string;
    keyVocabulary: string[];
}
export interface WritingSubmission {
    id: string;
    promptId: string;
    taskType: 'TASK_1' | 'TASK_2';
    content: string;
    planNotes?: string;
    wordCount: number;
    timeSpentSecs: number;
    evaluation?: WritingEvaluation;
    createdAt: string;
}
export interface SpeakingCollocationTip {
    overusedWord: string;
    suggestedAlternatives: string[];
    exampleSentence: string;
}
export interface SpeakingEvaluation {
    fluencyScore: number;
    lexicalScore: number;
    grammarScore: number;
    pronunciationScore: number;
    estimatedBand: number;
    transcript: string;
    durationSecs: number;
    fillerWordCount: number;
    pauseObservations: string;
    vocabularyRecommendations: SpeakingCollocationTip[];
    grammarNotes: string[];
    modelAnswer: string;
    feedbackVi: string;
}
export interface SpeakingPrompt {
    id: string;
    part: 1 | 2 | 3;
    topic: string;
    topicVi: string;
    question: string;
    questionVi: string;
    cues?: string[];
    followUps?: string[];
    usefulPhrases: string[];
    modelAnswer: string;
    modelAudioUrl?: string;
}
export interface SpeakingSubmission {
    id: string;
    promptId: string;
    part: 1 | 2 | 3;
    audioBlobUrl?: string;
    durationSecs: number;
    transcript: string;
    evaluation?: SpeakingEvaluation;
    createdAt: string;
}
export interface MockTestResult {
    id: string;
    testType: 'FULL' | 'SKILL' | 'MINI';
    skill?: SkillType;
    listeningBand?: number;
    readingBand?: number;
    writingBand?: number;
    speakingBand?: number;
    overallBand: number;
    listeningRawScore?: number;
    readingRawScore?: number;
    completedAt: string;
    timeSpentSecs: number;
}
export interface StudyPlanItem {
    id: string;
    skill: SkillType;
    title: string;
    titleVi: string;
    durationMinutes: number;
    targetCount?: number;
    completed: boolean;
    actionUrl: string;
    description: string;
    descriptionVi: string;
}
export interface DailyStudyPlan {
    date: string;
    totalPlannedMinutes: number;
    completedMinutes: number;
    items: StudyPlanItem[];
}
