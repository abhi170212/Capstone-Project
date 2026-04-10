'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function HeroSection() {
  const images = [
    "/hero-images/1.png",
    "/hero-images/2.png",
    "/hero-images/3.png",
    "/hero-images/4.png",
    "/hero-images/5.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: [
        { element: '#nav-links', popover: { title: 'Navigation', description: 'Navigate the entire application from here.', side: "bottom", align: 'start' }},
        { element: '#hero-explore', popover: { title: 'Destinations', description: 'Start browsing our curated destinations instantly.', side: "bottom", align: 'start' }},
        { element: '#featured-destinations', popover: { title: 'Featured', description: 'Check out our top rated spots tailored for your eco and cultural tourism journey.', side: "top", align: 'start' }},
        { element: '#interactive-map', popover: { title: 'Interactive Map', description: 'Pinpoint historical locations natively on our interactive map.', side: "top", align: 'start' }},
        { element: '#image-gallery', popover: { title: 'Image Gallery', description: 'Browse stunning photography from across the region.', side: "top", align: 'start' }}
      ]
    });
    driverObj.drive();
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image Slider with fixed attachment */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          aria-label={`Slide ${currentIndex + 1}`}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-8 md:px-16 py-12 max-w-4xl mx-auto bg-[#FFF8EC]/40 backdrop-blur-sm rounded-3xl border border-[#FFF8EC]/50 shadow-xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight"
          >
            Discover the Magic of Bihar
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto font-medium"
          >
            Experience eco-tourism and cultural heritage in the land of enlightenment
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row flex-wrap gap-4 justify-center items-center"
          >
            <a
              id="hero-explore"
              href="/destinations"
              className="px-6 py-2.5 bg-[#DCCCAC] text-black rounded-full font-bold text-sm tracking-wide hover:bg-[#99AD7A] transition-colors shadow-none hover:-translate-y-0.5"
            >
              Explore Destinations
            </a>
            <a
              href="/about"
              className="px-6 py-2.5 bg-[#FFF8EC] text-black border border-[#546B41] rounded-full font-semibold text-sm tracking-wide hover:bg-[#DCCCAC] transition-colors shadow-none hover:-translate-y-0.5"
            >
              Learn More
            </a>
            <button
              onClick={startTour}
              className="px-6 py-2.5 bg-[#546B41] text-[#FFF8EC] border-none rounded-full font-bold text-sm tracking-wide hover:bg-[#99AD7A] transition-colors shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              Learn to Use
            </button>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-[#546B41]' : 'w-2 bg-[#99AD7A]'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-[#546B41] rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-3 bg-[#546B41] rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
