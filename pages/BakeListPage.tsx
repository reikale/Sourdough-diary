
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BakeEntry } from '../types';
import { Thermometer, Calendar, ArrowRight, Sparkles, Wind } from 'lucide-react';

interface Props {
  bakes: BakeEntry[];
}

const BakeListPage: React.FC<Props> = ({ bakes }) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('app_name')} | ${t('subtitle')}`;
  }, [t]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24">
      {/* Hero Header */}
      <section className="relative flex flex-col md:flex-row items-center gap-12 py-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-black border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_0px_#000]">
            {t('app_name')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-black leading-[0.85] tracking-tighter uppercase">
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-bold max-w-xl leading-snug">
            {t('hero_desc')}
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="w-full h-[400px] bg-yellow-400 border-8 border-black shadow-[15px_15px_0px_0px_#000] rotate-2 overflow-hidden rounded-2xl relative">
             <img src="https://picsum.photos/seed/bakeryblog/800/1000" className="w-full h-full object-cover grayscale-0 hover:scale-110 transition-transform duration-700" alt="Sourdough Bread" />
          </div>
        </div>
      </section>

      {/* Bake Feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {bakes.map((bake, index) => {
          const isBig = index % 3 === 0;
          return (
            <Link 
              key={bake.id} 
              to={`/bakes/${bake.id}`}
              className={`group relative ${isBig ? 'md:col-span-8' : 'md:col-span-4'}`}
            >
              <article className={`sticker-card h-full flex flex-col overflow-hidden bg-white rounded-2xl ${index % 2 === 0 ? 'bg-orange-50' : 'bg-blue-50'}`}>
                <div className={`${isBig ? 'h-[350px]' : 'h-56'} overflow-hidden border-b-4 border-black relative`}>
                  <img src={bake.coverImage} alt={bake.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white border-2 border-black px-4 py-1 rounded-full font-black text-[10px] uppercase">
                    {t('batch_no')} #{bake.batchNumber}
                  </div>
                </div>
                
                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className={`font-black text-black leading-none tracking-tighter uppercase group-hover:text-orange-500 transition-colors ${isBig ? 'text-5xl' : 'text-2xl'}`}>
                      {bake.title}
                    </h3>
                    <p className="text-lg text-gray-700 handwriting font-bold line-clamp-2">
                      {bake.intro}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t-2 border-black/10 text-xs font-black uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(bake.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1 text-orange-500"><Thermometer size={12} /> {bake.kitchenTemp}°</div>
                    </div>
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-all group-hover:translate-x-1">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default BakeListPage;
