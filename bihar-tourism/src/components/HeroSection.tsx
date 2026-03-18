'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sliderImages = [
  "https://unsplash.com/photos/mPKCK5AcPVo/download", // Image 1 (Green grass on lake, user specified)
  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&q=80", // Image 2 (Heritage - Working)
  "https://images.pexels.com/photos/2444403/pexels-photo-2444403.jpeg", // Image 3 (Culture fixed)
  "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg"  // Image 4 (Nature/Tradition fixed)
];

export default function HeroSection({ 
  title = "Discover the Magic of Bihar", 
  subtitle = "Experience eco-tourism and cultural heritage in the land of enlightenment"
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden bg-black">
      {/* Background Image Slider */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={sliderImages[currentIndex]}
          alt={`Bihar Culture Image ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-md"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-sm"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/destinations"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Destinations
            </a>
            <a
              href="/about"
              className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
