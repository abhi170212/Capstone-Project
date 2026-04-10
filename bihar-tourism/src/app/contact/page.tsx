'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MapComponent from '@/components/MapComponent';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] font-poppins text-black pt-28">
      {/* Hero Section */}
      <section className="relative px-4 mb-20">
        <div className="max-w-7xl mx-auto h-[350px] relative rounded-3xl overflow-hidden shadow-2xl bg-[#546B41] border-4 border-[#DCCCAC] group">
          <div className="absolute inset-0 opacity-[0.2] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFF' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.2C91,-33.3,97.3,-16.6,98.1,0.5C98.9,17.6,94.2,35.2,84.1,50.1C74.1,65,58.7,77.3,42,83.8C25.3,90.3,7.3,91,-9.7,88C-26.7,85,-42.6,78.3,-56.9,67.8C-71.1,57.3,-83.7,43,-90.6,26.2C-97.4,9.4,-98.6,-9.9,-92.9,-27C-87.3,-44.1,-75,-59,-60.1,-66.5C-45.2,-74,-22.6,-74.1,-3.5,-68.2C15.6,-62.3,31.2,-60,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")` }} />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-[#FFF8EC] mb-4 tracking-tighter drop-shadow-2xl">
                SECURE COMMS
              </h1>
              <p className="text-xl md:text-2xl text-[#DCCCAC] max-w-2xl mx-auto font-medium tracking-widest uppercase">
                Establish a direct link to the central hub
              </p>
              <div className="w-32 h-1.5 bg-[#DCCCAC] mx-auto mt-6 rounded-full shadow-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-[#546B41]/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#546B41]"></div>
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">TRANSMIT DATA</h2>
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#FFF8EC] border-4 border-[#546B41] rounded-2xl p-8 text-center"
                >
                  <svg className="w-20 h-20 mx-auto text-[#546B41] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-3xl font-black text-black mb-2 uppercase">Packet Received</h3>
                  <p className="text-[#546B41] font-bold tracking-wide">Transmission logged. Awaiting agent processing.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-black text-black uppercase tracking-widest mb-2">
                      Operative Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-xl focus:border-[#546B41]/50 focus:bg-white focus:outline-none focus:shadow-inner transition-all font-semibold text-black"
                      placeholder="Ghost Protocol"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-black text-black uppercase tracking-widest mb-2">
                      Routing Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-xl focus:border-[#546B41]/50 focus:bg-white focus:outline-none focus:shadow-inner transition-all font-semibold text-black"
                      placeholder="link@mainframe.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-black text-black uppercase tracking-widest mb-2">
                      Secure Line
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-xl focus:border-[#546B41]/50 focus:bg-white focus:outline-none focus:shadow-inner transition-all font-semibold text-black"
                      placeholder="+91 Matrix..."
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-black text-black uppercase tracking-widest mb-2">
                      Signal Intent *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-xl focus:border-[#546B41]/50 focus:bg-white focus:outline-none focus:shadow-inner transition-all font-semibold text-black cursor-pointer"
                    >
                      <option value="">Select a protocol</option>
                      <option value="General Inquiry">General Intelligence</option>
                      <option value="Tour Planning">Vector Planning</option>
                      <option value="Accommodation">Safehouse Logistics</option>
                      <option value="Transportation">Transport Nodes</option>
                      <option value="Group Booking">Squadron Deployment</option>
                      <option value="Feedback">Debrief / Feedback</option>
                      <option value="Other">Unclassified</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-black text-black uppercase tracking-widest mb-2">
                      Encrypted Body *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-5 py-4 bg-[#FFF8EC] border-2 border-transparent rounded-xl focus:border-[#546B41]/50 focus:bg-white focus:outline-none focus:shadow-inner transition-all font-semibold text-black resize-none"
                      placeholder="Input encrypted data payload here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#546B41] text-[#FFF8EC] py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-[0_10px_20px_rgba(84,107,65,0.3)] hover:shadow-xl hover:-translate-y-1 block text-center"
                  >
                    Execute Transmission
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              {/* Contact Cards */}
              <div className="bg-white rounded-3xl shadow-xl p-10 border border-[#546B41]/10">
                <h2 className="text-4xl font-black text-black mb-8 tracking-tight">NODE DETAILS</h2>
                
                <div className="space-y-8">
                  {[
                    {
                      label: "Physical Architecture",
                      value: "Bihar Tourism Department\nPatna, Bihar 800001\nIndia",
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    },
                    {
                      label: "Digital Channels",
                      value: "info@bihartourism.gov.in\nsupport@bihartourism.gov.in",
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    },
                    {
                      label: "Voice Relays",
                      value: "+91 612 2222222\n+91 98765 43210 (Toll Free: 1800-123-4567)",
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    },
                    {
                      label: "Active Duty Cycles",
                      value: "Mon - Fri: 10:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Offline",
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    }
                  ].map((card, idx) => (
                    <div key={idx} className="flex items-start space-x-5 group">
                      <div className="flex-shrink-0 w-14 h-14 bg-[#546B41] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                        <svg className="w-7 h-7 text-[#DCCCAC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {card.icon}
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black text-black tracking-widest uppercase text-sm mb-1">{card.label}</h3>
                        <p className="text-gray-600 font-medium whitespace-pre-line leading-relaxed">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-black rounded-3xl shadow-2xl p-10 border-4 border-red-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <h2 className="text-3xl font-black text-white mb-6 flex items-center tracking-tight">
                  <svg className="w-8 h-8 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  CRITICAL ALERTS
                </h2>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-colors">
                    <span className="text-gray-300 font-bold uppercase tracking-wider text-sm">Law Enforcement</span>
                    <span className="text-red-500 font-black text-xl">100</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-colors">
                    <span className="text-gray-300 font-bold uppercase tracking-wider text-sm">Medical Response</span>
                    <span className="text-red-500 font-black text-xl">102</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-colors">
                    <span className="text-gray-300 font-bold uppercase tracking-wider text-sm">Fire Contingency</span>
                    <span className="text-red-500 font-black text-xl">101</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-colors">
                    <span className="text-gray-300 font-bold uppercase tracking-wider text-sm">Tourism Backup</span>
                    <span className="text-red-500 font-black text-xl">1363</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-[#FFF8EC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
              GEOGRAPHICAL <span className="text-[#546B41]">PING</span>
            </h2>
            <div className="w-32 h-1.5 bg-[#DCCCAC] mx-auto mt-4 mb-6 rounded-full shadow-lg"></div>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium">
              Initialize location protocol
            </p>
          </motion.div>
          
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#546B41]/10">
             <MapComponent height="500px" />
          </div>
        </div>
      </section>
    </div>
  );
}
