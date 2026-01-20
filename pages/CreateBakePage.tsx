
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BakeEntry, TimelineStep } from '../types';
import { Plus, Trash2, Save, Sparkles, Clock, FlaskConical, Camera, X } from 'lucide-react';
import { MOCK_BAKES } from '../constants';

interface Props {
  onAdd: (bake: BakeEntry) => void;
}

const CreateBakePage: React.FC<Props> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [batchNumber, setBatchNumber] = useState(MOCK_BAKES.length + 1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [intro, setIntro] = useState('');
  const [temp, setTemp] = useState(22);
  const [flour, setFlour] = useState(500);
  const [water, setWater] = useState(375);
  const [starter, setStarter] = useState(100);
  const [salt, setSalt] = useState(10);
  const [coverImage, setCoverImage] = useState('https://picsum.photos/seed/' + Math.random() + '/800/600');
  
  const [timeline, setTimeline] = useState<TimelineStep[]>([
    { id: '1', time: '09:00', action: 'Feed Starter', notes: 'Simulated feedback loop...', image: '' }
  ]);

  const addTimelineStep = () => {
    const newStep: TimelineStep = {
      id: Date.now().toString(),
      time: '12:00',
      action: 'Next Step',
      notes: '',
      image: ''
    };
    setTimeline([...timeline, newStep]);
  };

  const updateStep = (id: string, field: keyof TimelineStep, value: string) => {
    setTimeline(timeline.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeStep = (id: string) => {
    setTimeline(timeline.filter(s => s.id !== id));
  };

  const setStepImage = (id: string) => {
    // Simulation of image upload
    const url = `https://picsum.photos/seed/${Math.random()}/800/600`;
    updateStep(id, 'image', url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBake: BakeEntry = {
      id: Date.now().toString(),
      title,
      batchNumber,
      date,
      intro,
      kitchenTemp: temp,
      percentages: { flour, water, starter, salt },
      timeline,
      coverImage
    };
    onAdd(newBake);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-32 space-y-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-yellow-100 border-2 border-black text-black px-6 py-2 rounded-full font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#000]">
          <Sparkles size={18} /> SECRET ADMIN PANEL
        </div>
        <h1 className="text-7xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">
          Document <br/> <span className="text-orange-500">The Magic.</span>
        </h1>
        <p className="text-3xl handwriting text-gray-500 font-bold">Log today's fermentation journey...</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-20">
        {/* Core Details */}
        <section className="sticker-card bg-white p-12 rounded-[3rem] space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Post Title</label>
                <input 
                  required
                  placeholder="e.g. My Fluffiest Focaccia"
                  className="w-full bg-transparent border-b-8 border-yellow-200 text-4xl font-black text-black px-0 py-4 focus:outline-none focus:border-yellow-400 transition-all uppercase placeholder:opacity-20"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="flex gap-8">
                <div className="flex-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Batch No.</label>
                  <input type="number" className="w-full bg-gray-50 border-4 border-black rounded-2xl px-6 py-4 font-black text-3xl" value={batchNumber} onChange={(e) => setBatchNumber(Number(e.target.value))} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Ambient Temp</label>
                  <input type="number" className="w-full bg-gray-50 border-4 border-black rounded-2xl px-6 py-4 font-black text-3xl" value={temp} onChange={(e) => setTemp(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Cover Image URL</label>
                <div className="flex gap-4">
                  <input type="text" className="flex-1 bg-gray-50 border-4 border-black rounded-2xl px-6 py-4 font-bold" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
                  <button type="button" onClick={() => setCoverImage(`https://picsum.photos/seed/${Math.random()}/800/600`)} className="bg-black text-white p-4 rounded-2xl"><Camera /></button>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
               <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Introduction</label>
                <textarea 
                  rows={8}
                  placeholder="What was the vibe today? Any new flours? Weather?"
                  className="w-full bg-yellow-50 border-4 border-black rounded-[2.5rem] px-8 py-8 text-2xl handwriting font-bold text-gray-800 leading-tight focus:outline-none shadow-inner resize-none"
                  value={intro} onChange={(e) => setIntro(e.target.value)}
                />
              </div>
              <div className="bg-gray-100 border-4 border-black border-dashed rounded-3xl p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center text-3xl">📅</div>
                <input type="date" className="bg-transparent text-2xl font-black uppercase tracking-tighter focus:outline-none" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Stats Section */}
        <section className="bg-black text-white p-12 rounded-[4rem] shadow-[15px_15px_0px_0px_#facc15] relative overflow-hidden">
          <h2 className="text-4xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
            <FlaskConical size={32} className="text-yellow-400" /> Flour Math
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Flour (g)</label>
              <input type="number" value={flour} onChange={(e) => setFlour(Number(e.target.value))} className="w-full bg-white/10 border-4 border-white/20 rounded-2xl p-6 text-4xl font-black focus:border-yellow-400 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Water (g)</label>
              <input type="number" value={water} onChange={(e) => setWater(Number(e.target.value))} className="w-full bg-white/10 border-4 border-white/20 rounded-2xl p-6 text-4xl font-black focus:border-yellow-400 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Starter (g)</label>
              <input type="number" value={starter} onChange={(e) => setStarter(Number(e.target.value))} className="w-full bg-white/10 border-4 border-white/20 rounded-2xl p-6 text-4xl font-black focus:border-yellow-400 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Salt (g)</label>
              <input type="number" value={salt} onChange={(e) => setSalt(Number(e.target.value))} className="w-full bg-white/10 border-4 border-white/20 rounded-2xl p-6 text-4xl font-black focus:border-yellow-400 transition-colors" />
            </div>
          </div>
        </section>

        {/* Timeline Log */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-6xl font-black text-black tracking-tighter uppercase">The Journey Log.</h2>
            <button 
              type="button"
              onClick={addTimelineStep}
              className="bg-black text-white px-10 py-4 rounded-full font-black text-2xl flex items-center gap-4 hover:bg-gray-800 shadow-[8px_8px_0px_0px_#facc15] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Plus size={32} /> New Step
            </button>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-10 md:left-14 top-0 bottom-0 w-4 bg-black rounded-full"></div>
            {timeline.map((step, idx) => (
              <div key={step.id} className="relative pl-24 md:pl-44 group animate-in slide-in-from-left duration-500">
                <div className="absolute left-4 md:left-8 top-0 w-12 h-12 md:w-16 md:h-16 bg-white border-8 border-black rounded-full z-10 font-black text-xl flex items-center justify-center">
                  {idx + 1}
                </div>
                
                <div className="sticker-card bg-white p-10 rounded-[3rem] space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-48 space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Time</label>
                      <input 
                        type="time" 
                        value={step.time} 
                        onChange={(e) => updateStep(step.id, 'time', e.target.value)}
                        className="w-full bg-gray-50 border-4 border-black rounded-2xl p-4 text-2xl font-black text-orange-500"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Action</label>
                      <input 
                        placeholder="e.g. Bulk Ferment" 
                        value={step.action}
                        onChange={(e) => updateStep(step.id, 'action', e.target.value)}
                        className="w-full bg-transparent border-b-4 border-black text-3xl font-black text-black px-0 py-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detailed Notes</label>
                    <textarea 
                      placeholder="Bubbles looks good? Dough feels sticky?"
                      value={step.notes}
                      onChange={(e) => updateStep(step.id, 'notes', e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black border-dashed rounded-3xl p-6 text-xl handwriting font-bold text-gray-700 focus:bg-white transition-all min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Step Image</label>
                     <div className="flex flex-wrap gap-4">
                        {step.image && (
                          <div className="relative w-40 h-40 border-4 border-black rounded-2xl overflow-hidden group/img">
                            <img src={step.image} className="w-full h-full object-cover" />
                            <button onClick={() => updateStep(step.id, 'image', '')} className="absolute top-2 right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"><X size={14}/></button>
                          </div>
                        )}
                        <button 
                          type="button" 
                          onClick={() => setStepImage(step.id)}
                          className="w-40 h-40 border-4 border-black border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-yellow-50 transition-colors group"
                        >
                          <Camera className="text-gray-300 group-hover:text-black transition-colors" size={32} />
                          <span className="text-[10px] font-black text-gray-400 uppercase">Simulate Photo</span>
                        </button>
                     </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 text-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final Save Button */}
        <button 
          type="submit"
          className="w-full bg-black text-white py-12 rounded-[4rem] text-5xl font-black shadow-[20px_20px_0px_0px_#facc15] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-8 group active:scale-95"
        >
          <Save size={64} className="group-hover:rotate-12 transition-transform" /> 
          PUBLISH BAKE
        </button>
      </form>
    </div>
  );
};

export default CreateBakePage;
