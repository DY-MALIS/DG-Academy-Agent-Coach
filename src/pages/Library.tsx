import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { runFullSeed } from '../lib/seeds';
import { Search, Copy, Check, Heart, Filter, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

const CATEGORIES = ["All", "Student", "Teacher", "Business", "Marketing", "Sales", "Accounting", "Coding", "Design", "CV / Job", "Automation"];

const CATEGORY_MAP: Record<string, string> = {
  "All": "all_categories",
  "Student": "student",
  "Teacher": "teacher",
  "Business": "business",
  "Marketing": "marketing",
  "Sales": "sales",
  "Accounting": "accounting",
  "Coding": "coding",
  "Design": "design",
  "CV / Job": "job",
  "Automation": "automation"
};

export default function Library() {
  const { t } = useLanguage();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, 'prompts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setPrompts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center md:text-left shadow-2xl shadow-slate-200">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary-600/20 text-primary-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-primary-500/10">
                <Sparkles className="w-4 h-4" />
                <span>Prompt Engineering Hub</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white khmer-text leading-[1.1] italic uppercase tracking-tighter">
                {t('library_title')}
              </h1>
              <p className="text-slate-400 khmer-text font-medium leading-relaxed max-w-md opacity-80">
                {t('library_subtitle')}
              </p>
              <div className="pt-4">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder={t('search_prompts')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-lg bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-14 pr-8 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all khmer-text text-sm font-bold shadow-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <div className="w-80 h-80 bg-primary-600/10 rounded-full flex items-center justify-center border-2 border-primary-500/20 relative animate-pulse">
                <Terminal className="w-32 h-32 text-primary-500 opacity-40" />
                <div className="absolute inset-0 border-[20px] border-white/5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all khmer-text border-2 ${
              selectedCategory === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
            }`}
          >
            {t(CATEGORY_MAP[cat] || cat)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={prompt.id}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] uppercase font-black tracking-widest text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full shadow-sm khmer-text">
                      {t(CATEGORY_MAP[prompt.category] || prompt.category)}
                    </span>
                    <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 khmer-text italic leading-tight group-hover:text-primary-600 transition-colors uppercase">{prompt.title}</h3>
                  <div className="bg-slate-50/50 p-6 rounded-[2rem] text-sm text-slate-600 khmer-text leading-relaxed italic line-clamp-4 mb-8 border border-slate-100 shadow-inner">
                    {prompt.content}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    {prompt.tags?.map((tag: string) => (
                      <span key={tag} className="text-[10px] text-slate-400 font-black uppercase tracking-tighter hover:text-primary-500 cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleCopy(prompt.id, prompt.content)}
                    className={`flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                      copiedId === prompt.id 
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                        : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'
                    }`}
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="khmer-text">{t('copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="khmer-text">{t('copy_prompt')}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-6">
          <Sparkles className="w-16 h-16 text-slate-200" />
          <div className="space-y-2">
            <h3 className="text-xl font-black khmer-text text-slate-400 italic">{t('no_prompts_found')}</h3>
          </div>
          <button 
            onClick={async () => {
              setLoading(true);
              await runFullSeed();
              window.location.reload();
            }}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-slate-200 khmer-text"
          >
            🚀 {t('seed_platform')}
          </button>
        </div>
      )}
    </div>
  );
}
