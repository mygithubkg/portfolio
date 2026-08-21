"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

// --- GLOBAL DATA ---
const milestones = [
  {
    id: "ms-1",
    issuer: "Microsoft, AICTE & Edunet",
    title: "AI Azure Internship",
    date: "May 2025",
    tags: ["AI Azure", "Enterprise Tech", "Practical Application"],
    credentialLink: "https://res.cloudinary.com/f8njovya/image/upload/v1783444283/Screenshot_2026-07-07_224106_npli4x.png",
  },
  {
    id: "mck-1",
    issuer: "McKinsey.org",
    title: "Forward Program",
    date: "Verified",
    tags: ["Structured Problem Solving", "Consulting Frameworks", "Leadership"],
    credentialLink: "https://www.credly.com/badges/43e76812-bf3d-4ac8-9ce2-b9116a52437f/public_url",
  },
  {
    id: "ggl-adk-1",
    issuer: "Google Cloud",
    title: "Build Intelligent Agents with Agent Development Kit (ADK)",
    date: "Jun 2026",
    tags: ["Agent Development Kit", "Intelligent Agents", "Google Cloud"],
    credentialLink: "https://www.skills.google/public_profiles/98a14d26-8779-428d-9f21-9b6521e99766/badges/24858699",
  },
  {
    id: "ggl-adk-2",
    issuer: "Google Cloud",
    title: "Build Your First Agent with Agent Development Kit",
    date: "Jun 2026",
    tags: ["Agent Development", "ADK", "Google Cloud"],
    credentialLink: "https://www.skills.google/public_profiles/98a14d26-8779-428d-9f21-9b6521e99766/badges/24713548",
  },
  {
    id: "ggl-agents",
    issuer: "Google Cloud",
    title: "Understand Google Cloud Agents",
    date: "Jun 2026",
    tags: ["Google Cloud Agents", "Cloud Architecture"],
    credentialLink: "https://www.skills.google/public_profiles/98a14d26-8779-428d-9f21-9b6521e99766/badges/24694022",
  },
  {
    id: "ggl-engineer",
    issuer: "Google Cloud",
    title: "Engineer AI Agents with Agent Development Kit",
    date: "Verified",
    tags: ["AI Agents", "Engineering", "Artificial Intelligence"],
    credentialLink: "https://www.skills.google/public_profiles/98a14d26-8779-428d-9f21-9b6521e99766/badges/24520438",
  },
  {
    id: "helsinki-1",
    issuer: "University of Helsinki",
    title: "Elements of AI",
    date: "Jul 2025",
    tags: ["Artificial Intelligence", "Machine Learning Concepts"],
    credentialLink: "https://res.cloudinary.com/f8njovya/image/upload/v1783443886/Certificate_Elements_of_AI_wxax47.png",
  },
  {
    id: "outskill-1",
    issuer: "Outskill",
    title: "Generative AI Mastermind",
    date: "Verified",
    tags: ["Generative AI", "Prompt Engineering"],
    credentialLink: "https://res.cloudinary.com/f8njovya/image/upload/v1783444115/Screenshot_2026-07-07_223807_y4z2qx.png",
  },
  {
    id: "coursera-1",
    issuer: "SkillUp EdTech / Coursera",
    title: "Get Started with Mail and Calendar Applications: Outlook",
    date: "Jun 2024",
    tags: ["Microsoft Outlook", "Mail Applications", "Calendar Management"],
    credentialLink: "https://www.coursera.org/account/accomplishments/verify/YEEN9XW7NUSM",
  }
];

const VerifiedStamp = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 xl:w-20 xl:h-20 text-accent opacity-0 group-hover/card:opacity-10 transition-opacity duration-500">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    <text x="50" y="55" fontSize="16" fontFamily="monospace" textAnchor="middle" fill="currentColor" transform="rotate(-15, 50, 50)" fontWeight="bold">VERIFIED</text>
  </svg>
);

// --- DESKTOP VIEW ---
function DesktopView() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-16 pt-32 pb-64">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center mb-24">
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: EASE }}
           className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-6"
         >
           {'>_'} VERIFIED DOSSIER — {milestones.length} ENTRIES
         </motion.div>
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: EASE, delay: 0.1 }}
           className="font-display text-7xl xl:text-8xl tracking-tight leading-tight text-text"
         >
           Career Milestones.
         </motion.h1>
      </div>

      {/* The Verified Dossier Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="grid grid-cols-2 xl:grid-cols-3 gap-[1px] bg-border border border-border rounded-xl overflow-hidden shadow-2xl"
      >
        {milestones.map((milestone) => (
          <a
            key={milestone.id}
            href={milestone.credentialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/card relative bg-background hover:bg-surface transition-colors duration-500 p-10 flex flex-col h-full overflow-hidden"
          >
            {/* Top Content */}
            <div>
              <div className="flex justify-between items-start">
                 <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
                   {milestone.issuer}
                 </span>
                 <div className="absolute top-8 right-8 pointer-events-none origin-center rotate-[-30deg] group-hover/card:rotate-[0deg] transition-transform duration-700 ease-out">
                   <VerifiedStamp />
                 </div>
              </div>
              
              <div className="mt-12 mb-8">
                 <h2 className="font-display text-3xl xl:text-4xl leading-tight text-text text-balance group-hover/card:text-accent transition-colors duration-500">
                   {milestone.title}
                 </h2>
              </div>
            </div>

            {/* Bottom Content pushed down */}
            <div className="mt-auto pt-8 flex flex-col gap-4">
              <span className="font-mono text-[10px] text-textSecondary uppercase tracking-widest block">
                 {milestone.date}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                 {milestone.tags.map(tag => (
                   <span key={tag} className="font-mono text-[10px] bg-border/50 text-text px-2 py-1 rounded-sm uppercase tracking-wider">
                     {tag}
                   </span>
                 ))}
              </div>
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  )
}

// --- MOBILE VIEW ---
function MobileView() {
  return (
    <div className="w-full pb-32">
      {/* Hero */}
      <div className="pt-24 pb-16 px-6 text-center border-b border-border">
         <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
           {'>_'} VERIFIED DOSSIER — {milestones.length} ENTRIES
         </div>
         <h1 className="font-display text-5xl tracking-tight leading-tight text-text">
           Career Milestones.
         </h1>
      </div>

      {/* The Execution Log (Git-Style Timeline) */}
      <div className="relative w-full mt-12">
         {/* Vertical Track */}
         <div className="absolute top-0 bottom-0 left-[24px] w-[1px] bg-border" />
         
         <div className="flex flex-col">
           {milestones.map((milestone) => (
             <motion.div
               key={milestone.id}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, margin: "-10%" }}
               transition={{ duration: 0.6, ease: EASE }}
               className="relative flex w-full"
             >
               {/* Timeline Node */}
               <div className="absolute left-[24.5px] top-8 w-2 h-2 rounded-full bg-accent -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_4px_var(--bg)]" />
               
               {/* Card Content */}
               <div className="ml-12 pr-6 py-6 flex flex-col w-full border-b border-border/50">
                  <div className="flex items-center justify-between font-mono text-[10px] text-textSecondary uppercase tracking-widest mb-3">
                    <span>{milestone.date}</span>
                    <span className="text-accent">{milestone.issuer}</span>
                  </div>
                  
                  <h2 className="font-display text-2xl leading-tight text-text text-balance mb-6">
                    {milestone.title}
                  </h2>
                  
                  <motion.a
                    href={milestone.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-4 rounded-full border border-border text-center font-mono text-[10px] uppercase tracking-widest text-text hover:bg-surface transition-colors flex items-center justify-center gap-2"
                  >
                    View Credential <ExternalLink size={12} />
                  </motion.a>
               </div>
             </motion.div>
           ))}
         </div>
      </div>
    </div>
  )
}

// --- MAIN PAGE ---
export default function Certifications() {
  return (
    <div className="w-full min-h-screen bg-background text-text selection:bg-accent/20 selection:text-accent relative">
      <div className="hidden lg:block">
        <DesktopView />
      </div>
      <div className="block lg:hidden">
        <MobileView />
      </div>
    </div>
  );
}
