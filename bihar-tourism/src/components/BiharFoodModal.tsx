'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Utensils, MapPin, ArrowLeft, BookOpen, Store } from 'lucide-react';
import api from '@/lib/api';

interface Shop {
  name: string;
  address: string;
}

interface Food {
  _id: string;
  name: string;
  description: string;
  location: string;
  ingredients: string[];
  recipe: string;
  famousShops: Shop[];
  image: string;
}

interface BiharFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BiharFoodModal({ isOpen, onClose }: BiharFoodModalProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  // Views
  const [activeLocation, setActiveLocation] = useState<string>('All');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  useEffect(() => {
    if (isOpen && foods.length === 0) {
      fetchFoods();
    }
  }, [isOpen]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const locations = ['All', ...Array.from(new Set(foods.map(f => f.location)))];
  const filteredFoods = foods.filter(f => activeLocation === 'All' ? true : f.location === activeLocation);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFF8EC] w-full max-w-7xl h-full md:h-[90vh] md:rounded-3xl overflow-hidden shadow-[16px_16px_0_0_rgba(0,0,0,1)] border-0 md:border-4 border-black flex flex-col relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-black bg-white z-20 sticky top-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#99AD7A] border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center">
                <Utensils size={24} className="text-black" />
              </div>
              <span className="text-2xl font-black text-black uppercase tracking-tight">Bihar Cuisines</span>
            </div>

            <div className="hidden md:flex gap-4 font-black uppercase tracking-wider text-sm overflow-x-auto custom-scrollbar px-6 py-4 max-w-[60%]">
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => { setActiveLocation(loc); setSelectedFood(null); }}
                  className={`px-6 py-3 rounded-2xl border-4 border-black whitespace-nowrap transition-all flex-shrink-0 ${activeLocation === loc
                      ? 'bg-[#546B41] text-[#FFF8EC] shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-[#DCCCAC] text-black hover:bg-[#99AD7A] shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                    }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <button onClick={onClose} className="p-2 border-2 border-black bg-[#DCCCAC] hover:bg-[#99AD7A] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none rounded-xl text-black transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto relative bg-[#FFF8EC]">
            {/* Mobile Tabs */}
            <div className="md:hidden flex gap-4 py-6 px-6 border-b-4 border-black font-black uppercase tracking-wider text-sm bg-white overflow-x-auto custom-scrollbar">
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => { setActiveLocation(loc); setSelectedFood(null); }}
                  className={`px-6 py-3 rounded-2xl border-4 border-black whitespace-nowrap flex-shrink-0 transition-all ${activeLocation === loc
                      ? 'bg-[#546B41] text-[#FFF8EC] shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-[#DCCCAC] text-black hover:bg-[#99AD7A] shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                    }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-16 h-16 text-[#546B41] animate-spin" />
              </div>
            ) : selectedFood ? (
              /* Detail View */
              <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-5/12 flex flex-col">
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="mb-6 flex w-fit items-center gap-2 font-black uppercase tracking-widest text-sm text-black hover:text-[#546B41] transition-colors bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  >
                    <ArrowLeft size={16} /> Back to grid
                  </button>

                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white mb-8">
                    <img
                      src={selectedFood.image}
                      alt={selectedFood.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="bg-[#99AD7A] border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight mb-4 flex items-center gap-2">
                      <Store size={20} /> Famous Shops
                    </h3>
                    <div className="space-y-4">
                      {selectedFood.famousShops.length > 0 ? (
                        selectedFood.famousShops.map((shop, i) => (
                          <div key={i} className="bg-white border-2 border-black rounded-xl p-3">
                            <p className="font-black text-black text-lg">{shop.name}</p>
                            <p className="font-bold text-[#546B41] text-sm">{shop.address}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-black font-bold italic">No famous shops listed.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-7/12 flex flex-col py-2">
                  <div className="inline-block bg-[#DCCCAC] border-2 border-black px-4 py-2 rounded-xl w-fit mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-2">
                    <MapPin size={16} />
                    <span className="text-black font-black tracking-widest text-sm uppercase">{selectedFood.location}</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tight mb-6 leading-none">{selectedFood.name}</h1>

                  <p className="text-black text-lg mb-10 leading-relaxed font-bold bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    {selectedFood.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#FFF8EC] border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                      <h3 className="text-xl font-black text-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2 flex items-center gap-2">
                        <Utensils size={20} /> Ingredients
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-black font-bold">
                        {selectedFood.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:col-span-2">
                      <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2 flex items-center gap-2">
                        <BookOpen size={24} /> Recipe / Preparation
                      </h3>
                      <p className="text-black font-bold whitespace-pre-line leading-relaxed">
                        {selectedFood.recipe}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Grid */
              <div className="p-6 md:p-12 max-w-7xl mx-auto">
                <div className="mb-12 border-l-8 border-[#546B41] pl-6">
                  <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
                    {activeLocation === 'All' ? 'Culinary Heritage' : `Cuisines of ${activeLocation}`}
                  </h2>
                  <p className="text-[#546B41] font-bold text-lg mt-2">Discover the authentic flavors of Bihar.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFoods.map((food) => (
                    <div
                      key={food._id}
                      onClick={() => setSelectedFood(food)}
                      className="group cursor-pointer flex flex-col bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all overflow-hidden"
                    >
                      <div className="relative aspect-video border-b-4 border-black overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-[#DCCCAC] border-2 border-black px-3 py-1 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-1 text-black font-black uppercase text-xs tracking-wider">
                          <MapPin size={12} /> {food.location}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-2 line-clamp-1">{food.name}</h3>
                        <p className="text-gray-700 font-bold line-clamp-2 mb-4">{food.description}</p>

                        <div className="mt-auto pt-4 border-t-2 border-black flex justify-between items-center">
                          <span className="text-[#546B41] font-black uppercase text-sm tracking-wider">View Recipe</span>
                          <span className="bg-[#99AD7A] text-black border-2 border-black w-8 h-8 rounded-full flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] group-hover:bg-[#546B41] group-hover:text-white transition-colors">
                            <ArrowLeft size={16} className="rotate-180" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredFoods.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                      <Utensils size={64} className="text-gray-300 mb-4" />
                      <p className="text-2xl font-black text-gray-500 uppercase tracking-widest">No cuisines found for this location.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
