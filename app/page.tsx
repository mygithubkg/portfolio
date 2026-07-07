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
  { icon: <SiExpress />, name: 'Express.js', color: '#ffffff' },
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
    <div className="relative bg-[#030303] text-gray-300 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* ==================== SECTOR 1: CINEMATIC HERO ==================== */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
      >
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-[90%] md:w-[85%] mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-12 md:mt-0">

          {/* --- LEFT: Typography & Actions --- */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md w-fit"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-cyan-400 text-[10px] md:text-xs font-mono tracking-widest uppercase">
                SYS_ONLINE // DEV_READY
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              // Mobile uses vw for extreme edge-to-edge typography
              className="text-[13vw] leading-[0.9] md:text-7xl lg:text-[5.5rem] font-black tracking-tighter md:leading-[0.95] text-white uppercase"
            >
              Architecting <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">
                Intelligence.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-gray-400 max-w-xl font-light leading-relaxed"
            >
              Building scalable ecosystems and intelligent agents. Bridging the gap between unstructured data and <span className="text-white font-medium">structured engineering</span>.
            </motion.p>

            {/* Mobile App-Style Full-Width Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 pt-6 w-full"
            >
              <Link href="/projects" className="group flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 md:py-4 rounded-3xl md:rounded-full bg-white text-black font-bold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
                VIEW SYSTEMS
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="group flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 md:py-4 rounded-3xl md:rounded-full bg-white/[0.03] border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors active:scale-95">
                <TerminalSquare size={16} />
                INITIALIZE CONTACT
              </Link>
            </motion.div>
          </div>

          {/* --- RIGHT: 3D Holographic Terminal (Hidden on Mobile, Epic on Laptop) --- */}
          <div className="hidden lg:block lg:col-span-5 relative h-[600px]">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute inset-4 bg-cyan-500/20 rounded-3xl blur-2xl" style={{ transform: "translateZ(-50px)" }} />
              <div
                className="w-full h-full max-h-[500px] bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative flex flex-col"
                style={{ transform: "translateZ(50px)" }}
              >
                <div className="flex gap-2 mb-6 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="font-mono text-[13px] leading-[1.8] flex-1">
                  <p><span className="text-purple-400">const</span> <span className="text-yellow-200">Architect</span> <span className="text-purple-400">=</span> <span className="text-blue-400">new</span> <span className="text-teal-300">System</span>({'{'}</p>
                  <p className="pl-6">identity: <span className="text-green-400">'Karrtik Gupta'</span>,</p>
                  <p className="pl-6">role: <span className="text-green-400">'Full-Stack & AI Engineer'</span>,</p>
                  <p className="pl-6">modules: [</p>
                  <p className="pl-12 text-green-400">'Next.js', 'React',</p>
                  <p className="pl-12 text-green-400">'Node.js', 'Python',</p>
                  <p className="pl-12 text-green-400">'LangChain', 'RAG'</p>
                  <p className="pl-6">],</p>
                  <p className="pl-6">status: <span className="text-blue-400">await</span> <span className="text-yellow-200">deploy</span>()</p>
                  <p>{'}'});</p>
                  <br />
                  <p className="text-gray-500 animate-pulse">root@karrtik:~# executing setup...</p>
                </div>
                <div className="absolute bottom-0 right-0 w-48 h-48 opacity-20 grayscale mix-blend-screen pointer-events-none">
                  <Image src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png" alt="Profile Ghost" width={400} height={400} className="w-full h-full object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==================== SECTOR 2: INFINITE TECH TICKER ==================== */}
      <section className="border-y border-white/5 bg-[#0a0a0c] overflow-hidden py-4 md:py-6 relative flex items-center">
        <div className="absolute left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#030303] to-transparent z-10" />
        <div className="absolute right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#030303] to-transparent z-10" />

        <motion.div
          className="flex gap-12 md:gap-16 whitespace-nowrap px-4 md:px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...techStack, ...techStack].map((tech, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors duration-300 group cursor-default">
              <span className="text-xl md:text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300" style={{ color: tech.color }}>
                {tech.icon}
              </span>
              <span className="font-mono text-xs md:text-sm tracking-widest uppercase">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ==================== SECTOR 3: BENTO APP CAROUSEL ==================== */}
      <section className="py-20 md:py-32 relative">
        <div className="w-full md:w-[85%] mx-auto px-5 md:px-0">

          <div className="mb-8 md:mb-16 flex items-end justify-between">
            <div>
              <h3 className="text-[10px] md:text-sm font-mono text-cyan-500 tracking-widest uppercase mb-2 md:mb-4">Core Modules</h3>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Technical Arsenal.</h2>
            </div>
            {/* Mobile Swipe Indicator */}
            <div className="md:hidden flex items-center gap-1 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Swipe <ChevronRight size={12} />
            </div>
          </div>

          {/* 
            MAGIC MOBILE CAROUSEL LOGIC:
            On Mobile: flex, overflow-x-auto, snap-x (Horizontal Swipe)
            On Desktop: grid, grid-cols-3 (Bento Box)
          */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Bento Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:col-span-2 bg-[#0a0a0c] border border-white/5 rounded-3xl md:rounded-[2rem] p-8 md:p-12 group hover:border-cyan-500/30 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                <FaBrain size={120} />
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 md:mb-8">
                <Cpu size={24} />
              </div>
              <h4 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 relative z-10">GenAI & LLM Engineering</h4>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl relative z-10">
                Developing intelligent automation tools and agentic workflows using LLM APIs, LangChain, and RAG architectures. Transforming unstructured datasets into structured intelligence.
              </p>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:col-span-1 bg-[#0a0a0c] border border-white/5 rounded-3xl md:rounded-[2rem] p-8 md:p-10 group hover:border-blue-500/30 transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <FaLayerGroup size={20} />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Full-Stack Ecosystems</h4>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                Architecting scalable platforms using Next.js, Node.js, and secure databases. Implementing real-time synchronization workflows.
              </p>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:col-span-1 bg-[#0a0a0c] border border-white/5 rounded-3xl md:rounded-[2rem] p-8 md:p-10 group hover:border-purple-500/30 transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                <GitMerge size={20} />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Applied NLP</h4>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                Building end-to-end NLP pipelines to extract and classify text. Leveraging Hugging Face transformers and semantic search capabilities.
              </p>
            </motion.div>

            {/* Quick Status Card (Hidden on Mobile Carousel, moves to below carousel) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex md:col-span-2 bg-gradient-to-br from-cyan-900/20 to-[#0a0a0c] border border-white/5 rounded-[2rem] p-8 md:p-10 flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div>
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Current Trajectory</p>
                <h4 className="text-2xl font-bold text-white">Exploring Agentic Workflows</h4>
              </div>
              <Link href="/contact" className="px-6 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-bold text-sm transition-all whitespace-nowrap text-center">
                Let's Collaborate
              </Link>
            </motion.div>

          </div>

          {/* Mobile Only: Status Card placed below carousel */}
          <div className="md:hidden mt-4 bg-gradient-to-br from-cyan-900/20 to-[#0a0a0c] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Current Trajectory</p>
              <h4 className="text-xl font-bold text-white leading-tight">Exploring Agentic Workflows</h4>
            </div>
            <Link href="/contact" className="px-6 py-4 rounded-full bg-white text-black font-bold text-xs transition-all text-center active:scale-95">
              Let's Collaborate
            </Link>
          </div>

        </div>
      </section>

      {/* ==================== SECTOR 4: EDITORIAL PHILOSOPHY ==================== */}
      <section className="py-20 md:py-24 border-t border-white/5 bg-[#050505]">
        <div className="w-[90%] md:w-[85%] mx-auto">

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-24">

            {/* Sticky Header Column */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-32 space-y-4 md:space-y-6">
                <h2 className="text-[10px] md:text-sm font-mono text-cyan-500 tracking-widest uppercase">Operating Principles</h2>
                <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                  Engineering <br className="hidden md:block" /> Philosophy.
                </h3>
                <p className="text-gray-400 text-sm md:text-lg">The foundational algorithms driving my development process.</p>
              </div>
            </div>

            {/* 
              MOBILE: Stacked iOS Notification Cards 
              DESKTOP: Scrolling Text List
            */}
            <div className="lg:col-span-7 flex flex-col gap-4 md:gap-16">

              <div className="relative bg-[#0a0a0c] md:bg-transparent border border-white/5 md:border-none p-6 md:p-0 rounded-3xl md:rounded-none md:pl-0">
                <span className="hidden md:block absolute left-0 top-1 text-4xl -left-16 font-black text-white/5">01</span>
                <div className="flex items-center gap-3 mb-2 md:mb-4">
                  <span className="md:hidden font-mono text-xs text-cyan-500">01 //</span>
                  <h4 className="text-lg md:text-2xl font-bold text-white">Scalability First</h4>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm md:text-lg font-light">
                  Architecture dictates limits. Whether developing a real-time command center syncing multiple hackathon teams or engineering NLP pipelines to process scientific corpora, I build robust systems designed to handle data at an enterprise scale.
                </p>
              </div>

              <div className="relative bg-[#0a0a0c] md:bg-transparent border border-white/5 md:border-none p-6 md:p-0 rounded-3xl md:rounded-none md:pl-0">
                <span className="hidden md:block absolute left-0 top-1 text-4xl -left-16 font-black text-white/5">02</span>
                <div className="flex items-center gap-3 mb-2 md:mb-4">
                  <span className="md:hidden font-mono text-xs text-cyan-500">02 //</span>
                  <h4 className="text-lg md:text-2xl font-bold text-white">Human-AI Synergy</h4>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm md:text-lg font-light">
                  AI shouldn't just exist; it must solve complex problems. I bridge the gap between ambiguity and clarity, using advanced prompt engineering to transform unstructured inputs into structured, deterministic solutions.
                </p>
              </div>

              <div className="relative bg-[#0a0a0c] md:bg-transparent border border-white/5 md:border-none p-6 md:p-0 rounded-3xl md:rounded-none md:pl-0">
                <span className="hidden md:block absolute left-0 top-1 text-4xl -left-16 font-black text-white/5">03</span>
                <div className="flex items-center gap-3 mb-2 md:mb-4">
                  <span className="md:hidden font-mono text-xs text-cyan-500">03 //</span>
                  <h4 className="text-lg md:text-2xl font-bold text-white">Operational Efficiency</h4>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm md:text-lg font-light">
                  From optimizing event logistics to fine-tuning machine learning models for peak accuracy, I believe in streamlining organizational and technical workflows to achieve maximum output with minimum friction.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
