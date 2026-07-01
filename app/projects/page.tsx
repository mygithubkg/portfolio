"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaGithub, FaFolder, FaMicrochip, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiTailwindcss, SiPostgresql, SiExpress, SiStreamlit, SiScikitlearn } from 'react-icons/si';
import { ArrowUpRight, Code2, TerminalSquare, Eye, Box, Activity, X, LayoutGrid } from 'lucide-react';
import { useData } from '@/context/DataContext';

/* ── NOTE ON DATA SHAPE ──────────────────────────────────────────────
   This component now expects two new optional fields on Project:
     featured?: boolean            // drives the ONE full-width slot
     weight?: 'lg' | 'md' | 'sm'   // drives column span for non-featured
   Both are optional and default safely (see getGridSpan below), so no
   backfill is required — but the useData() Project type should add
   them so authors can actually set featured work going forward.
   ──────────────────────────────────────────────────────────────────── */

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

const UNIT = 120; // base grid unit in px — every row-span is a multiple of this

/* ── Grid math: derives span from real signals, not array position ── */
function isContentDense(project: any) {
  const descLen = (project.description || '').length;
  const techCount = (project.tech || []).length;
  return descLen + techCount * 20 > 220;
}

function getColSpan(project: any) {
  if (project.featured) return 'md:col-span-12';
  switch (project.weight) {
    case 'lg': return 'md:col-span-7';
    case 'sm': return 'md:col-span-5';
    default: return 'md:col-span-6';
  }
}

function getRowSpan(project: any) {
  const dense = isContentDense(project);
  if (project.featured) return dense ? 'md:row-span-5' : 'md:row-span-4';
  return dense ? 'md:row-span-4' : 'md:row-span-3';
}

/* ── Considered empty-image state — icon + enlarged tech stack instead
   of a bare gray box, since "no image" is an expected, real state. ── */
function NoImageFallback({ project, size = 'card' }: { project: any; size?: 'card' | 'modal' }) {
  const iconSize = size === 'modal' ? 22 : 16;
  const boxSize = size === 'modal' ? 40 : 28;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#050505] px-6">
      <Box className="text-white/10" size={boxSize} />
      <div className="flex flex-wrap justify-center gap-2 max-w-[80%]">
        {(project.tech || []).slice(0, size === 'modal' ? 6 : 4).map((t: string, i: number) => (
          <span
            key={i}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/5 text-gray-500"
            title={t}
          >
            <span style={{ fontSize: iconSize }}>{techIcons[t] || <FaMicrochip />}</span>
          </span>
        ))}
      </div>
      <span className="font-mono text-[10px] text-gray-700 tracking-widest uppercase">{project.category}</span>
    </div>
  );
}

/* ── Minimal, dependency-free focus trap for the modal ── */
function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(el => el.offsetParent !== null);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = getFocusable();
    (focusables[0] || container).focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const items = getFocusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, containerRef, onClose]);
}

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, loading, error } = useData();
  const projects = data?.projects || [];
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(!!selectedId, modalRef, () => setSelectedId(null));

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : 'unset';
  }, [selectedId]);

  const openProject = useCallback((e: React.SyntheticEvent, id: string) => {
    (e.currentTarget as HTMLElement).focus?.();
    setSelectedId(id);
  }, []);

  const handleCardKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProject(e, id);
    }
  }, [openProject]);

  /* Honest telemetry: derived from real per-project status, not hardcoded */
  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p: any) => {
      const key = (p.status || 'Unknown').trim();
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([status, count]) => `${count} ${status.toUpperCase()}`)
      .join(' · ');
  }, [projects]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-cyan-500 font-mono text-sm flex items-center gap-3 tracking-widest uppercase">
          <div className="w-2 h-2 bg-cyan-500 animate-ping rounded-full" />
          Querying_Databases...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#030303] flex items-center justify-center text-center">
        <div>
          <TerminalSquare className="mx-auto text-red-500/50 mb-4" size={48} />
          <div className="text-red-500 font-mono text-sm uppercase tracking-widest">Sys_Error: Mount Failed</div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-20 pb-12 md:py-32 relative bg-[#030303] text-gray-300 selection:bg-cyan-500/30 font-sans overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-[88%] md:w-[75%] mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs mb-4 md:mb-6 tracking-widest uppercase">
              <FaFolder size={12} />
              <span>/ROOT/DEPLOYMENTS</span>
            </div>
            {/* Gradient-clip text removed — same decision made site-wide on the blog
                pages. This page's own sans/uppercase/black system carries the headline. */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Live <br className="hidden md:block" />
              <span className="text-gray-600">Systems.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="hidden md:flex flex-col gap-2 font-mono text-xs text-gray-500 bg-white/[0.02] border border-white/5 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity size={14} /> SYSTEM_TELEMETRY
            </div>
            <div className="w-full h-px bg-white/10 my-1" />
            <div>TOTAL_MODULES: <span className="text-white">{projects.length}</span></div>
            <div>STATUS: <span className="text-white">{statusSummary || 'N/A'}</span></div>
          </motion.div>
        </div>

        {/* --- THE BENTO GRID / APP FEED --- */}
        {projects.length === 0 ? (
          <div className="py-24 text-center border-y border-white/10">
            <LayoutGrid className="mx-auto text-gray-700 mb-4" size={40} />
            <p className="font-mono text-sm text-gray-400 mb-1 tracking-widest uppercase">No_Modules_Deployed</p>
            <p className="font-mono text-xs text-gray-600">Systems will appear here once they go live.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 md:auto-rows-[120px]">
            {projects.map((project: any, index: number) => {
              const isFeatured = !!project.featured;
              const colSpanClass = getColSpan(project);
              const rowSpanClass = getRowSpan(project);
              const titleId = `project-title-${project.id}`;

              return (
                <motion.div
                  key={project.id}
                  layoutId={`card-container-${project.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: Math.min((index % 6) * 0.08, 0.4), duration: 0.5 }}
                  onClick={(e) => openProject(e, project.id)}
                  onKeyDown={(e) => handleCardKeyDown(e, project.id)}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  aria-labelledby={titleId}
                  className={`group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] rounded-[1.5rem] md:rounded-[2rem] ${colSpanClass} ${rowSpanClass}`}
                >
                  {/* CARD ARCHITECTURE */}
                  <div className={`
                    relative bg-[#0a0a0c] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 h-full
                    hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]
                    ${isFeatured ? 'flex flex-col md:flex-row' : 'flex flex-col'}
                  `}>

                    {/* Image Section */}
                    <motion.div
                      layoutId={`image-${project.id}`}
                      className={`relative overflow-hidden ${isFeatured ? 'aspect-[4/3] md:aspect-auto md:h-full md:w-[60%]' : 'aspect-[4/3] md:aspect-auto md:h-[55%] w-full'}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent z-10 md:hidden" />
                      {isFeatured && <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0c] z-10" />}

                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <NoImageFallback project={project} size="card" />
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-5 left-5 md:top-6 md:left-6 z-20">
                        <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-400 tracking-widest uppercase rounded-full flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                          {project.status}
                        </span>
                      </div>
                    </motion.div>

                    {/* Content Section */}
                    <div className={`relative z-20 flex flex-col justify-between p-5 md:p-10 flex-1 ${isFeatured ? 'md:h-full md:w-[40%]' : 'md:h-[45%] w-full'}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c] to-transparent md:hidden -z-10 -top-16" />

                      <div>
                        <span className="text-[10px] md:text-xs font-mono text-cyan-500 mb-1.5 md:mb-2 block tracking-widest uppercase">
                          {project.category}
                        </span>
                        <motion.h3
                          layoutId={`title-${project.id}`}
                          id={titleId}
                          className="text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 md:line-clamp-3 leading-tight"
                        >
                          {project.title}
                        </motion.h3>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-light hidden md:block">
                          {project.description}
                        </p>

                        {/* Tech Stack Pills — fixed mask-image syntax + Safari fallback */}
                        <div className="flex overflow-x-auto gap-2 pt-1 md:pt-2 pb-1 [&::-webkit-scrollbar]:hidden [-webkit-mask-image:linear-gradient(to_right,white_80%,transparent)] [mask-image:linear-gradient(to_right,white_80%,transparent)]">
                          {project.tech.map((t: string, i: number) => (
                            <div key={i} className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-mono text-gray-300 whitespace-nowrap">
                              {techIcons[t] || <FaMicrochip />}
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* --- THE EXECUTION MODAL (Bottom Sheet / Desktop IDE) --- */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedId && (
          <>
            {/* Deep Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-[#030303]/80 md:bg-[#030303]/90 backdrop-blur-md md:backdrop-blur-xl z-50 cursor-pointer"
            />

            {/* Modal Container: Appends to bottom on mobile, centers on desktop */}
            <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-8 pointer-events-none">
              {projects.filter((p: any) => p.id === selectedId).map((project: any) => {
                const modalTitleId = `modal-title-${project.id}`;
                return (
                  <motion.div
                    key={project.id}
                    ref={modalRef}
                    layoutId={`card-container-${project.id}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={modalTitleId}
                    tabIndex={-1}
                    className="w-full md:max-w-5xl bg-[#0a0a0c] md:border border-white/10 
                               rounded-t-[32px] md:rounded-[2rem] overflow-hidden 
                               shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-[0_0_50px_rgba(0,0,0,0.5)] 
                               pointer-events-auto h-[92vh] md:h-auto md:max-h-[95vh] flex flex-col relative outline-none"
                  >

                    {/* MOBILE NATIVE HEADER (Bottom Sheet Handle + Close) */}
                    <div className="md:hidden flex flex-col items-center sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 shrink-0 px-5 pb-3 pt-2">
                      <div className="w-12 h-1.5 bg-white/20 rounded-full mb-3" />
                      <div className="w-full flex justify-between items-center">
                        <span className="font-mono text-[10px] text-cyan-500 tracking-widest uppercase">sys_preview</span>
                        <button
                          onClick={() => setSelectedId(null)}
                          aria-label="Close project details"
                          className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-gray-300 active:scale-90 transition-transform"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* MACOS DESKTOP HEADER */}
                    <div className="hidden md:flex h-14 bg-white/[0.02] border-b border-white/5 items-center justify-between px-6 shrink-0">
                      <div className="flex gap-2">
                        <button
                          aria-label="Close project details"
                          className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-400"
                          onClick={() => setSelectedId(null)}
                        />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="font-mono text-xs text-gray-500 tracking-widest uppercase">sys_execution_preview</div>
                      <div className="w-16" /> {/* Spacer */}
                    </div>

                    {/* Modal Body */}
                    <div className="flex flex-col md:flex-row flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden overscroll-contain">

                      {/* Visuals */}
                      <motion.div layoutId={`image-${project.id}`} className="w-full h-[250px] md:h-auto md:w-1/2 relative shrink-0 bg-[#050505]">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                            onError={(e: any) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <NoImageFallback project={project} size="modal" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0c]" />
                      </motion.div>

                      {/* Content */}
                      <div className="md:w-1/2 p-6 md:p-12 flex flex-col relative z-10 -mt-10 md:mt-0">
                        <div className="mb-6 md:mb-8">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a0a0c] md:bg-cyan-500/10 text-cyan-400 font-mono text-[10px] tracking-widest uppercase rounded-full md:border border-cyan-500/20 mb-3 shadow-xl md:shadow-none">
                            <Box size={10} /> {project.category}
                          </span>
                          <motion.h2 layoutId={`title-${project.id}`} id={modalTitleId} className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
                            {project.title}
                          </motion.h2>
                        </div>

                        <div className="space-y-6 md:space-y-8 flex-1">
                          <div>
                            <h4 className="text-white text-[10px] md:text-xs font-mono tracking-widest uppercase mb-2 md:mb-3 text-gray-500">System Architecture</h4>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                              {project.details || project.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-white text-[10px] md:text-xs font-mono tracking-widest uppercase mb-2 md:mb-3 text-gray-500">Core Modules</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((t: string, i: number) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 text-gray-300 text-xs font-mono rounded-lg">
                                  {techIcons[t] || <FaMicrochip />} {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/5 pb-8 md:pb-0">
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="flex-1 group flex items-center justify-center gap-2 py-4 md:py-4 bg-white text-black font-bold text-sm rounded-2xl md:rounded-xl hover:bg-cyan-400 transition-all active:scale-95">
                              <Eye size={16} /> DEPLOYMENT
                              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform hidden md:block" />
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noreferrer" className="flex-1 group flex items-center justify-center gap-2 py-4 md:py-4 bg-white/[0.03] border border-white/10 text-white font-bold text-sm rounded-2xl md:rounded-xl hover:bg-white/10 transition-all active:scale-95">
                              <Code2 size={16} /> REPOSITORY
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}