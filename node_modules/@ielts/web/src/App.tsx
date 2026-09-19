import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { PlacementPage } from './features/placement/PlacementPage';
import { PracticeHubPage } from './features/practice/PracticeHubPage';
import { ListeningPage } from './features/listening/ListeningPage';
import { ReadingPage } from './features/reading/ReadingPage';
import { WritingPage } from './features/writing/WritingPage';
import { SpeakingPage } from './features/speaking/SpeakingPage';
import { VocabularyPage } from './features/vocabulary/VocabularyPage';
import { GrammarPage } from './features/grammar/GrammarPage';
import { MistakesPage } from './features/mistakes/MistakesPage';
import { StudyPlanPage } from './features/study-plan/StudyPlanPage';
import { RoadmapPage } from './features/roadmap/RoadmapPage';
import { MockTestPage } from './features/mock-test/MockTestPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { SettingsPage } from './features/settings/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/placement" element={<PlacementPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="practice" element={<PracticeHubPage />} />
          <Route path="listening" element={<ListeningPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="writing" element={<WritingPage />} />
          <Route path="speaking" element={<SpeakingPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="grammar" element={<GrammarPage />} />
          <Route path="mistakes" element={<MistakesPage />} />
          <Route path="study-plan" element={<StudyPlanPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="mock-test" element={<MockTestPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
