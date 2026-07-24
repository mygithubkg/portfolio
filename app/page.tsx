"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { FaReact, FaNodeJs, FaPython, FaBrain, FaCloud, FaLayerGroup } from 'react-icons/fa';
import { SiOpenai, SiTailwindcss, SiFirebase, SiExpress } from 'react-icons/si';
import { ArrowRight, TerminalSquare, Cpu, GitMerge, ChevronRight } from 'lucide-react';

// --- AUTHENTIC DATA: TECH STACK ---
const techStack = [
  { icon: <SiOpenai />, name: 'Gemini API', color: '#10a37f' },
  { icon: <FaReact />, name: 'React 18', color: '#61dafb' },
  { icon: <FaNodeJs />, name: 'Node.js', color: '#8cc84b' },
  { icon: <FaPython />, name: 'Python', color: '#3776ab' },
  { icon: <SiExpress />, name: 'Express.js', color: '#888' },
  { icon: <SiFirebase />, name: 'Firebase', color: '#ffca28' },
  { icon: <SiTailwindcss />, name: 'Tailwind', color: '#38bdf8' },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // --- 3D MOUSE TRACKING FOR TERMINAL (Desktop Only) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 30, stiffness: 200 });

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative overflow-hidden font-sans"
      style={{ background: 'var(--bg-hero)', color: 'var(--ink)' }}
    >

      {/* ==================== SECTOR 1: CINEMATIC HERO ==================== */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
      >
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-60"
          style={{ background: 'var(--accent-dim)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-40"
          style={{ background: 'rgba(59, 130, 246, 0.06)' }} />

        {/* ── MOBILE HERO (visible only on small screens) ── */}
        <div className="md:hidden w-full px-5 pt-28 pb-36 flex flex-col gap-6 relative z-10">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full w-fit"
            style={{
              border: '1px solid var(--border-nav)',
              background: 'var(--bg-pill)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: 'var(--accent)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: 'var(--accent)' }} />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--accent)' }}>
              SYS_ONLINE // DEV_READY
            </span>
          </motion.div>

          {/* Mobile profile card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-4 p-4 rounded-3xl"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-card)',
            }}
          >
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: '2px solid var(--border-card)' }}>
              <Image
                src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png"
                alt="Karrtik Gupta"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <p className="font-bold text-base leading-tight" style={{ color: 'var(--ink)' }}>
                Karrtik Gupta
              </p>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                Full-Stack &amp; AI Engineer
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-faint)' }}>
                Punjab Engineering College
              </p>
            </div>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[11.5vw] leading-[0.92] font-black tracking-tighter uppercase"
            style={{ color: 'var(--ink)' }}
          >
            Architecting{' '}
            <span className="block" style={{ color: 'var(--ink-faint)' }}>
              Intelligence.
            </span>
          </motion.h1>

          {/* Sub text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="text-base leading-relaxed font-light"
            style={{ color: 'var(--ink-dim)' }}
          >
            Building scalable ecosystems and intelligent agents. Bridging the gap between unstructured data and{' '}
            <span style={{ color: 'var(--ink)', fontWeight: 500 }}>structured engineering</span>.
          </motion.p>

          {/* Mobile CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="flex flex-col gap-3 pt-2"
          >
            <Link
              href="/projects"
              className="group flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-all"
              style={{ background: 'var(--ink)', color: 'var(--ink-invert)' }}
            >
              VIEW SYSTEMS
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-all"
              style={{
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-card)',
                color: 'var(--ink)',
              }}
            >
              <TerminalSquare size={16} />
              INITIALIZE CONTACT
            </Link>
          </motion.div>

          {/* Mobile mini tech strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.34 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {techStack.slice(0, 5).map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--ink-dim)',
                }}
              >
                <span style={{ color: tech.color }}>{tech.icon}</span>
                {tech.name}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── DESKTOP HERO (visible only on md+) ── */}
        <div className="hidden md:grid w-[85%] mx-auto relative z-10 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* --- LEFT: Typography & Actions --- */}
          <div className="lg:col-span-7 space-y-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full w-fit"
              style={{
                border: '1px solid var(--border-nav)',
                background: 'var(--bg-pill)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: 'var(--accent)' }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: 'var(--accent)' }} />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}>
                SYS_ONLINE // DEV_READY
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] uppercase"
              style={{ color: 'var(--ink)' }}
            >
              Architecting <br />
              <span style={{ color: 'var(--ink-faint)' }}>
                Intelligence.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl max-w-xl font-light leading-relaxed"
              style={{ color: 'var(--ink-dim)' }}
            >
              Building scalable ecosystems and intelligent agents. Bridging the gap between unstructured data and{' '}
              <span style={{ color: 'var(--ink)', fontWeight: 500 }}>structured engineering</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Link
                href="/projects"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm transition-all active:scale-[0.97]"
                style={{ background: 'var(--ink)', color: 'var(--ink-invert)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ink)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-invert)'; }}
              >
                VIEW SYSTEMS
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm transition-all active:scale-[0.97]"
                style={{
                  background: 'var(--bg-pill)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--ink)',
                }}
              >
                <TerminalSquare size={16} />
                INITIALIZE CONTACT
              </Link>
            </motion.div>
          </div>

          {/* --- RIGHT: 3D Holographic Terminal --- */}
          <div className="hidden lg:block lg:col-span-5 relative h-[600px]">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="absolute inset-4 rounded-3xl blur-2xl"
                style={{ background: 'var(--accent-dim)', transform: 'translateZ(-50px)' }}
              />
              <div
                className="w-full h-full max-h-[500px] backdrop-blur-2xl rounded-3xl p-6 shadow-2xl overflow-hidden relative flex flex-col"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-nav)',
                  transform: 'translateZ(50px)',
                }}
              >
                <div className="flex gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-card)' }}>
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="font-mono text-[13px] leading-[1.8] flex-1">
                  <p><span className="text-purple-400">const</span> <span className="text-yellow-200">Architect</span> <span className="text-purple-400">=</span> <span className="text-blue-400">new</span> <span className="text-teal-300">System</span>({'{'}</p>
                  <p className="pl-6" style={{ color: 'var(--ink-dim)' }}>identity: <span className="text-green-400">'Karrtik Gupta'</span>,</p>
                  <p className="pl-6" style={{ color: 'var(--ink-dim)' }}>role: <span className="text-green-400">'Full-Stack &amp; AI Engineer'</span>,</p>
                  <p className="pl-6" style={{ color: 'var(--ink-dim)' }}>modules: [</p>
                  <p className="pl-12 text-green-400">'Next.js', 'React',</p>
                  <p className="pl-12 text-green-400">'Node.js', 'Python',</p>
                  <p className="pl-12 text-green-400">'LangChain', 'RAG'</p>
                  <p className="pl-6" style={{ color: 'var(--ink-dim)' }}>],</p>
                  <p className="pl-6" style={{ color: 'var(--ink-dim)' }}>status: <span className="text-blue-400">await</span> <span className="text-yellow-200">deploy</span>()</p>
                  <p style={{ color: 'var(--ink-dim)' }}>{'}'});</p>
                  <br />
                  <p className="animate-pulse" style={{ color: 'var(--ink-faint)' }}>root@karrtik:~# executing setup...</p>
                </div>
                <div className="absolute bottom-0 right-0 w-48 h-48 opacity-20 grayscale mix-blend-screen pointer-events-none">
                  <Image src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png" alt="Profile Ghost" width={400} height={400} className="w-full h-full object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==================== SECTOR 2: INFINITE TECH TICKER ==================== */}
      <section
        className="overflow-hidden py-4 md:py-6 relative flex items-center"
        style={{
          borderTop: '1px solid var(--border-card)',
          borderBottom: '1px solid var(--border-card)',
          background: 'var(--bg-ticker)',
        }}
      >
        <div
          className="absolute left-0 w-16 md:w-32 h-full z-10"
          style={{ background: 'linear-gradient(to right, var(--bg-hero), transparent)' }}
        />
        <div
          className="absolute right-0 w-16 md:w-32 h-full z-10"
          style={{ background: 'linear-gradient(to left, var(--bg-hero), transparent)' }}
        />

        <motion.div
          className="flex gap-12 md:gap-16 whitespace-nowrap px-4 md:px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...techStack, ...techStack].map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-3 transition-colors duration-300 group cursor-default"
              style={{ color: 'var(--ink-faint)' }}
            >
              <span
                className="text-xl md:text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300"
                style={{ color: tech.color }}
              >
                {tech.icon}
              </span>
              <span className="font-mono text-xs md:text-sm tracking-widest uppercase">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ==================== SECTOR 3: BENTO APP CAROUSEL ==================== */}
      <section className="py-20 md:py-32 relative">
        <div className="w-full md:w-[85%] mx-auto px-5 md:px-0">

          <div className="mb-8 md:mb-16 flex items-end justify-between">
            <div>
              <h3
                className="text-[10px] md:text-sm font-mono tracking-widest uppercase mb-2 md:mb-4"
                style={{ color: 'var(--accent)' }}
              >
                Core Modules
              </h3>
              <h2
                className="text-3xl md:text-5xl font-bold tracking-tight"
                style={{ color: 'var(--ink)' }}
              >
                Technical Arsenal.
              </h2>
            </div>
            {/* Mobile Swipe Indicator */}
            <div
              className="md:hidden flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest"
              style={{ color: 'var(--ink-faint)' }}
            >
              Swipe <ChevronRight size={12} />
            </div>
          </div>

          {/*
            Mobile: Horizontal swipe carousel
            Desktop: Bento grid
          */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Bento Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:col-span-2 rounded-3xl md:rounded-[2rem] p-8 md:p-12 group transition-all relative overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-rule)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)'}
            >
              <div
                className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700"
                style={{ color: 'var(--ink)' }}
              >
                <FaBrain size={120} />
              </div>
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8"
                style={{ background: 'var(--rule)', color: 'var(--accent)' }}
              >
                <Cpu size={24} />
              </div>
              <h4
                className="text-xl md:text-3xl font-bold mb-3 md:mb-4 relative z-10"
                style={{ color: 'var(--ink)' }}
              >
                GenAI &amp; LLM Engineering
              </h4>
              <p
                className="text-sm md:text-base leading-relaxed max-w-xl relative z-10"
                style={{ color: 'var(--ink-dim)' }}
              >
                Developing intelligent automation tools and agentic workflows using LLM APIs, LangChain, and RAG architectures. Transforming unstructured datasets into structured intelligence.
              </p>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:col-span-1 rounded-3xl md:rounded-[2rem] p-8 md:p-10 group transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96, 165, 250, 0.3)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)'}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-blue-400 mb-6"
                style={{ background: 'var(--rule)' }}
              >
                <FaLayerGroup size={20} />
              </div>
              <h4
                className="text-lg md:text-xl font-bold mb-2 md:mb-3"
                style={{ color: 'var(--ink)' }}
              >
                Full-Stack Ecosystems
              </h4>
              <p
                className="text-xs md:text-sm leading-relaxed"
                style={{ color: 'var(--ink-dim)' }}
              >
                Architecting scalable platforms using Next.js, Node.js, and secure databases. Implementing real-time synchronization workflows.
              </p>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:col-span-1 rounded-3xl md:rounded-[2rem] p-8 md:p-10 group transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192, 132, 252, 0.3)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)'}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-purple-400 mb-6"
                style={{ background: 'var(--rule)' }}
              >
                <GitMerge size={20} />
              </div>
              <h4
                className="text-lg md:text-xl font-bold mb-2 md:mb-3"
                style={{ color: 'var(--ink)' }}
              >
                Applied NLP
              </h4>
              <p
                className="text-xs md:text-sm leading-relaxed"
                style={{ color: 'var(--ink-dim)' }}
              >
                Building end-to-end NLP pipelines to extract and classify text. Leveraging Hugging Face transformers and semantic search capabilities.
              </p>
            </motion.div>

            {/* Collaboration Status Card — Desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex md:col-span-2 rounded-[2rem] p-8 md:p-10 flex-col md:flex-row md:items-center justify-between gap-6"
              style={{
                background: `linear-gradient(135deg, var(--accent-dim), var(--bg-card))`,
                border: '1px solid var(--border-card)',
              }}
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-widest mb-2"
                  style={{ color: 'var(--accent)' }}>
                  Current Trajectory
                </p>
                <h4 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                  Exploring Agentic Workflows
                </h4>
              </div>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap text-center"
                style={{ background: 'var(--rule)', color: 'var(--ink)', border: '1px solid var(--rule-strong)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ink)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-invert)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--rule)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
              >
                Let's Collaborate
              </Link>
            </motion.div>

          </div>

          {/* Mobile-only Status Card */}
          <div
            className="md:hidden mt-4 rounded-3xl p-6 flex flex-col gap-4"
            style={{
              background: `linear-gradient(135deg, var(--accent-dim), var(--bg-card))`,
              border: '1px solid var(--border-card)',
            }}
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1"
                style={{ color: 'var(--accent)' }}>
                Current Trajectory
              </p>
              <h4 className="text-xl font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                Exploring Agentic Workflows
              </h4>
            </div>
            <Link
              href="/contact"
              className="px-6 py-4 rounded-full font-bold text-xs transition-all text-center active:scale-95"
              style={{ background: 'var(--ink)', color: 'var(--ink-invert)' }}
            >
              Let's Collaborate
            </Link>
          </div>

        </div>
      </section>

      {/* ==================== SECTOR 4: EDITORIAL PHILOSOPHY ==================== */}
      <section
        className="py-20 md:py-24"
        style={{
          borderTop: '1px solid var(--border-card)',
          background: 'var(--bg-section)',
        }}
      >
        <div className="w-[90%] md:w-[85%] mx-auto">

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-24">

            {/* Sticky Header Column */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-32 space-y-4 md:space-y-6">
                <h2
                  className="text-[10px] md:text-sm font-mono tracking-widest uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  Operating Principles
                </h2>
                <h3
                  className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]"
                  style={{ color: 'var(--ink)' }}
                >
                  Engineering <br className="hidden md:block" /> Philosophy.
                </h3>
                <p
                  className="text-sm md:text-lg"
                  style={{ color: 'var(--ink-dim)' }}
                >
                  The foundational algorithms driving my development process.
                </p>
              </div>
            </div>

            {/* Philosophy Cards */}
            <div className="lg:col-span-7 flex flex-col gap-4 md:gap-16">

              {[
                {
                  num: '01',
                  title: 'Scalability First',
                  body: 'Architecture dictates limits. Whether developing a real-time command center syncing multiple hackathon teams or engineering NLP pipelines to process scientific corpora, I build robust systems designed to handle data at an enterprise scale.',
                },
                {
                  num: '02',
                  title: 'Human-AI Synergy',
                  body: "AI shouldn't just exist; it must solve complex problems. I bridge the gap between ambiguity and clarity, using advanced prompt engineering to transform unstructured inputs into structured, deterministic solutions.",
                },
                {
                  num: '03',
                  title: 'Operational Efficiency',
                  body: 'From optimizing event logistics to fine-tuning machine learning models for peak accuracy, I believe in streamlining organizational and technical workflows to achieve maximum output with minimum friction.',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="relative rounded-3xl md:rounded-none p-6 md:p-0"
                  style={{
                    background: 'var(--bg-raised)',
                    border: '1px solid var(--border-card)',
                    // On desktop override with transparent
                  }}
                >
                  {/* Desktop: big number watermark */}
                  <span
                    className="hidden md:block absolute -left-16 top-1 text-4xl font-black"
                    style={{ color: 'var(--rule)' }}
                  >
                    {item.num}
                  </span>
                  <div className="flex items-center gap-3 mb-2 md:mb-4">
                    <span className="md:hidden font-mono text-xs" style={{ color: 'var(--accent)' }}>
                      {item.num} //
                    </span>
                    <h4
                      className="text-lg md:text-2xl font-bold"
                      style={{ color: 'var(--ink)' }}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p
                    className="leading-relaxed text-sm md:text-lg font-light"
                    style={{ color: 'var(--ink-dim)' }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
