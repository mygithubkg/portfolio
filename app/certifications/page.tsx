"use client"
import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  PanInfo,
} from 'framer-motion';
import {
  ExternalLink,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Cloud,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MonitorPlay,
  Mail,
  Bot,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// DATA
// Each credential now carries a single restrained "accent" hex used only for
// its icon ring — the card body itself stays uniform, so the page reads as
// one cohesive dossier rather than nine different colored panels.
//
// NOTE: for production, swap the <style>@import for next/font/google to avoid
// a render-blocking font request — kept inline here for portability.
// ---------------------------------------------------------------------------
export const credentials = [
  {
    id: "ms-1",
    issuer: "Microsoft, AICTE & Edunet",
    title: "AI Azure Internship",
    category: "Industry Experience",
    date: "May 2025",
    icon: Briefcase,
    accent: "#5B8DEF",
    skills: ["AI Azure", "Enterprise Tech", "Practical Application"],
    link: "#",
  },
  {
    id: "mck-1",
    issuer: "McKinsey.org",
    title: "Forward Program",
    category: "Professional Development",
    date: "Verified",
    icon: TrendingUp,
    accent: "#C7C9D9",
    skills: ["Structured Problem Solving", "Consulting Frameworks", "Leadership"],
    link: "#",
  },
  {
    id: "ggl-adk-1",
    issuer: "Google Cloud",
    title: "Build Intelligent Agents with Agent Development Kit (ADK)",
    category: "Completion Badge",
    date: "Jun 2026",
    icon: Bot,
    accent: "#E0A93E",
    skills: ["Agent Development Kit", "Intelligent Agents", "Google Cloud"],
    link: "#",
  },
  {
    id: "ggl-adk-2",
    issuer: "Google Cloud",
    title: "Build Your First Agent with Agent Development Kit",
    category: "Completion Badge",
    date: "Jun 2026",
    icon: Cloud,
    accent: "#5FA8E0",
    skills: ["Agent Development", "ADK", "Google Cloud"],
    link: "#",
  },
  {
    id: "ggl-agents",
    issuer: "Google Cloud",
    title: "Understand Google Cloud Agents",
    category: "Completion Badge",
    date: "Jun 2026",
    icon: Cloud,
    accent: "#4FC08D",
    skills: ["Google Cloud Agents", "Cloud Architecture"],
    link: "#",
  },
  {
    id: "ggl-engineer",
    issuer: "Google Cloud",
    title: "Engineer AI Agents with Agent Development Kit",
    category: "Skill Badge",
    date: "Verified",
    icon: MonitorPlay,
    accent: "#E0637A",
    skills: ["AI Agents", "Engineering", "Artificial Intelligence"],
    link: "#",
  },
  {
    id: "helsinki-1",
    issuer: "University of Helsinki",
    title: "Elements of AI",
    category: "2 ECTS Credits",
    date: "Jul 2025",
    icon: BookOpen,
    accent: "#8B85E8",
    skills: ["Artificial Intelligence", "Machine Learning Concepts"],
    link: "https://certificates.mooc.fi/validate/ff1hmix5j38",
  },
  {
    id: "outskill-1",
    issuer: "Outskill",
    title: "Generative AI Mastermind",
    category: "Certificate of Completion",
    date: "Verified",
    icon: Bot,
    accent: "#3FBF8F",
    skills: ["Generative AI", "Prompt Engineering"],
    link: "#",
  },
  {
    id: "coursera-1",
    issuer: "SkillUp EdTech / Coursera",
    title: "Get Started with Mail and Calendar Applications: Outlook",
    category: "Course Certificate",
    date: "Jun 2024",
    icon: Mail,
    accent: "#4FB2D6",
    skills: ["Microsoft Outlook", "Mail Applications", "Calendar Management"],
    link: "https://coursera.org/verify/YEEN9XW7NUSM",
  },
];

const ACCENT = "#C8A24A"; // brass — the one bold color this page spends

// ---------------------------------------------------------------------------
// Single card. Broken out so each card can safely own its own hover-tilt
// motion values (hooks can't live inside a .map() on the parent).
// ---------------------------------------------------------------------------
export interface CredentialItem {
  id: string;
  issuer: string;
  title: string;
  category: string;
  date: string;
  icon: React.ElementType;
  accent: string;
  skills: string[];
  link: string;
}

interface CredentialCardProps {
  cert: CredentialItem;
  index: number;
  currentIndex: number;
  total: number;
  isMobile: boolean;
  reduceMotion: boolean | null;
  onSelect: (index: number) => void;
}

function CredentialCard({ cert, index, currentIndex, total, isMobile, reduceMotion, onSelect }: CredentialCardProps) {
  const offset = index - currentIndex;
  const absOffset = Math.abs(offset);
  const isCenter = offset === 0;
  const isVisible = absOffset <= 2;

  const Icon = cert.icon;

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCenter || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 10);
    rotX.set(py * -10);
  };
  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  if (!isVisible) return null;

  const xOffset = offset * (isMobile ? 130 : 210);
  const zOffset = absOffset * -160;
  const rotateY = isCenter ? 0 : offset > 0 ? -38 : 38;
  const scale = isCenter ? 1 : 1 - absOffset * 0.1;
  const opacity = isCenter ? 1 : Math.max(0.55 - absOffset * 0.15, 0.18);
  const zIndex = 50 - absOffset;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ x: xOffset, z: zOffset, y: 0, rotateY, scale, opacity, zIndex }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 26,
        delay: reduceMotion ? 0 : Math.min(absOffset * 0.03, 0.15),
      }}
      onClick={() => onSelect(index)}
      className={`absolute w-[290px] md:w-[380px] h-[460px] md:h-[500px] rounded-2xl ${isCenter ? "cursor-default" : "cursor-pointer"
        }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isCenter ? springX : 0,
          rotateY: isCenter ? springY : 0,
          transformStyle: "preserve-3d",
          boxShadow: isCenter
            ? `0 30px 80px -20px ${cert.accent}33, 0 0 0 1px rgba(255,255,255,0.06)`
            : "0 20px 40px -20px rgba(0,0,0,0.6)",
        }}
        className="w-full h-full rounded-2xl bg-gradient-to-b from-[#131418] to-[#0a0b0e] border border-white/10 relative overflow-hidden"
      >
        {/* faint paper grain */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px)",
          }}
        />

        <div className="relative z-10 h-full flex flex-col p-6 md:p-7">
          {/* Ledger header */}
          <div className="flex items-start justify-between mb-5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
              N&deg; {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>

            <AnimatePresence>
              {isCenter && (
                <motion.div
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: -12, opacity: 1 }}
                  exit={{ scale: 0, rotate: -30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-dashed shrink-0"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  <span className="font-mono text-[7px] font-bold tracking-widest text-center leading-tight">
                    VERI<br />FIED
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Icon + issuer */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
              style={{
                borderColor: `${cert.accent}55`,
                backgroundColor: `${cert.accent}14`,
                color: cert.accent,
              }}
            >
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-white/50 leading-snug">
              {cert.issuer}
            </span>
          </div>

          {/* Title — fixed-height box so every card reads cleanly no matter how long the title is */}
          <div className="min-h-[86px] md:min-h-[96px] mb-4">
            <h3
              className="text-white font-semibold text-xl md:text-[26px] leading-[1.15] tracking-tight"
              style={{
                fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {cert.title}
            </h3>
          </div>

          {/* ticket-stub divider */}
          <div className="border-t border-dashed border-white/15 mb-4" />

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3 block">
            {cert.category}
          </span>

          {/* Skills — always present, just dimmer off-center instead of vanishing */}
          <div className="flex-1 flex flex-wrap items-start content-start gap-1.5 mb-4">
            {cert.skills.map((skill, i) => (
              <motion.span
                key={skill}
                animate={{ opacity: isCenter ? 1 : 0.45 }}
                transition={{ delay: isCenter && !reduceMotion ? i * 0.05 : 0 }}
                className="px-2.5 py-1 rounded-md text-[10px] font-mono text-white/75 border border-white/10 bg-white/[0.03]"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="font-mono text-[10px] text-white/40 tracking-wide">{cert.date}</span>
            <motion.a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              animate={{ opacity: isCenter ? 1 : 0.35 }}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/90 transition-colors"
              style={{ pointerEvents: isCenter ? "auto" : "none" }}
            >
              View credential
              <ExternalLink size={12} />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stage
// ---------------------------------------------------------------------------
export default function CoverFlowShowcase() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goTo = useCallback((i: number) => {
    setCurrentIndex(Math.max(0, Math.min(i, credentials.length - 1)));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, goTo]);

  // Swipe / drag navigation
  const handleDragEnd = (_e: any, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goTo(currentIndex + 1);
    else if (info.offset.x > threshold) goTo(currentIndex - 1);
  };

  return (
    <section className="min-h-screen py-20 md:py-32 bg-[#07080B] text-gray-300 relative overflow-hidden flex flex-col justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..900&family=JetBrains+Mono:wght@400;500;600&display=swap');`}</style>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] pointer-events-none"
        style={{ background: `radial-gradient(closest-side, ${ACCENT}14, transparent)` }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs mb-6 uppercase tracking-[0.2em]"
            style={{ color: ACCENT }}
          >
            <ShieldCheck size={14} />
            <span>Verified dossier &mdash; {credentials.length} entries</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
          >
            Career <span style={{ color: ACCENT }}>Milestones</span>
          </motion.h2>
        </div>

        {/* Coverflow stage */}
        <motion.div
          className="relative w-full h-[480px] md:h-[540px] flex items-center justify-center [perspective:1300px] cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
        >
          {credentials.map((cert, index) => (
            <CredentialCard
              key={cert.id}
              cert={cert}
              index={index}
              currentIndex={currentIndex}
              total={credentials.length}
              isMobile={isMobile}
              reduceMotion={reduceMotion}
              onSelect={goTo}
            />
          ))}
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 mt-16 md:mt-20 relative z-30">
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Previous credential"
              className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-25 transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Ledger ticks — click any tick to jump straight there */}
            <div className="flex items-end gap-1.5 h-6">
              {credentials.map((c, i) => (
                <button key={c.id} onClick={() => goTo(i)} aria-label={`Go to ${c.title}`} className="relative h-6 flex items-end">
                  <motion.span
                    animate={{
                      height: i === currentIndex ? 20 : 8,
                      backgroundColor: i === currentIndex ? ACCENT : "rgba(255,255,255,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="w-[3px] rounded-full block"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo(currentIndex + 1)}
              disabled={currentIndex === credentials.length - 1}
              aria-label="Next credential"
              className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-25 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <span className="font-mono text-xs text-white/40 uppercase tracking-[0.2em]">
            {String(currentIndex + 1).padStart(2, "0")} of {String(credentials.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}