'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { festivalApi } from '@/lib/api';
import { Festival } from '@/types';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await festivalApi.getAll();
        setFestivals(res.data);
      } catch (err) {
        console.error('Failed to fetch festivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredFestivals = festivals.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !selectedMonth || festival.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] pt-28 pb-20 px-4 font-poppins text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative py-12 rounded-3xl bg-[#546B41] overflow-hidden group shadow-2xl border-4 border-[#DCCCAC]"
        >
          <div className="absolute inset-0 opacity-[0.15] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFF' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.2C91,-33.3,97.3,-16.6,98.1,0.5C98.9,17.6,94.2,35.2,84.1,50.1C74.1,65,58.7,77.3,42,83.8C25.3,90.3,7.3,91,-9.7,88C-26.7,85,-42.6,78.3,-56.9,67.8C-71.1,57.3,-83.7,43,-90.6,26.2C-97.4,9.4,-98.6,-9.9,-92.9,-27C-87.3,-44.1,-75,-59,-60.1,-66.5C-45.2,-74,-22.6,-74.1,-3.5,-68.2C15.6,-62.3,31.2,-60,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")` }} />
          <div className="relative z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-black text-[#FFF8EC] mb-4 tracking-tighter drop-shadow-lg">
              FESTIVALS MATRIX
            </h1>
            <p className="text-xl md:text-2xl text-[#DCCCAC] max-w-3xl mx-auto font-medium tracking-wide">
              Experience the vibrant cultural celebrations of Bihar throughout the year
            </p>
            <div className="w-48 h-2 bg-[#DCCCAC] mx-auto mt-8 rounded-full shadow-lg"></div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-[#546B41]/10 p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#546B41] opacity-[0.03] rounded-bl-full pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#546B41] group-focus-within:text-black transition-colors" size={22} strokeWidth={3} />
              <input
                type="text"
                placeholder="Search events matrix..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-2xl font-bold text-black focus:outline-none focus:border-[#546B41]/30 focus:shadow-inner transition-all placeholder:text-[#546B41]/50"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-5 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-2xl font-black text-[#546B41] uppercase tracking-widest focus:outline-none focus:border-[#546B41]/30 focus:shadow-inner transition-all cursor-pointer"
            >
              <option value="">All Temporal Cycles</option>
              {months.map(month => (
                <option key={month} value={month} className="font-bold">{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 pl-4">
          <p className="text-[#546B41] font-bold text-sm tracking-widest uppercase">
            Detecting <span className="text-black font-black text-xl mx-2 bg-[#DCCCAC] px-3 py-1 rounded-lg">{filteredFestivals.length}</span> Event{filteredFestivals.length !== 1 ? 's' : ''} Active
          </p>
        </div>

        {/* Festivals Grid */}
        {filteredFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-transparent hover:border-[#DCCCAC] hover:shadow-2xl transition-all duration-300 group relative"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={festival.images[0] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                     <div>
                       <h3 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{festival.name}</h3>
                     </div>
                     <div className="bg-[#546B41] backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-[#DCCCAC]/30">
                       <span className="text-xs font-black text-[#FFF8EC] uppercase tracking-widest">{festival.month}</span>
                     </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 pb-10">
                  <div className="space-y-3 mb-6 bg-[#FFF8EC] p-4 rounded-2xl border border-[#546B41]/10">
                    <div className="flex items-center gap-3 text-black">
                      <MapPin size={18} className="text-[#546B41]" strokeWidth={3} />
                      <span className="text-sm font-bold">{festival.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#546B41]">
                      <Calendar size={18} className="text-[#546B41]" strokeWidth={3} />
                      <span className="text-sm font-black uppercase tracking-widest">{festival.month} Block</span>
                    </div>
                  </div>

                  <p className="text-gray-600 font-medium text-sm leading-relaxed line-clamp-3 mb-8">
                    {festival.description}
                  </p>

                  <button className="w-full py-4 bg-[#546B41] text-[#FFF8EC] rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-[0_10px_20px_rgba(84,107,65,0.3)] hover:shadow-xl hover:-translate-y-1">
                    Execute Data Check
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#FFF8EC] border-4 border-dashed border-[#546B41]/30 rounded-3xl shadow-inner group">
            <Calendar size={72} className="mx-auto text-[#DCCCAC] mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            <h3 className="text-3xl font-black text-black mb-3">Void Sector</h3>
            <p className="text-[#546B41] font-bold uppercase tracking-widest text-sm">No cultural events detected with parameter criteria.</p>
          </div>
        )}

        {/* Calendar View Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-white rounded-3xl p-10 shadow-2xl border-2 border-[#546B41]/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DCCCAC] opacity-[0.05] rounded-bl-full pointer-events-none" />
          <h2 className="text-4xl font-black text-black mb-10 text-center tracking-tight">
            Temporal Operations Matrix
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
            {months.map((month, idx) => {
              const monthFestivals = festivals.filter(f => f.month === month);
              return (
                <div
                  key={month}
                  className="p-6 rounded-3xl border-2 border-[#546B41]/10 hover:border-[#546B41] bg-[#FFF8EC] hover:bg-white hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setSelectedMonth(month)}
                >
                  <div className="font-black text-xl text-black mb-2 tracking-tight group-hover:text-[#546B41] transition-colors">{month}</div>
                  <div className="text-sm font-bold text-gray-500">
                    {monthFestivals.length} event{monthFestivals.length !== 1 ? 's' : ''}
                  </div>
                  {monthFestivals.length > 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-[#546B41]/10 text-xs font-black text-[#DCCCAC] uppercase tracking-widest line-clamp-1">
                      {monthFestivals[0].name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-black rounded-3xl p-12 md:p-16 text-center shadow-2xl border-4 border-[#546B41] relative group overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.2] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23546B41' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.2C91,-33.3,97.3,-16.6,98.1,0.5C98.9,17.6,94.2,35.2,84.1,50.1C74.1,65,58.7,77.3,42,83.8C25.3,90.3,7.3,91,-9.7,88C-26.7,85,-42.6,78.3,-56.9,67.8C-71.1,57.3,-83.7,43,-90.6,26.2C-97.4,9.4,-98.6,-9.9,-92.9,-27C-87.3,-44.1,-75,-59,-60.1,-66.5C-45.2,-74,-22.6,-74.1,-3.5,-68.2C15.6,-62.3,31.2,-60,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")` }} />
          <div className="relative z-10">
             <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
               ENGAGE TEMPORAL EVENTS
             </h2>
             <p className="text-xl md:text-2xl mb-10 text-[#DCCCAC] font-medium max-w-2xl mx-auto">
               Incorporate synchronized cultural phases into your personal routing matrix.
             </p>
             <Link
               href="/trip-planner"
               className="inline-block px-10 py-5 bg-[#DCCCAC] text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[0_10px_30px_rgba(220,204,172,0.3)] hover:shadow-[0_15px_40px_rgba(220,204,172,0.5)] hover:-translate-y-1"
             >
               Initialize Planner Node
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
