'use client';

import { motion } from 'framer-motion';
import ImageGallery from '@/components/ImageGallery';
import PanoramaViewer from '@/components/PanoramaViewer';
import FamousPersonalities from '@/components/FamousPersonalities';

export default function About() {
  return (
    <div className="min-h-screen bg-[#FFF8EC] font-poppins text-black pt-28">
      <section className="relative px-4 mb-20">
        <div className="max-w-7xl mx-auto h-[400px] md:h-[600px] relative rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-[#546B41]">
          {/* Background Video */}
          <div className="absolute inset-0 w-[150%] h-[150%] md:w-full md:h-[180%] -left-[25%] -top-[25%] md:left-0 md:-top-[40%] pointer-events-none">
            <iframe
              src="https://www.youtube.com/embed/yGp_o04GYF8?autoplay=1&mute=1&controls=0&loop=1&playlist=yGp_o04GYF8&modestbranding=1&rel=0&playsinline=1"
              title="Bihar Tourism Background"
              className="w-full h-full object-cover opacity-80"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">
                BIHAR
              </h1>
              <p className="text-xl md:text-2xl text-[#DCCCAC] max-w-2xl mx-auto font-medium tracking-widest uppercase drop-shadow-md">
                Discovering the land where civilization began
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-black mb-8 tracking-tight">
                Welcome to <span className="text-[#546B41]">Bihar</span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-black font-medium leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-[#546B41]/10 border-l-4 border-l-[#546B41]">
                  Bihar, one of the world's oldest continuously inhabited regions, is a land of profound
                  spiritual significance and natural beauty. This is where Lord Buddha attained enlightenment,
                  where Mahavira preached his message of non-violence, and where ancient universities like
                  Nalanda attracted scholars from across the globe.
                </p>
                <p className="text-lg text-black font-medium leading-relaxed">
                  Our Smart Digital Platform for Eco & Cultural Tourism aims to showcase the incredible
                  diversity of Bihar - from its pristine wildlife sanctuaries and tiger reserves to its
                  sacred pilgrimage sites and archaeological wonders.
                </p>
                <p className="text-lg text-[#546B41] font-bold leading-relaxed tracking-wide">
                  Whether you seek spiritual enlightenment, adventure in nature, or a journey through
                  history, Bihar offers an experience that will transform your understanding of India's
                  rich heritage.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
            >
              <PanoramaViewer />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 text-white pointer-events-none z-20">
                <p className="font-black tracking-widest text-[#DCCCAC] uppercase text-sm drop-shadow-md">360° Matrix Projection</p>
                <p className="font-medium text-xs mt-1 text-white/80 drop-shadow-md">Click and drag to explore the landscape.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-4 bg-[#546B41] relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-4 bg-black"></div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#DCCCAC] opacity-[0.05] rounded-full mix-blend-overlay group-hover:scale-150 transition-transform duration-1000" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-[#DCCCAC] rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-[#546B41] -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-5xl font-black mb-8 text-[#FFF8EC] tracking-tighter">OUR MISSION</h2>
            <p className="text-2xl text-[#DCCCAC] leading-relaxed max-w-4xl mx-auto font-medium">
              To promote sustainable tourism that preserves Bihar's natural and cultural heritage
              while providing authentic experiences that benefit local communities and create
              lasting memories for visitors.
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-4 bg-black"></div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
              WHY CHOOSE <span className="text-[#546B41]">BIHAR</span>?
            </h2>
            <div className="w-32 h-1.5 bg-[#DCCCAC] mx-auto mt-4 mb-6 rounded-full shadow-lg"></div>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium">
              Experience the perfect blend of nature, culture, and spirituality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Rich Biodiversity',
                description: 'Home to diverse flora and fauna including Bengal tigers, elephants, and rare bird species'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: 'Ancient Heritage',
                description: 'Archaeological sites dating back thousands of years with UNESCO World Heritage potential'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
                title: 'Spiritual Significance',
                description: 'Sacred destination for Buddhists, Jains, Sikhs, and Hindus from around the world'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Pristine Nature',
                description: 'Untouched forests, wildlife sanctuaries, and natural landscapes waiting to be explored'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Timeless Traditions',
                description: 'Living culture and traditions that have been preserved for millennia'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Warm Hospitality',
                description: 'Experience the legendary warmth and hospitality of the people of Bihar'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:border-[#546B41] border-2 border-transparent transition-all group"
              >
                <div className="w-16 h-16 bg-[#546B41] text-[#DCCCAC] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">{feature.icon}</div>
                <h3 className="text-2xl font-black text-black mb-3 tracking-tight group-hover:text-[#546B41] transition-colors">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Famous Personalities Section */}
      <FamousPersonalities />

      {/* Gallery Section */}
      <section className="py-32 px-4 bg-[#FFF8EC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
              VISUAL <span className="text-[#546B41]">DOCUMENTATION</span>
            </h2>
            <div className="w-32 h-1.5 bg-[#DCCCAC] mx-auto mt-4 mb-6 rounded-full shadow-lg"></div>
          </div>
          <ImageGallery />
        </div>
      </section>
    </div>
  );
}
