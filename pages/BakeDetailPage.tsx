
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BakeEntry } from '../types';
import { ArrowLeft, Clock, Thermometer, Calendar, Hash, Droplets, Info, Layers, Camera, Heart, Scissors } from 'lucide-react';

interface Props {
  bakes: BakeEntry[];
}

const BakeDetailPage: React.FC<Props> = ({ bakes }) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const bake = bakes.find((b) => b.id === id);

  useEffect(() => {
    if (bake) {
      document.title = `${bake.title} | ${t('app_name')}`;
    }
  }, [bake, t]);

  if (!bake) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="text-9xl animate-bounce">🫙</div>
        <h2 className="text-6xl font-black text-black tracking-tighter">Bake not found!</h2>
        <Link to="/" className="inline-block bg-black text-white px-10 py-4 rounded-full font-black text-2xl shadow-xl hover:-translate-y-1 transition-all">Go Home</Link>
      </div>
    );
  }

  const hydration = ((bake.percentages.water / bake.percentages.flour) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <Link to="/" className="inline-flex items-center gap-2 bg-white border-4 border-black px-6 py-2 rounded-full font-black text-xl hover:bg-yellow-50 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none">
        <ArrowLeft size={24} /> {t('nav_blog')}
      </Link>

      <article className="space-y-24">
        {/* Header Collage */}
        <div className="flex flex-col lg:flex-row gap-12 items-end">
          <div className="flex-1 space-y-8">
             <div className="flex flex-wrap items-center gap-4">
                <span className="bg-orange-500 text-white border-4 border-black px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000]">
                  {t('batch_no')} #{bake.batchNumber}
                </span>
                <span className="bg-blue-100 text-blue-700 border-2 border-black px-4 py-1 rounded-full font-black text-sm uppercase">
                  <Calendar size={16} className="inline mr-1" /> {new Date(bake.date).toDateString()}
                </span>
             </div>
             <h1 className="text-7xl md:text-9xl font-black text-black leading-[0.85] tracking-tighter uppercase drop-shadow-sm">
               {bake.title}
             </h1>
             <p className="text-3xl md:text-4xl text-gray-600 handwriting font-bold leading-tight border-l-8 border-yellow-400 pl-8 py-2 italic">
               "{bake.intro}"
             </p>
          </div>
          <div className="flex-1 w-full group">
            <div className="sticker-card bg-white rounded-3xl overflow-hidden rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <img src={bake.coverImage} className="w-full h-[500px] object-cover" alt={bake.title} />
            </div>
          </div>
        </div>

        {/* Stats Section - Playful Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sticker-card bg-pink-100 p-8 rounded-3xl space-y-4 text-center transform hover:rotate-1">
            <Thermometer className="mx-auto text-pink-500" size={48} />
            <div className="text-sm font-black uppercase tracking-widest text-pink-700">{t('kitchen_temp')}</div>
            <div className="text-5xl font-black text-black">{bake.kitchenTemp}°C</div>
          </div>
          <div className="sticker-card bg-blue-100 p-8 rounded-3xl space-y-4 text-center transform hover:-rotate-1">
            <Droplets className="mx-auto text-blue-500" size={48} />
            <div className="text-sm font-black uppercase tracking-widest text-blue-700">{t('calc_hydration')}</div>
            <div className="text-5xl font-black text-black">{hydration}%</div>
          </div>
          <div className="sticker-card bg-yellow-100 p-8 rounded-3xl space-y-4 text-center transform hover:rotate-1">
            <Layers className="mx-auto text-yellow-600" size={48} />
            <div className="text-sm font-black uppercase tracking-widest text-yellow-800">{t('calc_total_flour')}</div>
            <div className="text-5xl font-black text-black">{bake.percentages.flour}g</div>
          </div>
          <div className="sticker-card bg-green-100 p-8 rounded-3xl space-y-4 text-center transform hover:-rotate-1">
            <Heart className="mx-auto text-green-500" size={48} />
            <div className="text-sm font-black uppercase tracking-widest text-green-800">Salt</div>
            <div className="text-5xl font-black text-black">{bake.percentages.salt}g</div>
          </div>
        </section>

        {/* Timeline Log */}
        <section className="space-y-12">
          <div className="flex items-center gap-8">
            <h2 className="text-6xl font-black text-black tracking-tighter uppercase italic">The Flow.</h2>
            <div className="h-4 bg-black flex-grow rounded-full shadow-[4px_4px_0px_0px_#facc15]"></div>
          </div>
          
          <div className="space-y-16 relative">
            <div className="absolute left-10 md:left-14 top-0 bottom-0 w-4 bg-black rounded-full"></div>
            
            {bake.timeline.map((step, idx) => (
              <div key={step.id} className="relative pl-24 md:pl-40 flex flex-col md:flex-row gap-8 group">
                {/* Circle marker */}
                <div className="absolute left-4 md:left-8 top-0 w-16 h-16 bg-white border-8 border-black rounded-full z-10 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                
                <div className="flex-grow space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="text-4xl font-black text-orange-500 font-mono italic">{step.time}</span>
                    <span className="bg-black text-white px-6 py-1 rounded-full text-xl font-black uppercase tracking-widest">
                      {step.action}
                    </span>
                  </div>
                  
                  <div className={`p-10 rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_#000] ${idx % 2 === 0 ? 'bg-white rotate-1' : 'bg-orange-50 -rotate-1'}`}>
                    {step.notes && (
                      <p className="text-2xl text-gray-800 handwriting font-bold leading-snug">
                        {step.notes}
                      </p>
                    )}
                    {step.image && (
                      <div className="mt-8 sticker-card bg-white rounded-2xl overflow-hidden h-96 relative">
                        <img src={step.image} className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-1000" alt={step.action} />
                        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-4 py-1 border-2 border-black font-black text-xs">PIC NO. {idx + 1}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Reflection */}
        <section className="bg-yellow-400 border-8 border-black p-12 md:p-20 rounded-[4rem] flex flex-col items-center text-center space-y-8 shadow-[20px_20px_0px_0px_#000]">
          <Scissors size={64} className="text-black" />
          <h3 className="text-5xl font-black text-black tracking-tighter uppercase">Verdict.</h3>
          <p className="text-3xl handwriting text-black font-bold max-w-2xl">
            This loaf was {bake.percentages.flour > 500 ? 'a big boy' : 'perfectly sized'}! The crust sang for a good 10 minutes. 10/10 would bake again.
          </p>
        </section>
      </article>
    </div>
  );
};

export default BakeDetailPage;
