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
      className="min-h-screen relative"
      style={{
        background: 'var(--bg-hero)',
        color: 'var(--ink)',
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-60"
        style={{ background: 'var(--accent-dim)' }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-30"
        style={{ background: 'rgba(139, 92, 246, 0.08)' }}
      />

      <div className="w-[90%] md:w-[80%] mx-auto px-4 md:px-6 py-24 md:py-32 relative z-10">

        {/* --- MASSIVE HERO TYPOGRAPHY --- */}
        <motion.div
          style={{ opacity }}
          className="mb-16 md:mb-32 flex flex-col items-center md:items-start"
        >
          <div
            className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] uppercase mb-6"
            style={{ color: 'var(--accent)' }}
          >
            <Terminal size={16} />
            <span>Identity Verified</span>
            <span className="w-12 h-[1px]" style={{ background: 'var(--accent-rule)' }} />
          </div>
          <h1 className="sr-only">About Karrtik Gupta</h1>
          <h2
            className="text-[13vw] md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] uppercase"
            style={{ color: 'var(--ink)' }}
          >
            System <br />
            <span style={{ color: 'var(--ink-faint)' }}>
              Architect.
            </span>
          </h2>
        </motion.div>

        {/* --- THE SPLIT LAYOUT --- */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">

          {/* LEFT: STICKY IDENTITY CARD */}
          <div className="lg:w-1/3 relative">
            <div className="lg:sticky lg:top-32 space-y-8">

              {/* Profile Image */}
              <div
                className="group relative w-40 h-40 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <Image
                  src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png"
                  alt="Karrtik Gupta"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Live Status Indicator */}
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-md rounded-full px-4 py-2"
                  style={{
                    background: 'rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: 'var(--accent)' }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ background: 'var(--accent)' }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-300">SYSTEM_ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Bio Block */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                  Karrtik Gupta
                </h3>
                <div className="text-base leading-relaxed space-y-4 font-light" style={{ color: 'var(--ink-dim)' }}>
                  <p>I bridge the gap between complex algorithms and scalable human experiences.</p>
                  <p>
                    From engineering end-to-end NLP pipelines at{' '}
                    <span style={{ color: 'var(--ink)', fontWeight: 500 }}>IIIT Delhi</span>{' '}
                    to architecting strategies for large-scale tech summits, I build systems that solve real problems.
                  </p>
                </div>
              </div>

              {/* Scroll prompt — desktop */}
              <div
                className="hidden lg:flex items-center gap-3 font-mono text-sm pt-8"
                style={{ color: 'var(--ink-faint)', borderTop: '1px solid var(--border-card)' }}
              >
                <ArrowDown size={16} className="animate-bounce" />
                <span>Scroll to trace execution path</span>
              </div>
            </div>
          </div>

          {/* RIGHT: SCROLLING TIMELINE */}
          <div className="lg:w-2/3 relative">
            {loading ? (
              <div
                className="h-64 flex items-center justify-center font-mono animate-pulse"
                style={{ color: 'var(--accent)' }}
              >
                Fetching execution logs...
              </div>
            ) : (
              <div className="relative">
                {/* Timeline thread line */}
                <div
                  className="absolute top-0 bottom-0 left-[27px] w-[2px]"
                  style={{ background: 'linear-gradient(to bottom, transparent, var(--rule-strong), transparent)' }}
                />

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
                      <div
                        className="absolute left-[24px] top-6 w-2 h-2 rounded-full"
                        style={{
                          background: 'var(--accent)',
                          boxShadow: '0 0 15px var(--accent-glow)',
                        }}
                      />
                      <div
                        className="absolute left-[15px] top-[15px] w-6 h-6 rounded-full"
                        style={{
                          border: '1px solid var(--accent-rule)',
                          background: 'var(--bg-hero)',
                        }}
                      />

                      {/* Content Card */}
                      <div
                        className="group rounded-3xl p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                        style={{
                          background: 'var(--bg-pill)',
                          border: '1px solid var(--border-card)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--rule)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule-strong)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--bg-pill)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)';
                        }}
                      >
                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h4
                              className="text-xl md:text-2xl font-bold transition-colors"
                              style={{ color: 'var(--ink)' }}
                            >
                              {item.title}
                            </h4>
                            <div
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap"
                              style={{
                                background: 'var(--bg-pill)',
                                border: '1px solid var(--border-card)',
                                color: 'var(--ink-dim)',
                              }}
                            >
                              <Crosshair size={12} />
                              {item.year}
                            </div>
                          </div>

                          <p
                            className="text-sm font-mono mb-6 uppercase tracking-wider"
                            style={{ color: 'var(--accent)' }}
                          >
                            {item.place}
                          </p>

                          <div
                            className="leading-relaxed text-base"
                            style={{ color: 'var(--ink-dim)' }}
                          >
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
      <div
        className="relative mt-16 md:mt-24 py-12 overflow-hidden flex items-center"
        style={{
          borderTop: '1px solid var(--border-card)',
          borderBottom: '1px solid var(--border-card)',
          background: 'var(--bg-raised)',
        }}
      >
        <div
          className="absolute left-0 w-32 h-full z-10"
          style={{ background: 'linear-gradient(to right, var(--bg-hero), transparent)' }}
        />
        <div
          className="absolute right-0 w-32 h-full z-10"
          style={{ background: 'linear-gradient(to left, var(--bg-hero), transparent)' }}
        />

        <div
          className="flex items-center gap-4 px-6 absolute z-20 left-6"
          style={{ color: 'var(--ink-faint)' }}
        >
          <Sparkles size={20} />
          <span className="font-mono text-sm tracking-widest uppercase hidden md:inline-block">
            Core Modules
          </span>
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
          {[...(techStack || []), ...(techStack || [])].map((tech: any, i: number) => (
            <div
              key={i}
              className="inline-flex items-center px-6 py-3 rounded-full font-medium cursor-default transition-colors"
              style={{
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-card)',
                color: 'var(--ink-dim)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)';
                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-rule)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-pill)';
                (e.currentTarget as HTMLElement).style.color = 'var(--ink-dim)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)';
              }}
            >
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
