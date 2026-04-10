'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

const pingLocations = [
  { name: 'Patna Matrix', top: '45%', left: '35%' },
  { name: 'Bodh Gaya Core', top: '70%', left: '42%' },
  { name: 'Rajgir Sector', top: '62%', left: '50%' },
  { name: 'Nalanda Archive', top: '55%', left: '54%' },
  { name: 'Vaishali Region', top: '38%', left: '43%' },
  { name: 'Bhagalpur Node', top: '48%', left: '78%' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black font-poppins text-white overflow-hidden">
      {/* Visual Map Side (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-[55%] relative group">
        <div className="absolute inset-0 bg-[#546B41]/10 z-10 pointer-events-none"></div>
        <img 
          src="/bihar_tactical_map.png" 
          alt="Tactical Map" 
          className="w-full h-full object-cover opacity-60 saturate-50 contrast-125 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10 pointer-events-none"></div>

        {/* Dynamic Pings */}
        {pingLocations.map((loc, idx) => (
          <motion.div 
            key={idx} 
            className="absolute flex flex-col items-center group/ping z-20" 
            style={{ top: loc.top, left: loc.left }}
          >
            <motion.div 
              animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }} 
              transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.4 }}
              className="absolute w-8 h-8 bg-[#DCCCAC] rounded-full blur-md"
            />
            <div className="relative w-4 h-4 bg-[#DCCCAC] rounded-full shadow-[0_0_15px_#DCCCAC] border-2 border-black flex items-center justify-center cursor-crosshair">
               <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
            {/* Tooltip */}
            <span className="mt-3 text-[11px] font-black tracking-widest uppercase text-[#DCCCAC] opacity-0 group-hover/ping:opacity-100 transition-opacity bg-black/80 px-3 py-1.5 rounded-md border border-[#546B41] pointer-events-none whitespace-nowrap shadow-xl">
              {loc.name}
            </span>
          </motion.div>
        ))}

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 z-20">
          <Link href="/" className="block group cursor-pointer">
            <h2 className="text-4xl font-black tracking-tighter text-[#FFF8EC] drop-shadow-md opacity-90 group-hover:text-[#DCCCAC] transition-colors">
              BIHAR TRAVEL
            </h2>
            <div className="w-20 h-1 bg-[#DCCCAC] mt-2 shadow-[0_0_10px_#DCCCAC] group-hover:w-full transition-all duration-300"></div>
          </Link>
          <p className="mt-4 text-[#546B41] font-bold text-xs uppercase tracking-[0.2em]">Travel the mother of civilizations</p>
        </div>
      </div>

      {/* Authentication Form Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 xl:p-24 relative z-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#546B41]/20 via-black to-black -z-10 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-[#FFF8EC]">
              LOGIN
            </h2>
            <p className="mt-4 text-sm font-medium tracking-widest uppercase text-[#DCCCAC]">
              Access your Bihar Travel account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/40 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase text-center backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-[#546B41] uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-[#FFF8EC] placeholder-white/20 focus:outline-none focus:border-[#DCCCAC] focus:bg-white/10 transition-all font-medium backdrop-blur-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#546B41] uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-[#FFF8EC] placeholder-white/20 focus:outline-none focus:border-[#DCCCAC] focus:bg-white/10 transition-all font-medium backdrop-blur-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#546B41] text-[#FFF8EC] rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#DCCCAC] hover:text-black transition-all duration-300 shadow-[0_10px_30px_rgba(84,107,65,0.4)] hover:shadow-[0_15px_40px_rgba(220,204,172,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 text-sm mt-4"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            
            <div className="text-center pt-6 border-t border-white/10 mt-8">
              <span className="text-xs font-medium text-white/50 tracking-widest uppercase">
                Don't have an account?{' '}
              </span>
              <Link href="/signup" className="text-xs font-black text-[#DCCCAC] hover:text-white transition-colors tracking-widest uppercase pb-1 border-b-2 border-[#DCCCAC]/30 hover:border-white">
                Sign Up
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
