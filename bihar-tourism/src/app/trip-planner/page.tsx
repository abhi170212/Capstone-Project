'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { destinationApi, itineraryApi, ItineraryData } from '@/lib/api';
import { Destination, Itinerary } from '@/types';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Save, 
  MapPin, 
  Clock, 
  ChevronRight,
  PlaneTakeoff,
  History
} from 'lucide-react';

export default function TripPlanner() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [currentPlan, setCurrentPlan] = useState<ItineraryData>({
    name: 'My Bihar Adventure',
    days: [
      { day: 1, activities: [] }
    ]
  });

  const [activeDay, setActiveDay] = useState(1);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, itinRes] = await Promise.all([
          destinationApi.getAll(),
          itineraryApi.getAll()
        ]);
        setDestinations(destRes.data);
        setItineraries(itinRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addDay = () => {
    setCurrentPlan(prev => ({
      ...prev,
      days: [...prev.days, { day: prev.days.length + 1, activities: [] }]
    }));
  };

  const removeDay = (dayNum: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      days: prev.days.filter(d => d.day !== dayNum).map((d, i) => ({ ...d, day: i + 1 }))
    }));
    if (activeDay === dayNum) setActiveDay(1);
  };

  const addActivity = (destId: string) => {
    const dest = destinations.find(d => d._id === destId);
    if (!dest) return;

    setCurrentPlan(prev => {
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.day === activeDay);
      newDays[dayIdx].activities.push({
        destinationId: destId,
        location: dest.name,
        time: 'Morning',
        description: `Visit ${dest.name}`
      });
      return { ...prev, days: newDays };
    });
  };

  const removeActivity = (dayNum: number, actIdx: number) => {
    setCurrentPlan(prev => {
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.day === dayNum);
      newDays[dayIdx].activities.splice(actIdx, 1);
      return { ...prev, days: newDays };
    });
  };

  const saveItinerary = async () => {
    setSaving(true);
    try {
      await itineraryApi.create(currentPlan);
      const res = await itineraryApi.getAll();
      setItineraries(res.data);
      alert('Itinerary saved successfully!');
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Error saving itinerary');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
              <PlaneTakeoff className="text-blue-600" /> Trip Planner
            </h1>
            <p className="text-gray-600 mt-2">Design your perfect Bihar itinerary day by day.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowSaved(!showSaved)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <History size={18} /> {showSaved ? 'Hide Saved' : 'Show Saved'}
            </button>
            <button 
              onClick={saveItinerary}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </div>

        {showSaved && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {itineraries.map(itin => (
              <div key={itin._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-lg text-gray-800 mb-2">{itin.name}</h4>
                <p className="text-sm text-gray-500 mb-4">{itin.days.length} Days Itinerary</p>
                <button 
                  onClick={() => {
                    setCurrentPlan({
                      name: itin.name,
                      description: itin.description,
                      days: itin.days.map(d => ({
                        day: d.day,
                        activities: d.activities.map(a => ({
                          time: a.time,
                          location: a.location,
                          description: a.description,
                          destinationId: a.destinationId?._id
                        }))
                      }))
                    });
                    setShowSaved(false);
                  }}
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Load this plan
                </button>
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planner Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar size={20} className="text-green-600" /> Timeline
                </h3>
                <button 
                  onClick={addDay}
                  className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                {currentPlan.days.map(day => (
                  <div 
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex justify-between items-center ${
                      activeDay === day.day 
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md' 
                        : 'bg-gray-50 text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <span className="font-bold">Day {day.day}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-80">{day.activities.length} acts</span>
                      {day.day > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeDay(day.day); }}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" /> Quick Add
              </h3>
              <div className="h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {destinations.map(dest => (
                  <div 
                    key={dest._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    <div className="flex gap-3 items-center">
                      <img src={dest.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{dest.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{dest.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => addActivity(dest._id)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[600px]">
              <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Day {activeDay} Plans</h2>
                  <p className="text-gray-500">Add destinations from the side to build your day.</p>
                </div>
                <div className="text-right">
                  <input 
                    type="text" 
                    value={currentPlan.name}
                    onChange={(e) => setCurrentPlan({...currentPlan, name: e.target.value})}
                    className="text-lg font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {currentPlan.days.find(d => d.day === activeDay)?.activities.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
                    >
                      <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-400">No activities planned for this day yet.</p>
                    </motion.div>
                  ) : (
                    currentPlan.days.find(d => d.day === activeDay)?.activities.map((act, idx) => (
                      <motion.div 
                        key={`${activeDay}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group flex gap-6 p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition-all relative overflow-hidden"
                      >
                         <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 group-hover:w-3 transition-all" />
                         
                         <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <select 
                                    value={act.time}
                                    onChange={(e) => {
                                      const newDays = [...currentPlan.days];
                                      const dayIdx = newDays.findIndex(d => d.day === activeDay);
                                      newDays[dayIdx].activities[idx].time = e.target.value;
                                      setCurrentPlan({...currentPlan, days: newDays});
                                    }}
                                    className="bg-blue-50 text-blue-600 font-bold text-xs uppercase px-3 py-1 rounded-full border-none focus:ring-1 focus:ring-blue-400"
                                  >
                                    <option>Morning</option>
                                    <option>Afternoon</option>
                                    <option>Evening</option>
                                    <option>Night</option>
                                  </select>
                                  <h4 className="text-xl font-extrabold text-gray-800">{act.location}</h4>
                               </div>
                               <button 
                                 onClick={() => removeActivity(activeDay, idx)}
                                 className="text-gray-300 hover:text-red-500 transition-colors"
                               >
                                 <Trash2 size={20} />
                               </button>
                            </div>
                            <textarea 
                              value={act.description}
                              onChange={(e) => {
                                const newDays = [...currentPlan.days];
                                const dayIdx = newDays.findIndex(d => d.day === activeDay);
                                newDays[dayIdx].activities[idx].description = e.target.value;
                                setCurrentPlan({...currentPlan, days: newDays});
                              }}
                              className="w-full text-gray-600 text-sm bg-gray-50 p-4 rounded-2xl border-none focus:ring-1 focus:ring-gray-200 resize-none"
                              rows={2}
                            />
                         </div>
                         <div className="hidden md:block w-32 h-32 rounded-2xl overflow-hidden shadow-sm">
                            <img 
                              src={destinations.find(d => d._id === act.destinationId)?.images[0]} 
                              className="w-full h-full object-cover"
                            />
                         </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                
                {currentPlan.days.find(d => d.day === activeDay)?.activities.length! > 0 && (
                   <div className="pt-6 flex justify-center">
                      <button 
                        onClick={() => setActiveDay(prev => Math.min(prev + 1, currentPlan.days.length))}
                        className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                      >
                         Next Day <ChevronRight size={20} />
                      </button>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
