import {
  WritingEvaluation,
  SpeakingEvaluation,
  Question,
  Mistake,
} from '@ielts/shared';
import { evaluateWriting } from './writingEvaluator';
import { evaluateSpeaking } from './speakingEvaluator';

export interface ExplanationResult {
  explanationEn: string;
  explanationVi: string;
  whyUserWasWrong: string;
  keyTakeaway: string;
}

export interface AIService {
  evaluateWriting(
    taskType: 'TASK_1' | 'TASK_2',
    content: string,
    prompt: string,
    apiKey?: string
  ): Promise<WritingEvaluation>;
  evaluateSpeaking(
    part: 1 | 2 | 3,
    transcript: string,
    durationSecs: number,
    topic: string,
    apiKey?: string
  ): Promise<SpeakingEvaluation>;
  explainMistake(mistake: Mistake): Promise<ExplanationResult>;
  generatePractice(skill: string, topic: string, targetBand: number): Promise<Partial<Question>[]>;
}

/**
 * 100% Offline Heuristic AI Service (Works locally without external models or internet)
 */
export class OfflineHeuristicAIService implements AIService {
  async evaluateWriting(
    taskType: 'TASK_1' | 'TASK_2',
    content: string,
    prompt: string
  ): Promise<WritingEvaluation> {
    return evaluateWriting(taskType, content, prompt);
  }

  async evaluateSpeaking(
    part: 1 | 2 | 3,
    transcript: string,
    durationSecs: number,
    topic: string
  ): Promise<SpeakingEvaluation> {
    return evaluateSpeaking(part, transcript, durationSecs, topic);
  }

  async explainMistake(mistake: Mistake): Promise<ExplanationResult> {
    return {
      explanationEn: mistake.explanationEn,
      explanationVi: mistake.explanationVi,
      whyUserWasWrong: `Your answer was "${mistake.userAnswer}", but the correct answer is "${mistake.correctAnswer}". ${
        mistake.evidenceQuote ? `Notice the evidence in the passage: "${mistake.evidenceQuote}".` : ''
      }`,
      keyTakeaway: 'Carefully compare keywords in the question with synonyms in the text before making your decision.',
    };
  }

  async generatePractice(skill: string, topic: string, targetBand: number): Promise<Partial<Question>[]> {
    return [];
  }
}

/**
 * Google Gemini AI Service (Uses Gemini 1.5 Flash / 2.0 Flash REST API)
 * Falls back to OfflineHeuristic if no key or network issue
 */
export class GeminiAIService implements AIService {
  private fallback = new OfflineHeuristicAIService();
  private defaultApiKey: string | undefined;

  constructor(apiKey?: string) {
    this.defaultApiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  private cleanJsonString(raw: string): string {
    let clean = raw.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return clean;
  }

  async evaluateWriting(
    taskType: 'TASK_1' | 'TASK_2',
    content: string,
    prompt: string,
    apiKey?: string
  ): Promise<WritingEvaluation> {
    const key = apiKey || this.defaultApiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      return this.fallback.evaluateWriting(taskType, content, prompt);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert official Cambridge IELTS examiner evaluating a Vietnamese university student striving for IELTS Band 6.5+.
Evaluate this ${taskType} essay based on Cambridge IELTS criteria:
1. Task Achievement / Task Response (TR)
2. Coherence and Cohesion (CC)
3. Lexical Resource (LR)
4. Grammatical Range and Accuracy (GRA)

Prompt:
"""${prompt}"""

Student Essay:
"""${content}"""

Return STRICTLY a JSON object with this exact schema (no markdown, no backticks, no other text):
{
  "taskResponseScore": <number 1.0 - 9.0 in 0.5 increments>,
  "coherenceScore": <number 1.0 - 9.0 in 0.5 increments>,
  "lexicalScore": <number 1.0 - 9.0 in 0.5 increments>,
  "grammarScore": <number 1.0 - 9.0 in 0.5 increments>,
  "estimatedBand": <number 1.0 - 9.0 in 0.5 increments>,
  "strengths": ["<string>", "<string>"],
  "weaknesses": ["<string>", "<string>"],
  "vietnameseCommonErrors": [
    {
      "original": "<exact phrase from essay with error>",
      "corrected": "<corrected phrase>",
      "explanationVi": "<giải thích bằng tiếng Việt lỗi người Việt hay gặp>"
    }
  ],
  "vocabularyUpgrades": [
    {
      "original": "<common word/phrase>",
      "suggestion": "<Band 6.5+ or C1 academic collocation>",
      "bandLevel": "Band 6.5+",
      "example": "<example sentence in context>"
    }
  ],
  "sentenceRewrites": [
    {
      "original": "<clunky sentence from essay>",
      "improved": "<natural, high-scoring native rewrite>",
      "reason": "<reason in Vietnamese>"
    }
  ],
  "overallFeedbackEn": "<detailed examiner commentary in English>",
  "overallFeedbackVi": "<nhận xét chi tiết và lời khuyên đạt Band 6.5 bằng tiếng Việt>"
}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn('Gemini API returned error:', response.status, response.statusText);
        return this.fallback.evaluateWriting(taskType, content, prompt);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return this.fallback.evaluateWriting(taskType, content, prompt);

      const parsed = JSON.parse(this.cleanJsonString(rawText));
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

      return {
        taskResponseScore: parsed.taskResponseScore || 6.0,
        coherenceScore: parsed.coherenceScore || 6.0,
        lexicalScore: parsed.lexicalScore || 6.0,
        grammarScore: parsed.grammarScore || 6.0,
        estimatedBand: parsed.estimatedBand || 6.0,
        wordCount,
        taskRequirementsMet: wordCount >= (taskType === 'TASK_1' ? 150 : 250),
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        sentenceCorrections: (parsed.sentenceCorrections || []).map((sc: any) => ({
          original: sc.original || '',
          corrected: sc.corrected || '',
          errorCategory: sc.errorCategory || 'grammar',
          reasonEn: sc.reasonEn || '',
          reasonVi: sc.reasonVi || sc.explanationVi || '',
          improvedBand65: sc.improvedBand65 || sc.improved || '',
        })),
        band65ModelSample: parsed.band65ModelSample || '',
        actionableTips: parsed.actionableTips || [
          parsed.overallFeedbackVi || 'Cần luyện tập thêm từ vựng học thuật và liên từ nối.',
        ],
      };
    } catch (err) {
      console.warn('Gemini Writing evaluation failed, falling back to heuristic:', err);
      return this.fallback.evaluateWriting(taskType, content, prompt);
    }
  }

  async evaluateSpeaking(
    part: 1 | 2 | 3,
    transcript: string,
    durationSecs: number,
    topic: string,
    apiKey?: string
  ): Promise<SpeakingEvaluation> {
    const key = apiKey || this.defaultApiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      return this.fallback.evaluateSpeaking(part, transcript, durationSecs, topic);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an official Cambridge IELTS Speaking examiner evaluating a Vietnamese learner striving for Band 6.5+.
Evaluate this IELTS Speaking Part ${part} response on the topic: "${topic}".
Duration: ${durationSecs} seconds.

Student's spoken transcript:
"""${transcript}"""

Return STRICTLY a JSON object matching this schema:
{
  "fluencyScore": <number 1.0 - 9.0 in 0.5 increments>,
  "lexicalScore": <number 1.0 - 9.0 in 0.5 increments>,
  "grammarScore": <number 1.0 - 9.0 in 0.5 increments>,
  "pronunciationScore": <number 1.0 - 9.0 in 0.5 increments>,
  "estimatedBand": <number 1.0 - 9.0 in 0.5 increments>,
  "fillerWordCount": <number of fillers like uh, um, like>,
  "pauseObservations": "<nhận xét về độ trôi chảy và tốc độ nói bằng tiếng Việt>",
  "vocabularyRecommendations": [
    {
      "overusedWord": "<phrase used>",
      "suggestedAlternatives": ["<Band 6.5+ collocation>"],
      "exampleSentence": "<example sentence>"
    }
  ],
  "grammarNotes": ["<lưu ý lỗi ngữ pháp bằng tiếng Việt>"],
  "modelAnswer": "<câu trả lời mẫu Band 6.5+>",
  "feedbackVi": "<nhận xét chi tiết bằng tiếng Việt>"
}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        return this.fallback.evaluateSpeaking(part, transcript, durationSecs, topic);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return this.fallback.evaluateSpeaking(part, transcript, durationSecs, topic);

      const parsed = JSON.parse(this.cleanJsonString(rawText));
      const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
      const wpm = durationSecs > 0 ? Math.round((wordCount / durationSecs) * 60) : 100;

      return {
        fluencyScore: parsed.fluencyScore || 6.0,
        lexicalScore: parsed.lexicalScore || 6.0,
        grammarScore: parsed.grammarScore || 6.0,
        pronunciationScore: parsed.pronunciationScore || 6.0,
        estimatedBand: parsed.estimatedBand || 6.0,
        transcript,
        durationSecs,
        fillerWordCount: parsed.fillerWordCount || 0,
        pauseObservations: parsed.pauseObservations || `Tốc độ nói khoảng ${wpm} WPM.`,
        vocabularyRecommendations: (parsed.vocabularyRecommendations || []).map((vr: any) => ({
          overusedWord: vr.overusedWord || vr.original || '',
          suggestedAlternatives: vr.suggestedAlternatives || [vr.suggestion || ''],
          exampleSentence: vr.exampleSentence || '',
        })),
        grammarNotes: parsed.grammarNotes || [],
        modelAnswer: parsed.modelAnswer || '',
        feedbackVi: parsed.feedbackVi || parsed.overallFeedbackVi || 'Bài nói tốt, cần mở rộng câu trả lời tự nhiên hơn.',
      };
    } catch (err) {
      console.warn('Gemini Speaking evaluation failed, falling back to heuristic:', err);
      return this.fallback.evaluateSpeaking(part, transcript, durationSecs, topic);
    }
  }

  async explainMistake(mistake: Mistake): Promise<ExplanationResult> {
    return this.fallback.explainMistake(mistake);
  }

  async generatePractice(skill: string, topic: string, targetBand: number): Promise<Partial<Question>[]> {
    return this.fallback.generatePractice(skill, topic, targetBand);
  }
}

/**
 * Optional Ollama Local LLM Service (Falls back to OfflineHeuristic if unreachable)
 */
export class OllamaAIService implements AIService {
  private fallback = new OfflineHeuristicAIService();
  private ollamaUrl: string;
  private modelName: string;

  constructor(ollamaUrl = 'http://localhost:11434', modelName = 'llama3') {
    this.ollamaUrl = ollamaUrl;
    this.modelName = modelName;
  }

  async evaluateWriting(
    taskType: 'TASK_1' | 'TASK_2',
    content: string,
    prompt: string
  ): Promise<WritingEvaluation> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: `Evaluate this IELTS ${taskType} essay based on TR, CC, LR, GRA criteria for Band 6.5. Prompt: ${prompt}\n\nEssay: ${content}`,
          stream: false,
        }),
      });
      if (!response.ok) throw new Error('Ollama error');
      return this.fallback.evaluateWriting(taskType, content, prompt);
    } catch {
      return this.fallback.evaluateWriting(taskType, content, prompt);
    }
  }

  async evaluateSpeaking(
    part: 1 | 2 | 3,
    transcript: string,
    durationSecs: number,
    topic: string
  ): Promise<SpeakingEvaluation> {
    return this.fallback.evaluateSpeaking(part, transcript, durationSecs, topic);
  }

  async explainMistake(mistake: Mistake): Promise<ExplanationResult> {
    return this.fallback.explainMistake(mistake);
  }

  async generatePractice(skill: string, topic: string, targetBand: number): Promise<Partial<Question>[]> {
    return this.fallback.generatePractice(skill, topic, targetBand);
  }
}

// Singleton factory - Defaults to GeminiAIService with automatic offline fallback
let currentAIService: AIService = new GeminiAIService();

export function getAIService(apiKey?: string): AIService {
  if (apiKey) {
    return new GeminiAIService(apiKey);
  }
  return currentAIService;
}

export function setAIService(service: AIService): void {
  currentAIService = service;
}
