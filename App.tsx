import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  BookOpen, PlusCircle, Layers, Lock, Unlock, X, Check, 
  Cloud, ShieldAlert, Globe, Loader2, LogOut, User 
} from 'lucide-react';
import { createClient, Session } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

import BakeListPage from './pages/BakeListPage';
import BakeDetailPage from './pages/BakeDetailPage';
import CalculatorPage from './pages/CalculatorPage';
import CreateBakePage from './pages/CreateBakePage';
import { BakeEntry } from './types';
import { MOCK_BAKES } from './constants';
import './i18n/config';

// --- Supabase Setup ---
// --- Enhanced Environment Variable Loading ---
const getEnvVar = (name: string): string | undefined => {
  // Try import.meta.env (Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    // @ts-ignore
    return import.meta.env[name];
  }
  // Try process.env
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  return undefined;
};
const SUPABASE_URL = getEnvVar('VITE_NEXT_PUBLIC_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && 
                        SUPABASE_URL !== 'https://your-project.supabase.co' && 
                        SUPABASE_ANON_KEY !== 'your-anon-key');

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!) 
  : null;

const SourdoughApp: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [bakes, setBakes] = useState<BakeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('is_owner') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    if (i18n.language) document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    const fetchBakes = async () => {
      setLoading(true);
      setDbError(null);

      if (!isConfigured || !supabase) {
        setBakes(MOCK_BAKES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bakes')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          setDbError(error.message);
          setBakes(MOCK_BAKES); 
        } else if (data && data.length > 0) {
          setBakes(data as BakeEntry[]);
        } else {
          setBakes(MOCK_BAKES);
        }
      } catch (err: any) {
        setDbError(err.message);
        setBakes(MOCK_BAKES);
      } finally {
        setLoading(false);
      }
    };

    fetchBakes();
  }, []);

  const toggleLanguage = () => {
    const currentLang = i18n.language || 'en';
    i18n.changeLanguage(currentLang.startsWith('en') ? 'lt' : 'en');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sourdough') {
      setIsLoggedIn(true);
      sessionStorage.setItem('is_owner', 'true');
      setShowLogin(false);
      setPassword('');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
  };

  const addBake = async (newBake: BakeEntry) => {
    const updateBakesState = () => {
        const bakeIndex = bakes.findIndex(b => b.id === newBake.id);
        if (bakeIndex !== -1) {
            // Update existing bake
            const newBakes = [...bakes];
            newBakes[bakeIndex] = newBake;
            setBakes(newBakes);
        } else {
            // Add new bake to the start of the list
            setBakes([newBake, ...bakes]);
        }
    };

    if (!isConfigured || !supabase) {
        updateBakesState();
        return;
    }

    const { error } = await supabase.from('bakes').upsert(newBake);
    if (error) {
        alert(`Cloud save failed: ${error.message}`);
    } else {
        updateBakesState();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf0] flex flex-col items-center justify-center p-8 space-y-8">
        <div className="w-32 h-32 bg-yellow-400 rounded-full border-8 border-black flex items-center justify-center text-6xl animate-spin-slow shadow-[10px_10px_0px_0px_#000]">🥯</div>
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter animate-pulse">Fermenting...</h2>
      </div>
    );
  }

  const currentLangCode = (i18n.language || 'EN').split('-')[0].toUpperCase();

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        {!isConfigured && (
          <div className="bg-orange-500 text-white border-b-4 border-black p-2 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4">
            <ShieldAlert size={12} /> {t('missing_keys')} - Local Mode
          </div>
        )}

        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className={`sticker-card bg-yellow-400 p-8 w-full max-w-md space-y-6 relative ${loginError ? 'animate-bounce' : ''}`}>
              <button onClick={() => setShowLogin(false)} className="absolute -top-4 -right-4 bg-white border-4 border-black p-2 rounded-full hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-black text-center">{t('login_owner')}</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Password..."
                  className="w-full bg-white border-4 border-black p-4 text-2xl font-black rounded-2xl focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-black text-white p-4 rounded-2xl text-2xl font-black flex items-center justify-center gap-3">
                  <Check size={28} /> UNLOCK
                </button>
              </form>
            </div>
          </div>
        )}

        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b-4 border-black px-4 md:px-8 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center text-white font-bold text-2xl group-hover:rotate-12 transition-transform shadow-[3px_3px_0px_0px_#000]">🥖</div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-black leading-none uppercase tracking-tighter">{t('app_name')}</span>
                <span className="text-[10px] font-bold text-orange-500 handwriting">{t('subtitle')}</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3 md:gap-6">
              <Link to="/" className="text-black hover:text-orange-500 font-black text-sm md:text-lg transition-colors flex items-center gap-2">
                <BookOpen size={18} /> <span className="hidden sm:inline">{t('nav_blog')}</span>
              </Link>
              <Link to="/calculator" className="text-black hover:text-blue-500 font-black text-sm md:text-lg transition-colors flex items-center gap-2">
                <Layers size={18} /> <span className="hidden sm:inline">{t('nav_lab')}</span>
              </Link>
              
              <button onClick={toggleLanguage} className="sticker-card bg-pink-100 px-3 py-1 rounded-full text-xs font-black border-2 border-black hover:bg-pink-200 flex items-center gap-2">
                <Globe size={14} /> {currentLangCode}
              </button>

              {session ? (
                <div className="flex items-center gap-2">
                  <img src={session.user.user_metadata.avatar_url} className="w-8 h-8 rounded-full border-2 border-black hidden md:block" alt="User" />
                  <button onClick={() => supabase?.auth.signOut()} className="p-2 border-2 border-black rounded-full hover:bg-red-50 text-red-500 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => handleSocialSignIn('google')} className="sticker-card bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-black border-2 border-black hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <User size={14} /> <span className="hidden md:inline">{t('sign_in')}</span>
                </button>
              )}

              {isLoggedIn && (
                <Link to="/new" className="bg-orange-500 text-white border-2 border-black px-4 py-1 rounded-full font-black text-sm flex items-center gap-2 hover:bg-orange-600 shadow-[3px_3px_0px_0px_#000]">
                  <PlusCircle size={16} /> <span className="hidden lg:inline">{t('nav_new')}</span>
                </Link>
              )}
              
              <button onClick={isLoggedIn ? () => {setIsLoggedIn(false); sessionStorage.removeItem('is_owner');} : () => setShowLogin(true)} className={`p-1.5 border-2 border-black rounded-full transition-colors ${isLoggedIn ? 'bg-green-100' : 'hover:bg-gray-100'}`}>
                {isLoggedIn ? <Unlock size={16} className="text-green-600" /> : <Lock size={16} className="text-gray-400" />}
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-grow w-full py-8">
          <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-orange-500" size={48} /></div>}>
            <Routes>
              <Route path="/" element={<BakeListPage bakes={bakes} isLoggedIn={isLoggedIn} />} />
              <Route path="/bakes/:id" element={<BakeDetailPage bakes={bakes} session={session} />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/new" element={isLoggedIn ? <CreateBakePage onAdd={addBake} bakes={bakes} /> : <Navigate to="/" replace />} />
              <Route path="/bakes/:id/edit" element={isLoggedIn ? <CreateBakePage onAdd={addBake} bakes={bakes} /> : <Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="py-12 bg-black text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-white" style={{ clipPath: 'polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)' }}></div>
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <h2 className="text-4xl font-black italic tracking-tighter">{t('footer_slogan')}</h2>
            <div className="flex items-center justify-center gap-2 text-orange-400/50 uppercase tracking-widest font-black text-[10px]">
              <Cloud size={10} /> {isConfigured ? t('cloud_mode') : t('local_mode')}
            </div>
            <p className="font-black text-orange-400 text-sm uppercase tracking-widest handwriting italic">{t('footer_sub')}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <SourdoughApp />
  );
};

export default App;
