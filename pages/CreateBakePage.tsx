
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BakeEntry, TimelineStep } from '../types';
import { Plus, Trash2, Save, Sparkles, Clock, FlaskConical, Camera, X, Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_BAKES } from '../constants';
import { supabase } from '../App';

interface Props {
  onAdd: (bake: BakeEntry) => Promise<void>;
  bakes: BakeEntry[];
}

const CreateBakePage: React.FC<Props> = ({ onAdd, bakes }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('draft');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSteps, setUploadingSteps] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    { id: '1', time: '09:00', action: 'Feed Starter', notes: 'Starter is feeling hungry today!', image: '' }
  ]);

  useEffect(() => {
    if (id) {
      const existingBake = bakes.find(b => b.id === id);
      if (existingBake) {
        setTitle(existingBake.title);
        setBatchNumber(existingBake.batchNumber);
        setDate(existingBake.date);
        setIntro(existingBake.intro);
        setTemp(existingBake.kitchenTemp);
        setFlour(existingBake.percentages.flour);
        setWater(existingBake.percentages.water);
        setStarter(existingBake.percentages.starter);
        setSalt(existingBake.percentages.salt);
        setCoverImage(existingBake.coverImage);
        setTimeline(existingBake.timeline);
      }
    }
  }, [id, bakes]);
  
 // Reusable upload helper
 const uploadFile = async (file: File, folder: string): Promise<string> => {
  if (!supabase) throw new Error("Supabase not configured.");
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('bakes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('bakes')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setUploadingCover(true);
  setUploadError(null);

  try {
    const url = await uploadFile(file, 'covers');
    setCoverImage(url);
  } catch (error: any) {
    setUploadError(`Cover Upload Failed: ${error.message}`);
  } finally {
    setUploadingCover(false);
  }
};

const handleStepImageUpload = async (stepId: string, event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setUploadingSteps(prev => new Set(prev).add(stepId));
  try {
    const url = await uploadFile(file, 'steps');
    updateStep(stepId, 'image', url);
  } catch (error: any) {
    alert(`Step image upload failed: ${error.message}`);
  } finally {
    setUploadingSteps(prev => {
      const next = new Set(prev);
      next.delete(stepId);
      return next;
    });
  }
};

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
    // fix this
    const url = `https://picsum.photos/seed/${Math.random()}/800/600`;
    updateStep(id, 'image', url);
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    setSubmitting(true);
    setPublishStatus(status);
    const newBake: BakeEntry = {
      id: id || Date.now().toString(),
      title,
      batchNumber,
      date,
      intro,
      kitchenTemp: temp,
      percentages: { flour, water, starter, salt },
      timeline,
      coverImage,
      status
    };
    
    try {
      await onAdd(newBake);
      navigate('/');
    } catch (err) {
      alert('Error publishing to database!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-32 space-y-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-yellow-100 border-2 border-black text-black px-6 py-2 rounded-full font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#000]">
          <Sparkles size={18} /> SECRET ADMIN PANEL
        </div>
        <h1 className="text-7xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">
          {id ? 'Edit' : 'Document'} <br/> <span className="text-orange-500">The Magic.</span>
        </h1>
        <p className="text-3xl handwriting text-gray-500 font-bold">Log today's fermentation journey...</p>
      </div>
      
      <form className="space-y-20">
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

              {/* Cover Image Upload */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Cover Image</label>
                
                <div 
                  onClick={() => !uploadingCover && fileInputRef.current?.click()}
                  className={`relative h-64 border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                    coverImage ? 'border-green-400' : 'border-black hover:bg-yellow-50'
                  } ${uploadingCover ? 'cursor-not-allowed' : ''}`}
                >
                  {uploadingCover ? (
                    <div className="text-center space-y-4">
                      <Loader2 size={48} className="animate-spin text-orange-500 mx-auto" />
                      <p className="font-black uppercase text-sm tracking-widest">Rising...</p>
                    </div>
                  ) : coverImage ? (
                    <>
                      <img src={coverImage} className="absolute inset-0 w-full h-full object-cover" alt="Cover Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="text-white" size={48} />
                      </div>
                      <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                        <CheckCircle2 size={20} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4 p-8">
                      <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                        <Camera className="text-orange-500" size={32} />
                      </div>
                      <p className="font-black text-xl uppercase tracking-tighter">Click to upload photo</p>
                      <p className="text-gray-400 handwriting text-lg">Your loaf deserves to be seen!</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleCoverUpload} 
                  />
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                    <AlertCircle size={14} /> {uploadError}
                  </div>
                )}
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

          {/* New step Button */}
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
        </section>
        {/* TODO: Add verdict section */}
        {/* Final Save Button */}
        <div className="flex gap-4">
        <button 
          type="submit"
          disabled={submitting}
          onClick={(e) => handleSubmit(e, 'draft')}
          className="w-full bg-gray-200 text-black py-8 rounded-[3rem] text-3xl font-black shadow-[10px_10px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && publishStatus === 'draft' ? (
            <Loader2 size={48} className="animate-spin" />
          ) : (
            <Save size={48} className="group-hover:rotate-12 transition-transform" /> 
          )}
          {submitting && publishStatus === 'draft' ? 'SAVING...' : 'SAVE DRAFT'}
        </button>
        <button 
          type="submit"
          disabled={submitting}
          onClick={(e) => handleSubmit(e, 'published')}
          className="w-full bg-black text-white py-8 rounded-[3rem] text-3xl font-black shadow-[10px_10px_0px_0px_#facc15] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && publishStatus === 'published' ? (
            <Loader2 size={48} className="animate-spin text-yellow-400" />
          ) : (
            <Sparkles size={48} className="group-hover:scale-125 transition-transform" /> 
          )}
          {submitting && publishStatus === 'published' ? 'PUBLISHING...' : 'PUBLISH BAKE'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBakePage;
