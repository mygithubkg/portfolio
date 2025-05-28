import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.section
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-8 py-20 bg-cover bg-center"
      style={{ backgroundImage: "url('/your-background.png')" }} // Use your actual background path here
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Overlay for darkened effect */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
        <motion.div
          className="space-y-6 text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Hello! I'm <span className="text-[#00B0FF]">Karrtik Gupta</span>,
          </h1>
          <p className="text-2xl text-gray-200">Web Designer & Developer Enthusiast</p>
          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <motion.button
              className="border border-[#00B0FF] text-[#00B0FF] px-6 py-3 rounded-lg hover:bg-[#00B0FF] hover:text-white transition"
              whileHover={{ scale: 1.05 }}
            >
              View Projects
            </motion.button>
            <motion.button
              className="border border-[#00B0FF] text-[#00B0FF] px-6 py-3 rounded-lg hover:bg-[#00B0FF] hover:text-white transition"
              whileHover={{ scale: 1.05 }}
            >
              WhatsApp
            </motion.button>
          </div>
        </motion.div>

        <motion.img
          src="/karrtik.png"
          alt="Profile"
          className="w-64 rounded-full shadow-xl ring-4 ring-[#00B0FF] ring-offset-2 ring-offset-black"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.section>
  );
}
