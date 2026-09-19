"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Export all data
router.get('/export', async (req, res) => {
    try {
        const profile = await prisma.userProfile.findUnique({ where: { id: 'default-user' } });
        const attempts = await prisma.attempt.findMany();
        const mistakes = await prisma.mistake.findMany();
        const vocabProgress = await prisma.userVocabProgress.findMany();
        const writingSubmissions = await prisma.writingSubmission.findMany();
        const speakingSubmissions = await prisma.speakingSubmission.findMany();
        const mockTests = await prisma.mockTest.findMany();
        const backupData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            profile,
            attempts,
            mistakes,
            vocabProgress,
            writingSubmissions,
            speakingSubmissions,
            mockTests,
        };
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="ielts-backup-${new Date().toISOString().split('T')[0]}.json"`);
        res.json(backupData);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to export backup data' });
    }
});
// Import backup data
router.post('/import', async (req, res) => {
    try {
        const backup = req.body;
        if (!backup || !backup.version) {
            return res.status(400).json({ error: 'Invalid backup file format' });
        }
        // Restore profile
        if (backup.profile) {
            await prisma.userProfile.upsert({
                where: { id: 'default-user' },
                create: backup.profile,
                update: backup.profile,
            });
        }
        // Restore vocab progress
        if (Array.isArray(backup.vocabProgress)) {
            for (const vp of backup.vocabProgress) {
                await prisma.userVocabProgress.upsert({
                    where: { vocabId: vp.vocabId },
                    create: vp,
                    update: vp,
                });
            }
        }
        // Restore mistakes
        if (Array.isArray(backup.mistakes)) {
            for (const m of backup.mistakes) {
                await prisma.mistake.upsert({
                    where: { id: m.id },
                    create: m,
                    update: m,
                });
            }
        }
        res.json({ message: 'Backup restored successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to import backup data', details: error });
    }
});
exports.default = router;
