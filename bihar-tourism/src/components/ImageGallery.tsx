'use client';

import { motion } from 'framer-motion';

interface ImageGalleryProps {
  images?: string[];
  title?: string;
}

export default function ImageGallery({ 
  images = [
    "/destinations/bodh_gaya.png",
    "/destinations/nalanda.png",
    "/destinations/rajgir.png",
    "/destinations/vaishali.png",
    "/destinations/vikramshila.png",
    "/destinations/patna_sahib.png",
  ],
  title = "Explore Bihar's Beauty"
}: ImageGalleryProps) {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative h-64 overflow-hidden rounded-xl shadow-lg cursor-pointer group"
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">View Destination</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
