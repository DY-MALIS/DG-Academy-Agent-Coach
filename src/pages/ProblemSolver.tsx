import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { ai, MODELS } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Zap, Loader2, CheckCircle2, ClipboardList, Calendar, Target, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Type } from "@google/genai";

interface Solution {
  summary: string;
  rootCause: string;
  skillsToLearn: string[];
  actionPlan7Day: string;
  actionPlan30Day: string;
  recommendedPrompts: string[];
}

export default function ProblemSolver() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<Solution | null>(null);

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || loading || !user) return;

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.pro,
        contents: `I have this problem: "${problem}". Analyze it and provide a structured solution. Respond in the same language as my message (Khmer or English).`,
        config: {
          systemInstruction: `You are a "Problem Solving Expert". Analyze the user's problem and return a JSON response. The human-readable fields must match the language of the user's message.
          Schema:
          - summary: A clear summary of the problem.
          - rootCause: The underlying root cause.
          - skillsToLearn: A list of 3-5 specific skills (technical or soft) to learn to solve this.
          - actionPlan7Day: A concrete plan for the first 7 days.
          - actionPlan30Day: A broader 30-day plan.
          - recommendedPrompts: 2-3 AI prompts that can help solve parts of the problem.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              rootCause: { type: Type.STRING },
              skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionPlan7Day: { type: Type.STRING },
              actionPlan30Day: { type: Type.STRING },
              recommendedPrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "rootCause", "skillsToLearn", "actionPlan7Day", "actionPlan30Day", "recommendedPrompts"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setSolution(result);

      // Save to report history
      await addDoc(collection(db, 'problem_reports'), {
        userId: user.uid,
        problem,
        ...result,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm">
          <BrainCircuit className="w-4 h-4" />
          <span>{t('agent_logic')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-950 khmer-text italic leading-tight uppercase tracking-tighter">
          {t('solver_title')}
        </h1>
        <p className="text-slate-500 khmer-text leading-relaxed font-medium">
          {t('solver_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-primary-500/5 sticky top-24">
            <form onSubmit={handleSolve} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-800 khmer-text uppercase tracking-widest">{t('your_problem')}</label>
                <textarea 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder={t('problem_placeholder')}
                  className="w-full h-56 bg-slate-50 border border-slate-200 rounded-3xl p-8 focus:ring-4 focus:ring-primary-100 focus:bg-white outline-none transition-all khmer-text text-base resize-none shadow-inner"
                />
              </div>
              <button 
                disabled={loading || !problem.trim()}
                className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black flex items-center justify-center space-x-4 shadow-2xl shadow-slate-950/20 hover:bg-black disabled:opacity-50 transition-all active:scale-95 group uppercase tracking-widest text-lg"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <Zap className="w-6 h-6 fill-primary-400 group-hover:animate-pulse" />
                    <span className="khmer-text">{t('solve_now_btn')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Results Animation Area */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!solution && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-slate-500 khmer-text">{t('no_results_yet')}</p>
                  <p className="text-xs text-slate-400 khmer-text mt-1 italic">{t('fill_problem_left')}</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center py-32 space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                  <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary-600 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold khmer-text text-slate-800 animate-bounce">{t('analyzing')}</h3>
                  <p className="text-sm text-slate-400 khmer-text italic">{t('finding_best_solution')}</p>
                </div>
              </motion.div>
            )}

            {solution && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Summary Card */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-50">
                    <Target className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold khmer-text">{t('analysis_result')}</h3>
                  </div>
                  <div className="grid gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('problem_summary')}</h4>
                      <p className="khmer-text text-slate-700 leading-relaxed">{solution.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('root_cause')}</h4>
                      <p className="khmer-text text-slate-700 font-medium">{solution.rootCause}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 text-white p-8 rounded-[2rem] space-y-4">
                    <h3 className="font-bold khmer-text flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>{t('skills_to_learn')}</span>
                    </h3>
                    <ul className="space-y-2">
                      {solution.skillsToLearn.map((skill, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          <span className="khmer-text">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-primary-600 text-white p-8 rounded-[2rem] space-y-4 shadow-xl shadow-primary-600/20">
                    <h3 className="font-bold khmer-text flex items-center space-x-2">
                       <Sparkles className="w-5 h-5" />
                       <span>{t('recommended_prompts_title')}</span>
                    </h3>
                    <div className="space-y-2">
                      {solution.recommendedPrompts.map((p, i) => (
                        <div key={i} className="bg-white/10 p-3 rounded-xl text-xs khmer-text italic border border-white/10">
                          "{p}"
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Plans */}
                <div className="space-y-4">
                   <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold khmer-text">{t('action_plan_7')}</h3>
                      </div>
                      <div className="khmer-text prose prose-slate">
                        <ReactMarkdown>{solution.actionPlan7Day}</ReactMarkdown>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                   </div>

                   <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold khmer-text">{t('action_plan_30')}</h3>
                      </div>
                      <div className="khmer-text prose prose-slate">
                        <ReactMarkdown>{solution.actionPlan30Day}</ReactMarkdown>
                      </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                   </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setSolution(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold flex items-center space-x-2 transition-colors"
                  >
                    <span>{t('solve_another')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
