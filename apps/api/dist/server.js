"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const attemptRoutes_1 = __importDefault(require("./routes/attemptRoutes"));
const mistakeRoutes_1 = __importDefault(require("./routes/mistakeRoutes"));
const vocabRoutes_1 = __importDefault(require("./routes/vocabRoutes"));
const grammarRoutes_1 = __importDefault(require("./routes/grammarRoutes"));
const writingRoutes_1 = __importDefault(require("./routes/writingRoutes"));
const speakingRoutes_1 = __importDefault(require("./routes/speakingRoutes"));
const mockTestRoutes_1 = __importDefault(require("./routes/mockTestRoutes"));
const studyPlanRoutes_1 = __importDefault(require("./routes/studyPlanRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const backupRoutes_1 = __importDefault(require("./routes/backupRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middlewares
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Mount routes
app.use('/api/profile', profileRoutes_1.default);
app.use('/api/questions', questionRoutes_1.default);
app.use('/api/attempts', attemptRoutes_1.default);
app.use('/api/mistakes', mistakeRoutes_1.default);
app.use('/api/vocabulary', vocabRoutes_1.default);
app.use('/api/grammar', grammarRoutes_1.default);
app.use('/api/writing', writingRoutes_1.default);
app.use('/api/speaking', speakingRoutes_1.default);
app.use('/api/mock-test', mockTestRoutes_1.default);
app.use('/api/study-plan', studyPlanRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/backup', backupRoutes_1.default);
// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`[IELTS API Server] listening on http://localhost:${PORT}`);
    });
}
exports.default = app;
