import React from 'react';
import { useUserStore } from '../stores/userStore';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useUserStore();

  return (
    <button
      onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors min-h-touch"
      title="Toggle English / Tiếng Việt"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
      <span>{language === 'vi' ? 'VI (Tiếng Việt)' : 'EN (English)'}</span>
    </button>
  );
};
