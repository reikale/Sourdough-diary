
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Utensils, Zap, Coffee, Cloud } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Personal Hero Section */}
      <section className="text-center space-y-8 relative py-10">
        <div className="absolute -top-10 left-10 text-6xl opacity-20 floating">🥖</div>
        <div className="absolute top-20 right-10 text-6xl opacity-20 floating" style={{ animationDelay: '-3s' }}>🌾</div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-800 leading-[0.9] tracking-tighter">
          My Sourdough <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Love Story.</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-500 max-w-3xl mx-auto font-medium">
          Welcome to my kitchen diary. It's messy, it's floury, and it's full of <span className="text-orange-400 font-bold">delicious experiments</span>.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link to="/new" className="bg-purple-500 text-white px-10 py-5 rounded-[2.5rem] text-2xl font-black shadow-[8px_8px_0px_0px_rgba(168,85,247,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3 group">
            Try your first entry <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/bakes" className="bg-white border-4 border-yellow-300 text-gray-700 px-10 py-5 rounded-[2.5rem] text-2xl font-black hover:bg-yellow-50 transition-all shadow-[8px_8px_0px_0px_rgba(253,224,71,0.3)]">
            Read the Diary
          </Link>
        </div>
      </section>

      {/* Feature "Post-its" */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-[#fff9c4] p-10 rounded-[3rem] shadow-xl transform hover:-rotate-3 transition-all border-b-8 border-r-8 border-yellow-200">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-yellow-500 mb-6 shadow-sm">
            <Sparkles size={32} />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Track Bakes</h3>
          <p className="text-gray-700 font-medium text-lg leading-snug">
            I record every batch number and detail. It helps me see how my crust is getting better every week!
          </p>
          <div className="mt-6 handwriting text-2xl text-yellow-600">- Batch #42 was a dream!</div>
        </div>
        
        <div className="bg-[#e1f5fe] p-10 rounded-[3rem] shadow-xl transform hover:rotate-3 transition-all border-b-8 border-r-8 border-blue-200">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 mb-6 shadow-sm">
            <Coffee size={32} />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Baker's Math</h3>
          <p className="text-gray-700 font-medium text-lg leading-snug">
            I built a little calculator to help me figure out hydration and starter amounts. No more messy scribbles!
          </p>
          <div className="mt-6 handwriting text-2xl text-blue-600">- 75% hydration is my sweet spot</div>
        </div>

        <div className="bg-[#f3e5f5] p-10 rounded-[3rem] shadow-xl transform hover:-rotate-1 transition-all border-b-8 border-r-8 border-purple-200">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-500 mb-6 shadow-sm">
            <Cloud size={32} />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Flour Diary</h3>
          <p className="text-gray-700 font-medium text-lg leading-snug">
            A place for all my bread photos. Seeing the progress from my first flat loaf to these big ears is so satisfying.
          </p>
          <div className="mt-6 handwriting text-2xl text-purple-600">- Look at those bubbles!</div>
        </div>
      </section>

      {/* Blog Teaser Section */}
      <section className="bg-white p-10 md:p-16 rounded-[4rem] border-8 border-orange-50 shadow-2xl flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16"></div>
        <div className="flex-1 space-y-6 relative z-10">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">About this Diary</div>
          <h2 className="text-5xl font-black text-gray-800 tracking-tighter">Why do I bake?</h2>
          <p className="text-xl text-gray-600 font-medium leading-relaxed">
            Sourdough is a hobby that taught me patience. It’s a living ecosystem in a jar! 
            I created this space to share my journey, the failures (there are many!), and the successes. 
            It's not about being perfect; it's about the <span className="underline decoration-orange-300 decoration-wavy">joy of the process</span>.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <li className="flex items-center gap-3 text-gray-700 font-black text-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">✔</div>
              Learning Hydration
            </li>
            <li className="flex items-center gap-3 text-gray-700 font-black text-lg">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">✔</div>
              Starter Feeding
            </li>
            <li className="flex items-center gap-3 text-gray-700 font-black text-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">✔</div>
              Scoring Fun
            </li>
            <li className="flex items-center gap-3 text-gray-700 font-black text-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">✔</div>
              Bread Friends
            </li>
          </ul>
        </div>
        <div className="flex-1 w-full h-[450px] relative group">
          <div className="absolute inset-0 bg-orange-400 rounded-[3.5rem] rotate-3 group-hover:rotate-1 transition-transform"></div>
          <img src="https://picsum.photos/seed/bakery/800/1000" className="w-full h-full object-cover rounded-[3.5rem] relative z-10 -rotate-3 group-hover:-rotate-1 transition-transform border-4 border-white shadow-xl" alt="Sourdough Loaf" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
