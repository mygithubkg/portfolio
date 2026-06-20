import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, History, User, Code, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function About() {
  const { data, loading } = useData();
  const timeline = data?.timeline || [];
  const techStack = data?.techStack || [];

  const [expandedLog, setExpandedLog] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const toggleLog = (index) => {
    setExpandedLog(expandedLog === index ? null : index);
  };

  return (
    <section className="min-h-screen py-24 bg-[#030303] text-gray-300 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center md:items-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
            <User size={12} />
            <span>IDENTITY_VERIFIED // DEV_001</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            THE ARCHITECT.
          </h2>
        </motion.div>

        {/* --- BENTO BOX GRID --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          {/* BENTO ITEM 1: The Bio */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-[#0a0a0b] border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu size={120} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight max-w-xl relative z-10">
              I don't just write code; <br />
              <span className="text-cyan-400">I engineer systems.</span>
            </h3>
            <div className="space-y-4 text-gray-400 max-w-xl relative z-10 text-sm md:text-base leading-relaxed">
              <p>
                My journey began at <strong className="text-white">PEC Chandigarh</strong>, bridging Electronics and Communication with a rigorous specialization in Artificial Intelligence.
              </p>
              <p>
                From directing technical strategy for 2,000-person tech summits to architecting end-to-end NLP pipelines for complex scientific research at IIIT Delhi, I thrive in environments requiring precision and scalability. I believe technology is only as good as the complex problems it solves.
              </p>
            </div>
          </motion.div>

          {/* BENTO ITEM 2: Profile Image */}
          <motion.div variants={itemVariants} className="bg-[#0a0a0b] border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:border-cyan-500/30 transition-colors group">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-900 mb-4">
              <img
                src="/karrtik.png"
                alt="Karrtik Gupta"
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
            <div className="flex justify-between items-center font-mono text-xs px-2">
              <div>
                <p className="text-white font-bold">KARRTIK GUPTA</p>
                <p className="text-gray-500">STATUS: ONLINE</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            </div>
          </motion.div>

          {/* BENTO ITEM 3: Tech Arsenal */}
          <motion.div variants={itemVariants} className="md:col-span-3 bg-gradient-to-r from-[#0a0a0b] to-[#0d0d12] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 flex items-center gap-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Code size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold tracking-wide">TECHNICAL</h4>
                <p className="text-xs font-mono text-gray-500">ARSENAL</p>
              </div>
            </div>

            <div className="flex-grow flex flex-wrap gap-3">
              {loading ? (
                <div className="text-gray-500 text-sm animate-pulse">Loading core modules...</div>
              ) : (
                techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm font-medium hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50 transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))
              )}
            </div>
          </motion.div>

          {/* --- REDESIGNED TIMELINE ACCORDION --- */}
          <motion.div variants={itemVariants} className="md:col-span-3 mt-8">
            <div className="flex items-center gap-3 mb-8">
              <History className="text-cyan-500" size={20} />
              <h3 className="text-2xl font-bold text-white">System Logs</h3>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-10">Fetching timeline data...</div>
            ) : (
              <div className="relative border-l border-white/10 ml-4 space-y-4 max-w-4xl">
                {timeline.map((item, index) => {
                  const isActive = expandedLog === index;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="relative pl-8"
                    >
                      {/* Animated Timeline Node */}
                      <motion.div
                        animate={{
                          backgroundColor: isActive ? '#490cb9ff' : '#030303',
                          borderColor: isActive ? '#06d425ff' : '#374151',
                          scale: isActive ? 1.3 : 1,
                          boxShadow: isActive ? '0 0 12px rgba(66, 167, 20, 0.6)' : '0 0 0px rgba(0,0,0,0)'
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full border-2"
                      />

                      {/* Accordion Card Container */}
                      <motion.div
                        layout
                        className={`rounded-xl overflow-hidden transition-all duration-300 ${isActive
                          ? 'bg-[#121212] border border-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.04)]'
                          : 'bg-[#0a0a0b] border border-white/5 hover:border-white/10 hover:bg-[#0f0f0f]'
                          }`}
                      >
                        {/* Interactive Header */}
                        <motion.button
                          layout
                          onClick={() => toggleLog(index)}
                          className="w-full text-left p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group cursor-pointer"
                        >
                          <div>
                            <span className="font-mono text-cyan-500 text-xs tracking-wider mb-2 block">
                              {item.year}
                            </span>
                            <h4 className={`text-lg font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                              }`}>
                              {item.title}
                            </h4>
                            <span className="text-sm text-gray-500 font-medium">
                              {item.place}
                            </span>
                          </div>

                          <motion.div
                            animate={{ rotate: isActive ? 180 : 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                            className={`p-2 rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400'
                              }`}
                          >
                            <ChevronDown size={18} />
                          </motion.div>
                        </motion.button>

                        {/* Animated Expanded Content */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="px-5 pb-5 pt-0">
                                <div className="p-4 bg-black/40 border border-white/5 rounded-lg text-sm md:text-base text-gray-400 leading-relaxed shadow-inner">
                                  {item.desc}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}