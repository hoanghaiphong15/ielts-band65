# IELTS Band 6.5+ Personal Trainer 🚀

A complete, **local-first IELTS Training Web App** designed specifically to help Vietnamese university students and test-takers advance from **Band 5.0 to Band 6.5+**.

Trains all 4 IELTS skills:
1. **Listening** (Sections 1–4, speed controls 0.75x–1.5x, Dictation mode with real-time text diffs, Shadowing mode)
2. **Reading** (Desktop split-screen / mobile stacked, text highlighter, paragraph bookmarks, instant evidence locator, bilingual Vietnamese explanations)
3. **Writing** (Task 1 & Task 2, 8-step structured planning wizard, word counter, 4-criteria IELTS evaluation rubric, sentence-level corrections with grammatical reasons, Band 6.5 model answers)
4. **Speaking** (Parts 1–3, 1-min preparation countdown with scratchpad, 2-min speech timer, MediaRecorder voice recording, Shadowing mode, collocation upgrades like *"very interesting"* → *"fascinating"*, Vietnamese feedback)

Also includes:
* **Spaced Repetition (SRS)** Vocabulary system across 14 high-yield IELTS topics with IPA pronunciation
* **13 Band 6.5 Grammar Lessons** addressing common Vietnamese learner traps
* **Mistake Book** that automatically captures all missed questions for targeted re-practice
* **Adaptive Daily Study Plan** (15m, 30m, 45m, 60m) based on your weakest skills
* **Official Cambridge Band Scoring** with proper .25/.75 rounding rules
* **Mock Tests** (Full, Skill, and Mini tests)
* **Local-First JSON Backup & Restore**
* **Mobile-First PWA Support** (Installable on Android, iPhone, Windows, macOS)

---

## 1. System Architecture

```text
Browser / PWA (React + TypeScript + Vite + Tailwind CSS)
   │
   │  REST API (NetworkFirst / Offline-ready)
   ▼
Local Backend (Node.js + Express + Zod + Prisma ORM)
   │
   ▼
SQLite Database (dev.db)
```

* **100% Local**: No external database or paid cloud APIs required.
* **Offline Audio & Voice**: Uses HTML5 Audio and Web Speech API / Web Audio API.
* **AI Architecture**: Pluggable `AIService` interface with a built-in offline heuristic rule engine and an optional adapter for local Ollama models (`llama3`, etc.).

---

## 2. Requirements

* **Node.js**: v18.0.0 or higher (Tested on Node v22.15.0)
* **npm**: v9.0.0 or higher

---

## 3. Quick Start & Installation

### Step 1: Clone or Navigate to Directory
```bash
cd d:/engApp
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Initialize Database & Seed Original Materials
```bash
npm run db:push
npm run db:seed
```

### Step 4: Start Development Servers
```bash
npm run dev
```
* **Web PWA**: `http://localhost:5173`
* **Local API**: `http://localhost:3001`

---

## 4. Mobile & Wi-Fi Access

The Vite development server is configured with `--host`. You can access and install the app on your phone on the same Wi-Fi network:

1. Find your computer's local IP address:
   * **Windows**: Run `ipconfig` in PowerShell/CMD (look for IPv4 Address, e.g. `192.168.1.45`)
   * **macOS/Linux**: Run `ifconfig` or `ip a`
2. Open your mobile browser (Chrome on Android or Safari on iOS):
   ```text
   http://192.168.x.x:5173
   ```

---

## 5. PWA Installation

### Android (Google Chrome)
1. Open `http://<your-ip>:5173` in Google Chrome.
2. Tap the three-dot menu (**⋮**) in the upper-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. The IELTS 6.5+ Trainer icon will appear on your home screen and open in standalone fullscreen mode.

### iPhone / iPad (Safari)
1. Open `http://<your-ip>:5173` in Safari.
2. Tap the **Share** button (the square with an arrow pointing upward).
3. Scroll down and tap **"Add to Home Screen"** (Thêm vào MH chính).
4. Tap **"Add"** in the upper-right corner.

---

## 6. How to Add New Questions (Data Import)

You can import new IELTS practice materials without changing any code using the import script:

### JSON Format (`sample_questions.json`):
```json
[
  {
    "skill": "READING",
    "section": 1,
    "topic": "Urban Ecology",
    "questionType": "true_false_not_given",
    "difficulty": "medium",
    "targetBand": 6.5,
    "passageTitle": "Urban Green Roofs",
    "passageContent": "[Paragraph A] Green roofs reduce energy costs...",
    "instruction": "Do the following statements agree with the information? Write TRUE, FALSE, or NOT GIVEN.",
    "question": "Green roofs help lower household cooling expenses.",
    "answer": "TRUE",
    "explanation": "Paragraph A confirms energy cost reduction.",
    "explanationVi": "Đoạn A khẳng định mái nhà xanh giúp giảm chi phí năng lượng.",
    "evidenceQuote": "Green roofs reduce energy costs"
  }
]
```

### Run Import Command:
```bash
npm run import:questions --workspace=@ielts/api -- sample_questions.json
```

---

## 7. AI Service Integration

The application defines an extensible AI interface:
```typescript
interface AIService {
  evaluateWriting(taskType: 'TASK_1' | 'TASK_2', content: string, prompt: string): Promise<WritingEvaluation>;
  evaluateSpeaking(part: 1 | 2 | 3, transcript: string, durationSecs: number, topic: string): Promise<SpeakingEvaluation>;
  explainMistake(mistake: Mistake): Promise<ExplanationResult>;
  generatePractice(skill: string, topic: string, targetBand: number): Promise<Partial<Question>[]>;
}
```

* **Default**: `OfflineHeuristicAIService` runs 100% offline without needing any API keys.
* **Optional Local LLM (Ollama)**:
  1. Install [Ollama](https://ollama.com/)
  2. Run `ollama run llama3`
  3. The backend automatically leverages Ollama when reachable at `http://localhost:11434`.

---

## 8. Running Tests & Building

### Run Unit Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 9. Data Backup & Security

* Go to **Settings & Backup** (`/settings`) in the app.
* Click **"Export Backup (JSON)"** to download your complete study history, flashcards, attempts, and mistake book as a single `.json` file.
* You can restore this backup anytime on any device by clicking **"Restore from Backup"**.
