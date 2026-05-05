import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Map, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function Roadmaps() {
  const { t } = useLanguage();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, 'roadmaps'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setRoadmaps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
          <Map className="w-4 h-4" />
          <span>{t('learning_paths')}</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 khmer-text">{t('roadmap_title')}</h1>
        <p className="text-slate-500 khmer-text leading-relaxed">
          {t('roadmap_desc')}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6">
          {[1, 2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid gap-8">
          {roadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-5 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="md:col-span-2 relative h-64 md:h-full overflow-hidden">
                <img 
                  src={roadmap.thumbnail} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={roadmap.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10" />
                <div className="absolute bottom-6 left-6 md:hidden">
                    <h3 className="text-white font-bold text-2xl khmer-text">{roadmap.title}</h3>
                </div>
              </div>
              
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="hidden md:block">
                  <h3 className="text-2xl font-bold text-slate-900 khmer-text mb-4 italic group-hover:text-primary-600 transition-colors">{roadmap.title}</h3>
                  <p className="text-slate-500 khmer-text leading-relaxed">{roadmap.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">5 {t('steps')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">2 {t('completed')}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold">+12</div>
                  </div>
                  <Link to={`/learn`} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-slate-800 transition-all active:scale-95">
                    <span className="khmer-text">{t('explore')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
