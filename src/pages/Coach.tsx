import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { ai, MODELS } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Wand2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Coach() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    const chatRef = doc(db, 'chat_history', user.uid);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      } else {
        // Initial greeting
        const initialMessages: Message[] = [{
          role: 'assistant',
          content: t('initial_greeting')
        }];
        setDoc(chatRef, { 
          userId: user.uid, 
          messages: initialMessages,
          lastUpdatedAt: serverTimestamp() 
        });
      }
    });

    return () => unsubscribe();
  }, [user, language]); // Added language to dependency to reload greeting if changed

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = async () => {
    if (!user) return;
    
    // Remote confirmation as it can be blocked in some iframe environments
    const chatRef = doc(db, 'chat_history', user.uid);
    try {
      const initialMessages: Message[] = [{
        role: 'assistant',
        content: t('initial_greeting')
      }];
      
      // Use setDoc instead of updateDoc to ensure it works even if doc was deleted/not found
      await setDoc(chatRef, {
        userId: user.uid,
        messages: initialMessages,
        lastUpdatedAt: serverTimestamp()
      }, { merge: false });
      
      setMessages(initialMessages);
    } catch (err) {
      console.error("Error clearing chat:", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    
    // Save user message immediately to Firestore for persistence
    const chatRef = doc(db, 'chat_history', user.uid);
    try {
      await updateDoc(chatRef, {
        messages: newMessages,
        lastUpdatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error saving user message:", err);
    }

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: MODELS.text,
        contents: newMessages.map(m => ({ 
          role: m.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: m.content }] 
        })),
        config: {
          systemInstruction: `You are the DG Agent Coach, a highly intelligent and specialized educational representative for DG Academy. 
          Your goal is to help users master AI, digital skills, and complex problem-solving.
          
          LANGUAGE RULES:
          1. Detect the language used by the user in their message.
          2. Respond primarily in that same language (Khmer or English).
          3. Regardless of the user's language, you should prioritize clarity and helpfulness.
          4. Use English technical terms where appropriate even when speaking Khmer.
          5. Keep your answers professional yet approachable.
          
          Always refer to yourself as the DG Agent.`
        }
      });

      const aiMsg: Message = { role: 'assistant', content: response.text || (language === 'km' ? 'សុំទោស ខ្ញុំមានបញ្ហាបច្ចេកទេសបន្តិចបន្តួច។' : 'Sorry, I am having some technical issues.') };
      const finalMessages = [...newMessages, aiMsg];
      
      await updateDoc(chatRef, {
        messages: finalMessages,
        lastUpdatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-slate-900 khmer-text italic uppercase">{t('coach')}</h1>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('coach_active')}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={handleClearChat}
             title={t('clear_chat')}
             className="p-2 text-slate-400 hover:text-red-500 transition-colors"
           >
             <Trash2 className="w-5 h-5" />
           </button>
           <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Sparkles className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              key={i}
              className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] space-x-4 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                  m.role === 'user' ? 'bg-slate-900 text-white shadow-slate-900/10' : 'bg-primary-600 text-white shadow-primary-600/20'
                }`}>
                  {m.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-6 rounded-[2.5rem] shadow-sm relative transition-all border ${
                  m.role === 'user' 
                    ? 'bg-white border-slate-200 text-slate-800 rounded-tr-none' 
                    : 'bg-primary-50/50 border-primary-100 text-slate-900 rounded-tl-none font-medium'
                }`}>
                  <div className="prose prose-slate prose-sm max-w-none khmer-text leading-relaxed font-medium">
                     <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
              <span className="text-xs text-slate-400 khmer-text italic">{t('agent_thinking')}</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ask_question_placeholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-24 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all khmer-text text-sm"
          />
          <div className="absolute right-2 flex space-x-1">
             <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="mt-3 text-[10px] text-center text-slate-400 khmer-text">
          {t('agent_disclaimer')}
        </p>
      </div>
    </div>
  );
}
