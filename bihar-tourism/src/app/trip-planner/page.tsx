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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPlan, setCurrentPlan] = useState<ItineraryData>({
    name: 'My Bihar Adventure',
    days: [
      { day: 1, activities: [] }
    ]
  });

  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes] = await Promise.all([
          destinationApi.getAll()
        ]);
        setDestinations(destRes.data);
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
      
      const currentDay = newDays[dayIdx];
      newDays[dayIdx] = {
        ...currentDay,
        activities: [
          ...currentDay.activities,
          {
            destinationId: destId,
            location: dest.name,
            time: 'Morning',
            description: `Visit ${dest.name}`
          }
        ]
      };
      
      return { ...prev, days: newDays };
    });
  };

  const removeActivity = (dayNum: number, actIdx: number) => {
    setCurrentPlan(prev => {
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.day === dayNum);
      
      const currentDay = newDays[dayIdx];
      const newActivities = [...currentDay.activities];
      newActivities.splice(actIdx, 1);
      
      newDays[dayIdx] = {
        ...currentDay,
        activities: newActivities
      };
      
      return { ...prev, days: newDays };
    });
  };

  const saveItinerary = async () => {
    setSaving(true);
    try {
      await itineraryApi.create(currentPlan);
      alert('Itinerary saved successfully! You can view it in your Dashboard.');
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
    <div className="min-h-screen bg-[#FFF8EC] pt-32 pb-20 px-4 font-poppins text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-[#546B41] p-8 rounded-3xl shadow-xl border-4 border-[#DCCCAC] relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.1] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFF' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.2C91,-33.3,97.3,-16.6,98.1,0.5C98.9,17.6,94.2,35.2,84.1,50.1C74.1,65,58.7,77.3,42,83.8C25.3,90.3,7.3,91,-9.7,88C-26.7,85,-42.6,78.3,-56.9,67.8C-71.1,57.3,-83.7,43,-90.6,26.2C-97.4,9.4,-98.6,-9.9,-92.9,-27C-87.3,-44.1,-75,-59,-60.1,-66.5C-45.2,-74,-22.6,-74.1,-3.5,-68.2C15.6,-62.3,31.2,-60,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")` }} />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-[#FFF8EC] flex items-center gap-3 tracking-tight">
              <PlaneTakeoff className="text-[#DCCCAC] w-10 h-10" /> Strategic Planner
            </h1>
            <p className="text-[#DCCCAC] mt-2 font-medium text-lg border-l-4 border-[#99AD7A] pl-3">Design your perfect Bihar itinerary day by day.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={saveItinerary}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCCCAC] text-black rounded-2xl font-black shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:bg-white transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              <Save size={16} /> {saving ? 'Committing...' : 'Save Matrix'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planner Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#546B41]/10">
              <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
                <h3 className="text-2xl font-black text-black flex items-center gap-3 tracking-tight">
                  <Calendar size={22} className="text-[#546B41]" /> Timeline
                </h3>
                <button
                  onClick={addDay}
                  className="p-2.5 bg-[#546B41] text-[#FFF8EC] rounded-xl hover:bg-black hover:-translate-y-0.5 transition-all shadow-md"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-3">
                {currentPlan.days.map(day => (
                  <div
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex justify-between items-center border-2 border-transparent ${activeDay === day.day
                        ? 'bg-[#546B41] text-[#FFF8EC] shadow-lg scale-[1.02]'
                        : 'bg-[#FFF8EC] text-black hover:border-[#546B41]/30 hover:bg-white'
                      }`}
                  >
                    <span className="font-black tracking-wider uppercase text-sm">Day {day.day}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold opacity-80">{day.activities.length} acts</span>
                      {day.day > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeDay(day.day); }}
                          className="p-1.5 hover:bg-white/20 hover:text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#546B41]/10">
              <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-3 border-b-2 border-gray-100 pb-4 tracking-tight">
                <MapPin size={22} className="text-[#546B41]" /> Quick Add
              </h3>
              <div className="h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {destinations.map(dest => (
                  <div
                    key={dest._id}
                    className="flex items-center justify-between p-3 bg-[#FFF8EC] rounded-2xl border border-[#546B41]/10 hover:border-[#546B41]/40 hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-4 items-center">
                      <img src={dest.images[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                      <div>
                        <p className="text-sm font-black text-black line-clamp-1">{dest.name}</p>
                        <p className="text-[10px] font-bold text-[#546B41] uppercase tracking-widest">{dest.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addActivity(dest._id)}
                      className="p-2.5 bg-white text-[#546B41] border border-[#546B41]/20 rounded-xl group-hover:bg-[#546B41] group-hover:text-white group-hover:shadow-md transition-all"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#546B41]/10 min-h-[600px] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#546B41] to-[#DCCCAC]"></div>
              <div className="border-b-2 border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                <div>
                  <h2 className="text-3xl font-black text-black">Day {activeDay} Matrix</h2>
                  <p className="text-gray-500 font-medium">Inject destinations from the sidebar to assemble.</p>
                </div>
                <div className="w-full sm:w-auto text-right">
                  <input
                    type="text"
                    value={currentPlan.name}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                    className="w-full sm:w-auto text-lg font-black text-[#546B41] bg-[#FFF8EC] px-5 py-3 rounded-2xl border-2 border-[#546B41]/20 focus:border-[#546B41] outline-none transition-colors shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-6 relative">
                <AnimatePresence mode="popLayout">
                  {currentPlan.days.find(d => d.day === activeDay)?.activities.length === 0 ? (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-24 bg-[#FFF8EC] rounded-3xl border-2 border-dashed border-[#546B41]/30 shadow-inner group"
                    >
                      <Clock size={48} className="mx-auto text-[#DCCCAC] mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-black font-black text-xl mb-1">Awaiting Coordinates</p>
                      <p className="text-[#546B41] font-bold text-sm uppercase tracking-widest">No activities deployed for Day {activeDay} yet.</p>
                    </motion.div>
                  ) : (
                    currentPlan.days.find(d => d.day === activeDay)?.activities.map((act, idx) => (
                      <motion.div
                        key={`${activeDay}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex flex-col sm:flex-row gap-6 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-[#546B41]/30 hover:shadow-xl transition-all relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#DCCCAC] group-hover:bg-[#546B41] transition-colors" />

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <select
                                value={act.time}
                                onChange={(e) => {
                                  const newDays = [...currentPlan.days];
                                  const dayIdx = newDays.findIndex(d => d.day === activeDay);
                                  const newActivities = [...newDays[dayIdx].activities];
                                  newActivities[idx] = { ...newActivities[idx], time: e.target.value };
                                  newDays[dayIdx] = { ...newDays[dayIdx], activities: newActivities };
                                  setCurrentPlan({ ...currentPlan, days: newDays });
                                }}
                                className="bg-black text-[#DCCCAC] font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#99AD7A] cursor-pointer shadow-lg w-max"
                              >
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                                <option>Night</option>
                              </select>
                              <h4 className="text-xl md:text-2xl font-black text-black tracking-tight">{act.location}</h4>
                            </div>
                            <button
                              onClick={() => removeActivity(activeDay, idx)}
                              className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2.5 rounded-full transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <textarea
                            value={act.description}
                            onChange={(e) => {
                              const newDays = [...currentPlan.days];
                              const dayIdx = newDays.findIndex(d => d.day === activeDay);
                              const newActivities = [...newDays[dayIdx].activities];
                              newActivities[idx] = { ...newActivities[idx], description: e.target.value };
                              newDays[dayIdx] = { ...newDays[dayIdx], activities: newActivities };
                              setCurrentPlan({ ...currentPlan, days: newDays });
                            }}
                            className="w-full text-black font-medium text-sm bg-[#FFF8EC] p-5 rounded-2xl border border-transparent focus:border-[#546B41]/30 focus:shadow-inner resize-none transition-all outline-none leading-relaxed"
                            rows={2}
                          />
                        </div>
                        <div className="hidden md:block w-36 h-36 rounded-2xl overflow-hidden shadow-md shrink-0 border-4 border-[#FFF8EC]">
                          <img
                            src={destinations.find(d => d._id === act.destinationId)?.images[0]}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                      className="flex items-center gap-2 text-[#546B41] font-black uppercase tracking-widest text-sm hover:gap-4 hover:text-black py-4 px-8 bg-[#FFF8EC] rounded-2xl transition-all shadow-sm border border-[#546B41]/10"
                    >
                      Advance Day Matrix <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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
      `}} />
    </div>
  );
}
