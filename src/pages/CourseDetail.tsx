import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlayCircle, FileText, CheckCircle2, ArrowLeft, Clock, BarChart } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const CATEGORY_MAP: Record<string, string> = {
  "All": "all_categories",
  "AI Mastery": "coding",
  "Digital Marketing": "marketing",
  "Automation Pro": "automation",
  "Data Science": "coding",
  "Soft Skills": "business",
  "Fullstack Dev": "coding"
};

const LEVEL_MAP: Record<string, string> = {
  "All Levels": "level_all",
  "Beginner": "level_beginner",
  "Intermediate": "level_intermediate",
  "Advanced": "level_advanced"
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const { t } = useLanguage();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!courseId) return;
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        }

        const q = query(collection(db, 'lessons'), where('courseId', '==', courseId), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  if (loading) return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent animate-spin rounded-full"></div></div>;
  if (!course) return <div className="text-center py-20 khmer-text">{t('course_not_found')}</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link to="/learn" className="inline-flex items-center space-x-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold khmer-text">{t('back')}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase khmer-text">{t(CATEGORY_MAP[course.category] || course.category)}</span>
            <h1 className="text-4xl font-display font-bold text-slate-900 khmer-text">{course.title}</h1>
            <p className="text-lg text-slate-600 khmer-text leading-relaxed">{course.description}</p>
          </div>

          <div className="flex items-center space-x-8 py-6 border-y border-slate-100">
            <div className="flex items-center space-x-2 text-slate-500">
              <Clock className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium khmer-text">
                {course.duration?.replace('Hours', t('hours'))?.replace('m', t('minutes')) || course.duration}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500">
              <BarChart className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium khmer-text">{t(LEVEL_MAP[course.level] || course.level)}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500">
              <CheckCircle2 className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium">{lessons.length} {t('lessons')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold khmer-text">{t('course_lessons')}</h2>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <Link 
                  key={lesson.id}
                  to={`/learn/${courseId}/lesson/${lesson.id}`}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
                      {lesson.type === 'video' ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm khmer-text">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 khmer-text">{t('lesson_order')} {lesson.order}</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-xl">{t('start')}</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm sticky top-24">
            <img src={course.thumbnail} className="w-full h-48 object-cover" alt={course.title} />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm khmer-text">{t('course_price')}</span>
                <span className="text-2xl font-bold font-display text-primary-600">{course.price === 0 || !course.price ? t('free') : `${course.price}$`}</span>
              </div>
              <button 
                onClick={() => {
                   if (lessons.length > 0) {
                      window.location.href = `/learn/${courseId}/lesson/${lessons[0].id}`;
                   }
                }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors active:scale-95 khmer-text"
              >
                {t('start_learning_now')}
              </button>
              <p className="text-xs text-center text-slate-400 khmer-text">{t('auto_save_desc')}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
