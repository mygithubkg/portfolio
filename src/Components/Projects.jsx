import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaGithub, FaFolder, FaMicrochip, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiTailwindcss, SiPostgresql, SiExpress, SiStreamlit, SiScikitlearn } from 'react-icons/si';
import { ArrowUpRight, Code2, TerminalSquare, Eye, Box, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';

// --- ICON MAPPING ---
const techIcons = {
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

export default function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const { data, loading, error } = useData();
  const projects = data?.projects || [];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedId]);

  // Algorithmic Grid Sizing for Desktop Bento Layout
  const getGridSpan = (index) => {
    const pattern = index % 5;
    if (pattern === 0) return 'md:col-span-12'; // Featured (Full Width)
    if (pattern === 1 || pattern === 2) return 'md:col-span-6'; // Half Split
    if (pattern === 3) return 'md:col-span-7'; // Asymmetrical Large
    if (pattern === 4) return 'md:col-span-5'; // Asymmetrical Small
    return 'md:col-span-12';
  };

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
    <section className="min-h-screen pt-24 pb-12 md:py-32 relative bg-[#030303] text-gray-300 selection:bg-cyan-500/30 font-sans">

      {/* Ambient Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-[80%] md:w-[75%] mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs mb-6 tracking-widest uppercase">
              <FaFolder size={12} />
              <span>/ROOT/DEPLOYMENTS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Live <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">Systems.</span>
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
            <div>STATUS: <span className="text-white">ALL_OPERATIONAL</span></div>
          </motion.div>
        </div>

        {/* --- THE BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {projects.map((project, index) => {
            const isFeatured = index % 5 === 0;
            const colSpanClass = getGridSpan(index);

            return (
              <motion.div
                key={project.id}
                layoutId={`card-container-${project.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 5) * 0.1, duration: 0.5 }}
                onClick={() => setSelectedId(project.id)}
                className={`group cursor-pointer ${colSpanClass}`}
              >
                {/* CARD ARCHITECTURE:
                  Mobile: Massive vertical app-store card.
                  Desktop: Adapts based on Bento col-span.
                */}
                <div className={`
                  relative bg-[#0a0a0c] border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500
                  hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]
                  ${isFeatured ? 'flex flex-col md:flex-row h-[450px] md:h-[500px]' : 'flex flex-col h-[450px] md:h-[450px]'}
                `}>

                  {/* Image Section */}
                  <motion.div
                    layoutId={`image-${project.id}`}
                    className={`relative overflow-hidden ${isFeatured ? 'h-[60%] md:h-full md:w-[60%]' : 'h-[60%] w-full'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10 md:hidden" />
                    {isFeatured && <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0c] z-10" />}

                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover filter grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-400 tracking-widest uppercase rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                        {project.status}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content Section */}
                  <div className={`relative z-20 flex flex-col justify-between p-6 md:p-10 ${isFeatured ? 'h-[40%] md:h-full md:w-[40%]' : 'h-[40%] w-full'}`}>

                    {/* Mobile Only: App Store gradient bleed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent md:hidden -z-10 -top-20" />

                    <div>
                      <span className="text-xs font-mono text-cyan-500 mb-2 block tracking-widest uppercase">
                        {project.category}
                      </span>
                      <motion.h3
                        layoutId={`title-${project.id}`}
                        className="text-2xl md:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight"
                      >
                        {project.title}
                      </motion.h3>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-light hidden md:block">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tech.slice(0, isFeatured ? 4 : 3).map((t, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-mono text-gray-300">
                            {techIcons[t] || <FaMicrochip />}
                            <span className="hidden sm:inline-block">{t}</span>
                          </div>
                        ))}
                        {project.tech.length > (isFeatured ? 4 : 3) && (
                          <div className="flex items-center px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-mono text-gray-500">
                            +{project.tech.length - (isFeatured ? 4 : 3)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* --- THE EXECUTION MODAL (Mac/IDE Window) ---             */}
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
              className="fixed inset-0 bg-[#030303]/90 backdrop-blur-xl z-50 cursor-pointer"
            />

            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 pointer-events-none">
              {projects.filter(p => p.id === selectedId).map(project => (
                <motion.div
                  key={project.id}
                  layoutId={`card-container-${project.id}`}
                  className="w-full max-w-5xl bg-[#0a0a0c] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto max-h-[95vh] flex flex-col relative"
                >
                  {/* MacOS Style Window Header */}
                  <div className="h-14 bg-white/[0.02] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-400" onClick={() => setSelectedId(null)} />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="font-mono text-xs text-gray-500 tracking-widest uppercase">sys_execution_preview</div>
                    <div className="w-16" /> {/* Spacer for centering */}
                  </div>

                  {/* Modal Body: Split Layout on Desktop, Stacked on Mobile */}
                  <div className="flex flex-col md:flex-row flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">

                    {/* Left: Visuals */}
                    <motion.div layoutId={`image-${project.id}`} className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-[#050505]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0c]" />
                    </motion.div>

                    {/* Right: Telemetry & Content */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                      <div className="mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 font-mono text-[10px] tracking-widest uppercase rounded-full border border-cyan-500/20 mb-4">
                          <Box size={10} /> {project.category}
                        </span>
                        <motion.h2 layoutId={`title-${project.id}`} className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                          {project.title}
                        </motion.h2>
                      </div>

                      <div className="space-y-8 flex-1">
                        <div>
                          <h4 className="text-white text-xs font-mono tracking-widest uppercase mb-3 text-gray-500">System Architecture</h4>
                          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                            {project.details || project.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-white text-xs font-mono tracking-widest uppercase mb-3 text-gray-500">Core Modules</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((t, i) => (
                              <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 text-gray-300 text-xs font-mono rounded-lg">
                                {techIcons[t] || <FaMicrochip />} {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Native App Feel */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-8 border-t border-white/5">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noreferrer" className="flex-1 group flex items-center justify-center gap-2 py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-cyan-400 transition-all active:scale-95">
                            <Eye size={16} /> DEPLOYMENT
                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noreferrer" className="flex-1 group flex items-center justify-center gap-2 py-4 bg-white/[0.03] border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-all active:scale-95">
                            <Code2 size={16} /> REPOSITORY
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}