
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BakeEntry } from '../types';
import { Thermometer, Calendar, ArrowRight, Sparkles, Wind, Edit, EyeOff } from 'lucide-react';

interface Props {
  bakes: BakeEntry[];
  isLoggedIn: boolean;
}

const BakeListPage: React.FC<Props> = ({ bakes, isLoggedIn}) => {
  const { t } = useTranslation();
  // TODO: Replace with real authentication state
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.title = `${t('App_name')} | ${t('App_subtitle')}`;
  }, [t]);

  const publishedBakes = bakes.filter(b => b.status === 'published');
  const draftBakes = bakes.filter(b => b.status === 'draft');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24">
      {/* Hero Header */}
      <section className="relative flex flex-col md:flex-row items-center gap-12 py-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-black border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_0px_#000]">
            {t('App_name')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-black leading-[0.85] tracking-tighter uppercase">
            {t('BakeListPage_hero_title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-bold max-w-xl leading-snug">
            {t('BakeListPage_hero_desc')}
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="w-full h-[400px] bg-yellow-400 border-8 border-black shadow-[15px_15px_0px_0px_#000] rotate-2 overflow-hidden rounded-2xl relative">
             <img src="https://picsum.photos/seed/bakeryblog/800/1000" className="w-full h-full object-cover grayscale-0 hover:scale-110 transition-transform duration-700" alt="Sourdough Bread" />
          </div>
        </div>
      </section>

      {/* Drafts Section (Logged In Only) */}
      {isLoggedIn && draftBakes.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <h2 className="text-4xl font-black text-black tracking-tighter uppercase">{t('BakeListPage_recipesInProgress_lbl')}</h2>
             <span className="bg-yellow-100 text-yellow-800 text-xs font-bold me-2 px-2.5 py-0.5 rounded-full border-2 border-black">{t("BakeListPage_recipesInProgress_draftBold_lbl")}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {draftBakes.map(bake => (
              <Link key={bake.id} to={`/bakes/${bake.id}/edit`} className="group">
                <article className="sticker-card h-full flex flex-col overflow-hidden bg-white rounded-2xl border-4 border-dashed border-black hover:border-solid hover:shadow-lg transition-all">
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-black text-black leading-none tracking-tighter uppercase group-hover:text-orange-500 transition-colors">
                      {bake.title || 'Untitled Recipe'}
                    </h3>
                    <p className="text-sm text-gray-500 font-bold">
                      {t('BakeListPage_lastUpdated')}: {new Date(bake.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-auto p-4 bg-gray-50 border-t-4 border-dashed border-black flex items-center justify-between text-xs font-black uppercase">
                    <div className="flex items-center gap-2 text-yellow-700"><EyeOff size={14} />{t('BakeListPage_NotPublished')}</div>
                    <div className="flex items-center gap-2"><Edit size={14}/>{t('BakeListPage_Edit')}</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bake Feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {publishedBakes.map((bake, index) => {
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
                    {t('BakeListPage_batch_no')} #{bake.batchNumber}
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
