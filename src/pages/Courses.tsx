import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

const CATEGORIES = ["All", "AI Mastery", "Digital Marketing", "Automation Pro", "Data Science", "Soft Skills", "Fullstack Dev", "Design", "Coding", "Business", "Technical", "Marketing", "Accounting", "Sales"];

const CATEGORY_MAP: Record<string, string> = {
  "All": "all_categories",
  "AI Mastery": "coding",
  "Digital Marketing": "marketing",
  "Automation Pro": "automation",
  "Data Science": "coding",
  "Soft Skills": "business",
  "Fullstack Dev": "coding",
  "Design": "design",
  "Coding": "coding",
  "Business": "business",
  "Technical": "automation",
  "Marketing": "marketing",
  "Accounting": "accounting",
  "Sales": "sales"
};

const LEVEL_MAP: Record<string, string> = {
  "All Levels": "level_all",
  "Beginner": "level_beginner",
  "Intermediate": "level_intermediate",
  "Advanced": "level_advanced"
};

export default function Courses() {
  const { t, language, tLang } = useLanguage();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const otherLang = language === 'km' ? 'en' : 'km';

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        let q = collection(db, 'courses');
        const snap = await getDocs(q);
        setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic">{t('all_courses')}</h1>
          <p className="text-slate-500 khmer-text font-bold">{t('course_desc')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('search_lessons')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full sm:w-64 focus:ring-4 focus:ring-primary-100 focus:border-primary-300 outline-none transition-all khmer-text text-sm shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 outline-none transition-all khmer-text text-sm shadow-sm font-bold min-w-[200px]"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{t(CATEGORY_MAP[cat] || cat)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={course.id}
            >
              <Link 
                to={`/learn/${course.id}`}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden flex flex-col h-full group"
              >
                <div className="relative aspect-video">
                  <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                  <div className="absolute top-6 left-6 flex flex-col items-start gap-1">
                    <span className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20 khmer-text">
                      {t(CATEGORY_MAP[course.category] || course.category)}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-primary-900 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider khmer-text shadow-sm">
                      {tLang(CATEGORY_MAP[course.category] || course.category, otherLang)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 khmer-text group-hover:text-primary-600 transition-colors leading-tight italic">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-8 khmer-text font-medium line-clamp-2 leading-relaxed opacity-80">
                    {course.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-widest khmer-text text-slate-800">
                          {t(LEVEL_MAP[course.level] || course.level)}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest khmer-text text-slate-400">
                          {course.duration?.replace('Hours', t('hours'))?.replace('m', t('minutes')) || course.duration}
                        </span>
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest khmer-text text-slate-400 opacity-60">
                        {tLang(LEVEL_MAP[course.level] || course.level, otherLang)}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-primary-600 group-hover:shadow-lg group-hover:shadow-primary-600/20 transition-all active:scale-90">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <p className="text-slate-400 khmer-text">{t('no_courses_found')}</p>
        </div>
      )}
    </div>
  );
}
