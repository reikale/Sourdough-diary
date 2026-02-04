
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Droplets, Wheat, FlaskConical, Info, Sparkles, Loader2, BrainCircuit, LucideTable2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CalculatorPage: React.FC = () => {
  const { t } = useTranslation();
  const [flour, setFlour] = useState(500);
  const [hydration, setHydration] = useState(68);
  const [starter, setStarter] = useState(22);
  const [salt, setSalt] = useState(2);
  
  // AI States
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  let [targetStarter, setTargetStarter] = useState(110);
  const [ratioFlour, setRatioFlour] = useState(5);
  const [ratioWater, setRatioWater] = useState(5);
  const [ratioLevain, setRatioSeed] = useState(1);

  useEffect(() => {
    document.title = `${t('App_nav_lab')} | ${t('App_name')}`;
  }, [t]);
  // Flour 100%
  // Salt 2%
  const saltWeight = (flour * salt) / 100;
  // Starter 22%
  targetStarter = (flour * starter) / 100;
  // Calculate levain parameters
  const totalRatio = ratioFlour + ratioWater + ratioLevain;
  const unit = targetStarter / totalRatio;
  const feedFlour = (unit * ratioFlour);
  const feedWater = (unit * ratioWater);
  const feedLevain = (unit * ratioLevain).toFixed(1);

  // Water default hidration, but starter is affecting the amount of water
  const waterWeight = ((flour + feedFlour) * (hydration/100))- feedWater;
  const totalWeight = flour + waterWeight + targetStarter + saltWeight;

  const getAiPrediction = async () => {
    setIsAiLoading(true);
    setAiTip(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am baking sourdough. Stats: ${hydration}% hydration, ${starter}% starter amount, ${salt}% salt. Provide a 2-sentence professional prediction about dough handling and bulk fermentation time at 22°C. Be encouraging but honest about the difficulty level.`,
      });
      setAiTip(response.text || "The yeast is shy today. Try again!");
    } catch (err) {
      console.error(err);
      setAiTip("Ouch! The bread lab is offline. Check your API key!");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tighter">{t('CalculatorPage_calculator_title')}</h1>
        <p className="text-xl md:text-2xl text-gray-500 handwriting">{t('CalculatorPage_calculator_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="bg-white p-10 rounded-[4rem] shadow-2xl border-b-8 border-r-8 border-orange-100 relative">
          <div className="absolute -top-6 -left-6 bg-orange-400 w-16 h-16 rounded-3xl rotate-12 flex items-center justify-center text-white shadow-xl">
            <Wheat size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tight">{t('CalculatorPage_dough_builder')}</h2>
          <div className="space-y-8">
            <div className="bg-orange-50 p-6 rounded-3xl">
              <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">{t('CalculatorPage_total_flour')}</label>
              <input type="number" value={flour} onChange={(e) => setFlour(Number(e.target.value))} className="w-full bg-white border-4 border-white text-3xl font-black text-orange-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-300 transition-all shadow-inner" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-sm font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-2"><Droplets size={14}/> {t('CalculatorPage_hydration')}</div>
                <span className="text-2xl text-blue-500">{hydration}%</span>
              </div>
              <input type="range" min="50" max="100" value={hydration} onChange={(e) => setHydration(Number(e.target.value))} className="w-full accent-blue-500 h-3 rounded-full appearance-none bg-blue-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-sm font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-2"><FlaskConical size={14}/> {t('CalculatorPage_starter')}</div>
                <span className="text-2xl text-orange-400">{starter}%</span>
              </div>
              <input type="range" min="5" max="40" value={starter} onChange={(e) => setStarter(Number(e.target.value))} className="w-full accent-orange-400 h-3 rounded-full appearance-none bg-orange-50" />
            </div>
          </div>

          {/* Gemini AI Integration */}
          <div className="mt-8 space-y-4">
            <button 
              onClick={getAiPrediction}
              disabled={isAiLoading}
              className="w-full bg-purple-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-purple-700 transition-colors shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none"
            >
              {isAiLoading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={24} />}
              ASK THE YEAST MASTER
            </button>
            
            {aiTip && (
              <div className="sticker-card bg-purple-50 p-6 rounded-3xl border-purple-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest mb-2">
                  <Sparkles size={14} /> AI Prediction
                </div>
                <p className="handwriting text-xl font-bold text-purple-900 leading-snug">
                  "{aiTip}"
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t-4 border-dashed border-orange-50 space-y-3 font-black text-gray-500">
             <div className="flex justify-between"><span>{t('CalculatorPage_water')}</span><span className="text-blue-500">{waterWeight.toFixed(0)}g</span></div>
             <div className="flex justify-between"><span>{t('CalculatorPage_activeLevain_result')}</span><span className="text-orange-500">{targetStarter.toFixed(0)}g</span></div>
             <div className="flex justify-between"><span>{t('CalculatorPage_salt2%')}</span><span className="text-gray-800">{saltWeight.toFixed(0)}g</span></div>
             <div className="flex justify-between text-3xl font-black pt-4 text-black border-t-2 border-black/5">
                <span>{t('CalculatorPage_final_mix')}</span><span className="text-green-500">{totalWeight.toFixed(0)}g</span>
             </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[4rem] shadow-2xl border-b-8 border-r-8 border-blue-100 relative">
          <div className="absolute -top-6 -right-6 bg-blue-400 w-16 h-16 rounded-3xl -rotate-12 flex items-center justify-center text-white shadow-xl">
            <Calculator size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tight">{t('CalculatorPage_levain_prep')}</h2>
          <div className="bg-blue-50 p-6 rounded-3xl mb-8">
             <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{t('CalculatorPage_Levain_TargetAmount')} (g)</label>
             <input type="number" value={targetStarter} onChange={(e) => setTargetStarter(Number(e.target.value))} className="w-full bg-white border-4 border-white text-3xl font-black text-blue-600 rounded-2xl px-4 py-2 focus:outline-none focus:border-blue-300" />
          </div>
          <div className="grid grid-cols-3 gap-8 text-center bg-blue-500 text-white p-8 rounded-[2.5rem] shadow-lg">
             <div><div className="text-3xl font-black">{feedFlour}g</div><div className="text-[8px] uppercase tracking-widest opacity-60">{t('CalculatorPage_flour')}</div></div>
             <div><div className="text-3xl font-black">{feedWater}g</div><div className="text-[8px] uppercase tracking-widest opacity-60">{t('CalculatorPage_water')}</div></div>
             <div><div className="text-3xl font-black">{feedLevain}g</div><div className="text-[8px] uppercase tracking-widest opacity-60">{t('CalculatorPage_activeStarter_result')}</div></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CalculatorPage;
