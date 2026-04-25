'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Landmark, 
  Crown, 
  BookOpen, 
  Map, 
  Swords, 
  Users, 
  Flag 
} from 'lucide-react';

const historyData = [
  {
    id: 1,
    year: '500 BCE',
    title: "Buddha's Enlightenment",
    description: "Prince Siddhartha Gautama attained supreme enlightenment under the Bodhi tree in Bodh Gaya, becoming the Buddha. This monumental event birthed Buddhism, which spread across Asia, making Bihar the spiritual epicenter of the ancient world.",
    icon: <Leaf size={32} className="text-[#546B41]" />,
    color: '#99AD7A'
  },
  {
    id: 2,
    year: '322 BCE',
    title: "Maurya Empire Founded",
    description: "Chandragupta Maurya overthrew the Nanda Dynasty and established the Maurya Empire with Pataliputra (modern Patna) as its capital. With the guidance of Chanakya, it became one of the largest empires on the Indian subcontinent.",
    icon: <Landmark size={32} className="text-[#DCCCAC]" />,
    color: '#546B41'
  },
  {
    id: 3,
    year: '273 BCE',
    title: "Emperor Ashoka's Reign",
    description: "Ashoka the Great took the throne of Magadha. Following the destructive Kalinga War, he embraced Buddhism, prioritizing peace and dharma. His Rock Edicts and Pillars erected across the continent remain symbols of his legacy.",
    icon: <Crown size={32} className="text-[#546B41]" />,
    color: '#FFF8EC'
  },
  {
    id: 4,
    year: '400 CE',
    title: "Nalanda University Established",
    description: "Under the Gupta Empire, Nalanda University was founded. It operated as the greatest center of learning in the ancient world, attracting thousands of scholars from China, Korea, Japan, Tibet, and Persia to study medicine, logic, and philosophy.",
    icon: <BookOpen size={32} className="text-[#DCCCAC]" />,
    color: '#99AD7A'
  },
  {
    id: 5,
    year: '1540 CE',
    title: "Sher Shah Suri's Empire",
    description: "An Afghan commander from Sasaram, Sher Shah Suri, defeated the Mughal Emperor Humayun. He established a brilliant administration, reformed the currency (Rupiya), and rebuilt the famous Grand Trunk Road connecting the subcontinent.",
    icon: <Map size={32} className="text-[#FFF8EC]" />,
    color: '#546B41'
  },
  {
    id: 6,
    year: '1857 CE',
    title: "First War of Independence",
    description: "Eighty-year-old Veer Kunwar Singh of Jagdispur led a fierce armed rebellion against the British East India Company. He proved to be a master of guerrilla warfare and handed the British forces several severe defeats.",
    icon: <Swords size={32} className="text-[#546B41]" />,
    color: '#DCCCAC'
  },
  {
    id: 7,
    year: '1917 CE',
    title: "Champaran Satyagraha",
    description: "Mahatma Gandhi launched his very first Satyagraha (civil disobedience movement) in India from Champaran, Bihar. He rallied the indigo farmers against the oppressive British planters, igniting the mass independence movement.",
    icon: <Users size={32} className="text-[#546B41]" />,
    color: '#99AD7A'
  },
  {
    id: 8,
    year: '1974 CE',
    title: "The JP Movement",
    description: "Veteran leader Jayaprakash Narayan (Lok Nayak) launched the 'Total Revolution' from Patna to combat corruption and authoritarianism, which eventually led to the end of the Emergency period and reshaped modern Indian politics.",
    icon: <Flag size={32} className="text-[#DCCCAC]" />,
    color: '#546B41'
  }
];

export default function BiharHistoryTimeline() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div className="relative max-w-4xl mx-auto py-10 px-4">
      
      {/* Central Timeline Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-black z-0"></div>

      <div className="space-y-6">
        {historyData.map((event, index) => {
          const isEven = index % 2 === 0;
          const isHovered = hoveredNode === event.id;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
              onMouseEnter={() => setHoveredNode(event.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              
              {/* Timeline Center Node */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-2 border-black bg-white z-20 md:-ml-2 -ml-2 flex items-center justify-center transition-transform duration-300">
                <div className={`w-2 h-2 rounded-full ${isHovered ? 'bg-[#546B41]' : 'bg-black'}`}></div>
              </div>

              {/* Empty Space for the alternating layout on Desktop */}
              <div className="hidden md:block w-1/2 px-6"></div>

              {/* Content Card */}
              <div className="w-full pl-12 md:pl-6 md:w-1/2 md:px-6 z-10">
                <motion.div 
                  layout
                  className={`bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer overflow-hidden ${isHovered ? 'shadow-[6px_6px_0_0_rgba(0,0,0,1)] -translate-y-1 -translate-x-1 border-[#546B41]' : 'hover:border-[#546B41]'}`}
                >
                  <motion.div layout className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    >
                      {React.cloneElement(event.icon, { size: 18 })}
                    </div>
                    <div>
                      <motion.span layout className="inline-block px-2 py-0.5 bg-[#FFF8EC] border border-black text-black text-[10px] font-black uppercase tracking-wider rounded-md mb-1 shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                        {event.year}
                      </motion.span>
                      <motion.h3 layout className="text-lg font-black text-black uppercase tracking-tight leading-none">
                        {event.title}
                      </motion.h3>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 font-medium text-sm leading-relaxed border-t-2 border-dashed border-gray-200 pt-3">
                          {event.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
