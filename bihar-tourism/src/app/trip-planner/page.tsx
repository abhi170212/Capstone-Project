'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { destinations, Destination } from '@/data/destinations';

interface DayPlan {
  day: number;
  destinations: Destination[];
}

export default function TripPlanner() {
  const [itineraryName, setItineraryName] = useState('');
  const [days, setDays] = useState<DayPlan[]>([{ day: 1, destinations: [] }]);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  const addDay = () => {
    setDays([...days, { day: days.length + 1, destinations: [] }]);
  };

  const addDestinationToDay = (dayIndex: number, destinationId: string) => {
    if (!destinationId) return;
    const dest = destinations.find(d => d.id === parseInt(destinationId));
    if (!dest) return;
    
    const newDays = [...days];
    if (!newDays[dayIndex].destinations.find(d => d.id === dest.id)) {
      newDays[dayIndex].destinations.push(dest);
      setDays(newDays);
    }
  };

  const removeDestinationFromDay = (dayIndex: number, destId: number) => {
    const newDays = [...days];
    newDays[dayIndex].destinations = newDays[dayIndex].destinations.filter(d => d.id !== destId);
    setDays(newDays);
  };

  const handleSave = async () => {
    if (!itineraryName) {
      alert("Please provide a name for your itinerary.");
      return;
    }
    
    setSaving(true);
    try {
      const backendDays = days.map(d => ({
        day: d.day,
        destinations: d.destinations.map(dest => dest.name)
      }));
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/itineraries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: itineraryName, days: backendDays })
      });
      
      const data = await response.json();
      if (response.ok) {
        setSavedId(data.id);
      } else {
        alert("Error saving itinerary: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  if (savedId) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full transform"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Itinerary Saved!</h2>
          <p className="text-gray-600 mb-8">Your trip "{itineraryName}" has been successfully created.</p>
          <div className="space-x-4">
            <button 
              onClick={() => {
                setSavedId(null);
                setDays([{ day: 1, destinations: [] }]);
                setItineraryName('');
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
            Interactive Trip Planner
          </h1>
          <p className="text-xl text-gray-600">
            Build your perfect multi-day journey across Bihar's finest destinations.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Itinerary Name</label>
            <input 
              type="text" 
              placeholder="e.g. My Heritage Tour" 
              className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-green-500 focus:border-green-500 p-3 bg-gray-50 text-gray-900"
              value={itineraryName}
              onChange={(e) => setItineraryName(e.target.value)}
            />
          </div>

          <div className="space-y-8">
            {days.map((dayPlan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-xl font-bold text-gray-900">Day {dayPlan.day}</h3>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {dayPlan.destinations.length} Stops
                  </span>
                </div>
                
                {/* Destination selection */}
                <div className="mb-6 flex gap-4">
                  <select 
                    className="flex-1 border-gray-300 rounded-xl shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 bg-white text-gray-900 text-sm"
                    onChange={(e) => addDestinationToDay(index, e.target.value)}
                    value=""
                  >
                    <option value="" disabled>+ Add Destination...</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
                    ))}
                  </select>
                </div>

                {/* Selected Destinations list */}
                {dayPlan.destinations.length > 0 ? (
                  <div className="space-y-3">
                    {dayPlan.destinations.map(dest => (
                      <div key={dest.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-4">
                          <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{dest.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{dest.category} Tourism</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeDestinationFromDay(index, dest.id)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <p>No destinations added for this day yet.</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <button 
              onClick={addDay}
              className="text-blue-600 bg-blue-50 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Day
            </button>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold px-10 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 focus:ring-4 focus:ring-green-300 shadow-lg disabled:opacity-50 transition-all w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Itinerary'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
