import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <motion.section
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-8 py-20 bg-cover bg-center"
      style={{ backgroundImage: "url('/your-background.png')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Overlay for darkened effect */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
        <motion.div
          className="space-y-6 text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            Hello! I'm <span className="text-[#00B0FF] animate-pulse">Karrtik Gupta</span>,
          </h1>
          <p className="text-2xl text-gray-300 font-medium">
            Creative Web Designer & Full-Stack Developer Enthusiast
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <Link to="/projects">
              <motion.button
                className="bg-[#00B0FF] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#039be5] transition"
                whileHover={{ scale: 1.05 }}
              >
                View Projects
              </motion.button>
            </Link>
            
              <Link to="/contact">
              <motion.button
                className="border border-[#00B0FF] text-[#00B0FF] px-6 py-3 rounded-lg font-semibold hover:bg-[#00B0FF] hover:text-white transition"
                whileHover={{ scale: 1.05 }}
              >
                Connect With Me
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.img
          src="/karrtik.png"
          alt="Profile"
          className="w-64 h-64 object-cover rounded-full shadow-xl ring-4 ring-[#00B0FF] ring-offset-4 ring-offset-black hover:scale-105 transition-transform duration-300"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.section>
  );
}