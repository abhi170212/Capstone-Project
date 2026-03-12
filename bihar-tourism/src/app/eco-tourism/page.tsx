'use client';

import { motion } from 'framer-motion';
import DestinationCard from '@/components/DestinationCard';
import MapComponent from '@/components/MapComponent';
import HeroSection from '@/components/HeroSection';
import { ecoTourismDestinations } from '@/data/destinations';

export default function EcoTourism() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Custom Hero */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=1600&q=80"
            alt="Eco Tourism"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Eco Tourism in Bihar
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Immerse yourself in nature's bounty. Explore wildlife sanctuaries, tiger reserves, 
              and pristine forests that showcase Bihar's rich biodiversity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-green-50 rounded-2xl"
            >
              <div className="text-5xl font-bold text-green-600 mb-4">5+</div>
              <div className="text-lg text-gray-700 font-semibold">Wildlife Sanctuaries</div>
              <p className="text-gray-600 mt-2">Protected natural habitats</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-blue-50 rounded-2xl"
            >
              <div className="text-5xl font-bold text-blue-600 mb-4">100+</div>
              <div className="text-lg text-gray-700 font-semibold">Bird Species</div>
              <p className="text-gray-600 mt-2">Diverse avian population</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-purple-50 rounded-2xl"
            >
              <div className="text-5xl font-bold text-purple-600 mb-4">50+</div>
              <div className="text-lg text-gray-700 font-semibold">Mammal Species</div>
              <p className="text-gray-600 mt-2">Including endangered species</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Eco Tourism Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover Bihar's natural wonders and wildlife havens
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecoTourismDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore on Map
            </h2>
            <p className="text-xl text-gray-600">
              Locate all eco-tourism destinations across Bihar
            </p>
          </motion.div>
          <MapComponent destinations={ecoTourismDestinations} height="500px" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-700 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Connect with Nature
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-white/90"
          >
            Experience the thrill of wildlife safaris, bird watching, and nature treks in Bihar's pristine wilderness
          </motion.p>
        </div>
      </section>
    </div>
  );
}
