import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  BookOpen, 
  Map, 
  Library, 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { runFullSeed } from '../lib/seeds';

const CATEGORY_MAP: Record<string, string> = {
  "All": "all_categories",
  "AI Mastery": "coding",
  "Digital Marketing": "marketing",
  "Automation Pro": "automation",
  "Data Science": "coding",
  "Soft Skills": "business",
  "Fullstack Dev": "coding"
};

export default function Dashboard() {
  const { user, userData } = useAuth();
  const { t, language, tLang } = useLanguage();
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const otherLang = language === 'km' ? 'en' : 'km';

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'), limit(3));
        const snap = await getDocs(q);
        setRecentCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSeed = async () => {
    await runFullSeed();
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 pl-1">{t('dashboard')}</h2>
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Zap className="w-5 h-5" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 khmer-text italic uppercase">DG Academy</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeed}
            className="flex items-center space-x-2 bg-primary-50 text-primary-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-100 transition-all border border-primary-100 shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>{t('sync_content') || 'Sync Content'}</span>
          </button>
          <div className="flex -space-x-2">
             {[1, 2, 3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+15}`} className="w-9 h-9 rounded-xl border-2 border-white object-cover" alt="" />
             ))}
          </div>
        </div>
      </div>

      {/* Top Action Hero */}
      <div className="bg-primary-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-primary-200 relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-xl text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black leading-tight khmer-text italic">
            {t('solver_question')}
          </h1>
          <p className="text-primary-100 khmer-text font-medium leading-relaxed opacity-90">
            {t('solver_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/solver"
              className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 shadow-lg shadow-black/5 khmer-text text-center uppercase"
            >
              {t('solve_with_agent')}
            </Link>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none hidden md:block">
          <div className="w-96 h-96 border-[40px] border-white rounded-full" />
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roadmap Progress - Bento Large */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm col-span-1 lg:col-span-2 group hover:shadow-lg transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight khmer-text">{t('current_roadmap')}</h3>
            <Link to="/roadmap" className="text-primary-600 text-sm font-black flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>{t('learn_more')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-slate-100 group-hover:rotate-6 transition-transform">
              🚀
            </div>
            <div className="flex-1 w-full">
              <h4 className="font-display font-black text-2xl text-slate-900 leading-tight">AI Beginner to Job Ready</h4>
              <p className="text-slate-500 khmer-text text-sm mb-6 mt-1">ដំណាក់កាលទី ២៖ មូលដ្ឋានគ្រឹះនៃ Prompt Engineering</p>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                <div className="bg-primary-500 h-full w-[45%] rounded-full shadow-lg" />
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('progress')}: 45%</span>
                <span className="text-xs font-black text-primary-600 khmer-text uppercase">៩ / ២០ {t('lessons_count')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Task - Bento Small Dark */}
        <div className="bg-slate-950 p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-xl shadow-slate-900/20 relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-2">
              <p className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase">{t('daily_task')}</p>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </div>
            <p className="text-2xl font-black leading-tight khmer-text">{t('automation_task')}</p>
          </div>
          <div className="mt-12 relative z-10">
            <button className="w-full py-4 bg-primary-600 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-primary-600/30 hover:bg-primary-500 transition-all active:scale-95 uppercase">
              {t('start_now')}
            </button>
          </div>
          <div className="absolute -bottom-4 animate-pulse -right-4 w-24 h-24 bg-primary-600/20 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Recommended Lessons */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tighter khmer-text uppercase italic">{t('recommended_lessons')}</h3>
            <p className="text-slate-400 text-xs khmer-text opacity-70">{t('discover_new_skills')}</p>
          </div>
          <Link to="/learn" className="bg-slate-50 text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">{t('view_all')}</Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentCourses.map((course) => (
              <Link 
                key={course.id}
                to={`/learn/${course.id}`}
                className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className="aspect-video relative rounded-2xl overflow-hidden mb-4 shadow-sm border border-slate-100">
                  <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={course.title} />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest leading-none khmer-text">
                    {t(CATEGORY_MAP[course.category] || course.category)}
                  </p>
                  <h5 className="font-black leading-snug text-slate-800 khmer-text line-clamp-2 italic">
                    {course.title}
                  </h5>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl">📭</div>
            <div className="space-y-2">
              <h3 className="text-xl font-black khmer-text italic text-slate-400">{t('no_lessons')}</h3>
              <p className="text-sm khmer-text text-slate-400 opacity-70">{t('seed_desc')}</p>
            </div>
            <button 
              onClick={handleSeed} 
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 shadow-slate-200 khmer-text"
            >
              🚀 {t('seed_platform')}
            </button>
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-slate-100">
        {[
          { labelKey: 'coach', path: '/coach', icon: MessageSquare, color: 'text-primary-600', bg: 'bg-primary-50' },
          { labelKey: 'library', path: '/library', icon: Library, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { labelKey: 'solver', path: '/solver', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { labelKey: 'roadmap', path: '/roadmap', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((action, i) => (
          <Link 
            key={i}
            to={action.path}
            className="flex flex-col items-center text-center p-6 bg-white rounded-[2rem] border border-slate-200 hover:border-primary-200 hover:shadow-xl transition-all group"
          >
            <div className={`w-12 h-12 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-900 leading-none mb-1 khmer-text">{t(action.labelKey)}</h4>
            <span className="text-[10px] uppercase opacity-40 group-hover:opacity-60 transition-opacity font-bold tracking-widest leading-none khmer-text">{tLang(action.labelKey, otherLang)}</span>
          </Link>
        ))}
      </div>

      {/* Floating AI Coach Button already handled by pages like Coach.tsx or solver, 
         but for home we could add a floating shortcut if desired */}
    </div>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
