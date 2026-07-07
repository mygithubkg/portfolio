"use client"
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Terminal, Crosshair, Sparkles, ArrowDown } from 'lucide-react';
import { useData } from '@/context/DataContext';
import Image from 'next/image';
export default function About() {
  const { data, loading } = useData();
  const timeline = data?.timeline || [];
  const techStack = data?.techStack || [];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-[#020202] text-gray-300 relative selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Ambient Noise / Texture overlay (optional, subtle effect) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-[80%] mx-auto px-6 py-24 md:py-32 relative z-10">

        {/* --- MASSIVE HERO TYPOGRAPHY --- */}
        <motion.div
          style={{ opacity }}
          className="mb-24 md:mb-32 flex flex-col items-center md:items-start"
        >
          <div className="flex items-center gap-3 text-cyan-500 font-mono text-sm tracking-[0.2em] uppercase mb-6">
            <Terminal size={16} />
            <span>Identity Verified</span>
            <span className="w-12 h-[1px] bg-cyan-500/50" />
          </div>
          <h1 className="sr-only">About Karrtik Gupta</h1>
          <h2 className="text-5xl md:text-8xl lg:text-[9rem] font-black text-white tracking-tighter leading-[0.85] uppercase">
            System <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-800">
              Architect.
            </span>
          </h2>
        </motion.div>

        {/* --- THE SPLIT LAYOUT --- */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

          {/* LEFT: STICKY IDENTITY CARD */}
          <div className="lg:w-1/3 relative">
            <div className="sticky top-32 space-y-8">
              {/* Profile Image Node */}
              <div className="group relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png"
                  alt="Karrtik Gupta"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Live Status Indicator */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-md bg-black/40 border border-white/10 rounded-full px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </div>
                    <span className="text-xs font-mono text-gray-300">SYSTEM_ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Bio Block */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Karrtik Gupta
                </h3>
                <div className="text-gray-400 text-base leading-relaxed space-y-4 font-light">
                  <p>
                    I bridge the gap between complex algorithms and scalable human experiences.
                  </p>
                  <p>
                    From engineering end-to-end NLP pipelines at <span className="text-white font-medium">IIIT Delhi</span> to architecting strategies for large-scale tech summits, I build systems that solve real problems.
                  </p>
                </div>
              </div>

              {/* Scroll prompt for desktop */}
              <div className="hidden lg:flex items-center gap-3 text-gray-600 font-mono text-sm pt-8 border-t border-white/5">
                <ArrowDown size={16} className="animate-bounce" />
                <span>Scroll to trace execution path</span>
              </div>
            </div>
          </div>

          {/* RIGHT: SCROLLING TIMELINE THREAD */}
          <div className="lg:w-2/3 relative">
            {loading ? (
              <div className="h-64 flex items-center justify-center text-cyan-500 font-mono animate-pulse">
                Fetching execution logs...
              </div>
            ) : (
              <div className="relative">
                {/* The continuous vertical thread line */}
                <div className="absolute top-0 bottom-0 left-[27px] w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <div className="space-y-12 lg:space-y-24">
                  {timeline.map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="relative pl-16 lg:pl-24"
                    >
                      {/* Timeline Node */}
                      <div className="absolute left-[24px] top-6 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                      <div className="absolute left-[15px] top-[15px] w-6 h-6 rounded-full border border-cyan-500/30 bg-black" />

                      {/* Content Card */}
                      <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all duration-500 relative overflow-hidden">

                        {/* Hover Gradient Effect */}
                        <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h4 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {item.title}
                            </h4>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 whitespace-nowrap">
                              <Crosshair size={12} />
                              {item.year}
                            </div>
                          </div>

                          <p className="text-cyan-500/80 text-sm font-mono mb-6 uppercase tracking-wider">
                            {item.place}
                          </p>

                          <div className="text-gray-400 leading-relaxed text-base">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- INFINITE TECH STACK MARQUEE --- */}
      <div className="relative mt-24 py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden flex items-center">
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#020202] to-transparent z-10" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#020202] to-transparent z-10" />

        <div className="flex items-center gap-4 px-6 absolute z-20 left-6 text-white/40">
          <Sparkles size={20} />
          <span className="font-mono text-sm tracking-widest uppercase hidden md:inline-block">Core Modules</span>
        </div>

        <motion.div
          className="flex gap-6 whitespace-nowrap pl-48"
          animate={{ x: [0, -1500] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {/* Double the array to create a seamless loop effect */}
          {[...(techStack || []), ...(techStack || [])].map((tech: any, i: number) => (
            <div
              key={i}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors cursor-default"
            >
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
