'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, Music, Music2, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface BiharSong {
  _id: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  coverImage?: string;
}

const DEFAULT_COVER = "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=600&auto=format&fit=crop";

interface BiharMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BiharMusicPlayer({ isOpen, onClose }: BiharMusicPlayerProps) {
  const [songs, setSongs] = useState<BiharSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedProgress, setPlayedProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get('/songs');
        setSongs(res.data.data);
      } catch (err) {
        console.error('Failed to fetch songs', err);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && songs.length === 0) {
       fetchSongs();
    }
  }, [isOpen]);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayedProgress(state.played);
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#121212] w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>

            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                 <Loader2 className="w-12 h-12 text-[#99AD7A] animate-spin" />
                 <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Loading Playlist...</p>
              </div>
            ) : songs.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                 <Music size={48} className="text-gray-600" />
                 <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">No songs available.</p>
              </div>
            ) : (
              <>
                <div className="hidden">
                  <ReactPlayer
                    url={currentSong?.youtubeUrl}
                    playing={isPlaying}
                    onEnded={handleNext}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    volume={0.8}
                    width="0"
                    height="0"
                  />
                </div>

                <div className="w-full md:w-2/5 bg-gradient-to-b from-[#2A2A2A] to-[#121212] p-8 flex flex-col justify-between border-r border-white/5">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-widest uppercase mb-8">
                      <Music2 size={16} />
                      <span>Now Playing</span>
                    </div>
                    
                    <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 relative group">
                      <img
                        src={currentSong?.coverImage || DEFAULT_COVER}
                        alt={currentSong?.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                           <div className="flex gap-1.5 items-end h-8">
                              {[...Array(5)].map((_, i) => (
                                 <motion.div
                                   key={i}
                                   animate={{ height: ["20%", "100%", "20%"] }}
                                   transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                   className="w-1.5 bg-[#DCCCAC] rounded-full"
                                 />
                              ))}
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-white leading-tight mb-2 line-clamp-2">
                        {currentSong?.title}
                      </h2>
                      <p className="text-gray-400 font-medium">
                        {currentSong?.artist}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6 group">
                      <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer">
                        <div
                          className="h-full bg-white group-hover:bg-[#99AD7A] transition-colors relative"
                          style={{ width: `${playedProgress * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                        <span>{formatTime(playedProgress * duration)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <button onClick={handlePrev} className="text-gray-400 hover:text-white transition-colors">
                        <SkipBack size={32} />
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-[#546B41] hover:bg-[#99AD7A] rounded-full flex items-center justify-center text-white transition-all hover:scale-105 shadow-lg"
                      >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                      </button>
                      <button onClick={handleNext} className="text-gray-400 hover:text-white transition-colors">
                        <SkipForward size={32} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-3/5 p-8 flex flex-col bg-[#121212]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#546B41]/20 rounded-xl flex items-center justify-center">
                      <ListMusic className="text-[#99AD7A]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Songs of Bihar</h3>
                      <p className="text-gray-400 text-sm">Curated Cultural Collection</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-4 mb-4 px-4">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7">Title</div>
                    <div className="col-span-4 text-right">Artist</div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {songs.map((song, index) => {
                      const isActive = index === currentSongIndex;
                      return (
                        <div
                          key={song._id}
                          onClick={() => {
                            setCurrentSongIndex(index);
                            setIsPlaying(true);
                          }}
                          className={`grid grid-cols-12 items-center p-4 rounded-xl cursor-pointer transition-all group ${
                            isActive ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="col-span-1 text-gray-500 font-medium group-hover:text-white">
                            {isActive ? (
                              <div className="w-4 h-4 text-[#DCCCAC]">
                                <Play size={16} className="fill-current" />
                              </div>
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="col-span-7 flex items-center gap-3 pr-4">
                            <img
                              src={song.coverImage || DEFAULT_COVER}
                              className="w-10 h-10 rounded-md object-cover"
                              alt="Cover"
                            />
                            <span className={`font-bold truncate ${isActive ? 'text-[#DCCCAC]' : 'text-white'}`}>
                              {song.title}
                            </span>
                          </div>
                          <div className="col-span-4 text-right text-sm text-gray-400 group-hover:text-white truncate">
                            {song.artist}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-6 mt-auto border-t border-white/10 flex items-center justify-between text-gray-500 text-xs">
                    <span>{songs.length} tracks available</span>
                    <span className="flex items-center gap-2"><Volume2 size={16}/> Audio streaming via YouTube</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
