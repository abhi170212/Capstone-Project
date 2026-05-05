'use client';

import { motion } from 'framer-motion';
import { Mountain, Droplets, CloudSun, MapPin } from 'lucide-react';

export default function BiharAtAGlance() {
  const stats = [
    { label: 'Total Area', value: '94,163 km²' },
    { label: 'Capital', value: 'Patna' },
    { label: 'Major Rivers', value: 'Ganges, Koshi, Son' },
    { label: 'Terrain', value: 'Fertile Plains' },
  ];

  return (
    <section className="py-24 px-4 bg-[#FFF8EC] relative overflow-hidden border-t-4 border-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-block bg-[#DCCCAC] text-black border-2 border-black px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            Geographical Overview
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase mb-6 drop-shadow-[4px_4px_0_rgba(84,107,65,0.2)]">
            Bihar At A Glance
          </h2>
          <p className="text-lg text-black font-bold max-w-2xl mx-auto border-l-4 border-[#546B41] pl-4">
            Discover the rich topography, fertile soils, and dynamic climate of Bihar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-[#546B41] border-2 border-black text-white rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <Mountain size={24} />
                </div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">Geography</h3>
              </div>
              <p className="text-black font-bold leading-relaxed">
                Bisected by the Ganges into rich North plains and undulating South plains. Completely landlocked.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#DCCCAC] p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white border-2 border-black text-[#546B41] rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <Droplets size={24} />
                </div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">Soil</h3>
              </div>
              <p className="text-black font-bold leading-relaxed">
                Blessed with highly fertile alluvial soil (Khadar and Bhangar), ideal for massive agricultural output.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#99AD7A] p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-black border-2 border-white text-white rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
                  <CloudSun size={24} />
                </div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">Climate</h3>
              </div>
              <p className="text-black font-bold leading-relaxed">
                Humid subtropical climate featuring hot summers, generous monsoons, and cool winters.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Advanced Map Display */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative p-3 bg-white border-4 border-black rounded-3xl shadow-[16px_16px_0_0_rgba(0,0,0,1)]"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 border-black group">
                <img 
                  src="/images/bihar_map.png" 
                  alt="Stylized Map of Bihar" 
                  className="w-full h-[600px] object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                
                {/* Floating Map Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />
                
                {/* Pins and Labels */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <MapPin size={48} className="text-[#DCCCAC] drop-shadow-2xl mb-2 animate-bounce" fill="black" />
                  <div className="bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <span className="text-black font-black uppercase tracking-widest text-sm">Heart of India</span>
                  </div>
                </motion.div>

                {/* Stat Grid Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="bg-white border-2 border-black rounded-xl p-3 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                        <div className="text-black text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-[#546B41] font-black text-sm md:text-base">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
