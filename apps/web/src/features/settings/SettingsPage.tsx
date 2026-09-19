import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Globe,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Save,
  Sparkles,
  Key,
  ExternalLink,
  Zap,
  Loader2,
  XCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, language, theme, setLanguage, setTheme, updateProfile } = useUserStore();

  const [targetBand, setTargetBand] = useState<number>(profile?.targetBand || 6.5);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(profile?.dailyGoalMinutes || 45);
  const [examDate, setExamDate] = useState<string>(profile?.examDate || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(
    () => localStorage.getItem('gemini-api-key') || ''
  );
  const [apiKeySaved, setApiKeySaved] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestApiKey = async () => {
    if (!geminiApiKey.trim()) {
      setTestStatus({
        success: false,
        message: language === 'vi' ? 'Vui lòng nhập API Key trước khi kiểm tra.' : 'Please enter an API Key first.',
      });
      return;
    }
    setIsTestingKey(true);
    setTestStatus(null);
    try {
      const res = await api.testGeminiKey(geminiApiKey.trim());
      if (res.success) {
        setTestStatus({ success: true, message: res.message });
      } else {
        setTestStatus({ success: false, message: res.error || 'Kiểm tra thất bại.' });
      }
    } catch (err: any) {
      setTestStatus({
        success: false,
        message: err.message || (language === 'vi' ? 'Lỗi kết nối khi kiểm tra.' : 'Connection error during test.'),
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiApiKey.trim()) {
      localStorage.setItem('gemini-api-key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('gemini-api-key');
    }
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      targetBand,
      dailyGoalMinutes,
      examDate: examDate || null,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = async () => {
    try {
      window.location.href = api.exportBackupUrl();
    } catch (err) {
      console.error('Failed to export backup:', err);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      await api.importBackup(backupData);
      setImportSuccess('Backup restored successfully! Please refresh the page.');
    } catch (err: any) {
      console.error('Failed to import backup:', err);
      alert('Failed to restore backup: ' + err.message);
    }
  };

  const handleResetProgress = async () => {
    try {
      await api.resetProgress();
      setIsResetConfirmOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to reset progress:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <Settings className="w-4 h-4" />
          <span>{language === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Cài đặt & Sao lưu dữ liệu' : 'Preferences & Data Backup'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {language === 'vi'
            ? 'Quản lý mục tiêu Band điểm, ngôn ngữ giao diện, chế độ sáng/tối và sao lưu toàn bộ tiến độ học tập vào máy tính.'
            : 'Configure Band targets, interface language, theme, and export full backups to guarantee you never lose your progress.'}
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Mục tiêu luyện thi' : 'IELTS Target Preferences'}
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'vi' ? 'Band mục tiêu' : 'Target Band'}
              </label>
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white min-h-touch"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0].map((b) => (
                  <option key={b} value={b}>
                    Band {b.toFixed(1)} {b === 6.5 ? '(Target Standard)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'vi' ? 'Thời gian học mỗi ngày' : 'Daily Study Goal'}
              </label>
              <select
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white min-h-touch"
              >
                {[15, 30, 45, 60, 90].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes per day
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'vi' ? 'Ngày dự kiến thi IELTS' : 'Target Exam Date'}
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white min-h-touch"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {language === 'vi' ? 'Đã lưu thay đổi!' : 'Settings saved successfully!'}
              </span>
            )}

            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2 min-h-touch"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'vi' ? 'Lưu cài đặt' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Language & Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Ngôn ngữ & Giao diện' : 'Language & Display'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'vi' ? 'Ngôn ngữ giao diện & Giải thích' : 'Language & Explanations'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                  language === 'vi'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                Tiếng Việt (VI)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                  language === 'en'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'vi' ? 'Chế độ hiển thị' : 'Theme Mode'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                  theme === 'light'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                  theme === 'dark'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                  theme === 'system'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Gemini AI API Configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Google Gemini AI (Tùy chọn - Miễn phí 100%)' : 'Google Gemini AI (Optional - 100% Free)'}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {language === 'vi' ? 'Miễn phí' : 'Free Tier'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'vi'
            ? 'Tích hợp Gemini 1.5/2.0 Flash để chấm bài Writing & Speaking chi tiết từng câu như giám khảo bản xứ. Hoàn toàn miễn phí từ Google AI Studio. Nếu không nhập key, hệ thống sẽ tự động dùng bộ chấm điểm Heuristic có sẵn.'
            : 'Integrate Gemini 1.5/2.0 Flash for examiner-level feedback, native rewrites, and band analysis. Free tier provided by Google AI Studio. If left empty, the built-in heuristic evaluator will be used.'}
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Gemini API Key</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-bold inline-flex items-center gap-1 normal-case tracking-normal hover:underline"
              >
                <span>{language === 'vi' ? 'Lấy key miễn phí tại Google AI Studio' : 'Get free key at Google AI Studio'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white min-h-touch"
            />
          </div>

          {/* Test Status Banner */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 transition-all ${
                testStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">
                <span className="font-bold block mb-0.5">
                  {testStatus.success
                    ? language === 'vi'
                      ? 'Kết nối thành công!'
                      : 'Connection Successful!'
                    : language === 'vi'
                    ? 'Kết nối thất bại'
                    : 'Connection Failed'}
                </span>
                <span>{testStatus.message}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {apiKeySaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                {language === 'vi' ? 'Đã lưu API Key thành công!' : 'API Key saved successfully!'}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                {geminiApiKey ? (language === 'vi' ? '✓ Đang bật chế độ Gemini AI' : '✓ Gemini AI enabled') : (language === 'vi' ? 'Đang dùng bộ chấm điểm cục bộ' : 'Using offline evaluator')}
              </span>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isTestingKey}
                className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5 min-h-touch disabled:opacity-50"
              >
                {isTestingKey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'vi' ? 'Đang kiểm tra...' : 'Testing...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'vi' ? 'Kiểm tra kết nối' : 'Test API Key'}</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2 min-h-touch"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'vi' ? 'Lưu API Key' : 'Save API Key'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Local-First Backup and Restore */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Sao lưu & Phục hồi dữ liệu' : 'Local-First Backup & Restore'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {language === 'vi'
            ? 'Vì ứng dụng hoạt động hoàn toàn cục bộ (local-first), bạn có thể xuất toàn bộ tiến độ, thẻ từ vựng và sổ tay lỗi sai thành tệp JSON để lưu trữ hoặc chuyển sang thiết bị khác.'
            : 'Because the application is local-first, you can export all user attempts, spaced repetition progress, and mistakes into a single JSON file.'}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 min-h-touch"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'vi' ? 'Xuất tệp sao lưu (.json)' : 'Export Backup (JSON)'}</span>
          </button>

          <label className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer min-h-touch">
            <Upload className="w-4 h-4" />
            <span>{language === 'vi' ? 'Phục hồi từ tệp (.json)' : 'Restore from Backup'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        {importSuccess && (
          <p className="text-xs font-bold text-emerald-600">{importSuccess}</p>
        )}
      </div>

      {/* Reset Progress Danger Zone */}
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <h3 className="text-base font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{language === 'vi' ? 'Khu vực nguy hiểm' : 'Danger Zone'}</span>
        </h3>

        <p className="text-xs text-slate-500">
          {language === 'vi'
            ? 'Xóa toàn bộ lịch sử làm bài, sổ tay lỗi sai và tiến độ từ vựng để bắt đầu lại từ đầu.'
            : 'Clear all practice attempts, mistake book records, and vocabulary progress to reset from scratch.'}
        </p>

        {!isResetConfirmOpen ? (
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50 min-h-touch"
          >
            {language === 'vi' ? 'Đặt lại toàn bộ tiến độ' : 'Reset All Progress'}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-3">
            <p className="text-xs font-bold text-rose-800 dark:text-rose-300">
              {language === 'vi'
                ? 'Bạn có chắc chắn muốn xóa hết tiến độ không? Thao tác này không thể hoàn tác.'
                : 'Are you sure you want to reset all progress? This action cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs min-h-touch"
              >
                {language === 'vi' ? 'Xác nhận xóa' : 'Confirm Reset'}
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold min-h-touch"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
