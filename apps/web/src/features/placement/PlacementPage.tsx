import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { CheckCircle2, ChevronRight, Sparkles, Award } from 'lucide-react';

export const PlacementPage: React.FC = () => {
  const { profile, updateProfile, language } = useUserStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<'survey' | 'test' | 'results'>('survey');

  // Survey state
  const [takenBefore, setTakenBefore] = useState<'yes' | 'no'>('no');
  const [estBand, setEstBand] = useState<number>(5.0);
  const [targetBand, setTargetBand] = useState<number>(6.5);
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);
  const [examDate, setExamDate] = useState<string>('');

  // Diagnostic mini-test state
  const [qListening, setQListening] = useState<string>('');
  const [qReading, setQReading] = useState<string>('');
  const [qWriting, setQWriting] = useState<string>('');
  const [qSpeaking, setQSpeaking] = useState<string>('');

  // Results state
  const [results, setResults] = useState<any>(null);

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('test');
  };

  const handleTestSubmit = async () => {
    // Score the diagnostic questions
    let lBand = 5.0;
    if (qListening === 'B') lBand = 6.0;

    let rBand = 5.0;
    if (qReading === 'TRUE') rBand = 6.0;

    let wBand = 4.5;
    if (qWriting.toLowerCase().includes('are') && !qWriting.toLowerCase().includes('is')) {
      wBand = 5.5;
    }

    let sBand = 5.0;
    if (qSpeaking.trim().split(/\s+/).length >= 15) {
      sBand = 5.5;
    }

    const overall = Math.round(((lBand + rBand + wBand + sBand) / 4) * 2) / 2;

    const skillRanking = [
      { skill: 'Writing', skillVi: 'Kỹ năng Viết', band: wBand },
      { skill: 'Speaking', skillVi: 'Kỹ năng Nói', band: sBand },
      { skill: 'Listening', skillVi: 'Kỹ năng Nghe', band: lBand },
      { skill: 'Reading', skillVi: 'Kỹ năng Đọc', band: rBand },
    ].sort((a, b) => a.band - b.band);

    const resultData = {
      listeningBand: lBand,
      readingBand: rBand,
      writingBand: wBand,
      speakingBand: sBand,
      currentBand: overall,
      targetBand,
      dailyGoalMinutes: dailyMinutes,
      examDate: examDate || null,
      hasCompletedPlacement: true,
    };

    setResults({ ...resultData, ranking: skillRanking });
    await updateProfile(resultData);
    setStep('results');
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Step 1: Initial Survey */}
      {step === 'survey' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Khảo sát đầu vào cá nhân' : 'Initial Placement Questionnaire'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi'
                ? 'Hãy cho chúng tôi biết mục tiêu của bạn để thiết kế lộ trình đạt Band 6.5+ chính xác nhất.'
                : 'Tell us your goals to design a structured training path directly toward Band 6.5+.'}
            </p>
          </div>

          <form onSubmit={handleSurveySubmit} className="space-y-6">
            {/* Question 1: Taken IELTS before? */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'vi' ? 'Bạn đã từng thi IELTS chưa?' : 'Have you taken IELTS before?'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTakenBefore('yes')}
                  className={`p-3.5 rounded-xl border font-bold text-xs transition-all min-h-touch ${
                    takenBefore === 'yes'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {language === 'vi' ? 'Đã từng thi' : 'Yes, I have'}
                </button>
                <button
                  type="button"
                  onClick={() => setTakenBefore('no')}
                  className={`p-3.5 rounded-xl border font-bold text-xs transition-all min-h-touch ${
                    takenBefore === 'no'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {language === 'vi' ? 'Chưa từng thi' : 'No, first time'}
                </button>
              </div>
            </div>

            {/* Question 2: Estimated Current Band */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'vi' ? 'Band ước tính hiện tại của bạn' : 'Estimated Current Band'}
                </label>
                <span className="text-sm font-black text-brand-600">Band {estBand.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="6.0"
                step="0.5"
                value={estBand}
                onChange={(e) => setEstBand(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Band 4.0</span>
                <span>Band 5.0 (Cơ bản)</span>
                <span>Band 6.0</span>
              </div>
            </div>

            {/* Question 3: Target Band */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'vi' ? 'Band mục tiêu' : 'Target Band'}
                </label>
                <span className="text-sm font-black text-amber-600">Band {targetBand.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="8.0"
                step="0.5"
                value={targetBand}
                onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Band 6.0</span>
                <span>Band 6.5 (Mục tiêu chuẩn)</span>
                <span>Band 7.5+</span>
              </div>
            </div>

            {/* Question 4: Daily Study Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'vi' ? 'Thời gian học mỗi ngày' : 'Available Study Time Per Day'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                      dailyMinutes === mins
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Exam Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'vi' ? 'Ngày dự kiến thi (nếu có)' : 'Planned Exam Date (Optional)'}
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 min-h-touch"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 min-h-touch"
            >
              <span>{language === 'vi' ? 'Tiếp tục làm bài kiểm tra nhanh' : 'Proceed to Quick Diagnostic'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Diagnostic Mini Test */}
      {step === 'test' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase text-brand-600 tracking-wider">
              {language === 'vi' ? 'Kiểm tra chẩn đoán 4 kỹ năng' : '4-Skill Quick Diagnostic'}
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {language === 'vi' ? '4 câu hỏi đánh giá nhanh năng lực' : '4 Diagnostic Skill Questions'}
            </h2>
          </div>

          {/* 1. Listening Diagnostic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase">1. Listening Diagnostic</span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
              "The library will remain open until 9:00 PM on weekdays, but weekend hours finish promptly at 5:00 PM."
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              When does the library close on Saturday?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'A', text: '9:00 PM' },
                { id: 'B', text: '5:00 PM' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQListening(opt.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left min-h-touch ${
                    qListening === opt.id
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {opt.id}. {opt.text}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Reading Diagnostic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase">2. Reading Diagnostic (TFNG)</span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic">
              "Nearly seventy percent of the projected world population will live in urban centers by 2050."
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Statement: "By 2050, more than half of all people will reside in cities."
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['TRUE', 'FALSE', 'NOT GIVEN'].map((ans) => (
                <button
                  key={ans}
                  type="button"
                  onClick={() => setQReading(ans)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center min-h-touch ${
                    qReading === ans
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Writing Diagnostic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase">3. Writing Grammar Diagnostic</span>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Identify the error and write the correct verb for this sentence:
              <br />
              <span className="font-semibold italic">"People is using technology more and more."</span>
            </p>
            <input
              type="text"
              placeholder="Type corrected verb (e.g. are)"
              value={qWriting}
              onChange={(e) => setQWriting(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium min-h-touch"
            />
          </div>

          {/* 4. Speaking Diagnostic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase">4. Speaking Self-Expression</span>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              In 1-2 sentences, why do you want to achieve IELTS Band 6.5+?
            </p>
            <textarea
              rows={2}
              placeholder="e.g. I need Band 6.5 to apply for a master's scholarship in Australia and advance my career in data science."
              value={qSpeaking}
              onChange={(e) => setQSpeaking(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium min-h-touch"
            />
          </div>

          <button
            onClick={handleTestSubmit}
            disabled={!qListening || !qReading || !qWriting}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 min-h-touch"
          >
            <span>{language === 'vi' ? 'Xem kết quả & Hồ sơ năng lực' : 'View Estimated Skill Profile'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 3: Diagnostic Results & Tailored Profile */}
      {step === 'results' && results && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Hồ sơ năng lực khởi điểm của bạn' : 'Your Estimated Skill Profile'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi'
                ? 'Dựa trên kết quả đo lường, đây là thứ tự ưu tiên ôn tập để đạt Band 6.5+ nhanh nhất.'
                : 'Based on measured performance, here is your priority roadmap to Band 6.5+.'}
            </p>
          </div>

          {/* Estimated Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-semibold">Listening</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {results.listeningBand.toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-semibold">Reading</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {results.readingBand.toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-semibold">Writing</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {results.writingBand.toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-semibold">Speaking</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {results.speakingBand.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Measured Priority Ranking */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
            <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200 mb-3">
              {language === 'vi' ? 'Thứ tự ưu tiên cần tập trung:' : 'Measured Priority Ranking:'}
            </h4>
            <ol className="space-y-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {results.ranking.map((item: any, idx: number) => (
                <li key={item.skill} className="flex items-center justify-between">
                  <span>
                    {idx + 1}. {language === 'vi' ? item.skillVi : item.skill} (Band {item.band.toFixed(1)})
                  </span>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                    {idx === 0
                      ? language === 'vi'
                        ? 'Ưu tiên số 1'
                        : 'Top Priority'
                      : language === 'vi'
                      ? 'Luyện đều đặn'
                      : 'Maintain & Improve'}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 min-h-touch"
          >
            {language === 'vi' ? 'Bắt đầu học ngay trên Dashboard' : 'Start Practicing on Dashboard'}
          </button>
        </div>
      )}
    </div>
  );
};
