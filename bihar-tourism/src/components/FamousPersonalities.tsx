'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Personality {
  _id: string;
  name: string;
  era: string;
  description: string;
  image: string;
}

export default function FamousPersonalities() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalities = async () => {
      try {
        const res = await api.get('/personalities');
        setPersonalities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonalities();
  }, []);

  const eras = [
    'All',
    'Ancient Era',
    'Medieval & Pre-Independence',
    'Post-Independence',
    'Modern Day'
  ];

  const filteredPersonalities = activeFilter === 'All'
    ? personalities
    : personalities.filter(p => p.era === activeFilter || p.era.includes(activeFilter));

  return (
    <section className="py-24 bg-[#FFF8EC] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#546B41]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#99AD7A]/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-12 h-[2px] bg-[#546B41]"></span>
              <span className="text-[#546B41] font-bold tracking-widest uppercase text-sm">Our Pride</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight tracking-tight"
            >
              FAMOUS <span className="text-[#546B41]">PERSONALITIES</span>
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 justify-end"
          >
            {eras.map((era) => (
              <button
                key={era}
                onClick={() => setActiveFilter(era)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeFilter === era
                    ? 'bg-[#546B41] text-white shadow-lg shadow-[#546B41]/30 scale-105'
                    : 'bg-white text-gray-600 hover:bg-[#FFF8EC] border border-gray-200'
                }`}
              >
                {era}
              </button>
            ))}
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-16 h-16 text-[#546B41] animate-spin" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPersonalities.map((person) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={person._id}
                  className="group relative h-72 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#546B41] cursor-pointer"
                >
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 bg-[#DCCCAC]/90 backdrop-blur-sm text-black text-xs font-black uppercase tracking-wider rounded-lg mb-2">
                        {person.era}
                      </span>
                      <h3 className="text-2xl font-black text-white mb-2">{person.name}</h3>
                      <p className="text-gray-200 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {person.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
