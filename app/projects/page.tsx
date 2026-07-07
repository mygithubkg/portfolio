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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0a0a0c] to-[#111] px-6">
      <Box className="text-cyan-500/20" size={48} />
      <div className="flex flex-wrap justify-center gap-2 max-w-[80%]">
        {(project.tech || []).slice(0, 5).map((t: string, i: number) => (
          <span
            key={i}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-gray-500 shadow-lg"
            title={t}
          >
            <span className="text-xl">{techIcons[t] || <FaMicrochip />}</span>
          </span>
        ))}
      </div>
      <span className="font-mono text-xs text-gray-600 tracking-widest uppercase mt-2">
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
    <div className="w-full bg-[#030303] rounded-lg border border-white/5 p-3 font-mono text-[10px] text-green-500/80 leading-relaxed mb-6 h-[88px] overflow-hidden">
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
        className="w-2 h-3 bg-green-500/80 mt-1"
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

  // --- TOP LEVEL HOOKS (FIXED POSITION) ---
  // 3D Tilt & Glare Logic 
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Transform values for tilt (max 5 degrees)
  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);

  // Transform values for glare position
  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
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

  // --- EARLY RETURNS (Must happen AFTER all hooks) ---
  if (loading) {
    return (
      <section className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-cyan-500 font-mono text-sm flex items-center gap-3 tracking-widest uppercase">
          <div className="w-2 h-2 bg-cyan-500 animate-ping rounded-full" />
          Querying_Databases...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#050505] flex items-center justify-center text-center">
        <div>
          <TerminalSquare className="mx-auto text-red-500/50 mb-4" size={48} />
          <div className="text-red-500 font-mono text-sm uppercase tracking-widest">Sys_Error: Mount Failed</div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 md:py-32 bg-[#050505] text-gray-300 font-sans relative overflow-hidden selection:bg-cyan-500/30">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-950/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
              <Sparkles size={12} />
              <span>/ROOT/DEPLOYMENTS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Systems.</span>
            </h1>
          </div>

          {projects.length > 0 && (
            <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveTab(category);
                    const firstMatch = projects.find((p: any) => category === "All" || (p.category || 'Uncategorized') === category);
                    if (firstMatch) setSelectedId(firstMatch.id);
                  }}
                  className={`relative px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300 ${activeTab === category ? "text-white font-bold" : "text-gray-400 hover:text-white"
                    }`}
                >
                  {activeTab === category && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg -z-10"
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
          <div className="py-24 text-center border-y border-white/10">
            <LayoutGrid className="mx-auto text-gray-700 mb-4" size={40} />
            <p className="font-mono text-sm text-gray-400 mb-1 tracking-widest uppercase">No_Modules_Deployed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* --- LEFT PANE: Scannable List (7 Cols) --- */}
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider px-2 mb-2 flex justify-between">
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
                      className={`group relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border text-left flex items-center justify-between gap-4 overflow-hidden ${isSelected
                        ? "bg-gradient-to-r from-white/[0.08] to-white/[0.02] border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.05)]"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                        }`}
                    >
                      {/* Hover Spotlight Effect for non-selected items */}
                      {!isSelected && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.06)_0%,transparent_50%)]" />
                      )}

                      {/* Active Left Indicator Bar */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        />
                      )}

                      <div className="flex items-center gap-4 min-w-0 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-gray-400 group-hover:text-white"
                          }`}>
                          <Folder size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className={`text-base sm:text-lg font-bold truncate transition-colors flex items-center gap-2 ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                            }`}>
                            {project.title}
                            {project.featured && <Sparkles size={12} className="text-yellow-500/70" />}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-1">
                            <span className="text-cyan-500/80">{project.category || 'Uncategorized'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Box size={10} /> {(project.tech && project.tech.length) || 0} Modules
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                          <div className={`w-1.5 h-1.5 rounded-full ${project.status?.toLowerCase() === 'live' ? 'bg-green-400 animate-pulse' : 'bg-cyan-400'}`} />
                          {project.status || 'Active'}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isSelected ? "bg-cyan-400 text-black rotate-0 font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "bg-transparent text-gray-600 -rotate-45 group-hover:text-gray-400 group-hover:translate-x-0.5"
                          }`}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* --- RIGHT PANE: 3D Interactive Detail Showcase (5 Cols, Sticky) --- */}
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
                    className="bg-gradient-to-b from-[#0e0e12] to-[#08080a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group cursor-crosshair"
                  >
                    {/* Dynamic Glare Effect mapping to mouse */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: glareBackground }}
                    />

                    {/* Image Preview (Popped out slightly in 3D) */}
                    <div style={{ transform: "translateZ(20px)" }} className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-6 bg-black/40 border border-white/5">
                      {activeProject.image ? (
                        <>
                          <img
                            src={activeProject.image}
                            alt={activeProject.title}
                            className="w-full h-full object-cover object-top filter brightness-90 group-hover:scale-110 transition-transform duration-1000 ease-out"
                            onError={(e: any) => e.target.style.display = 'none'}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent opacity-90" />
                        </>
                      ) : (
                        <NoImageFallback project={activeProject} />
                      )}
                    </div>

                    <div style={{ transform: "translateZ(30px)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
                          {activeProject.title}
                        </h2>
                      </div>

                      {/* Animated Terminal Boot Sequence */}
                      <SystemTerminal project={activeProject} />

                      {/* Tech Stack Breakdown */}
                      <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                          {(activeProject.tech || []).map((t: string, i: number) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors border border-white/5 text-gray-300 rounded-xl text-xs font-mono cursor-default"
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
                            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-widest uppercase font-mono transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
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
                            className="flex-1 py-3.5 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase font-mono transition-all duration-300 flex items-center justify-center gap-2"
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