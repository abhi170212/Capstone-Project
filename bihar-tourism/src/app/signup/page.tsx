'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const pingLocations = [
  { name: 'Patna Matrix', top: '45%', left: '35%' },
  { name: 'Bodh Gaya Core', top: '70%', left: '42%' },
  { name: 'Rajgir Sector', top: '62%', left: '50%' },
  { name: 'Nalanda Archive', top: '55%', left: '54%' },
  { name: 'Vaishali Region', top: '38%', left: '43%' },
  { name: 'Bhagalpur Node', top: '48%', left: '78%' },
];

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

interface PasswordRequirement {
  key: string;
  label: string;
  test: (pw: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { key: 'minLength', label: `At least ${PASSWORD_MIN_LENGTH} characters`, test: (pw) => pw.length >= PASSWORD_MIN_LENGTH },
  { key: 'maxLength', label: `Maximum ${PASSWORD_MAX_LENGTH} characters`, test: (pw) => pw.length > 0 && pw.length <= PASSWORD_MAX_LENGTH },
  { key: 'uppercase', label: 'One uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lowercase', label: 'One lowercase letter (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { key: 'number', label: 'One number (0-9)', test: (pw) => /[0-9]/.test(pw) },
  { key: 'special', label: 'One special character (!@#$%...)', test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
];

const strengthLevels = [
  { label: 'Too Weak', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' },
  { label: 'Weak', color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' },
  { label: 'Fair', color: '#eab308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)' },
  { label: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)' },
  { label: 'Strong', color: '#DCCCAC', bg: 'rgba(220,204,172,0.15)', border: 'rgba(220,204,172,0.4)' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Compute password strength
  const passwordAnalysis = useMemo(() => {
    const results = passwordRequirements.map((req) => ({
      ...req,
      passed: req.test(password),
    }));
    const passedCount = results.filter((r) => r.passed).length;
    const total = results.length;
    const allPassed = passedCount === total;

    // Strength index: 0-4
    let strengthIndex = 0;
    if (passedCount >= 2) strengthIndex = 1;
    if (passedCount >= 3) strengthIndex = 2;
    if (passedCount >= 5) strengthIndex = 3;
    if (allPassed) strengthIndex = 4;

    const percentage = (passedCount / total) * 100;

    return { results, passedCount, total, allPassed, strengthIndex, percentage };
  }, [password]);

  const currentStrength = strengthLevels[passwordAnalysis.strengthIndex];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordAnalysis.allPassed) {
      setError('Please meet all password requirements before signing up.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
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
              SIGN <span className="text-[#546B41]">UP</span>
            </h2>
            <p className="mt-4 text-sm font-medium tracking-widest uppercase text-[#DCCCAC]">
              Create your Bihar Travel account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
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
                <label className="block text-xs font-black text-[#546B41] uppercase tracking-widest mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-[#FFF8EC] placeholder-white/20 focus:outline-none focus:border-[#DCCCAC] focus:bg-white/10 transition-all font-medium backdrop-blur-sm"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    maxLength={PASSWORD_MAX_LENGTH}
                    className="w-full px-5 py-4 pr-14 bg-white/5 border-2 border-white/10 rounded-2xl text-[#FFF8EC] placeholder-white/20 focus:outline-none focus:border-[#DCCCAC] focus:bg-white/10 transition-all font-medium backdrop-blur-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  {/* Show/Hide Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#DCCCAC] transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.243 4.243l2.829 2.829M6.343 6.343l11.314 11.314M14.121 14.121A3 3 0 009.879 9.879" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Character Count */}
                {password.length > 0 && (
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: currentStrength.color }}>
                      {currentStrength.label}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wider ${password.length > PASSWORD_MAX_LENGTH ? 'text-red-400' : 'text-white/30'}`}>
                      {password.length}/{PASSWORD_MAX_LENGTH}
                    </span>
                  </div>
                )}

                {/* Strength Meter Bar */}
                {password.length > 0 && (
                  <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${passwordAnalysis.percentage}%`,
                        backgroundColor: currentStrength.color,
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      style={{
                        boxShadow: `0 0 10px ${currentStrength.color}40`,
                      }}
                    />
                  </div>
                )}

                {/* Password Requirements Checklist */}
                <AnimatePresence>
                  {(passwordFocused || password.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 rounded-xl overflow-hidden"
                      style={{
                        backgroundColor: currentStrength.bg,
                        border: `1px solid ${password.length > 0 ? currentStrength.border : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <div className="p-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">
                          Password Requirements
                        </p>
                        {passwordAnalysis.results.map((req) => (
                          <motion.div
                            key={req.key}
                            className="flex items-center gap-2.5"
                            initial={false}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                              animate={{
                                backgroundColor: req.passed ? currentStrength.color : 'rgba(255,255,255,0.08)',
                                scale: req.passed ? [1, 1.2, 1] : 1,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {req.passed ? (
                                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              )}
                            </motion.div>
                            <span
                              className="text-[11px] font-semibold tracking-wider transition-colors duration-200"
                              style={{ color: req.passed ? currentStrength.color : 'rgba(255,255,255,0.35)' }}
                            >
                              {req.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !passwordAnalysis.allPassed}
                className="w-full py-5 bg-[#546B41] text-[#FFF8EC] rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#DCCCAC] hover:text-black transition-all duration-300 shadow-[0_10px_30px_rgba(84,107,65,0.4)] hover:shadow-[0_15px_40px_rgba(220,204,172,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 text-sm mt-4"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
            
            <div className="text-center pt-6 border-t border-white/10 mt-8">
              <span className="text-xs font-medium text-white/50 tracking-widest uppercase">
                Already have an account?{' '}
              </span>
              <Link href="/login" className="text-xs font-black text-[#DCCCAC] hover:text-white transition-colors tracking-widest uppercase pb-1 border-b-2 border-[#DCCCAC]/30 hover:border-white">
                Log In
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
