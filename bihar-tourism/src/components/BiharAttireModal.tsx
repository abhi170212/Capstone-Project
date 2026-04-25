'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Loader2, ArrowLeft, Plus, Minus, Trash2, Shirt, MapPin } from 'lucide-react';
import api from '@/lib/api';
import CheckoutModal from './CheckoutModal';
import { useAuth } from '@/context/AuthContext';

interface BiharAttireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Attire {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  stock: number;
  image: string;
  sizes: string[];
}

interface CartItem extends Attire {
  selectedSize: string;
  quantity: number;
}

export default function BiharAttireModal({ isOpen, onClose }: BiharAttireModalProps) {
  const { user } = useAuth();
  const [attires, setAttires] = useState<Attire[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Views
  const [activeLocation, setActiveLocation] = useState<string>('All');
  const [selectedAttire, setSelectedAttire] = useState<Attire | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Selection
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isOpen && attires.length === 0) {
      fetchAttires();
    }
  }, [isOpen]);

  const fetchAttires = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attires');
      setAttires(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const locations = ['All', ...Array.from(new Set(attires.map(a => a.location)))];
  const filteredAttires = attires.filter(a => activeLocation === 'All' ? true : a.location === activeLocation);

  const handleAddToCart = () => {
    if (!selectedAttire || !selectedSize) return;
    
    const existingIndex = cart.findIndex(
      item => item._id === selectedAttire._id && item.selectedSize === selectedSize
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...selectedAttire, selectedSize, quantity: 1 }]);
    }
    
    setSelectedSize('');
    setSelectedAttire(null);
    setShowCart(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setShowCart(false);
    setCart([]);
  };

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
                <Shirt size={24} className="text-black" />
              </div>
              <span className="text-2xl font-black text-black uppercase tracking-tight">Bihar Threads</span>
            </div>

            <div className="hidden md:flex gap-4 font-black uppercase tracking-wider text-sm overflow-x-auto custom-scrollbar px-6 py-4 max-w-[60%]">
              {locations.map(loc => (
                <button 
                  key={loc}
                  onClick={() => { setActiveLocation(loc); setSelectedAttire(null); }} 
                  className={`px-6 py-3 rounded-2xl border-4 border-black whitespace-nowrap transition-all flex-shrink-0 ${
                    activeLocation === loc 
                      ? 'bg-[#546B41] text-[#FFF8EC] shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                      : 'bg-[#DCCCAC] text-black hover:bg-[#99AD7A] shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => setShowCart(true)} className="relative hover:scale-110 transition-transform">
                <ShoppingBag size={28} className="text-black" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#546B41] text-[#FFF8EC] border-2 border-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full">
                    {cart.reduce((a,b) => a+b.quantity, 0)}
                  </span>
                )}
              </button>
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
                  onClick={() => { setActiveLocation(loc); setSelectedAttire(null); }} 
                  className={`px-6 py-3 rounded-2xl border-4 border-black whitespace-nowrap flex-shrink-0 transition-all ${
                    activeLocation === loc 
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
            ) : selectedAttire ? (
              /* Product Detail View */
              <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 max-w-6xl mx-auto">
                <button 
                  onClick={() => { setSelectedAttire(null); setSelectedSize(''); }}
                  className="absolute top-6 md:top-12 left-6 md:left-12 flex items-center gap-2 font-black uppercase tracking-widest text-sm text-black hover:text-[#546B41] transition-colors z-10 bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                
                <div className="w-full md:w-1/2 mt-16 md:mt-0">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
                    <img 
                      src={selectedAttire.image} 
                      alt={selectedAttire.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-center py-4">
                  <div className="flex gap-2 mb-4">
                    <div className="inline-block bg-[#DCCCAC] border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="text-black font-black tracking-widest text-xs uppercase">{selectedAttire.location}</span>
                    </div>
                    <div className="inline-block bg-[#99AD7A] border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-2">
                      <span className="text-black font-black tracking-widest text-xs uppercase">{selectedAttire.category}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tight mb-4 leading-none">{selectedAttire.name}</h1>
                  <p className="text-3xl font-black text-[#546B41] mb-8">₹{selectedAttire.price}</p>
                  
                  <p className="text-black text-lg mb-10 leading-relaxed font-bold bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    {selectedAttire.description}
                  </p>
                  
                  <div className="mb-10 bg-[#FFF8EC] border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
                      <span className="text-xl font-black tracking-wider text-black uppercase">Select Size</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {selectedAttire.sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-16 h-16 rounded-xl font-black text-lg flex items-center justify-center transition-all border-4 border-black ${
                            selectedSize === size 
                              ? 'bg-[#546B41] text-[#FFF8EC] shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                              : 'bg-white text-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:bg-[#DCCCAC] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className={`py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all flex items-center justify-center gap-3 border-4 border-black ${
                      selectedSize 
                        ? 'bg-[#546B41] text-[#FFF8EC] shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                    }`}
                  >
                    <ShoppingBag size={24} /> Add to Bag
                  </button>
                </div>
              </div>
            ) : (
              /* Product Grid */
              <div className="p-6 md:p-12 max-w-7xl mx-auto">
                <div className="mb-12 border-l-8 border-[#546B41] pl-6">
                  <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
                    {activeLocation === 'All' ? 'Threads of Bihar' : `Attires of ${activeLocation}`}
                  </h2>
                  <p className="text-[#546B41] font-bold text-lg mt-2">Premium traditional attires tailored to cultural heritage.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAttires.map((attire) => (
                    <div 
                      key={attire._id}
                      onClick={() => setSelectedAttire(attire)}
                      className="group cursor-pointer flex flex-col bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all overflow-hidden"
                    >
                      <div className="relative aspect-[3/4] border-b-4 border-black overflow-hidden bg-white">
                        <img 
                          src={attire.image} 
                          alt={attire.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4 bg-[#DCCCAC] border-2 border-black px-3 py-1 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-1 text-black font-black uppercase text-xs tracking-wider">
                          <MapPin size={12} /> {attire.location}
                        </div>
                        <div className="absolute top-4 right-4 bg-[#99AD7A] border-2 border-black w-8 h-8 rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-xs">
                          {attire.category === 'Male' ? 'M' : attire.category === 'Female' ? 'F' : 'U'}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 group-hover:bg-[#FFF8EC] transition-colors">
                        <h3 className="text-xl font-black text-black uppercase truncate mb-1">{attire.name}</h3>
                        <p className="text-[#546B41] font-bold mt-1 text-lg">₹{attire.price}</p>
                      </div>
                    </div>
                  ))}
                  {filteredAttires.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                      <Shirt size={64} className="text-gray-300 mb-4" />
                      <p className="text-2xl font-black text-gray-500 uppercase tracking-widest">No attires found for this region.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Drawer Overlay */}
          <AnimatePresence>
            {showCart && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowCart(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
                />
                <motion.div 
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute top-0 right-0 h-full w-full md:w-[450px] bg-[#FFF8EC] border-l-4 border-black z-50 flex flex-col shadow-[-16px_0_0_0_rgba(0,0,0,1)]"
                >
                  <div className="p-6 border-b-4 border-black flex items-center justify-between bg-white">
                    <h3 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                      Your Bag
                    </h3>
                    <button onClick={() => setShowCart(false)} className="p-2 border-2 border-black bg-[#DCCCAC] hover:bg-[#99AD7A] rounded-xl text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                      <div className="text-center text-black mt-32 flex flex-col items-center">
                        <ShoppingBag size={64} className="mb-6 opacity-30" />
                        <p className="text-2xl font-black uppercase tracking-tight">Your bag is empty.</p>
                        <button onClick={() => setShowCart(false)} className="mt-8 text-black border-2 border-black bg-[#99AD7A] px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      cart.map((item, index) => (
                        <div key={`${item._id}-${item.selectedSize}`} className="flex gap-4 bg-white p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative">
                          <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-black">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col flex-1 py-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black uppercase tracking-tight text-black text-lg pr-8 leading-tight">{item.name}</h4>
                            </div>
                            <span className="text-sm font-bold text-[#546B41] mb-2 uppercase tracking-wider">Size: <span className="text-black">{item.selectedSize}</span></span>
                            <span className="font-black text-black mb-auto text-xl">₹{item.price}</span>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <button onClick={() => updateQuantity(index, -1)} className="p-2 border-2 border-black bg-white rounded-lg hover:bg-[#DCCCAC] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-black"><Minus size={14} /></button>
                              <span className="font-black text-lg w-4 text-center text-black">{item.quantity}</span>
                              <button onClick={() => updateQuantity(index, 1)} className="p-2 border-2 border-black bg-white rounded-lg hover:bg-[#DCCCAC] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-black"><Plus size={14} /></button>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(index)} 
                            className="absolute top-4 right-4 p-2 bg-red-400 border-2 border-black rounded-lg text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 border-t-4 border-black bg-white">
                    <div className="space-y-3 mb-6 bg-[#FFF8EC] border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center text-sm font-bold text-black uppercase tracking-wider">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-black uppercase tracking-wider">
                        <span>Shipping</span>
                        <span className="text-[#546B41]">Free</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t-2 border-black mt-2">
                        <span className="text-xl font-black uppercase tracking-tight text-black">Total</span>
                        <span className="text-2xl font-black text-black">₹{cartTotal}</span>
                      </div>
                    </div>
                    <button 
                      disabled={cart.length === 0}
                      onClick={() => {
                        if (!user) {
                          alert("Please log in to checkout.");
                          return;
                        }
                        setShowCheckout(true);
                      }}
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all border-4 border-black ${
                        cart.length > 0
                          ? 'bg-[#546B41] text-[#FFF8EC] shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                      }`}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)}
        cartItems={cart}
        totalPrice={cartTotal}
        onSuccess={handleCheckoutSuccess}
      />
    </AnimatePresence>
  );
}
