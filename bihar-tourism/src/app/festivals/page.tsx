'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, BookmarkCheck, X, MapPin, Calendar, Info, Star } from 'lucide-react';
import Link from 'next/link';

import { festivalApi } from '@/lib/api';

const MONTHS = ['All','January','February','March','April','May','June','July','August','September','October','November','December'];

interface Festival {
  _id: string;
  name: string;
  month: string;
  location: string;
  images: string[];
  category?: string;
  description: string;
  highlight?: string;
}

export default function FestivalsPage() {
  const [search, setSearch] = useState('');
  const [activeMonth, setActiveMonth] = useState('All');
  const [saved, setSaved] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [selected, setSelected] = useState<Festival | null>(null);

  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem('biharSavedFestivals') || '[]')); } catch {}
    
    const fetchFestivals = async () => {
      try {
        const res = await festivalApi.getAll();
        if (res.success) {
          setFestivals(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch festivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(prev => {
      const next = prev.includes(id as any) ? prev.filter(x => x !== (id as any)) : [...prev, id as any];
      localStorage.setItem('biharSavedFestivals', JSON.stringify(next));
      return next;
    });
  };

  const filtered = festivals.filter(f => {
    const mMatch = activeMonth === 'All' || f.month === activeMonth;
    const sMatch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase());
    const svMatch = !showSaved || saved.includes(f._id as any);
    return mMatch && sMatch && svMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#546B41] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] pt-24 pb-20 font-[Poppins,sans-serif]">
      {/* Background botanical pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.04] z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full border-[1px] border-[#546B41]"
            style={{ width: `${120+i*60}px`, height: `${120+i*60}px`, top: `${Math.sin(i)*30+10}%`, left: `${(i*8)%100}%` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* HERO HEADER */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#546B41]/10 border border-[#546B41]/30 text-[#546B41] text-xs font-bold uppercase tracking-widest">
            Cultural Heritage
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            FESTIVALS
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Witness the vibrant festivals of Bihar – celebrating culture, tradition, and togetherness.
          </p>
        </motion.div>

        {/* FLOATING FILTER BAR */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl border border-[#546B41]/20 rounded-3xl shadow-[0_20px_60px_rgba(84,107,65,0.12)] p-5 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#546B41]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search festivals..."
              className="w-full pl-11 pr-4 py-3 bg-[#FFF8EC] border-2 border-[#546B41]/10 rounded-2xl text-sm font-semibold text-black focus:outline-none focus:border-[#546B41]/40 placeholder-black/30" />
          </div>
          <select value={activeMonth} onChange={e => setActiveMonth(e.target.value)}
            className="px-4 py-3 bg-[#FFF8EC] border-2 border-[#546B41]/10 rounded-2xl text-sm font-bold text-[#546B41] focus:outline-none cursor-pointer">
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <button onClick={() => setShowSaved(v => !v)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${showSaved ? 'bg-[#546B41] text-white border-[#546B41]' : 'bg-[#FFF8EC] text-[#546B41] border-[#546B41]/20 hover:border-[#546B41]/60'}`}>
            <Bookmark size={16} /> My Saved {saved.length > 0 && <span className="bg-[#99AD7A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{saved.length}</span>}
          </button>
        </motion.div>

        {/* MONTH FILTER CHIPS */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 hide-scrollbar">
          {MONTHS.map(m => (
            <button key={m} onClick={() => setActiveMonth(m)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all shadow-sm ${activeMonth === m ? 'bg-[#546B41] text-white border-[#546B41] shadow-[0_4px_15px_rgba(84,107,65,0.3)]' : 'bg-white text-black/60 border-[#546B41]/15 hover:border-[#546B41]/40'}`}>
              {m}
            </button>
          ))}
        </div>

        {/* COUNT */}
        <div className="mb-8 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#546B41]/70">Showing</span>
          <span className="bg-[#546B41] text-white text-sm font-black px-3 py-1 rounded-full">{filtered.length}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#546B41]/70">festivals</span>
          {showSaved && <span className="text-xs font-bold text-[#99AD7A] ml-2">• Saved only</span>}
        </div>

        {/* FESTIVAL GRID */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((f, i) => (
                <motion.div key={f._id} layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 120 }}
                  onClick={() => setSelected(f)}
                  className="group cursor-pointer bg-white/60 backdrop-blur-md border border-[#546B41]/15 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(84,107,65,0.08)] hover:shadow-[0_20px_60px_rgba(84,107,65,0.2)] hover:-translate-y-2 transition-all duration-400 relative">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img src={f.images && f.images.length > 0 ? f.images[0] : 'https://placehold.co/800x600?text=Festival'} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {/* Bookmark */}
                    <button onClick={e => toggleSave(f._id, e)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-10 ${saved.includes(f._id as any) ? 'bg-[#546B41] text-white' : 'bg-white/30 text-white hover:bg-white/50'}`}>
                      {saved.includes(f._id as any) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    {/* Category */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {f.category}
                    </div>
                    {/* Name on image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-xs font-bold text-[#DCCCAC] uppercase tracking-widest mb-0.5">{f.month}</div>
                      <h3 className="text-lg font-black text-white leading-tight">{f.name}</h3>
                    </div>
                  </div>
                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[#546B41] mb-2">
                      <MapPin size={12} strokeWidth={2.5} />
                      <span className="text-xs font-semibold">{f.location}</span>
                    </div>
                    <p className="text-xs text-black/60 leading-relaxed line-clamp-2 mb-3">{f.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#546B41] bg-[#546B41]/10 px-2 py-1 rounded-full">
                        ✦ {f.highlight}
                      </span>
                      <div className="flex items-center gap-1 text-[#546B41]">
                        <Info size={14} />
                        <span className="text-xs font-bold">Details</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white/50 backdrop-blur-md border-2 border-dashed border-[#546B41]/20 rounded-3xl">
            <Calendar size={64} className="mx-auto text-[#DCCCAC] mb-4" strokeWidth={1} />
            <h3 className="text-2xl font-black text-black mb-2">No Festivals Found</h3>
            <p className="text-[#546B41] font-medium text-sm">Try adjusting your filters.</p>
          </div>
        )}

        {/* FOOTER BANNER */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-24 bg-[#546B41] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-64 h-64 rounded-full border border-white"
                style={{ top: `${i*20-30}%`, left: `${i*20-10}%` }} />
            ))}
          </div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#DCCCAC" className="text-[#DCCCAC] mx-0.5" />)}
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Celebrate Every Moment</h2>
            <p className="text-[#DCCCAC] font-medium mb-6 max-w-xl mx-auto">Explore Bihar's festivals all year round – plan your visit and experience the culture firsthand.</p>
            <Link href="/trip-planner"
              className="inline-block px-8 py-3 bg-[#DCCCAC] text-black rounded-2xl font-black text-sm hover:bg-white transition-all shadow-lg hover:-translate-y-1">
              Plan Your Festival Trip →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* FESTIVAL DETAIL MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }} transition={{ type: 'spring', stiffness: 150 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)] max-w-lg w-full border border-[#546B41]/20 max-h-[90vh] overflow-y-auto">
              {/* Image */}
              <div className="relative h-64">
                <img src={selected.images && selected.images.length > 0 ? selected.images[0] : 'https://placehold.co/800x600?text=Festival'} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/30">
                  <X size={20} />
                </button>
                <button onClick={e => toggleSave(selected._id, e)}
                  className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${saved.includes(selected._id as any) ? 'bg-[#546B41] text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}>
                  {saved.includes(selected._id as any) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="text-xs font-bold text-[#DCCCAC] uppercase tracking-widest mb-1">{selected.category}</div>
                  <h2 className="text-3xl font-black text-white">{selected.name}</h2>
                </div>
              </div>
              {/* Body */}
              <div className="p-6">
                <div className="flex gap-4 mb-5">
                  <div className="flex items-center gap-2 bg-[#FFF8EC] border border-[#546B41]/20 rounded-xl px-3 py-2">
                    <Calendar size={15} className="text-[#546B41]" />
                    <span className="text-sm font-bold text-black">{selected.month}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFF8EC] border border-[#546B41]/20 rounded-xl px-3 py-2">
                    <MapPin size={15} className="text-[#546B41]" />
                    <span className="text-sm font-bold text-black">{selected.location}</span>
                  </div>
                </div>
                <div className="bg-[#546B41]/8 border border-[#546B41]/15 rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={14} fill="#546B41" className="text-[#546B41]" />
                    <span className="text-xs font-black text-[#546B41] uppercase tracking-widest">{selected.highlight}</span>
                  </div>
                </div>
                <p className="text-black/70 font-medium leading-relaxed text-sm mb-6">{selected.description}</p>
                <div className="flex gap-3">
                  <Link href="/trip-planner"
                    className="flex-1 text-center py-3 bg-[#546B41] text-white rounded-2xl font-bold text-sm hover:bg-black transition-all">
                    Plan a Trip
                  </Link>
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-3 bg-[#FFF8EC] border-2 border-[#546B41]/20 text-black rounded-2xl font-bold text-sm hover:border-[#546B41]/50 transition-all">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
