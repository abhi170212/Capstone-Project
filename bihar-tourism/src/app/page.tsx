'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import DestinationCard from '@/components/DestinationCard';
import ImageGallery from '@/components/ImageGallery';
import MapComponent from '@/components/MapComponent';
import Link from 'next/link';
import { featuredDestinations, destinations } from '@/data/destinations';

export default function Home() {
  const galleryImages = destinations.slice(0, 6).map(d => d.image);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most popular eco and cultural tourism destinations in Bihar
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/destinations"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Destinations →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Experience the Land of Enlightenment
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                Bihar, the ancient land where Lord Buddha attained enlightenment, offers a unique blend 
                of eco-tourism and cultural heritage. From the sacred Bodhi Tree in Bodh Gaya to the 
                pristine forests of Valmiki Tiger Reserve, discover destinations that will transform 
                your soul.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">10+</div>
                  <div className="text-sm">Tourist Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2</div>
                  <div className="text-sm">Tourism Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">∞</div>
                  <div className="text-sm">Memories Created</div>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-block px-8 py-4 bg-white text-green-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
              >
                Learn More About Bihar
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80"
                alt="Bihar Landscape"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 px-4 bg-gray-50">
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
              Discover tourist destinations across Bihar
            </p>
          </motion.div>
          <MapComponent destinations={destinations} height="500px" />
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ImageGallery images={galleryImages} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Begin Your Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-gray-300"
          >
            Plan your visit to Bihar and experience the perfect blend of nature and culture
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us for Planning
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
