'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, SkipBack, SkipForward, Volume2, 
  ListMusic, Music2, Loader2, Heart, Shuffle, Repeat, 
  Repeat1, Plus, MoreHorizontal, Share2, Search
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface BiharSong {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string;
}

interface Playlist {
  _id: string;
  name: string;
  coverImage: string;
  songs: BiharSong[];
}

const DEFAULT_COVER = "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=600&auto=format&fit=crop";

interface BiharMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BiharMusicPlayer({ isOpen, onClose }: BiharMusicPlayerProps) {
  const { user, refreshUserData } = useAuth();

  const [allSongs, setAllSongs] = useState<BiharSong[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  const [currentView, setCurrentView] = useState<'all' | 'liked' | string>('all');
  const [loading, setLoading] = useState(true);
  
  // Playback state
  const [currentQueue, setCurrentQueue] = useState<BiharSong[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedProgress, setPlayedProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Advanced Controls
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [volume, setVolume] = useState(0.8);

  // UI Modals inside player
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [addToPlaylistSongId, setAddToPlaylistSongId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, userRes, playlistsRes] = await Promise.all([
          api.get('/songs'),
          user?.token ? api.get('/users/dashboard') : Promise.resolve({ data: null }),
          user?.token ? api.get('/playlists/my-playlists') : Promise.resolve({ data: [] })
        ]);
        
        const fetchedSongs = songsRes.data.data || [];
        setAllSongs(fetchedSongs);
        
        if (userRes.data) {
          // If auth context refresh is needed, it's done elsewhere, but we have data here.
        }
        
        if (playlistsRes.data) {
          setPlaylists(playlistsRes.data);
        }

        // Initialize queue if empty
        if (currentQueue.length === 0) {
          setCurrentQueue(fetchedSongs);
        }
      } catch (err) {
        console.error('Failed to fetch music data', err);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, user?.token]);

  const currentSong = currentQueue[currentSongIndex];

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex, currentSong, volume]);

  const handleNext = () => {
    if (currentQueue.length === 0) return;
    
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    let nextIndex = currentSongIndex + 1;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentQueue.length);
    } else if (nextIndex >= currentQueue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return; // Stop playback
      }
    }
    
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (currentQueue.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    setCurrentSongIndex((prev) => (prev - 1 + currentQueue.length) % currentQueue.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur > 0) {
        setPlayedProgress(current / dur);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const toggleLike = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to like songs");
    try {
      await api.post(`/users/songs/${songId}/like`);
      await refreshUserData(); // This updates user.likedSongs in context
    } catch (err) {
      console.error(err);
    }
  };

  const isLiked = (songId: string) => {
    if (!user || !user.likedSongs) return false;
    // Assuming likedSongs is an array of IDs or populated objects
    return user.likedSongs.some((item: any) => 
      (typeof item === 'string' ? item : item._id) === songId
    );
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await api.post('/playlists', { name: newPlaylistName });
      setPlaylists([...playlists, res.data]);
      setShowCreatePlaylist(false);
      setNewPlaylistName('');
      refreshUserData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!addToPlaylistSongId) return;
    try {
      await api.post(`/playlists/${playlistId}/songs`, { songId: addToPlaylistSongId });
      // Refresh playlists
      const res = await api.get('/playlists/my-playlists');
      setPlaylists(res.data);
      setAddToPlaylistSongId(null);
      alert("Added to playlist!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add to playlist");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    alert("Music Player link copied!");
  };

  const playSongList = (songs: BiharSong[], startIndex: number) => {
    setCurrentQueue(songs);
    setCurrentSongIndex(startIndex);
    setIsPlaying(true);
  };

  // Determine what list of songs to show based on currentView
  const displaySongs = () => {
    if (currentView === 'all') return allSongs;
    if (currentView === 'liked') {
      if (!user || !user.likedSongs) return [];
      return allSongs.filter(s => isLiked(s._id));
    }
    const playlist = playlists.find(p => p._id === currentView);
    return playlist ? playlist.songs : [];
  };

  const viewSongsList = displaySongs();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#121212] w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 bg-black p-6 flex flex-col hidden md:flex border-r border-white/5">
                <div className="flex items-center gap-2 text-white mb-8">
                  <Music2 size={28} className="text-[#99AD7A]" />
                  <span className="text-xl font-bold tracking-tight">BiharAudio</span>
                </div>

                <div className="space-y-4 mb-8">
                  <button 
                    onClick={() => setCurrentView('all')}
                    className={`flex items-center gap-4 text-sm font-bold transition-colors ${currentView === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ListMusic size={20} /> All Songs
                  </button>
                  <button 
                    onClick={() => setCurrentView('liked')}
                    className={`flex items-center gap-4 text-sm font-bold transition-colors ${currentView === 'liked' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Heart size={20} className={currentView === 'liked' ? 'fill-[#99AD7A] text-[#99AD7A]' : ''} /> Liked Songs
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between text-gray-400 mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase">Your Playlists</span>
                    {user && (
                      <button onClick={() => setShowCreatePlaylist(true)} className="hover:text-white transition-colors">
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  {playlists.map((pl) => (
                    <button
                      key={pl._id}
                      onClick={() => setCurrentView(pl._id)}
                      className={`block w-full text-left text-sm py-2 truncate transition-colors ${currentView === pl._id ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      {pl.name}
                    </button>
                  ))}
                  {!user && (
                    <p className="text-xs text-gray-600 italic">Log in to create playlists</p>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-gradient-to-b from-[#2A2A2A] to-[#121212] flex flex-col relative overflow-hidden">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-[#99AD7A] animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Header Banner */}
                    <div className="px-8 pt-12 pb-6 flex items-end gap-6 bg-gradient-to-b from-black/40 to-transparent">
                      <div className="w-40 h-40 bg-[#1e1e1e] shadow-2xl flex items-center justify-center flex-shrink-0">
                        {currentView === 'all' ? (
                          <ListMusic size={64} className="text-gray-500" />
                        ) : currentView === 'liked' ? (
                          <Heart size={64} className="text-[#99AD7A] fill-current" />
                        ) : (
                          <img 
                            src={playlists.find(p => p._id === currentView)?.coverImage || DEFAULT_COVER} 
                            className="w-full h-full object-cover" 
                            alt="Cover" 
                          />
                        )}
                      </div>
                      <div>
                        <p className="uppercase text-xs font-bold tracking-widest text-white/70 mb-2">
                          {currentView === 'all' ? 'Collection' : currentView === 'liked' ? 'Playlist' : 'Playlist'}
                        </p>
                        <h1 className="text-5xl font-black text-white mb-4">
                          {currentView === 'all' ? 'All Songs' : currentView === 'liked' ? 'Liked Songs' : playlists.find(p => p._id === currentView)?.name}
                        </h1>
                        <p className="text-sm text-gray-300 font-medium">
                          {user?.name || 'Guest'} • {viewSongsList.length} songs
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="px-8 py-4 flex items-center gap-6">
                      <button 
                        onClick={() => playSongList(viewSongsList, 0)}
                        className="w-14 h-14 bg-[#99AD7A] hover:bg-[#a6bb85] rounded-full flex items-center justify-center text-black transition-transform hover:scale-105 shadow-xl"
                      >
                        <Play size={28} className="ml-1 fill-current" />
                      </button>
                      {currentView !== 'all' && currentView !== 'liked' && (
                        <button onClick={handleShare} className="text-gray-400 hover:text-white transition-colors">
                          <Share2 size={24} />
                        </button>
                      )}
                    </div>

                    {/* Tracklist */}
                    <div className="flex-1 overflow-y-auto px-8 pb-32 custom-scrollbar">
                      <div className="grid grid-cols-12 text-sm text-gray-400 border-b border-white/10 pb-2 mb-4 font-medium uppercase tracking-wider">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-6">Title</div>
                        <div className="col-span-4">Artist</div>
                        <div className="col-span-1"></div>
                      </div>

                      {viewSongsList.map((song, index) => {
                        const isCurrentlyPlaying = currentSong?._id === song._id;
                        return (
                          <div
                            key={song._id}
                            onClick={() => playSongList(viewSongsList, index)}
                            className={`grid grid-cols-12 items-center py-3 px-2 rounded-lg cursor-pointer transition-colors group ${
                              isCurrentlyPlaying ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="col-span-1 text-center text-gray-400">
                              {isCurrentlyPlaying ? (
                                <div className="flex gap-1 justify-center items-end h-4">
                                  {[...Array(3)].map((_, i) => (
                                     <motion.div
                                       key={i}
                                       animate={{ height: ["30%", "100%", "30%"] }}
                                       transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                       className="w-1 bg-[#99AD7A] rounded-full"
                                     />
                                  ))}
                                </div>
                              ) : (
                                <span className="group-hover:hidden">{index + 1}</span>
                              )}
                              {!isCurrentlyPlaying && (
                                <Play size={16} className="hidden group-hover:inline-block fill-current" />
                              )}
                            </div>
                            <div className="col-span-6 flex items-center gap-4 pr-4">
                              <img src={song.coverImage || DEFAULT_COVER} className="w-10 h-10 object-cover rounded shadow-sm" alt="Cover" />
                              <span className={`font-bold truncate ${isCurrentlyPlaying ? 'text-[#99AD7A]' : 'text-white'}`}>
                                {song.title}
                              </span>
                            </div>
                            <div className="col-span-4 text-gray-400 text-sm truncate">
                              {song.artist}
                            </div>
                            <div className="col-span-1 flex items-center justify-end gap-3 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => toggleLike(song._id, e)} className="text-gray-400 hover:text-white">
                                <Heart size={18} className={isLiked(song._id) ? 'fill-[#99AD7A] text-[#99AD7A]' : ''} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setAddToPlaylistSongId(song._id); }} className="text-gray-400 hover:text-white">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {viewSongsList.length === 0 && (
                         <div className="text-center py-20 text-gray-500">
                            <Music size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No songs found in this list.</p>
                         </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Player Bar */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-[#181818] border-t border-white/10 flex items-center justify-between px-6 z-20">
              {/* Now Playing Info */}
              <div className="w-1/3 flex items-center gap-4">
                {currentSong ? (
                  <>
                    <img src={currentSong.coverImage || DEFAULT_COVER} className="w-14 h-14 object-cover rounded shadow-md" alt="Cover" />
                    <div className="overflow-hidden">
                      <h4 className="text-white font-bold text-sm truncate">{currentSong.title}</h4>
                      <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
                    </div>
                    <button onClick={(e) => toggleLike(currentSong._id, e)} className="ml-4 text-gray-400 hover:text-white">
                      <Heart size={18} className={isLiked(currentSong._id) ? 'fill-[#99AD7A] text-[#99AD7A]' : ''} />
                    </button>
                  </>
                ) : (
                  <div className="text-gray-600 text-xs uppercase tracking-widest font-bold">No song selected</div>
                )}
              </div>

              {/* Player Controls */}
              <div className="w-1/3 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsShuffle(!isShuffle)} 
                    className={`transition-colors ${isShuffle ? 'text-[#99AD7A]' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Shuffle size={18} />
                  </button>
                  <button onClick={handlePrev} className="text-gray-300 hover:text-white transition-colors">
                    <SkipBack size={20} className="fill-current" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 bg-white hover:scale-105 rounded-full flex items-center justify-center text-black transition-transform"
                  >
                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="ml-1 fill-current" />}
                  </button>
                  <button onClick={handleNext} className="text-gray-300 hover:text-white transition-colors">
                    <SkipForward size={20} className="fill-current" />
                  </button>
                  <button 
                    onClick={() => setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none')} 
                    className={`transition-colors ${repeatMode !== 'none' ? 'text-[#99AD7A]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                  </button>
                </div>
                <div className="w-full max-w-md flex items-center gap-3 text-xs text-gray-400 font-medium">
                  <span>{formatTime(playedProgress * duration)}</span>
                  <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group" onClick={seek}>
                    <div 
                      className="h-full bg-white group-hover:bg-[#99AD7A] transition-colors relative"
                      style={{ width: `${playedProgress * 100}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Controls */}
              <div className="w-1/3 flex items-center justify-end gap-3 text-gray-400">
                <Volume2 size={18} />
                <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setVolume((e.clientX - rect.left) / rect.width);
                }}>
                  <div className="h-full bg-white group-hover:bg-[#99AD7A]" style={{ width: `${volume * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Hidden Audio Element */}
            <div className="hidden">
              <audio
                ref={audioRef}
                src={currentSong?.audioUrl}
                onEnded={handleNext}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            </div>

            {/* Create Playlist Modal */}
            {showCreatePlaylist && (
              <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-[#2A2A2A] p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/10">
                  <h3 className="text-white text-xl font-bold mb-4">Create Playlist</h3>
                  <input 
                    type="text" 
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="My Awesome Playlist"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-[#99AD7A]"
                    autoFocus
                  />
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setShowCreatePlaylist(false)} className="text-white/60 hover:text-white font-bold text-sm px-4">Cancel</button>
                    <button onClick={handleCreatePlaylist} className="bg-[#99AD7A] text-black font-bold px-6 py-2 rounded-full hover:bg-[#a6bb85]">Create</button>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Playlist Modal */}
            {addToPlaylistSongId && (
              <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-[#2A2A2A] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-lg font-bold">Add to Playlist</h3>
                    <button onClick={() => setAddToPlaylistSongId(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  {playlists.length === 0 ? (
                    <p className="text-gray-400 text-sm mb-6">You don't have any playlists yet.</p>
                  ) : (
                    <div className="space-y-2 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                      {playlists.map(pl => (
                        <button 
                          key={pl._id} 
                          onClick={() => handleAddToPlaylist(pl._id)}
                          className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                          {pl.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => { setAddToPlaylistSongId(null); setShowCreatePlaylist(true); }} className="w-full py-3 border border-dashed border-[#99AD7A]/50 text-[#99AD7A] rounded-lg font-bold text-sm hover:bg-[#99AD7A]/10">
                    + New Playlist
                  </button>
                </div>
              </div>
            )}
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
