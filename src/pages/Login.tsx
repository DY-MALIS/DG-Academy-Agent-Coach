import { motion } from 'motion/react';
import { Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/" />;

  const handleSignIn = async () => {
    try {
      await signIn();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 bg-gradient-to-br from-primary-50 via-white to-primary-100 flex font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-primary-500/10 border border-primary-100 p-10 text-center"
      >
        <div className="inline-flex w-20 h-20 bg-primary-600 rounded-[2rem] items-center justify-center mb-8 shadow-xl shadow-primary-600/30">
          <Shield className="text-white w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase font-display italic">DG ACADEMY</h1>
        <p className="text-slate-500 mb-10 khmer-text font-bold leading-relaxed px-4">
          ស្វាគមន៍មកកាន់សាលាឌីជីថល AI ដំបូងគេនៅកម្ពុជា។
        </p>

        <div className="grid gap-4 mb-10">
          <div className="flex items-center space-x-4 text-left p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-300 transition-all">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-md group-hover:rotate-12 transition-transform">
              <span className="font-black text-lg">១</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 font-display">Learn Everything</h3>
              <p className="text-xs text-slate-400 khmer-text italic">រៀនអ្វីៗគ្រប់យ៉ាងពី AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-left p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-300 transition-all">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-md group-hover:rotate-12 transition-transform">
              <span className="font-black text-lg">២</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 font-display">Solve Real Problems</h3>
              <p className="text-xs text-slate-400 khmer-text italic">ដោះស្រាយបញ្ហាពិតៗជាមួយ AI</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSignIn}
          className="w-full bg-slate-950 text-white rounded-2xl py-5 flex items-center justify-center space-x-3 hover:bg-slate-900 transition-all active:scale-95 shadow-2xl shadow-slate-950/20 group"
        >
          <img src="https://www.google.com/favicon.ico" className="w-6 h-6 bg-white rounded-full p-1" alt="Google" />
          <span className="font-black mb-0.5 ml-1 tracking-tight">CONTINUE WITH GOOGLE</span>
          <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>

        <p className="mt-8 text-[10px] text-slate-400 khmer-text font-bold uppercase tracking-widest leading-loose">
          START YOUR AI JOURNEY TODAY
        </p>
      </motion.div>
    </div>
  );
}
