import { ReactNode } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Map, 
  Library, 
  MessageSquare, 
  Search, 
  User, 
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../LanguageSwitcher';
import { useState } from 'react';

const NAV_ITEMS = [
  { icon: Home, labelKey: 'dashboard', path: '/' },
  { icon: BookOpen, labelKey: 'academy', path: '/learn' },
  { icon: Map, labelKey: 'roadmap', path: '/roadmap' },
  { icon: Library, labelKey: 'library', path: '/library' },
  { icon: MessageSquare, labelKey: 'coach', path: '/coach' },
  { icon: Search, labelKey: 'solver', path: '/solver' },
];

export default function Shell({ children }: { children: ReactNode }) {
  const { user, userData, logout } = useAuth();
  const { t, language, tLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const otherLang = language === 'km' ? 'en' : 'km';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-primary-950 text-white flex-col sticky top-0 h-screen border-r border-primary-900">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-xl italic shadow-lg shadow-primary-500/20">
              DG
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase">Academy</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 transition-all overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive(item.path)
                  ? 'bg-white/10 text-white font-bold shadow-lg shadow-black/10'
                  : 'text-primary-100/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive(item.path) ? 'scale-110 opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-black uppercase tracking-tight khmer-text">{t(item.labelKey)}</span>
                <span className={`text-[10px] uppercase opacity-40 group-hover:opacity-70 transition-opacity font-bold tracking-widest khmer-text`}>
                  {tLang(item.labelKey, otherLang)}
                </span>
              </div>
            </Link>
          ))}

          {userData?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-red-500/10 text-red-400 font-bold'
                  : 'text-primary-100/60 hover:bg-red-500/5 hover:text-red-400'
              }`}
            >
              <Shield className="w-5 h-5 opacity-70" />
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-tight khmer-text">{t('admin')}</span>
                <span className="text-[10px] uppercase opacity-40 transition-opacity font-bold tracking-widest khmer-text">
                  {tLang('admin', otherLang)}
                </span>
              </div>
            </Link>
          )}
        </nav>

        <div className="p-6 space-y-6">
          <LanguageSwitcher />
          
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary-900/50 rounded-xl border border-primary-800 flex items-center space-x-3">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  className="w-8 h-8 rounded-full border border-primary-700"
                  alt="Avatar"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">{user.displayName}</span>
                  <span className="text-[10px] text-primary-400 font-bold uppercase tracking-tighter">{userData?.role || 'User'} {t('role')}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-primary-300 hover:text-white transition-colors uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('sign_out')}</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-primary-500 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all font-display uppercase tracking-wider"
            >
              {t('sign_in')}
            </button>
          )}
        </div>
      </aside>


      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">DG</div>
          <span className="font-display font-black text-lg tracking-tighter">ACADEMY</span>
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-800">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>


      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-primary-950 pt-20 px-6 flex flex-col text-white"
          >
            <div className="flex-1 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl ${
                    isActive(item.path) ? 'bg-white/10 text-white' : 'text-primary-100/60'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <div className="flex flex-col">
                    <span className="font-bold khmer-text">{t(item.labelKey)}</span>
                    <span className="text-[10px] uppercase opacity-40 tracking-widest khmer-text">{tLang(item.labelKey, otherLang)}</span>
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 px-4">
                <LanguageSwitcher />
              </div>
            </div>
            
            <div className="pb-10 pt-6 border-t border-white/5 flex items-center justify-between">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <img src={user.photoURL!} className="w-12 h-12 rounded-full border border-primary-700" alt="User" />
                    <span className="font-bold">{user.displayName}</span>
                  </div>
                  <button onClick={logout} className="p-4 text-red-400 rounded-2xl bg-red-500/10">
                    <LogOut className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="w-full bg-primary-500 text-white rounded-2xl py-5 font-black tracking-tight khmer-text uppercase"
                >
                  {t('sign_in')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-black text-slate-800 khmer-text">{t('hi')}, {user?.displayName?.split(' ')[0] || 'មិត្ត'}! 👋</h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-tight shadow-sm">
              {userData?.role || 'STUDENT'} ROLE
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('search_lessons')} 
                className="bg-slate-100 border-none rounded-full px-11 py-2 text-sm w-64 focus:ring-2 focus:ring-primary-500 transition-all outline-none animate-all"
              />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>


      {/* Mobile Bottom Nav Bar (Optional, I'll stick to a clean top nav + sidebar for desktop) */}
    </div>
  );
}
