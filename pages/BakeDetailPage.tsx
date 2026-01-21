
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Session } from '@supabase/supabase-js';
import { BakeEntry, BakeComment } from '../types';
import { supabase } from '../App';
// Added Loader2 to the list of icons imported from lucide-react
import { 
  ArrowLeft, Clock, Thermometer, Calendar, Droplets, 
  Layers, Heart, Scissors, MessageCircle, Send, LogIn,
  MessageSquare, Loader2
} from 'lucide-react';

interface Props {
  bakes: BakeEntry[];
  session: Session | null;
}

const BakeDetailPage: React.FC<Props> = ({ bakes, session }) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const bake = bakes.find((b) => b.id === id);
  const [comments, setComments] = useState<BakeComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (bake) {
      document.title = `${bake.title} | ${t('app_name')}`;
      fetchComments();
    }
  }, [bake, t]);

  const fetchComments = async () => {
    if (!id || !supabase) return;
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('bake_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Fetch comments failed:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session || !id || !supabase) return;

    setPostingComment(true);
    const commentData = {
      bake_id: id,
      user_id: session.user.id,
      user_name: session.user.user_metadata.full_name || 'Anonymous Bread Friend',
      user_avatar: session.user.user_metadata.avatar_url || '',
      content: newComment.trim()
    };

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select();
      
      if (error) throw error;
      if (data) setComments([...comments, data[0] as BakeComment]);
      setNewComment('');
    } catch (err: any) {
      alert(`Comment failed: ${err.message}`);
    } finally {
      setPostingComment(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({ provider });
  };

  if (!bake) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="text-9xl animate-bounce">🫙</div>
        <h2 className="text-6xl font-black text-black tracking-tighter">Bake not found!</h2>
        <Link to="/" className="inline-block bg-black text-white px-10 py-4 rounded-full font-black text-2xl shadow-xl">Go Home</Link>
      </div>
    );
  }

  const hydration = ((bake.percentages.water / bake.percentages.flour) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <Link to="/" className="inline-flex items-center gap-2 bg-white border-4 border-black px-6 py-2 rounded-full font-black text-xl hover:bg-yellow-50 transition-all shadow-[4px_4px_0px_0px_#000]">
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

        {/* Stats Section */}
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
                <div className="absolute left-4 md:left-8 top-0 w-16 h-16 bg-white border-8 border-black rounded-full z-10 flex items-center justify-center font-black text-xl">
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
                    {step.notes && <p className="text-2xl text-gray-800 handwriting font-bold">{step.notes}</p>}
                    {step.image && (
                      <div className="mt-8 sticker-card bg-white rounded-2xl overflow-hidden h-96">
                        <img src={step.image} className="w-full h-full object-cover" alt={step.action} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verdict */}
        <section className="bg-yellow-400 border-8 border-black p-12 md:p-20 rounded-[4rem] flex flex-col items-center text-center space-y-8 shadow-[20px_20px_0px_0px_#000]">
          <Scissors size={64} className="text-black" />
          <h3 className="text-5xl font-black text-black tracking-tighter uppercase">Verdict.</h3>
          <p className="text-3xl handwriting text-black font-bold max-w-2xl">
            This loaf was {bake.percentages.flour > 500 ? 'a big boy' : 'perfectly sized'}! The crust sang for a good 10 minutes. 10/10 would bake again.
          </p>
        </section>

        {/* --- Comments Section --- */}
        <section className="space-y-12 pb-24 border-t-8 border-black border-dashed pt-24">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-pink-400 border-4 border-black rounded-3xl rotate-6 flex items-center justify-center text-white shadow-[6px_6px_0px_0px_#000]">
              <MessageSquare size={40} />
            </div>
            <h2 className="text-6xl font-black text-black tracking-tighter uppercase">{t('comments_title')}</h2>
          </div>

          <div className="max-w-4xl space-y-12">
            {/* Comment Feed */}
            <div className="space-y-10">
              {loadingComments ? (
                <div className="flex items-center gap-4 text-2xl font-black uppercase animate-pulse">
                  <Loader2 className="animate-spin" /> Gathering the crumbs...
                </div>
              ) : comments.length === 0 ? (
                <div className="p-12 border-4 border-black border-dashed rounded-[3rem] text-center space-y-4">
                  <div className="text-6xl">🦗</div>
                  <p className="text-2xl font-black text-gray-400 uppercase">No voices here yet. Be the first!</p>
                </div>
              ) : (
                comments.map((comment, idx) => (
                  <div 
                    key={comment.id} 
                    className={`sticker-card p-8 flex gap-6 items-start transform transition-transform hover:scale-[1.02] ${
                      idx % 3 === 0 ? 'bg-mint-100 rotate-1' : idx % 3 === 1 ? 'bg-pink-50 -rotate-1' : 'bg-yellow-50 rotate-0'
                    }`}
                    style={{ 
                      backgroundColor: idx % 3 === 0 ? '#d1fae5' : idx % 3 === 1 ? '#fdf2f8' : '#fefce8'
                    }}
                  >
                    <img 
                      src={comment.user_avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${comment.user_name}`} 
                      className="w-16 h-16 rounded-full border-4 border-black shadow-sm"
                      alt={comment.user_name}
                    />
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black uppercase tracking-tight text-black">{comment.user_name}</span>
                        <span className="text-[10px] font-black uppercase text-gray-400 italic">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xl handwriting font-bold text-gray-800 leading-snug">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            {session ? (
              <form onSubmit={handlePostComment} className="sticker-card bg-white p-10 rounded-[3rem] space-y-6">
                <div className="flex items-center gap-4 border-b-4 border-black pb-4">
                   <img src={session.user.user_metadata.avatar_url} className="w-12 h-12 rounded-full border-4 border-black" alt="You" />
                   <span className="text-xl font-black uppercase">{session.user.user_metadata.full_name}</span>
                </div>
                <textarea 
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('comment_placeholder')}
                  className="w-full bg-gray-50 border-4 border-black rounded-3xl p-6 text-2xl handwriting font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
                />
                <button 
                  disabled={postingComment || !newComment.trim()}
                  className="w-full bg-black text-white py-6 rounded-3xl text-3xl font-black flex items-center justify-center gap-4 hover:bg-orange-500 shadow-[8px_8px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                >
                  {postingComment ? <Loader2 className="animate-spin" /> : <Send size={32} />}
                  {t('post_comment')}
                </button>
              </form>
            ) : (
              <div className="bg-orange-100 border-8 border-black p-12 rounded-[4rem] text-center space-y-8 shadow-[15px_15px_0px_0px_#000]">
                <Heart className="mx-auto text-orange-500" size={64} />
                <h3 className="text-4xl font-black text-black tracking-tighter uppercase">{t('login_to_comment')}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                   <button 
                    onClick={() => handleSocialLogin('google')}
                    className="bg-white border-4 border-black px-8 py-4 rounded-full font-black text-xl flex items-center gap-3 hover:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_#000]"
                   >
                     <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="G" /> Google
                   </button>
                   <button 
                    onClick={() => handleSocialLogin('facebook')}
                    className="bg-[#1877F2] text-white border-4 border-black px-8 py-4 rounded-full font-black text-xl flex items-center gap-3 hover:bg-[#166fe5] transition-all shadow-[6px_6px_0px_0px_#000]"
                   >
                     <img src="https://www.facebook.com/favicon.ico" className="w-6 h-6 invert" alt="F" /> Facebook
                   </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default BakeDetailPage;
