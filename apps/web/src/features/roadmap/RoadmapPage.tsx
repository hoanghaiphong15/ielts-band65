import React from 'react';
import { useUserStore } from '../../stores/userStore';
import { Link } from 'react-router-dom';
import {
  Milestone,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Sparkles,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { profile, language } = useUserStore();

  if (!profile) return null;

  const milestones = [
    {
      level: '5.0',
      title: 'Foundation Level (Hiện tại)',
      titleEn: 'Foundation Level (Current)',
      descVi: 'Nắm được các câu đơn giản, từ vựng cơ bản nhưng còn mắc nhiều lỗi ngữ pháp và hạn chế về độ mạch lạc.',
      descEn: 'Can produce simple sentences, basic vocabulary, but frequent grammatical errors and limited cohesion.',
      completed: profile.currentBand >= 5.0,
      current: profile.currentBand >= 5.0 && profile.currentBand < 5.5,
    },
    {
      level: '5.5',
      title: 'Modest Competence',
      titleEn: 'Modest Competence',
      descVi: 'Bắt đầu sử dụng câu phức, vốn từ vựng mở rộng nhưng vẫn còn vấp lỗi mạo từ, chia động từ và phát âm âm đuôi.',
      descEn: 'Begins using complex structures; vocabulary expands but persistent errors in articles, agreement, and ending sounds.',
      completed: profile.currentBand >= 5.5,
      current: profile.currentBand >= 5.5 && profile.currentBand < 6.0,
    },
    {
      level: '6.0',
      title: 'Competent User',
      titleEn: 'Competent User',
      descVi: 'Sử dụng ngôn ngữ tương đối hiệu quả, hiểu được các đoạn văn học thuật phức tạp, bài viết có cấu trúc rõ ràng.',
      descEn: 'Generally effective command of language; understands complex academic passages; structured writing.',
      completed: profile.currentBand >= 6.0,
      current: profile.currentBand >= 6.0 && profile.currentBand < 6.5,
    },
    {
      level: '6.5+',
      title: 'Target Band (Mục tiêu)',
      titleEn: 'Target Band (Goal)',
      descVi: 'Kiểm soát tốt ngữ pháp, sử dụng linh hoạt các cụm từ học thuật (collocations), tư duy phản biện và phát triển ý sâu sắc.',
      descEn: 'Strong grammatical control, flexible academic collocations, deep idea development, and minimal distracting errors.',
      completed: profile.currentBand >= 6.5,
      current: profile.currentBand >= 6.5,
    },
  ];

  const skillGoals = [
    {
      skill: 'Writing',
      skillVi: 'Kỹ năng Viết',
      icon: PenTool,
      current: profile.writingBand,
      target: 6.5,
      path: '/writing',
      weaknessVi: 'Lỗi mạo từ (a/an/the), hòa hợp chủ vị (people is) và thiếu từ nối học thuật.',
      weaknessEn: 'Article omissions, subject-verb agreement (people is), and scarce academic cohesive devices.',
      actionGoalVi: 'Giảm 30% lỗi ngữ pháp, hoàn thành đủ 250 từ cho Task 2 với dàn ý 4 đoạn chuẩn.',
      actionGoalEn: 'Reduce grammatical errors by 30%, meet 250 words minimum with a solid 4-paragraph structure.',
    },
    {
      skill: 'Speaking',
      skillVi: 'Kỹ năng Nói',
      icon: Mic,
      current: profile.speakingBand,
      target: 6.5,
      path: '/speaking',
      weaknessVi: 'Nói ngập ngừng trước danh từ, lặp từ "very" nhiều lần, quên phát âm âm đuôi (/s/, /z/, /t/).',
      weaknessEn: 'Pausing before nouns, overusing "very", and dropping word-ending consonants (/s/, /z/, /t/).',
      actionGoalVi: 'Luyện tập Shadowing 15 phút mỗi ngày, thay thế "very interesting" bằng "fascinating".',
      actionGoalEn: 'Practice 15 minutes of Shadowing daily, replace basic phrases with Band 6.5+ collocations.',
    },
    {
      skill: 'Listening',
      skillVi: 'Kỹ năng Nghe',
      icon: Headphones,
      current: profile.listeningBand,
      target: 6.5,
      path: '/listening',
      weaknessVi: 'Bẫy thông tin gây nhiễu (distractors) và sai chính tả khi điền từ ở Section 1 & 4.',
      weaknessEn: 'Falling for conversational distractors and spelling errors in Section 1 & 4 note completions.',
      actionGoalVi: 'Luyện nghe chép chính tả (Dictation) để nâng cao độ nhạy với âm đuôi và mạo từ.',
      actionGoalEn: 'Use Dictation mode to sharpen phonetic recognition of plurals and determiners.',
    },
    {
      skill: 'Reading',
      skillVi: 'Kỹ năng Đọc',
      icon: BookOpen,
      current: profile.readingBand,
      target: 6.5,
      path: '/reading',
      weaknessVi: 'Nhầm lẫn giữa FALSE và NOT GIVEN, mất nhiều thời gian tìm dẫn chứng trong bài.',
      weaknessEn: 'Confusing FALSE and NOT GIVEN; spending excessive time locating textual evidence.',
      actionGoalVi: 'Luyện đọc phân tích dẫn chứng hai màn hình, nắm vững kỹ thuật Skimming & Scanning.',
      actionGoalEn: 'Master split-view evidence hunting and eliminate guesswork on TFNG questions.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <Milestone className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lộ trình cá nhân hóa' : 'Personalized Curriculum Roadmap'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Hành trình từ Band 5.0 lên Band 6.5+' : 'Road to IELTS Band 6.5+'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Đạt Band 6.5 không đòi hỏi từ vựng quá cao siêu mà tập trung vào độ chính xác ngữ pháp, khả năng tìm dẫn chứng bài đọc, phản xạ nghe chi tiết và phát triển ý bài nói mạch lạc.'
            : 'Achieving Band 6.5 requires consistent grammatical control, accurate reading evidence identification, detailed listening comprehension, and coherent speaking fluency.'}
        </p>
      </div>

      {/* 4 Milestones Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((m, idx) => (
          <div
            key={m.level}
            className={`p-5 rounded-3xl border transition-all space-y-3 ${
              m.current
                ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                : m.completed
                ? 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                Band {m.level}
              </span>
              {m.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : m.current ? (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white">
                  {language === 'vi' ? 'Hiện tại' : 'Current'}
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400">Step {idx + 1}</span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'vi' ? m.title : m.titleEn}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'vi' ? m.descVi : m.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Concrete Goals for Each Skill */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Mục tiêu hành động cụ thể cho từng kỹ năng' : 'Actionable Skill-by-Skill Goals'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillGoals.map((g) => (
            <div
              key={g.skill}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
                    <g.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'vi' ? g.skillVi : g.skill}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-slate-500">Band {g.current.toFixed(1)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-brand-600 font-black">Band {g.target.toFixed(1)}</span>
                </div>
              </div>

              {/* Weakness */}
              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs">
                <span className="font-bold text-rose-800 dark:text-rose-300 block mb-0.5">
                  {language === 'vi' ? 'Điểm yếu hiện tại:' : 'Current Weakness:'}
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {language === 'vi' ? g.weaknessVi : g.weaknessEn}
                </p>
              </div>

              {/* Action Goal */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  {language === 'vi' ? 'Mục tiêu bứt phá:' : 'Action Goal:'}
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {language === 'vi' ? g.actionGoalVi : g.actionGoalEn}
                </p>
              </div>

              <Link
                to={g.path}
                className="w-full py-2.5 rounded-xl border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-touch"
              >
                <span>{language === 'vi' ? `Luyện tập ${g.skillVi} ngay` : `Practice ${g.skill}`}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
