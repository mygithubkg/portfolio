"use client"
import React, { useState, useEffect, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import {
  FaReact, FaNodeJs, FaMicrochip, FaHtml5, FaCss3Alt
} from 'react-icons/fa';
import {
  SiFirebase, SiJavascript, SiTailwindcss, SiPostgresql, SiExpress, SiStreamlit, SiScikitlearn
} from 'react-icons/si';
import {
  ArrowUpRight, Code2, TerminalSquare, Eye, Box, Activity, Folder, Sparkles, ArrowRight, LayoutGrid
} from 'lucide-react';
import { useData } from '@/context/DataContext';

// --- ICON MAPPING ---
const techIcons: any = {
  'React': <FaReact />,
  'Node.js': <FaNodeJs />,
  'Firebase': <SiFirebase />,
  'Python': <FaMicrochip />,
  'Tailwind CSS': <SiTailwindcss />,
  'JavaScript': <SiJavascript />,
  'PostgreSQL': <SiPostgresql />,
  'Express': <SiExpress />,
  'Scikit-learn': <SiScikitlearn />,
  'HTML5': <FaHtml5 />,
  'CSS3': <FaCss3Alt />,
  'Streamlit': <SiStreamlit />
};

/* ── Fallback for projects without an image ── */
function NoImageFallback({ project }: { project: any }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: 'linear-gradient(135deg, var(--bg-raised), var(--bg-card))' }}
    >
      <Box style={{ color: 'var(--accent-dim)' }} size={48} />
      <div className="flex flex-wrap justify-center gap-2 max-w-[80%]">
        {(project.tech || []).slice(0, 5).map((t: string, i: number) => (
          <span
            key={i}
            className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg"
            style={{
              background: 'var(--bg-pill)',
              border: '1px solid var(--border-card)',
              color: 'var(--ink-dim)',
            }}
            title={t}
          >
            <span className="text-xl">{techIcons[t] || <FaMicrochip />}</span>
          </span>
        ))}
      </div>
      <span className="font-mono text-xs tracking-widest uppercase mt-2" style={{ color: 'var(--ink-faint)' }}>
        {project.category || 'Module'}
      </span>
    </div>
  );
}

/* ── Terminal Typing Effect Component ── */
function SystemTerminal({ project }: { project: any }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines([]);
    const sequence = [
      `> INITIATING SEQUENCE FOR [${project.title.toUpperCase()}]`,
      `> RESOLVING DEPENDENCIES: ${(project.tech || []).length} MODULES FOUND`,
      `> MOUNTING CORE: ${(project.tech || [])[0] || 'SYS_KERNEL'}`,
      `> STATUS: ${project.status?.toUpperCase() || 'ONLINE AND STABLE'}`
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < sequence.length) {
        setLines(prev => [...prev, sequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [project.id]);

  return (
    <div
      className="w-full rounded-lg p-3 font-mono text-[10px] text-green-500 leading-relaxed mb-6 h-[88px] overflow-hidden"
      style={{
        background: 'var(--bg-hero)',
        border: '1px solid var(--border-card)',
      }}
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {line}
        </motion.div>
      ))}
      <motion.div
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-2 h-3 bg-green-500 mt-1"
      />
    </div>
  );
}

export default function ProjectsVault() {
  const { data, loading, error } = useData();
  const rawProjects = data?.projects || [];

  // --- SMART SORTING LOGIC ---
  const projects = useMemo(() => {
    return [...rawProjects].sort((a: any, b: any) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const weightScore: Record<string, number> = { lg: 3, md: 2, sm: 1 };
      const aWeight = weightScore[a.weight] || 0;
      const bWeight = weightScore[b.weight] || 0;
      if (aWeight !== bWeight) return bWeight - aWeight;
      return 0;
    });
  }, [rawProjects]);

  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // --- TOP LEVEL HOOKS ---
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);
  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p: any) => p.category || 'Uncategorized'));
    return ["All", ...Array.from(cats)] as string[];
  }, [projects]);

  useEffect(() => {
    if (projects.length > 0 && !selectedId) setSelectedId(projects[0].id);
  }, [projects, selectedId]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p: any) =>
      activeTab === "All" || (p.category || 'Uncategorized') === activeTab
    );
  }, [projects, activeTab]);

  const activeProject = projects.find((p: any) => p.id === selectedId) || projects[0];

  // --- EARLY RETURNS ---
  if (loading) {
    return (
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-section)' }}
      >
        <div
          className="font-mono text-sm flex items-center gap-3 tracking-widest uppercase"
          style={{ color: 'var(--accent)' }}
        >
          <div className="w-2 h-2 animate-ping rounded-full" style={{ background: 'var(--accent)' }} />
          Querying_Databases...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="min-h-screen flex items-center justify-center text-center"
        style={{ background: 'var(--bg-section)' }}
      >
        <div>
          <TerminalSquare className="mx-auto text-red-500/50 mb-4" size={48} />
          <div className="text-red-500 font-mono text-sm uppercase tracking-widest">
            Sys_Error: Mount Failed
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen py-20 md:py-32 relative overflow-hidden"
      style={{ background: 'var(--bg-section)', color: 'var(--ink)' }}
    >

      {/* Background decorations */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 blur-3xl pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--accent-dim), transparent)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--border-card) 1px, transparent 1px), linear-gradient(to bottom, var(--border-card) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- SECTION HEADER --- */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 gap-6"
          style={{ borderBottom: '1px solid var(--rule)' }}
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs mb-4"
              style={{
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-rule)',
                color: 'var(--accent)',
              }}
            >
              <Sparkles size={12} />
              <span>/ROOT/DEPLOYMENTS</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase"
              style={{ color: 'var(--ink)' }}
            >
              Live{' '}
              <span style={{ color: 'var(--ink-faint)' }}>Systems.</span>
            </h1>
          </div>

          {projects.length > 0 && (
            <div
              className="flex flex-wrap gap-1 p-1 rounded-xl backdrop-blur-md"
              style={{
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-card)',
              }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveTab(category);
                    const firstMatch = projects.find((p: any) =>
                      category === "All" || (p.category || 'Uncategorized') === category
                    );
                    if (firstMatch) setSelectedId(firstMatch.id);
                  }}
                  className="relative px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300"
                  style={{ color: activeTab === category ? 'var(--ink)' : 'var(--ink-faint)' }}
                >
                  {activeTab === category && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 rounded-lg -z-10"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-dim), rgba(59,130,246,0.10))',
                        border: '1px solid var(--accent-rule)',
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div
            className="py-24 text-center"
            style={{ borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}
          >
            <LayoutGrid className="mx-auto mb-4" size={40} style={{ color: 'var(--ink-faint)' }} />
            <p className="font-mono text-sm mb-1 tracking-widest uppercase" style={{ color: 'var(--ink-dim)' }}>
              No_Modules_Deployed
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* --- LEFT PANE: Project List --- */}
            <div className="lg:col-span-7 space-y-3">
              <div
                className="text-xs font-mono uppercase tracking-wider px-2 mb-2 flex justify-between"
                style={{ color: 'var(--ink-faint)' }}
              >
                <span>System Name</span>
                <span>Status</span>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project: any) => {
                  const isSelected = selectedId === project.id;
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedId(project.id)}
                      className="group relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 text-left flex items-center justify-between gap-4 overflow-hidden"
                      style={{
                        background: isSelected ? 'var(--rule)' : 'var(--bg-pill)',
                        border: `1px solid ${isSelected ? 'var(--accent-rule)' : 'var(--border-card)'}`,
                        boxShadow: isSelected ? '0 0 20px var(--accent-dim)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.background = 'var(--rule)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule-strong)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.background = 'var(--bg-pill)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)';
                        }
                      }}
                    >
                      {/* Active Left Indicator Bar */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                          style={{
                            background: 'var(--accent)',
                            boxShadow: '0 0 8px var(--accent-glow)',
                          }}
                        />
                      )}

                      <div className="flex items-center gap-4 min-w-0 relative z-10">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            background: isSelected ? 'var(--accent-dim)' : 'var(--rule)',
                            color: isSelected ? 'var(--accent)' : 'var(--ink-dim)',
                          }}
                        >
                          <Folder size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3
                            className="text-base sm:text-lg font-bold truncate transition-colors flex items-center gap-2"
                            style={{ color: isSelected ? 'var(--ink)' : 'var(--ink-dim)' }}
                          >
                            {project.title}
                            {project.featured && <Sparkles size={12} className="text-yellow-500/70" />}
                          </h3>
                          <div
                            className="flex items-center gap-3 text-xs font-mono mt-1"
                            style={{ color: 'var(--ink-faint)' }}
                          >
                            <span style={{ color: 'var(--accent)' }}>
                              {project.category || 'Uncategorized'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Box size={10} /> {(project.tech && project.tech.length) || 0} Modules
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <span
                          className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-widest"
                          style={{
                            background: 'var(--bg-pill)',
                            border: '1px solid var(--border-card)',
                            color: 'var(--ink-dim)',
                          }}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${project.status?.toLowerCase() === 'live' ? 'animate-pulse' : ''}`}
                            style={{
                              background: project.status?.toLowerCase() === 'live'
                                ? '#4ade80'
                                : 'var(--accent)',
                            }}
                          />
                          {project.status || 'Active'}
                        </span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isSelected ? 'var(--accent)' : 'transparent',
                            color: isSelected ? 'var(--ink-invert)' : 'var(--ink-faint)',
                            transform: isSelected ? 'rotate(0deg)' : 'rotate(-45deg)',
                          }}
                        >
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* --- RIGHT PANE: 3D Detail Showcase --- */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 sm:mt-6 lg:mt-0 perspective-1000">
              {activeProject && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group cursor-crosshair"
                    aria-label={`${activeProject.title} project detail`}
                  >
                    {/* Theming via inline style to respond to CSS vars */}
                    <style>{`
                      .project-detail-card {
                        background: linear-gradient(to bottom, var(--bg-raised), var(--bg-card));
                        border: 1px solid var(--border-nav);
                      }
                    `}</style>
                    <div
                      className="project-detail-card absolute inset-0 rounded-3xl"
                      style={{
                        background: 'linear-gradient(to bottom, var(--bg-raised), var(--bg-card))',
                        border: '1px solid var(--border-nav)',
                      }}
                    />

                    {/* Dynamic Glare */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                      style={{ background: glareBackground }}
                    />

                    {/* Image Preview */}
                    <div
                      style={{ transform: "translateZ(20px)" }}
                      className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-6 z-10"
                    >
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-card)' }}
                      />
                      {activeProject.image ? (
                        <>
                          <img
                            src={activeProject.image}
                            alt={activeProject.title}
                            className="w-full h-full object-cover object-top filter brightness-90 group-hover:scale-110 transition-transform duration-1000 ease-out relative z-10"
                            onError={(e: any) => e.target.style.display = 'none'}
                          />
                          <div
                            className="absolute inset-0 z-20"
                            style={{ background: 'linear-gradient(to top, var(--bg-raised), transparent)' }}
                          />
                        </>
                      ) : (
                        <NoImageFallback project={activeProject} />
                      )}
                    </div>

                    <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h2
                          className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight flex items-center gap-2"
                          style={{ color: 'var(--ink)' }}
                        >
                          {activeProject.title}
                        </h2>
                      </div>

                      <SystemTerminal project={activeProject} />

                      {/* Tech Stack */}
                      <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                          {(activeProject.tech || []).map((t: string, i: number) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono cursor-default transition-colors"
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
                              {techIcons[t] || <FaMicrochip />}
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 relative z-20">
                        {activeProject.link && (
                          <a
                            href={activeProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs tracking-widest uppercase font-mono transition-all duration-300 flex items-center justify-center gap-2"
                            style={{
                              background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                              color: '#000',
                            }}
                          >
                            <Eye size={16} />
                            <span>Deployment</span>
                          </a>
                        )}

                        {activeProject.github && (
                          <a
                            href={activeProject.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs tracking-widest uppercase font-mono transition-all duration-300 flex items-center justify-center gap-2"
                            style={{
                              background: 'var(--bg-pill)',
                              border: '1px solid var(--border-card)',
                              color: 'var(--ink)',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = 'var(--rule)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = 'var(--bg-pill)';
                            }}
                          >
                            <Code2 size={16} />
                            <span>Repository</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}