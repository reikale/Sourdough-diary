
import React, { useState } from 'react';
import { Info, Calculator, Droplets, Wheat, FlaskConical } from 'lucide-react';

const CalculatorPage: React.FC = () => {
  const [flour, setFlour] = useState(500);
  const [hydration, setHydration] = useState(75);
  const [starter, setStarter] = useState(20);
  const [salt, setSalt] = useState(2);
  
  // Starter feeding calc
  const [targetStarter, setTargetStarter] = useState(100);
  const [ratioFlour, setRatioFlour] = useState(2);
  const [ratioWater, setRatioWater] = useState(2);
  const [ratioSeed, setRatioSeed] = useState(1);

  const waterWeight = (flour * hydration) / 100;
  const starterWeight = (flour * starter) / 100;
  const saltWeight = (flour * salt) / 100;
  const totalWeight = flour + waterWeight + starterWeight + saltWeight;

  const totalRatio = ratioFlour + ratioWater + ratioSeed;
  const unit = targetStarter / totalRatio;
  const feedFlour = (unit * ratioFlour).toFixed(1);
  const feedWater = (unit * ratioWater).toFixed(1);
  const feedSeed = (unit * ratioSeed).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24">
      <div className="text-center space-y-4">
        <div className="inline-block bg-blue-100 text-blue-600 px-6 py-2 rounded-full text-xl font-black uppercase tracking-widest shadow-sm">My Secret Formulas</div>
        <h1 className="text-6xl md:text-7xl font-black text-gray-800 tracking-tighter">Bread Lab.</h1>
        <p className="text-2xl text-gray-500 handwriting">Measure twice, mix once! 🥄</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Main Dough Calculator */}
        <section className="bg-white p-10 rounded-[4rem] shadow-2xl border-b-8 border-r-8 border-orange-100 relative group transition-transform hover:-translate-y-2">
          <div className="absolute -top-6 -left-6 bg-orange-400 w-16 h-16 rounded-3xl rotate-12 flex items-center justify-center text-white shadow-xl">
            <Wheat size={32} />
          </div>
          
          <h2 className="text-4xl font-black text-gray-800 mb-8 tracking-tight">Dough Builder</h2>

          <div className="space-y-8">
            <div className="bg-orange-50 p-6 rounded-3xl">
              <label className="block text-sm font-black text-orange-400 uppercase tracking-widest mb-2">Total Flour (g)</label>
              <input 
                type="number" 
                value={flour} 
                onChange={(e) => setFlour(Number(e.target.value))}
                className="w-full bg-white border-4 border-white text-4xl font-black text-orange-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-300 transition-all shadow-inner"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-sm"><Droplets size={16}/> Hydration</div>
                <span className="text-3xl font-black text-blue-500">{hydration}%</span>
              </div>
              <input type="range" min="50" max="100" value={hydration} onChange={(e) => setHydration(Number(e.target.value))} className="w-full accent-blue-500 h-4 rounded-full appearance-none bg-blue-50" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-sm"><FlaskConical size={16}/> Starter</div>
                <span className="text-3xl font-black text-orange-400">{starter}%</span>
              </div>
              <input type="range" min="5" max="40" value={starter} onChange={(e) => setStarter(Number(e.target.value))} className="w-full accent-orange-400 h-4 rounded-full appearance-none bg-orange-50" />
            </div>
          </div>

          <div className="mt-10 pt-8 border-t-4 border-dashed border-orange-50 space-y-4">
            <div className="flex justify-between items-center text-2xl font-bold text-gray-500">
              <span>Water</span>
              <span className="text-blue-500">{waterWeight.toFixed(0)}g</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold text-gray-500">
              <span>Starter</span>
              <span className="text-orange-500">{starterWeight.toFixed(0)}g</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold text-gray-500">
              <span>Salt (2%)</span>
              <span className="text-gray-800">{saltWeight.toFixed(0)}g</span>
            </div>
            <div className="flex justify-between items-center text-4xl font-black pt-6 text-gray-800 border-t-4 border-orange-50">
              <span>Final Mix</span>
              <span className="text-green-500">{totalWeight.toFixed(0)}g</span>
            </div>
          </div>
        </section>

        {/* Starter Maintenance */}
        <section className="bg-white p-10 rounded-[4rem] shadow-2xl border-b-8 border-r-8 border-blue-100 relative group transition-transform hover:-translate-y-2">
          <div className="absolute -top-6 -right-6 bg-blue-400 w-16 h-16 rounded-3xl -rotate-12 flex items-center justify-center text-white shadow-xl">
            <Calculator size={32} />
          </div>

          <h2 className="text-4xl font-black text-gray-800 mb-8 tracking-tight">Starter Prep</h2>

          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-3xl">
              <label className="block text-sm font-black text-blue-400 uppercase tracking-widest mb-2">Target Amount (g)</label>
              <input 
                type="number" 
                value={targetStarter} 
                onChange={(e) => setTargetStarter(Number(e.target.value))}
                className="w-full bg-white border-4 border-white text-4xl font-black text-blue-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-300 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Ratio Flour</span>
                <input type="number" value={ratioFlour} onChange={(e) => setRatioFlour(Number(e.target.value))} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-center font-black text-gray-700" />
              </div>
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Ratio Water</span>
                <input type="number" value={ratioWater} onChange={(e) => setRatioWater(Number(e.target.value))} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-center font-black text-gray-700" />
              </div>
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Ratio Seed</span>
                <input type="number" value={ratioSeed} onChange={(e) => setRatioSeed(Number(e.target.value))} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-center font-black text-gray-700" />
              </div>
            </div>
          </div>

          <div className="mt-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-4xl font-black">{feedFlour}g</div>
                <div className="text-[10px] font-black uppercase opacity-60 tracking-widest">New Flour</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black">{feedWater}g</div>
                <div className="text-[10px] font-black uppercase opacity-60 tracking-widest">Warm Water</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black">{feedSeed}g</div>
                <div className="text-[10px] font-black uppercase opacity-60 tracking-widest">Old Starter</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-100">
            <Info className="text-yellow-600 shrink-0" size={24} />
            <p className="text-sm font-bold text-yellow-800 leading-tight">
              Feed your starter when it's just past its peak for best results!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CalculatorPage;
