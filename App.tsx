
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, Layers, Heart, Lock, Unlock, X, Check } from 'lucide-react';
import BakeListPage from './pages/BakeListPage';
import BakeDetailPage from './pages/BakeDetailPage';
import CalculatorPage from './pages/CalculatorPage';
import CreateBakePage from './pages/CreateBakePage';
import { BakeEntry } from './types';
import { MOCK_BAKES } from './constants';

const App: React.FC = () => {
  const [bakes, setBakes] = useState<BakeEntry[]>(() => {
    const saved = localStorage.getItem('sourdough_bakes');
    return saved ? JSON.parse(saved) : MOCK_BAKES;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('is_owner') === 'true';
  });
  
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    localStorage.setItem('sourdough_bakes', JSON.stringify(bakes));
  }, [bakes]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default password for the owner
    if (password === 'sourdough') {
      setIsLoggedIn(true);
      sessionStorage.setItem('is_owner', 'true');
      setShowLogin(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('is_owner');
  };

  const addBake = (newBake: BakeEntry) => {
    setBakes([newBake, ...bakes]);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        {/* Playful Background Elements */}
        <div className="blob w-[600px] h-[600px] rounded-full bg-pink-200 -top-40 -left-20 floating"></div>
        <div className="blob w-[400px] h-[400px] rounded-full bg-blue-100 bottom-20 right-0" style={{ animationDelay: '-2s' }}></div>
        <div className="blob w-[300px] h-[300px] rounded-full bg-yellow-100 top-1/2 left-1/3" style={{ animationDelay: '-4s' }}></div>

        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`sticker-card bg-yellow-400 p-8 w-full max-w-md space-y-6 relative ${error ? 'animate-bounce' : ''}`}>
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute -top-4 -right-4 bg-white border-4 border-black p-2 rounded-full hover:rotate-90 transition-transform"
              >
                <X size={24} />
              </button>
              
              <div className="text-center space-y-2">
                <div className="text-5xl">🗝️</div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Owner Entry Only</h2>
                <p className="font-bold text-black/60 handwriting text-xl">What's the secret flour?</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Enter Password..."
                  className={`w-full bg-white border-4 border-black p-4 text-2xl font-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/10 ${error ? 'border-red-500' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="submit"
                  className="w-full bg-black text-white p-4 rounded-2xl text-2xl font-black flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Check size={28} /> UNLOCK
                </button>
                <p className="text-center text-[10px] font-black uppercase tracking-widest text-black/40">Hint: sourdough</p>
              </form>
            </div>
          </div>
        )}

        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b-4 border-black px-4 md:px-8 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center text-white font-bold text-3xl group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_0px_#000]">
                🥖
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-black leading-none uppercase tracking-tighter">Sourdough Diary</span>
                <span className="text-sm font-bold text-orange-500 handwriting">Stories from the Starter</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/" className="text-black hover:text-orange-500 font-black text-lg transition-colors flex items-center gap-2">
                <BookOpen size={20} />
                <span className="hidden sm:inline">The Blog</span>
              </Link>
              <Link to="/calculator" className="text-black hover:text-blue-500 font-black text-lg transition-colors flex items-center gap-2">
                <Layers size={20} />
                <span className="hidden sm:inline">The Lab</span>
              </Link>
              
              {isLoggedIn && (
                <Link to="/new" className="bg-orange-500 text-white border-4 border-black px-6 py-2 rounded-full font-black flex items-center gap-2 hover:bg-orange-600 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none">
                  <PlusCircle size={20} />
                  <span className="hidden lg:inline">Log Entry</span>
                </Link>
              )}

              <button 
                onClick={isLoggedIn ? handleLogout : () => setShowLogin(true)} 
                className={`p-2 border-2 border-black rounded-full transition-colors ${isLoggedIn ? 'bg-green-100 hover:bg-red-100' : 'hover:bg-gray-100'}`}
                title={isLoggedIn ? "Logout Owner" : "Owner Login"}
              >
                {isLoggedIn ? <Unlock size={18} className="text-green-600" /> : <Lock size={18} className="text-gray-400" />}
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-grow w-full py-8 md:py-16">
          <Routes>
            <Route path="/" element={<BakeListPage bakes={bakes} />} />
            <Route path="/bakes/:id" element={<BakeDetailPage bakes={bakes} />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route 
              path="/new" 
              element={isLoggedIn ? <CreateBakePage onAdd={addBake} /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </main>

        <footer className="py-20 bg-black text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-white" style={{ clipPath: 'polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)' }}></div>
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-5xl font-black italic tracking-tighter">Bread is Life.</h2>
            <div className="flex justify-center gap-8">
              <span className="text-3xl">🥯</span>
              <span className="text-3xl">🥖</span>
              <span className="text-3xl">🍞</span>
            </div>
            <p className="font-black text-orange-400 text-lg uppercase tracking-widest handwriting">Fermented with patience since 2023</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
