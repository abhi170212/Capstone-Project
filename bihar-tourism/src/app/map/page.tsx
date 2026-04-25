'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';
import MapComponent from '@/components/MapComponent';
import { destinationApi } from '@/lib/api';
import { Destination } from '@/types';
import { Navigation, Moon, Sun, Map as MapIcon, X, Maximize2, Car, Bike, Footprints, Train, Plane, Search, Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const CATEGORIES = ['All', 'Nature', 'Temples', 'Historical', 'Festivals'];

export default function InteractiveMapPage() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'cycling' | 'train' | 'plane'>('driving');
  
  const [routeInfo, setRouteInfo] = useState<{ distance: number, duration: number, mode: string } | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<{msg: string, isError: boolean} | null>(null);
  
  // Floating Window States
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        setDestinations(res.data);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [destinations, searchQuery, activeCategory]);

  const handleDestinationSelect = async (destination: Destination) => {
    setActiveDestination(destination);
    setClickedLocation(destination.coordinates);

    try {
      const postRes = await api.get(`/posts?location=${encodeURIComponent(destination.name)}`);
      setCommunityPosts(postRes.data);
    } catch (err) {
      console.error('Failed to load social posts for this location', err);
    }

    if (!userLocation) {
      setShowLocationPrompt(true);
    } else {
      setIsPanelOpen(true);
    }
  };

  const requestLocation = () => {
    setShowLocationPrompt(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsPanelOpen(true);
      }, (err) => {
        console.error("Location access denied", err);
        alert("Location access denied. Please enable location services to trace a route.");
      });
    }
  };

  const formatDistance = (meters: number) => (meters / 1000).toFixed(1) + ' km';
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  };

  const playPopSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log('Audio disabled/errored', e);
    }
  };

  const playErrorSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio disabled/errored', e);
    }
  };

  const showToast = (msg: string, isError: boolean = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveRoute = async () => {
    if (!user) {
      alert("Please log in to save locations and routes to your Personal Dashboard.");
      return;
    }
    if (!activeDestination) return;
    try {
      await api.post('/users/routes', {
        destinationName: activeDestination.name,
        mode: travelMode,
        distance: routeInfo ? formatDistance(routeInfo.distance) : 'Unknown',
        duration: routeInfo ? formatTime(routeInfo.duration) : 'Unknown'
      });
      playPopSound();
      showToast('Location perfectly saved! Check your Dashboard.', false);
    } catch (err: any) {
      console.error(err);
      playErrorSound();
      showToast(err.response?.data?.message || 'Failed to save location.', true);
    }
  };

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-[#FFF8EC] font-poppins">
      
      {/* Background Map layer */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
            destinations={filteredDestinations}
            onDestinationSelect={handleDestinationSelect}
            travelMode={travelMode}
            userLocation={userLocation}
            clickedLocation={clickedLocation}
            onRouteCalculated={(route) => setRouteInfo(route)}
            isDarkMode={isDarkMode}
            height="100%"
        />
      </div>

      {/* Floating UI Overlay Header Area */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-4 pointer-events-none w-full max-w-lg">
        {/* Search Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#DCCCAC]/95 backdrop-blur-md rounded-full shadow-lg border border-[#546B41] p-2 flex items-center gap-3 pointer-events-auto"
        >
          <div className="bg-[#546B41] text-[#FFF8EC] p-3 rounded-full flex-shrink-0">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search destinations in Bihar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-black font-bold placeholder-black/50"
          />
        </motion.div>

        {/* Categories / Filter Chips */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 pointer-events-auto"
        >
          {CATEGORIES.map((cat) => (
            <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-2 rounded-full font-bold transition-all duration-300 border shadow-sm ${
                 activeCategory === cat 
                   ? 'bg-[#546B41] text-[#FFF8EC] border-[#546B41] scale-105' 
                   : 'bg-[#FFF8EC]/90 backdrop-blur-sm text-black border-[#546B41]/30 hover:bg-[#99AD7A]'
               }`}
             >
               {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Modern Location Permission Popup */}
      <AnimatePresence>
        {showLocationPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#FFF8EC]/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#DCCCAC] p-8 rounded-3xl shadow-2xl border-2 border-[#546B41] max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-[#546B41] rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation size={30} className="text-[#FFF8EC]" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Enable Location</h2>
              <p className="text-black/80 font-medium text-sm mb-6">
                To map out your route to {activeDestination?.name || 'this destination'}, we need to detect your starting location.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLocationPrompt(false)}
                  className="flex-1 py-3 text-black font-bold hover:bg-[#FFF8EC]/50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={requestLocation}
                  className="flex-1 py-3 bg-[#546B41] text-[#FFF8EC] hover:bg-[#99AD7A] hover:text-black font-bold rounded-xl transition-colors shadow-lg border border-[#546B41]"
                >
                  Allow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[100] ${toastMessage.isError ? 'bg-red-600 border-red-800' : 'bg-[#546B41] border-[#DCCCAC]'} text-[#FFF8EC] px-6 py-4 rounded-full shadow-2xl border flex items-center gap-3 font-bold pointer-events-none`}
          >
            <Bookmark fill="#FFF8EC" size={20} />
            {toastMessage.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Utilities (Bottom Left) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-6 z-10 flex flex-col gap-3 pointer-events-auto"
      >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-[#FFF8EC]/90 backdrop-blur-md text-black p-4 rounded-full border border-[#546B41]/30 shadow-xl hover:bg-[#DCCCAC] hover:scale-105 transition-all flex items-center justify-center focus:outline-none"
          title="Toggle Map Pattern"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDarkMode ? 'dark' : 'light'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Draggable Rnd Component acting as Floating Window */}
      <AnimatePresence>
        {isPanelOpen && activeDestination && (
          <Rnd
            default={{
              x: typeof window !== 'undefined' && window.innerWidth > 768 ? window.innerWidth - 440 : typeof window !== 'undefined' ? (window.innerWidth - 340) / 2 : 0,
              y: 60,
              width: 400,
              height: typeof window !== 'undefined' ? Math.min(600, window.innerHeight - 150) : 600,
            }}
            size={isFullscreen ? { width: '90%', height: '80%' } : undefined}
            position={isFullscreen ? { x: window.innerWidth * 0.05, y: window.innerHeight * 0.1 } : undefined}
            minWidth={320}
            minHeight={450}
            bounds="parent"
            disableDragging={isFullscreen}
            enableResizing={!isFullscreen}
            dragHandleClassName="drag-handle"
            className={`z-20 bg-[#FFF8EC]/90 backdrop-blur-xl border border-[#546B41] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-shadow duration-300 ${isFullscreen ? 'transition-all duration-300' : ''}`}
          >
            {/* Window Header */}
            <div className="drag-handle bg-[#DCCCAC]/95 cursor-move flex items-center justify-between p-4 border-b border-[#546B41]/20">
              <h3 className="font-bold text-black flex items-center gap-2">
                <MapIcon size={18} /> Route to {activeDestination.name}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1 hover:bg-[#99AD7A] rounded-lg transition-colors cursor-pointer text-black"
                >
                  <Maximize2 size={16} />
                </button>
                <button 
                  onClick={() => {
                     setIsPanelOpen(false);
                     setClickedLocation(null);
                  }}
                  className="p-1 hover:bg-[#546B41]/20 rounded-lg transition-colors cursor-pointer text-black"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Window Body - Scrollable */}
            <div 
              className="flex-1 min-h-0 p-5 overflow-y-auto custom-scrollbar flex flex-col pointer-events-auto cursor-default"
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMoveCapture={(e) => e.stopPropagation()}
            >
              
              {/* Destination Banner */}
              {activeDestination.images && activeDestination.images.length > 0 && (
                <div className="h-32 w-full rounded-2xl overflow-hidden mb-4 border border-[#546B41]/30">
                  <img src={activeDestination.images[0]} alt={activeDestination.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Social Media Feed Injection */}
              {communityPosts.length > 0 && (
                <div className="mb-6">
                  <p className="text-black font-bold mx-1 mb-2">Traveler Experiences</p>
                  <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-2">
                    {communityPosts.map(post => {
                      const handle = post.user?.name ? `@${post.user.name.replace(/\s+/g, '').toLowerCase()}` : '@user';
                      // Strict fallback evaluating unstructured data requests
                      const imageUrl = Array.isArray(post.images) && post.images.length > 0 
                        ? (typeof post.images[0] === 'string' ? post.images[0] : post.images[0].url) 
                        : 'https://images.unsplash.com/photo-1596414272183-5ee9acabf333?q=80&w=400';
                      
                      return (
                        <div key={post._id} className="min-w-[200px] w-[200px] flex-shrink-0 snap-center bg-black rounded-2xl overflow-hidden relative group h-[250px] shadow-lg border border-[#546B41]/20">
                          <img src={imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Post"/>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                            <p className="text-[#FFF8EC] font-bold text-xs mb-1 line-clamp-2">{post.caption || 'Beautiful destination'}</p>
                            <p className="text-[#99AD7A] font-extrabold text-[10px] tracking-wider">{handle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Route Distances */}
              <div className="bg-[#99AD7A]/20 rounded-2xl p-4 border border-[#546B41]/20 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-[#546B41] font-bold text-xs uppercase tracking-wider mb-1">Total Distance</p>
                  <p className="text-black text-2xl font-extrabold">{routeInfo ? formatDistance(routeInfo.distance) : '--'}</p>
                </div>
                <div className="w-[1px] h-12 bg-[#546B41]/20 mx-4"></div>
                <div>
                  <p className="text-[#546B41] font-bold text-xs uppercase tracking-wider mb-1">Est. Time ({travelMode})</p>
                  <p className="text-black text-2xl font-extrabold">{routeInfo ? formatTime(routeInfo.duration) : '--'}</p>
                </div>
              </div>

              {/* Mode Selectors */}
              <p className="text-black font-bold mx-1 mb-2">Transit Options</p>
              <div className="grid grid-cols-5 gap-2 mb-auto">
                <button 
                  onClick={() => setTravelMode('driving')}
                  className={`py-3 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${travelMode === 'driving' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md border border-[#546B41]' : 'bg-[#DCCCAC]/50 text-black border border-[#546B41]/20 hover:bg-[#99AD7A]/40'}`} title="Car"
                >
                  <Car size={18} /> <span className="text-[10px] font-bold">Car</span>
                </button>
                <button 
                  onClick={() => setTravelMode('train')}
                  className={`py-3 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${travelMode === 'train' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md border border-[#546B41]' : 'bg-[#DCCCAC]/50 text-black border border-[#546B41]/20 hover:bg-[#99AD7A]/40'}`} title="Train"
                >
                  <Train size={18} /> <span className="text-[10px] font-bold">Train</span>
                </button>
                <button 
                  onClick={() => setTravelMode('plane')}
                  className={`py-3 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${travelMode === 'plane' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md border border-[#546B41]' : 'bg-[#DCCCAC]/50 text-black border border-[#546B41]/20 hover:bg-[#99AD7A]/40'}`} title="Plane"
                >
                  <Plane size={18} /> <span className="text-[10px] font-bold">Plane</span>
                </button>
                <button 
                  onClick={() => setTravelMode('cycling')}
                  className={`py-3 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${travelMode === 'cycling' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md border border-[#546B41]' : 'bg-[#DCCCAC]/50 text-black border border-[#546B41]/20 hover:bg-[#99AD7A]/40'}`} title="Bike"
                >
                  <Bike size={18} /> <span className="text-[10px] font-bold">Bike</span>
                </button>
                <button 
                  onClick={() => setTravelMode('walking')}
                  className={`py-3 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${travelMode === 'walking' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md border border-[#546B41]' : 'bg-[#DCCCAC]/50 text-black border border-[#546B41]/20 hover:bg-[#99AD7A]/40'}`} title="Walk"
                >
                  <Footprints size={18} /> <span className="text-[10px] font-bold">Walk</span>
                </button>
              </div>
            </div>

            {/* Window Footer - Fixed Action Buttons */}
            <div className="p-4 bg-[#FFF8EC]/95 backdrop-blur-sm border-t border-[#546B41]/20 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex gap-3 flex-shrink-0 z-10 pointer-events-auto">
              <button 
                disabled={!routeInfo}
                className="flex-1 py-3 rounded-xl bg-[#546B41] text-[#FFF8EC] text-sm font-bold shadow-[0_10px_20px_-10px_rgba(84,107,65,0.7)] hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <Navigation size={16} className="fill-current" /> Navigate
              </button>
              
              <button 
                onClick={handleSaveRoute}
                className="flex-1 py-3 rounded-xl bg-[#FFF8EC] border-2 border-[#546B41] text-[#546B41] text-sm font-bold shadow-sm hover:scale-105 transition-transform flex items-center justify-center gap-1 cursor-pointer opacity-100"
              >
                <Bookmark size={16} className="fill-current" /> Save
              </button>
            </div>
          </Rnd>
        )}
      </AnimatePresence>

    </div>
  );
}
