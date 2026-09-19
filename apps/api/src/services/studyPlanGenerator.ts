import { DailyStudyPlan, StudyPlanItem, SkillType } from '@ielts/shared';

export interface UserSkillStats {
  listeningBand: number;
  readingBand: number;
  writingBand: number;
  speakingBand: number;
  dueVocabCount: number;
  unresolvedMistakesCount: number;
}

export function generateDailyStudyPlan(
  targetMinutes: number,
  stats: UserSkillStats,
  dateString: string = new Date().toISOString().split('T')[0]
): DailyStudyPlan {
  // Determine weakest skill
  const skillBands: Array<{ skill: SkillType; band: number }> = [
    { skill: 'WRITING', band: stats.writingBand },
    { skill: 'SPEAKING', band: stats.speakingBand },
    { skill: 'LISTENING', band: stats.listeningBand },
    { skill: 'READING', band: stats.readingBand },
  ];

  // Sort ascending (lowest band first)
  skillBands.sort((a, b) => a.band - b.band);

  const items: StudyPlanItem[] = [];

  if (targetMinutes <= 20) {
    // 20-minute rapid drill
    items.push({
      id: 'plan-vocab',
      skill: 'VOCABULARY',
      title: 'Vocabulary SRS Review',
      titleVi: 'Ôn tập từ vựng ngắt quãng (SRS)',
      durationMinutes: 5,
      completed: false,
      actionUrl: '/vocabulary',
      description: `Review ${Math.min(15, stats.dueVocabCount || 10)} due flashcards.`,
      descriptionVi: `Ôn tập ${Math.min(15, stats.dueVocabCount || 10)} từ vựng đến hạn hôm nay.`,
    });
    items.push({
      id: 'plan-weakest',
      skill: skillBands[0].skill,
      title: `${skillBands[0].skill} Targeted Drill`,
      titleVi: `Luyện tập kỹ năng yếu nhất: ${skillBands[0].skill}`,
      durationMinutes: 8,
      completed: false,
      actionUrl: `/${skillBands[0].skill.toLowerCase()}`,
      description: `Focus on weakest area (current Band ${skillBands[0].band.toFixed(1)}).`,
      descriptionVi: `Tập trung cải thiện điểm yếu nhất (Band hiện tại: ${skillBands[0].band.toFixed(1)}).`,
    });
    items.push({
      id: 'plan-listening',
      skill: 'LISTENING',
      title: 'Listening Dictation',
      titleVi: 'Luyện nghe chép chính tả',
      durationMinutes: 7,
      completed: false,
      actionUrl: '/listening?mode=dictation',
      description: 'Sharpen phonetic recognition with a short dictation segment.',
      descriptionVi: 'Rèn luyện phản xạ nghe chi tiết qua bài nghe chép chính tả ngắn.',
    });
  } else if (targetMinutes <= 35) {
    // 30-minute balanced session
    items.push({
      id: 'plan-vocab',
      skill: 'VOCABULARY',
      title: 'Vocabulary SRS Review',
      titleVi: 'Ôn tập từ vựng SRS',
      durationMinutes: 8,
      completed: false,
      actionUrl: '/vocabulary',
      description: 'Complete all due flashcard reviews for today.',
      descriptionVi: 'Hoàn thành tất cả các thẻ từ vựng đến hạn hôm nay.',
    });
    items.push({
      id: 'plan-weakest-1',
      skill: skillBands[0].skill,
      title: `${skillBands[0].skill} Core Drill`,
      titleVi: `Bài tập trọng điểm ${skillBands[0].skill}`,
      durationMinutes: 12,
      completed: false,
      actionUrl: `/${skillBands[0].skill.toLowerCase()}`,
      description: `Targeted practice for ${skillBands[0].skill} (Band ${skillBands[0].band.toFixed(1)}).`,
      descriptionVi: `Luyện tập chuyên sâu kỹ năng ${skillBands[0].skill} (Band ${skillBands[0].band.toFixed(1)}).`,
    });
    items.push({
      id: 'plan-reading-tfng',
      skill: 'READING',
      title: 'Reading True/False/Not Given Drill',
      titleVi: 'Luyện kỹ năng Đọc TFNG',
      durationMinutes: 10,
      completed: false,
      actionUrl: '/reading',
      description: 'Practice 10 TFNG questions with evidence-based reasoning.',
      descriptionVi: 'Luyện 10 câu TFNG kèm phân tích dẫn chứng chính xác.',
    });
  } else {
    // 45+ minute comprehensive session
    items.push({
      id: 'plan-vocab',
      skill: 'VOCABULARY',
      title: 'Vocabulary SRS Review',
      titleVi: 'Ôn tập từ vựng SRS',
      durationMinutes: 10,
      completed: false,
      actionUrl: '/vocabulary',
      description: 'Review due flashcards and learn 5 new Band 6.5 collocations.',
      descriptionVi: 'Ôn từ vựng đến hạn và nạp thêm 5 cụm từ học thuật Band 6.5.',
    });
    items.push({
      id: 'plan-listening',
      skill: 'LISTENING',
      title: 'Listening Section Practice & Dictation',
      titleVi: 'Luyện nghe theo Section & Chép chính tả',
      durationMinutes: 10,
      completed: false,
      actionUrl: '/listening',
      description: 'Complete Section 2 or 3 and review missed answers.',
      descriptionVi: 'Hoàn thành Section 2 hoặc 3 và rà soát lỗi sai.',
    });
    items.push({
      id: 'plan-reading',
      skill: 'READING',
      title: 'Reading Passage & Evidence Hunting',
      titleVi: 'Luyện đọc đoạn văn & Tìm dẫn chứng',
      durationMinutes: 12,
      completed: false,
      actionUrl: '/reading',
      description: 'Practice academic reading passage with split-view evidence locator.',
      descriptionVi: 'Luyện đọc học thuật với giao diện tra cứu dẫn chứng hai màn hình.',
    });
    items.push({
      id: 'plan-speaking',
      skill: 'SPEAKING',
      title: 'Speaking Part 2 Simulation',
      titleVi: 'Mô phỏng Speaking Part 2',
      durationMinutes: 8,
      completed: false,
      actionUrl: '/speaking',
      description: '1-min preparation note-taking + 2-min recorded speech with feedback.',
      descriptionVi: '1 phút ghi chú dàn ý + 2 phút ghi âm bài nói nhận phản hồi.',
    });
    items.push({
      id: 'plan-grammar',
      skill: 'GRAMMAR',
      title: 'Grammar Band 6.5 Accuracy Drill',
      titleVi: 'Ngữ pháp chính xác Band 6.5',
      durationMinutes: 5,
      completed: false,
      actionUrl: '/grammar',
      description: 'Articles and Complex Sentences interactive drill.',
      descriptionVi: 'Bài tập tương tác về mạo từ và câu phức.',
    });
  }

  // If there are unresolved mistakes, add a quick 5-min mistake notebook review
  if (stats.unresolvedMistakesCount > 0 && targetMinutes >= 45) {
    items.push({
      id: 'plan-mistakes',
      skill: 'READING',
      title: 'Mistake Notebook Review',
      titleVi: 'Ôn tập Sổ tay lỗi sai',
      durationMinutes: 5,
      completed: false,
      actionUrl: '/mistakes',
      description: `Re-practice ${Math.min(5, stats.unresolvedMistakesCount)} previously missed questions.`,
      descriptionVi: `Làm lại ${Math.min(5, stats.unresolvedMistakesCount)} câu hỏi đã từng làm sai trước đó.`,
    });
  }

  const totalMinutes = items.reduce((acc, item) => acc + item.durationMinutes, 0);

  return {
    date: dateString,
    totalPlannedMinutes: totalMinutes,
    completedMinutes: 0,
    items,
  };
}
