import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  GraduationCap,
  AlertCircle,
  Calendar,
  Milestone,
  ArrowRight,
} from 'lucide-react';

export const PracticeHubPage: React.FC = () => {
  const { language } = useUserStore();

  const modules = [
    {
      to: '/listening',
      icon: Headphones,
      titleEn: 'Listening Module',
      titleVi: 'Luyện Nghe IELTS',
      descEn: 'Sections 1-4, Audio speed controls, Dictation & Shadowing modes.',
      descVi: 'Sections 1-4, Tùy chỉnh tốc độ nghe, Chế độ chép chính tả & Nói đuổi.',
      badge: 'Sec 1-4',
    },
    {
      to: '/reading',
      icon: BookOpen,
      titleEn: 'Reading Module',
      titleVi: 'Luyện Đọc IELTS',
      descEn: 'Academic passages, split-screen evidence finder, TFNG analysis.',
      descVi: 'Bài đọc học thuật, tra cứu dẫn chứng hai màn hình, phân tích TFNG.',
      badge: 'Academic',
    },
    {
      to: '/writing',
      icon: PenTool,
      titleEn: 'Writing Module',
      titleVi: 'Luyện Viết IELTS',
      descEn: 'Task 1 & 2, 8-step planning wizard, 4-criteria rubric evaluation.',
      descVi: 'Task 1 & 2, Dàn ý 8 bước, Chấm điểm 4 tiêu chí chuẩn IELTS.',
      badge: 'Task 1 & 2',
    },
    {
      to: '/speaking',
      icon: Mic,
      titleEn: 'Speaking Studio',
      titleVi: 'Phòng Luyện Nói IELTS',
      descEn: 'Part 1-3, 1-min prep timer, microphone recorder, collocation tips.',
      descVi: 'Part 1-3, Đồng hồ 1 phút chuẩn bị, Ghi âm micro, Gợi ý cụm từ hay.',
      badge: 'Part 1-3',
    },
    {
      to: '/vocabulary',
      icon: BookMarked,
      titleEn: 'Vocabulary (SRS)',
      titleVi: 'Từ vựng Học thuật (SRS)',
      descEn: '14 topics, IPA audio, collocations, SuperMemo SM-2 flashcards.',
      descVi: '14 chủ đề, Phát âm IPA, Cụm từ đi kèm, Flashcard lặp lại ngắt quãng.',
      badge: '14 Topics',
    },
    {
      to: '/grammar',
      icon: GraduationCap,
      titleEn: 'Grammar Accuracy',
      titleVi: 'Ngữ pháp Chính xác Band 6.5',
      descEn: '13 core lessons, common Vietnamese traps, interactive exercises.',
      descVi: '13 bài học trọng điểm, Lỗi bẫy người Việt hay mắc, Bài tập tương tác.',
      badge: '13 Lessons',
    },
    {
      to: '/mistakes',
      icon: AlertCircle,
      titleEn: 'Mistake Book',
      titleVi: 'Sổ tay Lỗi sai',
      descEn: 'Automatically collects wrong answers across all skills for targeted retry.',
      descVi: 'Tự động lưu câu sai của tất cả kỹ năng để làm lại đến khi thành thạo.',
      badge: 'Smart Retry',
    },
    {
      to: '/roadmap',
      icon: Milestone,
      titleEn: 'Road to Band 6.5',
      titleVi: 'Lộ trình Chinh phục 6.5',
      descEn: 'Step-by-step milestones (5.0 → 5.5 → 6.0 → 6.5) and actionable goals.',
      descVi: 'Các cột mốc cụ thể và mục tiêu hành động cho từng kỹ năng.',
      badge: 'Milestones',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Trung tâm Luyện tập 4 Kỹ năng' : 'Comprehensive Practice Hub'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {language === 'vi'
            ? 'Chọn kỹ năng hoặc mô-đun bạn muốn rèn luyện hôm nay. Tất cả đều hoạt động ngoại tuyến.'
            : 'Select the skill or module you wish to train today. All materials run 100% locally.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-brand-500 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <m.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {m.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {language === 'vi' ? m.titleVi : m.titleEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {language === 'vi' ? m.descVi : m.descEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 mt-4">
              <span>{language === 'vi' ? 'Vào luyện tập' : 'Open Module'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
