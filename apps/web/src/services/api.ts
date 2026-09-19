import {
  UserProfile,
  Question,
  VocabularyItem,
  GrammarLesson,
  WritingPrompt,
  WritingSubmission,
  SpeakingPrompt,
  SpeakingSubmission,
  MockTestResult,
  DailyStudyPlan,
  Mistake,
} from '@ielts/shared';

const rawBase = (import.meta as any).env?.VITE_API_URL || '';
const API_BASE = rawBase ? `${rawBase.replace(/\/$/, '')}/api` : '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const geminiApiKey = localStorage.getItem('gemini-api-key') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export const api = {
  // Profile
  getProfile: () => fetchJson<UserProfile>('/profile'),
  updateProfile: (data: Partial<UserProfile>) =>
    fetchJson<UserProfile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  resetProgress: () =>
    fetchJson<{ message: string; profile: UserProfile }>('/profile/reset', { method: 'POST' }),

  // Questions
  getQuestions: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson<Question[]>(`/questions${query ? `?${query}` : ''}`);
  },
  getQuestion: (id: string) => fetchJson<Question>(`/questions/${id}`),

  // Attempts
  submitAttempt: (data: { questionId: string; userResponse: string | string[]; timeSpentSecs?: number }) =>
    fetchJson<{
      attemptId: string;
      isCorrect: boolean;
      userResponse: string | string[];
      correctAnswer: string;
      explanationEn: string;
      explanationVi: string;
      evidenceQuote?: string;
      distractorExplanations?: Record<string, { en: string; vi: string }>;
    }>('/attempts', { method: 'POST', body: JSON.stringify(data) }),

  // Mistakes
  getMistakes: (params?: { skill?: string; isResolved?: boolean; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<Mistake[]>(`/mistakes${query ? `?${query}` : ''}`);
  },
  getMistake: (id: string) => fetchJson<Mistake>(`/mistakes/${id}`),
  updateMistake: (id: string, data: { isResolved?: boolean; notes?: string }) =>
    fetchJson<Mistake>(`/mistakes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  rePracticeMistake: (id: string, answer: string) =>
    fetchJson<{
      isCorrect: boolean;
      correctAnswer: string;
      explanationEn: string;
      explanationVi: string;
      evidenceQuote?: string;
      mistake: Mistake;
    }>(`/mistakes/${id}/re-practice`, { method: 'POST', body: JSON.stringify({ answer }) }),

  // Vocabulary
  getVocabulary: (params?: { topic?: string; search?: string; difficulty?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<VocabularyItem[]>(`/vocabulary${query ? `?${query}` : ''}`);
  },
  getVocabReviewQueue: () => fetchJson<any[]>('/vocabulary/review'),
  submitVocabReview: (vocabId: string, quality: number) =>
    fetchJson<any>(`/vocabulary/review/${vocabId}`, {
      method: 'POST',
      body: JSON.stringify({ quality }),
    }),
  getVocabStats: () =>
    fetchJson<{
      totalWords: number;
      newCount: number;
      learningCount: number;
      reviewCount: number;
      masteredCount: number;
      dueCount: number;
    }>('/vocabulary/stats'),

  // Grammar
  getGrammarLessons: () => fetchJson<any[]>('/grammar/lessons'),
  getGrammarLesson: (topicId: string) => fetchJson<GrammarLesson>(`/grammar/lessons/${topicId}`),
  checkGrammarExercise: (exerciseId: string, answer: string) =>
    fetchJson<{
      isCorrect: boolean;
      correctAnswer: string;
      explanationEn: string;
      explanationVi: string;
      bandTrapNotes?: string;
    }>('/grammar/check', {
      method: 'POST',
      body: JSON.stringify({ exerciseId, answer }),
    }),

  // Writing
  getWritingPrompts: (params?: { taskType?: string; subType?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<WritingPrompt[]>(`/writing/prompts${query ? `?${query}` : ''}`);
  },
  getWritingPrompt: (id: string) => fetchJson<WritingPrompt>(`/writing/prompts/${id}`),
  submitWriting: (data: {
    promptId: string;
    taskType: 'TASK_1' | 'TASK_2';
    content: string;
    planNotes?: string;
    timeSpentSecs?: number;
  }) =>
    fetchJson<{ submissionId: string; evaluation: any }>('/writing/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getWritingHistory: () => fetchJson<WritingSubmission[]>('/writing/submissions'),

  // Speaking
  getSpeakingPrompts: (params?: { part?: number; topic?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<SpeakingPrompt[]>(`/speaking/prompts${query ? `?${query}` : ''}`);
  },
  getSpeakingPrompt: (id: string) => fetchJson<SpeakingPrompt>(`/speaking/prompts/${id}`),
  submitSpeaking: (data: {
    promptId: string;
    part: 1 | 2 | 3;
    transcript: string;
    durationSecs: number;
    audioPath?: string;
  }) =>
    fetchJson<{ submissionId: string; evaluation: any }>('/speaking/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSpeakingHistory: () => fetchJson<SpeakingSubmission[]>('/speaking/submissions'),

  // Mock Test
  submitMockTest: (data: any) =>
    fetchJson<MockTestResult>('/mock-test/submit', { method: 'POST', body: JSON.stringify(data) }),
  getMockTestHistory: () => fetchJson<MockTestResult[]>('/mock-test/history'),

  // Study Plan
  getDailyStudyPlan: () => fetchJson<DailyStudyPlan>('/study-plan'),
  generateStudyPlan: (minutes: number) =>
    fetchJson<DailyStudyPlan>('/study-plan/generate', {
      method: 'POST',
      body: JSON.stringify({ minutes }),
    }),

  // Analytics
  getAnalytics: () => fetchJson<any>('/analytics'),

  // Backup
  exportBackupUrl: () => `${API_BASE}/backup/export`,
  importBackup: (backupData: any) =>
    fetchJson<{ message: string }>('/backup/import', {
      method: 'POST',
      body: JSON.stringify(backupData),
    }),

  // AI
  testGeminiKey: (apiKey?: string) =>
    fetchJson<{
      success: boolean;
      message: string;
      error?: string;
      model?: string;
    }>('/ai/test', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    }),
};
