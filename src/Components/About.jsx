import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-16 md:py-24 text-[#ECEFF1]"
      style={{ backgroundImage: "url('/backgroundimage.jpg')" }} // update with actual path
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-[#00B0FF]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 leading-relaxed px-2 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Hi! I'm <span className="font-semibold text-white">Karrtik</span>, a full-stack web developer and AI enthusiast currently pursuing B.Tech in ECE with a minor in AI at PEC Chandigarh. I specialize in building scalable web applications and smart AI solutions using modern technologies. Whether it's crafting responsive UIs or training predictive models, I love turning ideas into real-world tech experiences. Let’s build something impactful together!
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            'React',
            'Node.js',
            'JavaScript',
            'Tailwind CSS',
            'Firebase',
            'MySQL',
            'MongoDB',
            'Git',
            'GitHub',
            'Scikit-learn',
            'NumPy',
            'Pandas',
            'Matplotlib',
            'Azure AI',
          ].map((tech, idx) => (
            <span
              key={idx}
              className="bg-[#00B0FF] text-white px-4 py-2 text-sm sm:text-base rounded-full font-semibold shadow-md hover:bg-[#0288D1] transition"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
