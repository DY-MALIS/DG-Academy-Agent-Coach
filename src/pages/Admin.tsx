import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Database, Users, BookOpen, Map, Library as LibraryIcon, ShieldAlert, X, Save, Video, FileText, ChevronRight, ClipboardList, Zap } from 'lucide-react';
import { runFullSeed } from '../lib/seeds';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'prompts'>('courses');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // New Course Form State
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'AI Skill Learning',
    thumbnail: '',
    level: 'Beginner',
    duration: '2 hours',
    isPublished: true
  });

  // New Lesson Form State
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: '',
    type: 'text' as 'text' | 'video',
    order: 1
  });

  useEffect(() => {
    if (userData?.role !== 'admin') return;
    fetchItems();
  }, [activeTab, userData]);

  async function fetchItems() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, activeTab));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLessons(courseId: string) {
    setLoadingLessons(true);
    try {
      const q = query(
        collection(db, 'lessons'),
        where('courseId', '==', courseId),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLessons(false);
    }
  }

  const handleDelete = async (id: string, collectionName: string = activeTab) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'lessons' && selectedCourse) {
        fetchLessons(selectedCourse.id);
      } else {
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'courses'), {
        ...courseForm,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setCourseForm({
        title: '',
        description: '',
        category: 'AI Skill Learning',
        thumbnail: '',
        level: 'Beginner',
        duration: '2 hours',
        isPublished: true
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'lessons'), {
        ...lessonForm,
        courseId: selectedCourse.id,
        createdAt: serverTimestamp()
      });
      setLessonForm({
        title: '',
        content: '',
        videoUrl: '',
        type: 'text',
        order: lessons.length + 1
      });
      fetchLessons(selectedCourse.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      await runFullSeed();
      fetchItems();
      alert('Seed successful!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-500 khmer-text">អ្នកមិនមានសិទ្ធិប្រើប្រាស់ទំព័រនេះទេ។</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {items.length === 0 && !loading && (
        <div className="bg-amber-600 text-white p-10 rounded-[3rem] shadow-2xl shadow-amber-200 flex flex-col md:flex-row items-center justify-between gap-8 border-4 border-white">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter khmer-text">ប្រព័ន្ធមិនទាន់មានទិន្នន័យ (Empty System)</h2>
            <p className="khmer-text font-medium opacity-90 max-w-lg">
              មើលទៅប្រព័ន្ធរបស់អ្នកមិនទាន់មានទិន្នន័យមេរៀន ឬ Prompt នៅឡើយទេ។ សូមចុចប៊ូតុងខាងស្តាំដើម្បីបញ្ចូលទិន្នន័យគំរូ (Seed) ទៅក្នុងប្រព័ន្ធ។
            </p>
          </div>
          <button 
            onClick={handleSeed}
            className="whitespace-nowrap bg-white text-amber-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all active:scale-95"
          >
            🚀 Initialize Everything
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 khmer-text">គ្រប់គ្រងប្រព័ន្ធ (Admin Hub)</h1>
          <p className="text-slate-400 font-medium text-sm khmer-text opacity-70">កែសម្រួលមេរៀន ព័ត៌មានអ្នកប្រើប្រាស់ និងបណ្ណាល័យ Prompt</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSeed}
            className="flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <Zap className="w-4 h-4" />
            <span>Seed Platform / Full Sync</span>
          </button>
          {activeTab === 'courses' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-slate-100 w-fit">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'prompts', label: 'Prompts', icon: LibraryIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedCourse(null);
            }}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className={`${selectedCourse ? 'lg:col-span-4' : 'lg:col-span-12'} transition-all duration-500 ease-in-out`}>
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4">{activeTab} list</h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-20 text-center text-slate-400 flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                  <span className="text-sm font-bold">Loading...</span>
                </div>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-5 flex items-center justify-between transition-all cursor-pointer group ${
                      selectedCourse?.id === item.id ? 'bg-primary-50 ring-2 ring-inset ring-primary-100' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      if (activeTab === 'courses') {
                        setSelectedCourse(item);
                        fetchLessons(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                       {item.thumbnail ? (
                         <img src={item.thumbnail} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                       ) : (
                         <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                            <Database className="w-6 h-6" />
                         </div>
                       )}
                       <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate khmer-text text-sm">{item.title || item.displayName || item.email}</h4>
                          <p className="text-[10px] text-slate-400 font-mono truncate tracking-tight">{item.id}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {activeTab === 'courses' && <ChevronRight className={`w-5 h-5 transition-all ${selectedCourse?.id === item.id ? 'translate-x-1 text-primary-500' : 'text-slate-300 group-hover:translate-x-0.5'}`} />}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                  <Database className="w-10 h-10 opacity-20" />
                  <span className="text-sm font-bold">No data found in {activeTab}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedCourse && (
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="lg:col-span-8 space-y-8"
            >
              <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300 shadow-sm"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-10 pr-16">
                  <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <BookOpen className="w-3 h-3" />
                    <span>Course Manager</span>
                  </div>
                  <h2 className="text-3xl font-black italic text-slate-900 khmer-text leading-tight">{selectedCourse.title}</h2>
                  <p className="text-slate-400 font-medium text-sm mt-2">Manage content and hierarchy for this curriculum.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Add Lesson Section */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-8 rounded-[2rem] space-y-6 border border-slate-100 shadow-inner">
                      <h3 className="font-black text-slate-900 flex items-center space-x-3 text-sm uppercase tracking-widest italic">
                        <Plus className="w-5 h-5 text-primary-600" />
                        <span>Add New Entry</span>
                      </h3>
                      
                      <form onSubmit={handleAddLesson} className="space-y-4">
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            placeholder="Lesson Title (Khmer)"
                            value={lessonForm.title}
                            onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none khmer-text font-bold text-sm bg-white"
                            required
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <select 
                              value={lessonForm.type}
                              onChange={e => setLessonForm({...lessonForm, type: e.target.value as any})}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none font-black text-[11px] uppercase tracking-wider bg-white"
                            >
                              <option value="text">📄 Text Doc</option>
                              <option value="video">🎥 Video Content</option>
                            </select>
                            <input 
                              type="number" 
                              placeholder="Order"
                              value={lessonForm.order}
                              onChange={e => setLessonForm({...lessonForm, order: parseInt(e.target.value)})}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none font-bold bg-white"
                              required
                            />
                          </div>

                          {lessonForm.type === 'video' && (
                            <input 
                              type="url" 
                              placeholder="Video URL (YouTube/Vimeo)"
                              value={lessonForm.videoUrl}
                              onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none font-bold text-sm bg-white"
                            />
                          )}

                          <textarea 
                            placeholder="Lesson Content (Markdown supported)"
                            value={lessonForm.content}
                            onChange={e => setLessonForm({...lessonForm, content: e.target.value})}
                            className="w-full h-40 px-5 py-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none khmer-text text-sm resize-none bg-white shadow-sm"
                            required
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-primary-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/20 transition-all flex items-center justify-center space-x-3 active:scale-95"
                        >
                          <Save className="w-5 h-5" />
                          <span>Finalize Entry</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Lessons List Section */}
                  <div className="space-y-6">
                    <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] italic flex items-center space-x-2">
                       <ClipboardList className="w-4 h-4" />
                       <span>Current Curriculum Structure</span>
                    </h3>
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {loadingLessons ? (
                        <div className="p-20 text-center text-slate-300 italic font-medium">Synchronizing lessons...</div>
                      ) : lessons.length > 0 ? (
                        lessons.map((lesson) => (
                          <div key={lesson.id} className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-primary-200 hover:shadow-xl hover:shadow-slate-100 transition-all">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${lesson.type === 'video' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'}`}>
                                {lesson.type === 'video' ? <Video className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Step {lesson.order}</p>
                                 <h4 className="font-bold text-slate-900 khmer-text truncate max-w-[180px] text-sm">{lesson.title}</h4>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDelete(lesson.id, 'lessons')}
                              className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-16 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4">
                          <BookOpen className="w-12 h-12 opacity-10" />
                          <p className="text-sm font-medium">Curriculum is currently empty.<br/>Add your first lesson to begin.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Create New Course</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Course Title (Khmer)</label>
                    <input 
                      type="text" 
                      value={courseForm.title}
                      onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none khmer-text font-bold"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                      <select 
                        value={courseForm.category}
                        onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none font-bold"
                      >
                        <option>AI Skill Learning</option>
                        <option>Digital Skill</option>
                        <option>Business Skill</option>
                        <option>Career Skill</option>
                        <option>Automation Skill</option>
                        <option>Design</option>
                        <option>Coding</option>
                        <option>Marketing</option>
                        <option>Accounting</option>
                        <option>Sales</option>
                        <option>Technical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Level</label>
                      <select 
                        value={courseForm.level}
                        onChange={e => setCourseForm({...courseForm, level: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none font-bold"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Thumbnail URL</label>
                    <input 
                      type="url" 
                      value={courseForm.thumbnail}
                      onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none font-bold"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                    <textarea 
                      value={courseForm.description}
                      onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                      className="w-full h-32 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 outline-none khmer-text text-sm resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                  >
                    {loading ? 'Processing...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
