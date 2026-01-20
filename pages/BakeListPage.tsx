
import React from 'react';
import { Link } from 'react-router-dom';
import { BakeEntry } from '../types';
import { Thermometer, Calendar, Hash, ArrowRight, Sparkles, Wind } from 'lucide-react';

interface Props {
  bakes: BakeEntry[];
}

const BakeListPage: React.FC<Props> = ({ bakes }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24">
      {/* Hero Header */}
      <section className="relative flex flex-col md:flex-row items-center gap-12 py-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-black border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_0px_#000]">
            JOURNAL NO. 01
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-black leading-[0.85] tracking-tighter uppercase">
            Breads <br/>
            <span className="text-orange-500 italic lowercase wavy-text">of my</span> <br/>
            Dreams.
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-xl leading-snug">
            A personal corner where I document my <span className="text-blue-500">sourdough experiments</span>, failures, and crusty successes. 
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="w-full h-[500px] bg-yellow-400 border-8 border-black shadow-[20px_20px_0px_0px_#000] rotate-2 overflow-hidden rounded-2xl relative">
             <img src="https://picsum.photos/seed/bakeryblog/800/1000" className="w-full h-full object-cover grayscale-0 hover:scale-110 transition-transform duration-700" alt="Main Bread" />
             <div className="absolute top-10 right-10 w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center text-4xl animate-bounce shadow-lg">🥖</div>
          </div>
        </div>
      </section>

      {/* Bake Feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {bakes.map((bake, index) => {
          const isBig = index % 3 === 0;
          return (
            <Link 
              key={bake.id} 
              to={`/bakes/${bake.id}`}
              className={`group relative ${isBig ? 'md:col-span-8' : 'md:col-span-4'}`}
            >
              <article className={`sticker-card h-full flex flex-col overflow-hidden bg-white rounded-2xl ${index % 2 === 0 ? 'bg-orange-50' : 'bg-blue-50'}`}>
                <div className={`${isBig ? 'h-[400px]' : 'h-64'} overflow-hidden border-b-4 border-black relative`}>
                  <img 
                    src={bake.coverImage} 
                    alt={bake.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white border-2 border-black px-4 py-1 rounded-full font-black text-sm uppercase">
                    Batch #{bake.batchNumber}
                  </div>
                </div>
                
                <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className={`font-black text-black leading-none tracking-tighter uppercase group-hover:text-orange-500 transition-colors ${isBig ? 'text-6xl' : 'text-3xl'}`}>
                      {bake.title}
                    </h3>
                    <p className="text-xl text-gray-700 handwriting font-bold line-clamp-2">
                      {bake.intro}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t-2 border-black/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 font-black text-xs uppercase tracking-widest text-gray-500">
                        <Calendar size={14} /> {new Date(bake.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1 font-black text-xs uppercase tracking-widest text-orange-500">
                        <Thermometer size={14} /> {bake.kitchenTemp}°
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-all group-hover:translate-x-2">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </section>

      {/* Decorative Newsletter/Signoff Block */}
      <section className="bg-blue-400 border-8 border-black p-12 md:p-24 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-[20px_20px_0px_0px_#facc15]">
        <div className="absolute top-0 right-0 p-8 opacity-20"><Wind size={100} /></div>
        <div className="absolute bottom-0 left-0 p-8 opacity-20"><Sparkles size={100} /></div>
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
          Just Flour, Water, <br/> Salt & Love.
        </h2>
        <p className="text-3xl text-white font-black handwriting">Thanks for stopping by my diary!</p>
      </section>
    </div>
  );
};

export default BakeListPage;
