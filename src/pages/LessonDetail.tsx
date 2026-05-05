import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, ArrowRight, CheckCircle, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { useLanguage } from '../hooks/useLanguage';

export default function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!courseId || !lessonId) return;
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) setCourse({ id: courseDoc.id, ...courseDoc.data() });

        const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
        if (lessonDoc.exists()) setLesson({ id: lessonDoc.id, ...lessonDoc.data() });

        const q = query(collection(db, 'lessons'), where('courseId', '==', courseId), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllLessons(lessons);

        // Check completion if needed
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId, lessonId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent animate-spin rounded-full"></div></div>;
  if (!lesson || !course) return <div>Lesson or Course not found</div>;

  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = allLessons[currentIdx + 1];
  const prevLesson = allLessons[currentIdx - 1];

  const markAsCompleted = async () => {
    if (!user || !courseId || !lessonId) return;
    try {
      const progressId = `${user.uid}_${lessonId}`;
      await setDoc(doc(db, 'user_progress', progressId), {
        userId: user.uid,
        courseId,
        lessonId,
        completed: true,
        completedAt: serverTimestamp()
      }, { merge: true });
      setCompleted(true);
      if (nextLesson) {
        navigate(`/learn/${courseId}/lesson/${nextLesson.id}`);
      } else {
        navigate(`/learn/${courseId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <Link to={`/learn/${courseId}`} className="flex items-center space-x-2 text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold khmer-text">{t('back')}</span>
        </Link>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.title}</span>
          <h2 className="text-sm font-bold khmer-text text-slate-700">{lesson.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {lesson.type === 'video' && lesson.videoUrl && (
            <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl">
              <iframe 
                src={`https://www.youtube.com/embed/${getYoutubeEmbed(lesson.videoUrl)}`}
                className="w-full h-full"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          )}

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold text-slate-900 khmer-text mb-6">{lesson.title}</h1>
            <div className="khmer-text leading-relaxed text-slate-700 space-y-4">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            {prevLesson ? (
              <Link to={`/learn/${courseId}/lesson/${prevLesson.id}`} className="flex items-center space-x-3 px-6 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-bold khmer-text">{t('previous_lesson')}</span>
              </Link>
            ) : <div />}

            <button 
              onClick={markAsCompleted}
              className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="khmer-text">{t('finish_lesson')}</span>
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 khmer-text mb-4">{t('curriculum')}</h3>
            <div className="space-y-1">
              {allLessons.map((l) => (
                <Link 
                  key={l.id}
                  to={`/learn/${courseId}/lesson/${l.id}`}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all text-sm ${
                    l.id === lessonId 
                      ? 'bg-primary-50 text-primary-600 font-bold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${l.id === lessonId ? 'bg-primary-600' : 'bg-slate-200'}`} />
                  <span className="khmer-text truncate">{l.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
