"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const BIO_TEXT = "I am a Full-Stack & AI Engineer obsessed with designing robust systems and intuitive interfaces. I specialize in bridging the gap between heavy, complex backend architectures and flawless human experiences. Currently building intelligent applications with Next.js, Node.js, and GenAI.";

const systemLogs = [
  {
    year: "2024",
    date: "May 2024 - Jul 2024",
    role: "AI Intern",
    company: "Edunet Foundation",
    description: "Architected end-to-end AI workflows. Built robust models for NLP and computer vision tasks utilizing Python and TensorFlow."
  },
  {
    year: "2023",
    date: "Aug 2023 - May 2024",
    role: "Executive Board",
    company: "Technical Society",
    description: "Directed technical operations and led a team of 20+ developers in executing university-wide hackathons and coding bootcamps."
  },
  {
    year: "2022",
    date: "Jan 2022 - Dec 2022",
    role: "Campus Ambassador",
    company: "Tech Symposium",
    description: "Spearheaded marketing campaigns and community outreach, driving a 300% increase in student engagement across campus."
  },
  {
    year: "2025",
    date: "2021 - 2025",
    role: "B.Tech Electronics",
    company: "Punjab Engineering College",
    description: "Pursuing rigorous coursework in embedded systems and applied mathematics while focusing heavily on scalable software architecture."
  }
];

// --- DESKTOP VIEW ---
const DesktopView = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });
  
  // Map scroll progress to horizontal translation.
  // 4 cards * 60vw = 240vw total width. Translating -70% of the track length will reveal everything perfectly.
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div className="w-full">
      {/* HERO / BIO SECTION (Standard Scroll) */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 px-16 text-center relative overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col items-center z-10 max-w-4xl mx-auto"
        >
          {/* Identity Card */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } }}
            className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden relative border-2 border-border shadow-2xl bg-surface mb-12"
          >
            <Image
              src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png"
              alt="Karrtik Gupta"
              fill
              className="object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out"
              sizes="256px"
              priority
            />
          </motion.div>

          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            className="font-display text-7xl lg:text-8xl text-text tracking-tight mb-8"
          >
            Karrtik Gupta.
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            className="font-sans text-xl lg:text-2xl text-textSecondary font-light leading-relaxed text-balance"
          >
            {BIO_TEXT}
          </motion.p>
        </motion.div>
      </section>

      {/* EXPERIENCE SECTION (Pinned Horizontal Exhibition) */}
      <section ref={scrollRef} className="h-[400vh] relative bg-background">
        
        {/* The Sticky Viewport (The Camera) */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden w-full">
          
          {/* Aligned Section Title */}
          <div className="w-[85%] mx-auto absolute top-32 left-0 right-0 z-10 pointer-events-none">
            <h2 className="font-mono text-accent uppercase tracking-widest text-sm">Experience Matrix</h2>
            <span className="font-display text-textSecondary block mt-2 text-3xl">Professional Ledger</span>
          </div>

          {/* The Motion Track (The Moving Elements) */}
          <motion.div style={{ x: xTransform }} className="flex gap-32 items-center pl-[7.5vw] mt-24">
            {systemLogs.map((log, i) => (
              <div 
                key={i} 
                className="w-[70vw] max-w-[900px] bg-background border border-border rounded-2xl relative overflow-hidden flex flex-col justify-center p-12 md:p-16 shadow-2xl shrink-0"
              >
                {/* Giant Watermark Year Fixed */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <span className="text-[35vw] md:text-[25vw] leading-none font-mono text-text opacity-[0.03] select-none font-black tracking-tighter">
                    {log.year}
                  </span>
                </div>
                
                {/* Foreground Content */}
                <div className="z-10 flex flex-col gap-6 max-w-[85%] relative">
                  <span className="font-mono text-sm text-textSecondary uppercase tracking-widest">{log.date}</span>
                  <h3 className="font-display text-6xl xl:text-7xl text-text leading-[1.1]">{log.role}</h3>
                  <span className="font-mono text-xl text-accent uppercase tracking-widest">{log.company}</span>
                  <p className="font-sans text-xl text-textSecondary leading-relaxed mt-2 text-balance">
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};


// --- MOBILE VIEW ---
const MobileView = () => {
  return (
    <div className="w-full">
      {/* HERO / BIO SECTION */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center pt-24 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col items-center w-full"
        >
          {/* Identity Card */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } }}
            className="w-32 h-32 rounded-full overflow-hidden relative border-2 border-border shadow-xl bg-surface mb-8"
          >
            <Image
              src="https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png"
              alt="Karrtik Gupta"
              fill
              className="object-cover grayscale opacity-90"
              sizes="128px"
              priority
            />
          </motion.div>

          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            className="font-display text-[clamp(2.5rem,10vw,4rem)] text-text tracking-tight leading-[1] mb-6"
          >
            Karrtik Gupta.
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            className="font-sans text-base text-textSecondary font-light leading-relaxed text-balance px-4"
          >
            {BIO_TEXT}
          </motion.p>
        </motion.div>
      </section>

      {/* EXPERIENCE SECTION TITLE */}
      <div className="w-[85%] mx-auto pb-8 pt-16">
        <h2 className="font-mono text-accent uppercase tracking-widest text-[10px]">Experience Matrix</h2>
        <span className="font-display text-textSecondary block mt-2 text-2xl">Professional Ledger</span>
      </div>

      {/* EXPERIENCE SECTION (Cinematic Snap Scroll) */}
      <section className="h-[80vh] w-full bg-surface border-t border-b border-border overflow-y-auto snap-y snap-mandatory hide-scrollbar relative">
        {systemLogs.map((log, i) => (
          <div 
            key={i} 
            className="h-full w-full snap-center snap-always flex flex-col justify-center py-12 relative"
          >
            {/* Inner Wrapper with Strict Boundaries */}
            <div className="w-[85%] mx-auto relative h-full flex flex-col justify-center">
              {/* Absolute positioned Date at top left of inner container */}
              <span className="absolute top-0 left-0 font-mono text-[10px] text-textSecondary uppercase tracking-widest">
                {log.date}
              </span>
              
              {/* Centered Content */}
              <div className="flex flex-col gap-4 text-center mt-12">
                <h3 className="font-display text-[clamp(2.5rem,10vw,4rem)] text-text leading-[1.1]">{log.role}</h3>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block mb-4">{log.company}</span>
                <p className="font-sans text-sm sm:text-base text-textSecondary leading-loose text-balance">
                  {log.description}
                </p>
              </div>

              {/* Swipe UX Hint (Only on first item) */}
              {i === 0 && (
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-textSecondary opacity-50"
                >
                  <span className="font-mono text-[10px] tracking-widest uppercase mb-2">Swipe</span>
                  <ChevronUp size={16} />
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </section>
      
      {/* Footer Buffer space so snap scroll doesn't instantly crash into the global footer */}
      <div className="h-32 bg-background w-full"></div>
    </div>
  );
};


// --- MAIN PAGE (Responsive Switcher) ---
export default function About() {
  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <DesktopView />
      </div>
      <div className="block lg:hidden">
        <MobileView />
      </div>
    </div>
  );
}
