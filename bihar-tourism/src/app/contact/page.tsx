'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { issueApi } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Shield, Siren, HeartPulse, Phone, Mail, MessageCircle,
  MapPin, Hospital, Building2, Hotel, Send, AlertTriangle,
  CheckCircle2, Clock, Loader2, ExternalLink, Lock
} from 'lucide-react';

export default function Contact() {
  const { user } = useAuth();
  const [issueForm, setIssueForm] = useState({ subject: '', category: 'Other', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [myIssues, setMyIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [nearbyQuery, setNearbyQuery] = useState('');
  const [nearbyType, setNearbyType] = useState('hospital');

  useEffect(() => {
    if (user) fetchMyIssues();
  }, [user]);

  const fetchMyIssues = async () => {
    setLoadingIssues(true);
    try {
      const res = await issueApi.getMyIssues();
      if (res.success) setMyIssues(res.data);
    } catch { }
    setLoadingIssues(false);
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to raise an issue'); return; }
    setSubmitting(true);
    try {
      await issueApi.create(issueForm);
      toast.success('Issue raised successfully!');
      setIssueForm({ subject: '', category: 'Other', message: '' });
      fetchMyIssues();
    } catch { toast.error('Failed to submit issue'); }
    setSubmitting(false);
  };

  const handleNearbySearch = () => {
    if (!nearbyQuery.trim()) { toast.error('Please enter your location'); return; }
    const q = encodeURIComponent(`${nearbyType} near ${nearbyQuery}, Bihar, India`);
    window.open(`https://www.google.com/maps/search/${q}`, '_blank');
  };

  const statusColor = (s: string) => {
    if (s === 'Open') return 'bg-yellow-400 text-black';
    if (s === 'In Progress') return 'bg-blue-500 text-white';
    if (s === 'Resolved') return 'bg-green-500 text-white';
    return 'bg-gray-400 text-white';
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] font-poppins text-black pt-28 pb-20">
      {/* Hero */}
      <section className="relative px-4 mb-20">
        <div className="max-w-7xl mx-auto h-[300px] relative rounded-3xl overflow-hidden bg-[#546B41] border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl md:text-7xl font-black text-[#FFF8EC] mb-3 tracking-tighter">
                CONTACT & HELP
              </h1>
              <p className="text-lg text-[#DCCCAC] font-bold uppercase tracking-widest">
                Emergency • Support • Safety
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-20">

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: EMERGENCY CONTACTS
        ═══════════════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-red-500 border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <Siren className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Emergency Contacts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, label: 'Police Assistance', number: '100', desc: 'Bihar Police 24/7', color: 'bg-blue-600' },
              { icon: Siren, label: 'Emergency SOS', number: '112', desc: 'National Emergency', color: 'bg-red-500' },
              { icon: HeartPulse, label: 'Medical Emergency', number: '108', desc: 'Ambulance Service', color: 'bg-green-600' },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={`tel:${item.number}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all group"
              >
                <div className={`w-14 h-14 ${item.color} border-2 border-black rounded-xl flex items-center justify-center mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">{item.label}</h3>
                <p className="text-[#546B41] font-bold text-sm mb-3">{item.desc}</p>
                <div className="text-4xl font-black text-black">{item.number}</div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: NEARBY HELP
        ═══════════════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#546B41] border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <MapPin className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Nearby Help</h2>
          </div>

          <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <p className="text-black font-bold mb-6">Enter your location to find nearby help services.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={nearbyQuery}
                onChange={(e) => setNearbyQuery(e.target.value)}
                placeholder="Enter your location (e.g. Patna, Gaya...)"
                className="flex-1 bg-[#FFF8EC] border-4 border-black rounded-xl p-4 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              />
              <button
                onClick={handleNearbySearch}
                className="bg-[#546B41] text-white border-4 border-black px-8 py-4 rounded-xl font-black uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'hospital', icon: Hospital, label: 'Hospitals', color: 'bg-red-400' },
                { type: 'police', icon: Building2, label: 'Police Stations', color: 'bg-blue-400' },
                { type: 'hotel', icon: Hotel, label: 'Hotels / Stay', color: 'bg-[#DCCCAC]' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => { setNearbyType(item.type); if (nearbyQuery) handleNearbySearch(); }}
                  className={`p-4 rounded-xl border-4 border-black font-black uppercase tracking-wider text-sm flex items-center gap-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all ${nearbyType === item.type ? item.color + ' text-black' : 'bg-white text-black'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: CONTACT ADMIN (RAISE ISSUE)
        ═══════════════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#DCCCAC] border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <Send className="text-black" size={24} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Contact Admin</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Issue Form */}
            <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Raise an Issue</h3>
              <p className="text-[#546B41] font-bold text-sm mb-6">Have a question, feedback, or criticism? Let us know.</p>

              {!user ? (
                <div className="bg-[#FFF8EC] border-4 border-black rounded-xl p-8 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <Lock className="mx-auto mb-3 text-[#546B41]" size={40} />
                  <p className="font-black text-lg mb-1">Login Required</p>
                  <p className="text-[#546B41] font-bold text-sm">Please login to raise an issue.</p>
                </div>
              ) : (
                <form onSubmit={handleIssueSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider mb-2">Subject</label>
                    <input
                      type="text" required
                      value={issueForm.subject}
                      onChange={(e) => setIssueForm({ ...issueForm, subject: e.target.value })}
                      className="w-full bg-[#FFF8EC] border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={issueForm.category}
                      onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                      className="w-full bg-[#FFF8EC] border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer"
                    >
                      {['Bug', 'Feedback', 'Criticism', 'Question', 'Suggestion', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      required rows={4}
                      value={issueForm.message}
                      onChange={(e) => setIssueForm({ ...issueForm, message: e.target.value })}
                      className="w-full bg-[#FFF8EC] border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] resize-none"
                    />
                  </div>
                  <button
                    type="submit" disabled={submitting}
                    className="w-full bg-[#546B41] text-[#FFF8EC] border-4 border-black py-4 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {submitting ? 'Submitting...' : 'Submit Issue'}
                  </button>
                </form>
              )}
            </div>

            {/* My Issues List */}
            <div className="bg-[#FFF8EC] p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">My Issues</h3>

              {!user ? (
                <p className="text-[#546B41] font-bold text-sm">Login to view your issues.</p>
              ) : loadingIssues ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#546B41]" size={32} /></div>
              ) : myIssues.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="mx-auto mb-3 text-[#99AD7A]" size={40} />
                  <p className="font-black">No issues raised yet.</p>
                  <p className="text-[#546B41] font-bold text-sm">Everything looks good!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {myIssues.map((issue: any) => (
                    <div key={issue._id} className="bg-white p-5 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-sm truncate flex-1">{issue.subject}</h4>
                        <span className={`text-xs font-black px-2 py-1 rounded-lg border border-black ${statusColor(issue.status)}`}>{issue.status}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-bold mb-2 line-clamp-2">{issue.message}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#546B41] uppercase tracking-widest">
                        <Clock size={12} />
                        {new Date(issue.createdAt).toLocaleDateString()}
                        <span className="bg-[#DCCCAC] text-black px-2 py-0.5 rounded-md border border-black">{issue.category}</span>
                      </div>
                      {issue.adminReply && (
                        <div className="mt-3 bg-[#FFF8EC] border-2 border-[#546B41] rounded-lg p-3">
                          <p className="text-xs font-black text-[#546B41] uppercase tracking-widest mb-1">Admin Reply</p>
                          <p className="text-sm font-bold text-black">{issue.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: QUICK CONTACT SERVICE
        ═══════════════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-black border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(84,107,65,1)]">
              <Phone className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Quick Contact Service</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.a href="tel:+916206500860"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#546B41] p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group"
            >
              <Phone className="text-[#DCCCAC] mb-4 group-hover:rotate-12 transition-transform" size={32} />
              <h3 className="text-lg font-black text-white uppercase mb-1">Call Support</h3>
              <p className="text-[#DCCCAC] font-bold text-sm">+91 6206500860</p>
            </motion.a>

            <motion.a href="mailto:singhabhishek021202@gmail.com"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-[#DCCCAC] p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group"
            >
              <Mail className="text-black mb-4 group-hover:rotate-12 transition-transform" size={32} />
              <h3 className="text-lg font-black text-black uppercase mb-1">Email Support</h3>
              <p className="text-black/70 font-bold text-sm break-all">singhabhishek021202@gmail.com</p>
            </motion.a>

            <motion.a href="https://wa.me/916206500860" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-green-500 p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group"
            >
              <MessageCircle className="text-white mb-4 group-hover:rotate-12 transition-transform" size={32} />
              <h3 className="text-lg font-black text-white uppercase mb-1">WhatsApp</h3>
              <p className="text-white/80 font-bold text-sm flex items-center gap-1">Live Chat <ExternalLink size={12} /></p>
            </motion.a>

            <motion.a href="https://t.me/+916206500860" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="bg-blue-500 p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group"
            >
              <Send className="text-white mb-4 group-hover:rotate-12 transition-transform" size={32} />
              <h3 className="text-lg font-black text-white uppercase mb-1">Telegram</h3>
              <p className="text-white/80 font-bold text-sm flex items-center gap-1">Live Chat <ExternalLink size={12} /></p>
            </motion.a>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5: SAFETY CONCERNS
        ═══════════════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="bg-black rounded-3xl p-10 md:p-14 border-4 border-[#546B41] shadow-[12px_12px_0_0_rgba(84,107,65,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-red-500 border-2 border-white rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(255,255,255,0.3)]">
                <AlertTriangle className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Safety Tips for Tourists</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Keep Emergency Numbers Saved', desc: 'Save 112, 100, and 108 on your phone before traveling.' },
                { title: 'Share Your Itinerary', desc: 'Always share your travel plan with family or friends.' },
                { title: 'Avoid Isolated Areas at Night', desc: 'Stick to well-lit, populated areas after dark.' },
                { title: 'Use Registered Transport', desc: 'Use only government-registered taxis and auto-rickshaws.' },
                { title: 'Carry Identification', desc: 'Always carry a valid ID and a copy of your hotel booking.' },
                { title: 'Stay Hydrated', desc: 'Bihar has a hot climate — carry water bottles and stay hydrated.' },
                { title: 'Respect Local Customs', desc: 'Be mindful of dress codes at religious sites.' },
                { title: 'Register with Tourism Dept', desc: 'Register your visit with the local tourism office for assistance.' },
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 bg-[#546B41] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-black text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-wider mb-1">{tip.title}</h4>
                    <p className="text-white/60 font-bold text-sm">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/5 border-2 border-[#DCCCAC]/30 rounded-2xl text-center">
              <p className="text-[#DCCCAC] font-black uppercase tracking-widest text-sm mb-2">
                Bihar is a safe destination for tourists
              </p>
              <p className="text-white/60 font-bold text-sm max-w-2xl mx-auto">
                The state government and local police are committed to ensuring the safety of all visitors. Tourist police units operate in major destinations.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
