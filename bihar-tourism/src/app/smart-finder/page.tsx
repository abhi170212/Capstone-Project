'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendationApi } from '@/lib/api';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import { Sparkles, MapPin, Calculator, Wind, Search } from 'lucide-react';

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
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-green-600" /> What's your travel style?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRAVEL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setPreferences({ ...preferences, travelType: type });
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    preferences.travelType === type
                      ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                      : 'border-gray-100 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl font-semibold">{type}</span>
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
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="text-blue-600" /> What's your budget?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUDGET_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setPreferences({ ...preferences, budget: opt });
                    setStep(3);
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    preferences.budget === opt
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl font-semibold">{opt}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">← Back</button>
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
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Wind className="text-orange-600" /> Preferred visiting season?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {SEASONS.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setPreferences({ ...preferences, season: s });
                    setStep(4);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                    preferences.season === s
                      ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-md'
                      : 'border-gray-100 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">{s}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700">← Back</button>
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
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-purple-600" /> What interests you?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INTEREST_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleInterestToggle(opt)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                    preferences.interests.includes(opt)
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md'
                      : 'border-gray-100 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">{opt}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center pt-6">
              <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-700">← Back</button>
              <button
                onClick={findDestinations}
                disabled={preferences.interests.length === 0 || loading}
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center gap-2"
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
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Recommended for You</h2>
                <p className="text-gray-600">Based on your preferences in {preferences.travelType}</p>
              </div>
              <button
                onClick={resetFinder}
                className="text-green-600 font-semibold hover:underline"
              >
                Start Over
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-xl text-gray-500 mb-4">No exact matches found for your specific filters.</p>
                <button
                  onClick={resetFinder}
                  className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold"
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
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {step < 5 && (
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`w-1/4 h-2 rounded-full mx-1 transition-all duration-500 ${
                    s <= step ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-500 font-medium">Step {step} of 4</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
