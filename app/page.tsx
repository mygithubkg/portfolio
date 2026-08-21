"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { getBlogs } from '@/lib/utils/blogData';
import { ArrowRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

// --- DESKTOP VIEW ---
const DesktopView = ({ projects, blogs, skills }: { projects: any[], blogs: any[], skills: string[] }) => {
  return (
    <div className="w-full">
      
      {/* HERO SECTION (Centered) */}
      <section className="min-h-screen flex flex-col items-center justify-center px-16 relative overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col items-center text-center z-10"
        >
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            className="font-display text-8xl lg:text-9xl text-text tracking-tight whitespace-nowrap mb-6"
          >
            Karrtik Gupta.
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            className="font-sans text-xl lg:text-2xl text-textSecondary font-light max-w-2xl"
          >
            AI & Full-Stack Architect.<br/>
            Bridging complex algorithms with scalable human experiences.
          </motion.p>
        </motion.div>
      </section>

      {/* PROJECTS SECTION (Standard Vertical Scroll, Alternating Layout) */}
      <section className="py-section px-16 bg-surface border-t border-b border-border">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-group">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: EASE }}
            className="w-full flex justify-between items-end border-b border-border pb-8 mb-group"
          >
            <h2 className="font-display text-5xl text-text">Selected Systems</h2>
            <span className="font-mono text-sm text-textSecondary uppercase tracking-widest hidden md:block">01 / Projects</span>
          </motion.div>

          <div className="flex flex-col gap-[10rem]">
            {projects.map((project, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div 
                  key={project.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 1.2, ease: EASE }}
                  className={`flex items-center gap-24 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Image Block (60%) */}
                  <div className="w-[60%] h-[550px] relative rounded-2xl overflow-hidden border border-border bg-background shadow-2xl group">
                    {project.image ? (
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        sizes="(max-width: 1400px) 60vw, 840px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-4xl text-textSecondary/30">
                        {project.title}
                      </div>
                    )}
                  </div>

                  {/* Details Block (40%) */}
                  <div className="w-[40%] flex flex-col items-start gap-8">
                    <h3 className="font-display text-5xl text-text leading-tight">{project.title}</h3>
                    <ul className="flex flex-col gap-3 border-l border-border pl-6">
                      {project.tech?.slice(0, 3).map((t: string, idx: number) => (
                        <li key={idx} className="font-mono text-sm uppercase tracking-widest text-textSecondary">
                          — {t}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={project.links?.live || project.links?.code || '/projects'}
                      target="_blank"
                      className="group/btn relative inline-flex items-center gap-4 text-text font-mono uppercase tracking-widest text-sm overflow-hidden mt-4"
                    >
                      <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-background mix-blend-difference">View Live</span>
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover/btn:bg-text group-hover/btn:border-text group-hover/btn:w-full absolute left-0 z-0">
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-12 opacity-0 group-hover/btn:opacity-100 text-background" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="flex justify-center mt-block"
          >
            <Link 
              href="/projects" 
              className="px-10 py-5 border border-border rounded-full font-mono text-sm uppercase tracking-widest text-text hover:bg-text hover:text-background transition-colors duration-500"
            >
              View All Projects
            </Link>
          </motion.div>

        </div>
      </section>

      {/* JOURNAL SECTION (Book Reading Grid) */}
      <section className="py-section px-16 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-group">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: EASE }}
            className="w-full flex justify-between items-end border-b border-border pb-8 mb-group"
          >
            <h2 className="font-display text-5xl text-text">Field Notes</h2>
            <span className="font-mono text-sm text-textSecondary uppercase tracking-widest hidden md:block">02 / Journal</span>
          </motion.div>

          <div className="grid grid-cols-3 gap-12">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
              >
                <Link 
                  href={`/blog/${blog.id}`}
                  className="block group"
                >
                  <motion.div 
                    whileHover={{ y: -8 }} 
                    transition={{ duration: 0.4, ease: EASE }}
                    className="aspect-[3/4] bg-surface border-[1px] border-border p-10 flex flex-col justify-between items-center text-center shadow-sm group-hover:shadow-2xl transition-shadow duration-500 rounded-lg relative overflow-hidden"
                  >
                    {/* Inner Border (Book aesthetic) */}
                    <div className="absolute inset-4 border-[1px] border-border/50 rounded-sm pointer-events-none" />
                    
                    <span className="font-mono text-xs uppercase tracking-widest text-textSecondary border-b border-border pb-4 w-full z-10 shrink-0">
                      {blog.publishDate || blog.date}
                    </span>
                    
                    <div className="flex-1 flex flex-col justify-center items-center w-full py-4 z-10">
                      <h3 className="font-display text-3xl xl:text-4xl text-text leading-snug px-4 text-balance line-clamp-4">
                        {blog.title}
                      </h3>
                    </div>
                    
                    <span className="font-mono text-xs uppercase tracking-widest text-accent border-t border-border pt-4 w-full group-hover:text-text transition-colors duration-300 z-10 flex justify-center items-center gap-2 shrink-0">
                      Read <ArrowRight size={14} />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="flex justify-center mt-block"
          >
            <Link 
              href="/blog" 
              className="px-10 py-5 border border-border rounded-full font-mono text-sm uppercase tracking-widest text-text hover:bg-text hover:text-background transition-colors duration-500"
            >
              View All Journal
            </Link>
          </motion.div>

        </div>
      </section>

      {/* FOOTER TICKER */}
      <section className="py-24 border-t border-border overflow-hidden bg-surface">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex whitespace-nowrap items-center"
        >
          {[...skills, ...skills, ...skills, ...skills, ...skills].map((skill, i) => (
            <div key={i} className="flex items-center">
              <span className="font-display text-7xl text-text px-8">{skill}</span>
              <span className="font-sans text-4xl text-textSecondary/30 px-4">—</span>
            </div>
          ))}
        </motion.div>
      </section>

    </div>
  );
};


// --- MOBILE VIEW ---
const MobileView = ({ projects, blogs, skills }: { projects: any[], blogs: any[], skills: string[] }) => {
  return (
    <div className="w-full">
      
      {/* HERO SECTION */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 w-full max-w-full relative text-center pt-16 overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="font-display text-[clamp(2rem,11vw,4rem)] text-text tracking-tight leading-[1.1] mb-6 whitespace-nowrap"
        >
          Karrtik Gupta.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
          className="font-sans text-[clamp(1rem,4vw,1.25rem)] text-textSecondary font-light px-4"
        >
          AI & Full-Stack Architect.
        </motion.p>
        
        {/* Pulsing Dot Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-textSecondary">Scroll</span>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-accent"
          />
        </motion.div>
      </section>

      {/* PROJECTS SECTION (Sticky Stacking) */}
      <section className="py-section px-6 bg-surface border-t border-border">
        <div className="mb-block">
          <h2 className="font-display text-4xl text-text">Selected Systems</h2>
          <span className="font-mono text-xs text-textSecondary uppercase tracking-widest mt-2 block">01 / Projects</span>
        </div>

        <div className="flex flex-col pb-[10vh] relative">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="sticky w-full bg-background border border-border p-6 rounded-2xl shadow-xl flex flex-col gap-6 mb-8"
              style={{ top: `${(i + 3) * 1.5 + 4}rem` }} // Stacking offset, added extra space to clear header
            >
              {/* Project Image Frame (Natural Scaling) */}
              {project.image && (
                <div className="w-full bg-surface rounded-xl overflow-hidden border border-border flex items-center justify-center p-2 mb-4">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    width={800}
                    height={450}
                    className="w-full h-auto object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}
              
              <h3 className="font-display text-3xl text-text leading-tight">{project.title}</h3>
              <ul className="flex flex-col gap-2 border-l border-border pl-4">
                {project.tech?.slice(0, 3).map((t: string, idx: number) => (
                  <li key={idx} className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">
                    — {t}
                  </li>
                ))}
              </ul>
              <Link 
                href={project.links?.live || project.links?.code || '/projects'}
                target="_blank"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent mt-4"
              >
                View Live <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link 
            href="/projects" 
            className="px-8 py-4 border border-border rounded-full font-mono text-xs uppercase tracking-widest text-text hover:bg-text hover:text-background transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </section>

      {/* JOURNAL SECTION (Snap Scroll Book Covers) */}
      <section className="py-section px-6">
        <div className="mb-block">
          <h2 className="font-display text-4xl text-text">Field Notes</h2>
          <span className="font-mono text-xs text-textSecondary uppercase tracking-widest mt-2 block">02 / Journal</span>
        </div>

        {/* Horizontal Snap Slider */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 hide-scrollbar relative">
          {blogs.map((blog) => (
            <Link 
              key={blog.id}
              href={`/blog/${blog.id}`} 
              className="w-[85%] sm:w-[60%] shrink-0 snap-center block group relative"
            >
              <div className="aspect-[3/4] bg-surface border border-border p-6 flex flex-col justify-between items-center text-center shadow-lg rounded-lg relative overflow-hidden h-full">
                {/* Inner Border */}
                <div className="absolute inset-3 border-[1px] border-border/50 rounded-sm pointer-events-none" />

                <span className="font-mono text-[10px] uppercase tracking-widest text-textSecondary border-b border-border pb-4 w-full z-10 shrink-0">
                  {blog.publishDate || blog.date}
                </span>
                
                <div className="flex-1 flex flex-col justify-center items-center w-full py-2 z-10">
                  <h3 className="font-display text-xl sm:text-2xl text-text leading-snug px-2 text-balance line-clamp-4">
                    {blog.title}
                  </h3>
                </div>
                
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent border-t border-border pt-4 w-full z-10 flex items-center justify-center gap-1 group-active:text-text transition-colors shrink-0">
                  Read <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link 
            href="/blog" 
            className="px-8 py-4 border border-border rounded-full font-mono text-xs uppercase tracking-widest text-text hover:bg-text hover:text-background transition-colors"
          >
            View All Journal
          </Link>
        </div>
      </section>

      {/* FOOTER TICKER */}
      <section className="py-16 border-t border-border overflow-hidden bg-surface">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex whitespace-nowrap items-center"
        >
          {[...skills, ...skills, ...skills, ...skills, ...skills].map((skill, i) => (
            <div key={i} className="flex items-center">
              <span className="font-display text-4xl text-text px-4">{skill}</span>
              <span className="font-sans text-2xl text-textSecondary/30 px-2">—</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};


// --- MAIN PAGE (Responsive Switcher) ---
export default function Home() {
  const { data } = useData();
  
  // Constrain to exactly 3 projects
  const projects = data?.projects?.slice(0, 3) || [];
  
  const techStack = data?.techStack || [];
  const skills = techStack.length > 0 ? techStack.map((t: any) => t.name) : ["React", "Next.js", "Python", "Generative AI", "Firebase", "Node.js", "TypeScript"];

  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const fetchedBlogs = await getBlogs();
      // Constrain to exactly 3 blogs
      setBlogs(fetchedBlogs ? fetchedBlogs.slice(0, 3) : []);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <DesktopView projects={projects} blogs={blogs} skills={skills} />
      </div>
      <div className="block lg:hidden">
        <MobileView projects={projects} blogs={blogs} skills={skills} />
      </div>
    </div>
  );
}
