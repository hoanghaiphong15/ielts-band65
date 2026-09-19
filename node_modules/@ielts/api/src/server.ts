import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profileRoutes';
import questionRoutes from './routes/questionRoutes';
import attemptRoutes from './routes/attemptRoutes';
import mistakeRoutes from './routes/mistakeRoutes';
import vocabRoutes from './routes/vocabRoutes';
import grammarRoutes from './routes/grammarRoutes';
import writingRoutes from './routes/writingRoutes';
import speakingRoutes from './routes/speakingRoutes';
import mockTestRoutes from './routes/mockTestRoutes';
import studyPlanRoutes from './routes/studyPlanRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import backupRoutes from './routes/backupRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/profile', profileRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/mistakes', mistakeRoutes);
app.use('/api/vocabulary', vocabRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/writing', writingRoutes);
app.use('/api/speaking', speakingRoutes);
app.use('/api/mock-test', mockTestRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/backup', backupRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[IELTS API Server] listening on http://localhost:${PORT}`);
  });
}

export default app;
