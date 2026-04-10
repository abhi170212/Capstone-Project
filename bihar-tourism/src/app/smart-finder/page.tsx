'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendationApi } from '@/lib/api';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import { Sparkles, MapPin, Calculator, Wind, Search, Info } from 'lucide-react';

const TRAVEL_TYPES = ['Eco Tourism', 'Cultural Tourism', 'Religious'];
const BUDGET_OPTIONS = ['Budget', 'Mid-range', 'Luxury'];
const SEASONS = ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'];
const INTEREST_OPTIONS = ['Wildlife', 'History', 'Nature', 'Festivals', 'Architecture', 'Spiritual'];

export default function SmartFinder() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    travelType: '',
    budget: '',
    season: '',
    interests: [] as string[],
  });
  const [recommendations, setRecommendations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const findDestinations = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await recommendationApi.get({
        travelType: preferences.travelType,
        budget: preferences.budget,
        season: preferences.season,
        interests: preferences.interests,
      });
      setRecommendations(res.data);
      setStep(5); // Move to results
    } catch (err) {
      console.error('Failed to get recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFinder = () => {
    setStep(1);
    setSearched(false);
    setRecommendations([]);
    setPreferences({
      travelType: '',
      budget: '',
      season: '',
      interests: [],
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-black flex items-center gap-2">
              <MapPin className="text-black" /> What's your travel style?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRAVEL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setPreferences({ ...preferences, travelType: type });
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left shadow-none ${
                    preferences.travelType === type
                      ? 'border-[#546B41] bg-[#99AD7A] text-black'
                      : 'border-[#546B41]/30 bg-[#FFF8EC] text-black hover:bg-[#99AD7A]/50'
                  }`}
                >
                  <span className="text-xl font-bold">{type}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-black flex items-center gap-2">
              <Calculator className="text-black" /> What's your budget?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUDGET_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setPreferences({ ...preferences, budget: opt });
                    setStep(3);
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left shadow-none ${
                    preferences.budget === opt
                      ? 'border-[#546B41] bg-[#99AD7A] text-black'
                      : 'border-[#546B41]/30 bg-[#FFF8EC] text-black hover:bg-[#99AD7A]/50'
                  }`}
                >
                  <span className="text-xl font-bold">{opt}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-black font-bold underline decoration-[#546B41] hover:text-[#546B41]">← Back</button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-black flex items-center gap-2">
              <Wind className="text-black" /> Preferred visiting season?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {SEASONS.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setPreferences({ ...preferences, season: s });
                    setStep(4);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center shadow-none ${
                    preferences.season === s
                      ? 'border-[#546B41] bg-[#99AD7A] text-black'
                      : 'border-[#546B41]/30 bg-[#FFF8EC] text-black hover:bg-[#99AD7A]/50'
                  }`}
                >
                  <span className="font-bold">{s}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="text-black font-bold underline decoration-[#546B41] hover:text-[#546B41]">← Back</button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-black flex items-center gap-2">
              <Sparkles className="text-black" /> What interests you?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INTEREST_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleInterestToggle(opt)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center shadow-none ${
                    preferences.interests.includes(opt)
                      ? 'border-[#546B41] bg-[#99AD7A] text-black'
                      : 'border-[#546B41]/30 bg-[#FFF8EC] text-black hover:bg-[#99AD7A]/50'
                  }`}
                >
                  <span className="font-bold">{opt}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center pt-6">
              <button onClick={() => setStep(3)} className="text-black font-bold underline decoration-[#546B41] hover:text-[#546B41]">← Back</button>
              <button
                onClick={findDestinations}
                disabled={preferences.interests.length === 0 || loading}
                className="px-10 py-4 bg-[#99AD7A] border-2 border-[#546B41] text-black rounded-lg font-bold text-lg shadow-none hover:bg-[#FFF8EC] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Finding...' : <><Search size={20} /> Find My Destinations</>}
              </button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-bold text-black mb-2">Recommended for You</h2>
                <p className="text-black font-medium">Based on your preferences in {preferences.travelType}</p>
              </div>
              <button
                onClick={resetFinder}
                className="text-black underline decoration-[#546B41] hover:text-[#546B41] font-bold"
              >
                Start Over
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#546B41] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((dest, idx) => (
                  <motion.div
                    key={dest._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <DestinationCard destination={dest} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#546B41]/30 rounded-3xl bg-[#FFF8EC]">
                <p className="text-xl text-black font-bold mb-4">No exact matches found for your specific filters.</p>
                <button
                  onClick={resetFinder}
                  className="px-8 py-3 bg-[#99AD7A] text-black border border-[#546B41] hover:bg-[#FFF8EC] rounded-lg font-bold"
                >
                  Try Different Options
                </button>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {step < 5 && (
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`w-1/4 h-2 rounded-full mx-1 transition-all duration-500 ${
                    s <= step ? 'bg-[#546B41]' : 'bg-[#FFF8EC] border border-[#546B41]/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-black font-bold">Step {step} of 4</p>
          </div>
        )}

        <div className="bg-[#DCCCAC] rounded-3xl shadow-none border border-[#546B41]/30 p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative">
          <button 
            onClick={() => setShowInfoModal(true)}
            className="absolute top-6 right-6 p-2 rounded-full border border-[#546B41]/50 bg-[#FFF8EC] text-black hover:bg-[#99AD7A] hover:border-[#546B41] transition-all flex items-center justify-center flex-shrink-0 group cursor-pointer"
          >
            <Info size={24} />
            <span className="absolute right-full mr-3 whitespace-nowrap bg-[#546B41] text-[#FFF8EC] px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none">
              How to use Smart Finder
            </span>
          </button>
          
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FFF8EC]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#DCCCAC] border-2 border-[#546B41] p-8 rounded-3xl shadow-none"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-black flex items-center gap-2">
                  <Sparkles size={24} /> How it works
                </h3>
              </div>
              <ul className="text-black font-medium space-y-4 mb-8">
                <li className="flex gap-3"><span className="font-bold text-[#546B41]">1.</span> Select your preferred <span className="font-bold">Travel Style</span>.</li>
                <li className="flex gap-3"><span className="font-bold text-[#546B41]">2.</span> Choose a <span className="font-bold">Budget</span> that works for you.</li>
                <li className="flex gap-3"><span className="font-bold text-[#546B41]">3.</span> Pick the ideal <span className="font-bold">Season</span> for your trip.</li>
                <li className="flex gap-3"><span className="font-bold text-[#546B41]">4.</span> Select one or more <span className="font-bold">Interests</span> to discover your perfect destinations.</li>
              </ul>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-4 bg-[#99AD7A] border border-[#546B41] font-bold text-black rounded-xl hover:bg-[#FFF8EC] transition-colors shadow-none text-lg"
              >
                Let's Start!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
