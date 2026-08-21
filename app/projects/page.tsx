"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { useData } from '@/context/DataContext';

const EASE = [0.16, 1, 0.3, 1] as const;

// --- DESKTOP VIEW ---
const DesktopView = ({ spotlightProjects, archiveProjects, onOpenModal }: any) => {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center text-center pt-32 pb-16 relative">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="font-display text-8xl xl:text-[10rem] text-text tracking-tight leading-none"
        >
          Selected Works.
        </motion.h1>
      </section>

      {/* PART 1: THE SPOTLIGHT */}
      <section className="w-full max-w-[1600px] mx-auto px-16 flex flex-col gap-32 pb-section">
        {spotlightProjects.map((project: any, i: number) => {
          const isReversed = i % 2 !== 0;
          return (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: EASE }}
              className={`min-h-[80vh] flex items-center gap-16 xl:gap-24 ${isReversed ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Image Block (60%) */}
              <div 
                className="w-[60%] aspect-[4/3] xl:aspect-[16/9] relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-surface group shrink-0 cursor-pointer"
                onClick={() => onOpenModal(project)}
              >
                <Image 
                  src={project.image || "/fallback.jpg"} 
                  alt={project.title} 
                  fill 
                  sizes="(max-width: 1600px) 60vw, 900px"
                  className="object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out transform group-hover:scale-105" 
                />
              </div>
              
              {/* Text Block (40%) */}
              <div className="w-[40%] flex flex-col gap-8 justify-center group cursor-default">
                 <span className="font-mono text-sm text-accent uppercase tracking-widest block">
                    0{i + 1} / {(project.tech || []).slice(0,3).join(" · ")}
                 </span>
                 <h2 className="font-display text-5xl xl:text-7xl text-text leading-tight">{project.title}</h2>
                 <p className="font-sans text-lg text-textSecondary leading-relaxed text-balance">
                    {project.description}
                 </p>
                 <button 
                   onClick={() => onOpenModal(project)}
                   className="mt-6 font-mono text-sm uppercase tracking-widest flex items-center gap-3 text-textSecondary hover:text-accent transition-colors w-fit cursor-pointer"
                 >
                    Explore Case <ArrowRight size={16} />
                 </button>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* PART 2: THE ARCHIVE */}
      <section className="w-full max-w-5xl mx-auto px-16 py-section mt-16 mb-32 border-t border-border relative">
         <h3 className="font-mono text-sm text-textSecondary uppercase tracking-widest mb-16">The Archive</h3>
         
         <div className="flex flex-col border-b border-border">
            {archiveProjects.map((proj: any, i: number) => (
              <button 
                onClick={() => onOpenModal(proj)} 
                key={i} 
                className="group w-full flex items-center justify-between border-t border-border py-8 px-6 hover:bg-surface transition-colors duration-500 cursor-pointer text-left"
              >
                <div className="flex items-center gap-12 w-2/3">
                  <span className="font-mono text-sm text-textSecondary w-16">{proj.year}</span>
                  <span className="font-sans font-bold text-3xl text-text group-hover:translate-x-2 transition-transform duration-500 ease-out">{proj.title}</span>
                </div>
                <div className="flex items-center justify-end gap-16 w-1/3">
                  <span className="font-mono text-sm text-textSecondary uppercase tracking-widest">{proj.category}</span>
                  <ArrowUpRight size={20} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            ))}
         </div>
      </section>
    </div>
  );
};


// --- MOBILE VIEW ---
const MobileView = ({ spotlightProjects, archiveProjects, onOpenModal }: any) => {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="min-h-[40vh] flex flex-col items-center justify-center text-center pt-24 pb-8 overflow-hidden w-full max-w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="font-display text-[clamp(3rem,14vw,5rem)] text-text tracking-tight leading-none px-4"
        >
          Selected Works.
        </motion.h1>
      </section>

      {/* PART 1: THE SPOTLIGHT (Sticky Stack) */}
      <section className="w-[90%] mx-auto pb-section relative">
         {spotlightProjects.map((project: any, i: number) => (
           <div 
             key={project.id} 
             className="sticky w-full mb-12 shadow-2xl rounded-2xl overflow-hidden border border-border bg-background"
             style={{ top: `${(i * 1.5) + 6}rem` }}
             onClick={() => onOpenModal(project)}
           >
             {/* Image */}
             <div className="w-full aspect-video relative border-b border-border bg-surface">
               <Image 
                 src={project.image || "/fallback.jpg"} 
                 alt={project.title} 
                 fill 
                 sizes="(max-width: 768px) 90vw, 400px"
                 className="object-cover grayscale" 
               />
             </div>
             
             {/* Text Block */}
             <div className="bg-surface p-8 flex flex-col gap-6 relative">
                 <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">
                    0{i + 1} / {(project.tech || []).slice(0,3).join(" · ")}
                 </span>
                 <h2 className="font-display text-4xl text-text leading-tight text-balance">{project.title}</h2>
                 <p className="font-sans text-base text-textSecondary leading-relaxed text-balance line-clamp-3">
                    {project.description}
                 </p>
                 <span className="mt-2 font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-text w-fit active:text-accent transition-colors">
                    Explore Case <ArrowRight size={14} />
                 </span>
             </div>
           </div>
         ))}
      </section>

      {/* PART 2: THE ARCHIVE */}
      <section className="w-[90%] mx-auto py-section border-t border-border mb-16">
         <div className="mb-12">
           <h3 className="font-mono text-xs text-textSecondary uppercase tracking-widest block">The Archive</h3>
         </div>

         <div className="flex flex-col border-b border-border">
            {archiveProjects.map((proj: any, i: number) => (
              <button 
                onClick={() => onOpenModal(proj)} 
                key={i} 
                className="w-full flex items-center justify-between border-t border-border py-6 px-2 active:bg-surface transition-colors text-left cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-bold text-xl text-text">{proj.title}</span>
                  <span className="font-mono text-[10px] text-textSecondary uppercase tracking-widest">{proj.year}</span>
                </div>
                <ArrowUpRight size={18} className="text-accent" />
              </button>
            ))}
         </div>
      </section>
    </div>
  );
};

// --- MODAL COMPONENT ---
const ProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  if (!project) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-surface border border-border rounded-2xl shadow-2xl overflow-y-auto hide-scrollbar flex flex-col"
      >
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 bg-background/80 backdrop-blur-md p-2 rounded-full border border-border text-text hover:text-accent transition-colors">
          <X size={20} />
        </button>

        {project.image && (
          <div className="w-full aspect-video sm:aspect-[21/9] relative border-b border-border">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </div>
        )}
        
        <div className="p-8 sm:p-12 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-textSecondary uppercase tracking-widest">{project.year}</span>
              <span className="w-8 h-[1px] bg-border" />
              <span className="font-mono text-xs text-accent uppercase tracking-widest">{project.category}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-text leading-tight mb-6">{project.title}</h2>
            <p className="font-sans text-lg text-textSecondary leading-relaxed text-balance">
              {project.details || project.description}
            </p>
          </div>

          {project.tech && project.tech.length > 0 && (
            <div>
              <h4 className="font-mono text-xs text-textSecondary uppercase tracking-widest mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string, i: number) => (
                  <span key={i} className="font-mono text-[10px] text-text bg-background border border-border px-3 py-1.5 rounded-full uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-border mt-4">
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer" className="bg-text text-background font-mono text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:bg-accent hover:text-white transition-colors flex items-center gap-2">
                Live Project <ArrowUpRight size={14} />
              </a>
            )}
            {project.links?.code && (
              <a href={project.links.code} target="_blank" rel="noreferrer" className="bg-transparent border border-border text-text font-mono text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:border-text transition-colors flex items-center gap-2">
                Source Code <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- MAIN PAGE (Responsive Switcher) ---
export default function Projects() {
  const { data } = useData();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const projects = data?.projects || [];

  // 1. Filter out the chosen Spotlight projects
  const spotlightNames = ["Personal Portfolio", "AI Summary Pro", "Voice-Enabled Commerce"];
  
  // We want to keep the exact order of the spotlightNames array
  const spotlightProjects = spotlightNames.map(name => 
    projects.find((p: any) => p.title === name)
  ).filter(Boolean);

  // 2. The rest become Archive projects
  const archiveProjects = projects.filter((p: any) => !spotlightNames.includes(p.title));

  return (
    <div className="w-full relative">
      <div className="hidden lg:block">
        <DesktopView spotlightProjects={spotlightProjects} archiveProjects={archiveProjects} onOpenModal={setSelectedProject} />
      </div>
      <div className="block lg:hidden">
        <MobileView spotlightProjects={spotlightProjects} archiveProjects={archiveProjects} onOpenModal={setSelectedProject} />
      </div>

      {/* Global Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
