'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Utensils, Shirt } from 'lucide-react';
import BiharMusicPlayer from './BiharMusicPlayer';
import BiharAttireModal from './BiharAttireModal';
import BiharFoodModal from './BiharFoodModal';

export default function CultureShowcase() {
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showAttireModal, setShowAttireModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);

  const cards = [
    {
      id: 'songs',
      title: 'Songs of Bihar',
      description: 'Experience the soulful traditional folk music and Chhath songs.',
      icon: <Music2 size={32} className="text-[#DCCCAC]" />,
      bg: 'bg-[#546B41]',
      textColor: 'text-[#FFF8EC]',
      border: 'border-black',
      onClick: () => setShowMusicModal(true)
    },
    {
      id: 'foods',
      title: 'Cuisine of Bihar',
      description: 'Discover Litti Chokha, Khaja, and the rich culinary heritage.',
      icon: <Utensils size={32} className="text-black" />,
      bg: 'bg-[#DCCCAC]',
      textColor: 'text-black',
      border: 'border-black',
      onClick: () => setShowFoodModal(true)
    },
    {
      id: 'dress',
      title: 'Attires of Bihar',
      description: 'Explore Bhagalpuri silk, traditional sarees, and ethnic wear.',
      icon: <Shirt size={32} className="text-black" />,
      bg: 'bg-[#99AD7A]',
      textColor: 'text-black',
      border: 'border-black',
      onClick: () => setShowAttireModal(true)
    }
  ];

  return (
    <>
      <section className="bg-[#FFF8EC] py-16 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-4">
              Explore Our Culture
            </h2>
            <p className="text-lg text-[#546B41] font-medium max-w-2xl mx-auto">
              Immerse yourself in the vibrant heritage of Bihar through its music, food, and traditional attire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={card.onClick}
                className={`${card.bg} ${card.border} border-4 rounded-3xl p-8 cursor-pointer shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[0_12px_0_0_rgba(0,0,0,1)] transition-all group overflow-hidden relative`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  {React.cloneElement(card.icon as React.ReactElement<any>, { size: 120 })}
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center mb-6 border border-black/20">
                    {card.icon}
                  </div>
                  <h3 className={`text-2xl font-black ${card.textColor} uppercase tracking-wider mb-3`}>
                    {card.title}
                  </h3>
                  <p className={`${card.textColor} opacity-90 font-medium leading-relaxed mb-6 flex-grow`}>
                    {card.description}
                  </p>
                  
                  <div className="mt-auto">
                    <span className={`inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest ${card.textColor} group-hover:underline underline-offset-4`}>
                      Explore Now →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Music Modal */}
      <BiharMusicPlayer 
        isOpen={showMusicModal} 
        onClose={() => setShowMusicModal(false)} 
      />

      <BiharAttireModal
        isOpen={showAttireModal}
        onClose={() => setShowAttireModal(false)}
      />

      {/* Food Modal */}
      <BiharFoodModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
      />
    </>
  );
}
