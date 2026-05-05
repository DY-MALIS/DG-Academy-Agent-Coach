import { Languages } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 text-slate-400">
        <Languages className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest khmer-text">{t('language')}</span>
      </div>
      <div className="bg-slate-50 p-1 rounded-2xl flex items-center border border-slate-100 shadow-sm transition-all duration-300">
        <button
          onClick={() => setLanguage('km')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all duration-300 ${
            language === 'km'
              ? 'bg-primary-950 text-white shadow-lg khmer-text'
              : 'text-slate-400 hover:bg-white hover:text-slate-600'
          }`}
        >
          ខ្មែរ
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all duration-300 ${
            language === 'en'
              ? 'bg-primary-950 text-white shadow-lg'
              : 'text-slate-400 hover:bg-white hover:text-slate-600'
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
}
