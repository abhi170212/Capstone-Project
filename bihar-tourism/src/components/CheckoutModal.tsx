'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalPrice: number;
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, cartItems, totalPrice, onSuccess }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      await api.post('/orders', {
        orderItems: cartItems.map(item => ({
          attire: item._id,
          name: item.name,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'Credit Card',
        totalPrice: totalPrice,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFF8EC] w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-[16px_16px_0_0_rgba(0,0,0,1)] border-4 border-black flex flex-col md:flex-row relative"
        >
          <button
            onClick={onClose}
            disabled={loading || success}
            className="absolute top-4 right-4 z-50 p-2 border-2 border-black bg-[#DCCCAC] hover:bg-[#99AD7A] rounded-xl text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>

          {success ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8EC] p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="bg-[#99AD7A] p-4 rounded-full border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8">
                  <CheckCircle size={80} className="text-black" />
                </div>
              </motion.div>
              <h2 className="text-5xl font-black text-black uppercase tracking-tight mb-4">Payment Successful!</h2>
              <p className="text-[#546B41] font-bold text-xl">Your order has been placed successfully. Returning to store...</p>
            </div>
          ) : (
            <>
              {/* Left Side: Order Summary */}
              <div className="w-full md:w-2/5 bg-[#DCCCAC] p-8 md:p-10 border-r-4 border-black overflow-y-auto custom-scrollbar">
                <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-8 bg-white border-2 border-black w-fit px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">Order Summary</h3>
                <div className="space-y-6 mb-8">
                  {cartItems.map((item, idx) => (
                    <div key={`${item._id}-${idx}`} className="flex gap-4 items-center bg-white p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border-2 border-black" />
                        <span className="absolute -top-2 -right-2 bg-[#546B41] text-[#FFF8EC] border-2 border-black text-xs font-black w-6 h-6 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-base font-black text-black uppercase tracking-tight truncate">{item.name}</h4>
                        <p className="text-xs text-[#546B41] font-bold mt-1 uppercase">Size: {item.selectedSize}</p>
                      </div>
                      <span className="text-lg font-black text-black">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-[#FFF8EC] border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] space-y-4">
                  <div className="flex justify-between text-sm font-bold text-black uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-black uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className="text-[#546B41]">Free</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-black mt-4 pt-4 border-t-4 border-black">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Checkout Form */}
              <div className="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto custom-scrollbar bg-white">
                <div className="flex items-center gap-2 text-black mb-8 font-black uppercase tracking-widest text-sm bg-[#99AD7A] border-2 border-black w-fit px-4 py-2 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <ShieldCheck size={18} /> Secure Encrypted Checkout
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-[#FFF8EC] border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <h4 className="text-lg font-black text-black uppercase tracking-widest mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <input type="text" required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" />
                      <input type="email" required placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" />
                    </div>
                  </div>

                  <div className="bg-[#FFF8EC] border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <h4 className="text-lg font-black text-black uppercase tracking-widest mb-4">Shipping Address</h4>
                    <div className="space-y-4">
                      <input type="text" required placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" />
                        <input type="text" required placeholder="Postal Code" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFF8EC] border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <h4 className="text-lg font-black text-black uppercase tracking-widest mb-4">Payment Details</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <input type="text" required placeholder="Card Number" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 pl-12 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" maxLength={19} />
                        <CreditCard size={20} className="absolute left-4 top-3.5 text-black" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="MM / YY" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" maxLength={5} />
                        <input type="password" required placeholder="CVC" value={formData.cvc} onChange={e => setFormData({...formData, cvc: e.target.value})} className="w-full bg-white border-2 border-black rounded-xl p-3 font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#99AD7A] transition-all" maxLength={4} />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-[#FFF8EC] border-4 border-black font-black uppercase tracking-widest py-5 rounded-2xl shadow-[8px_8px_0_0_rgba(84,107,65,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : `Pay ₹${totalPrice}`}
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
