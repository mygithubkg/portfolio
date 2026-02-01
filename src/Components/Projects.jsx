import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaGithub, FaExternalLinkAlt, FaFolder, FaDatabase, FaMicrochip, FaHtml5, FaCss3Alt, FaGamepad, FaHeartbeat } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiTailwindcss, SiOpenai, SiPostgresql, SiExpress, SiStreamlit, SiScikitlearn } from 'react-icons/si';
import { useData } from '../context/DataContext';

// --- ICON MAPPING ---
// This maps your text strings (e.g., "React") to actual Icons
const techIcons = {
  'React': <FaReact />,
  'Node.js': <FaNodeJs />,
  'Firebase': <SiFirebase />,
  'Python': <FaMicrochip />, // Using Microchip for Python generic
  'Tailwind CSS': <SiTailwindcss />,
  'JavaScript': <SiJavascript />,
  'PostgreSQL': <SiPostgresql />,
  'Express': <SiExpress />,
  'Scikit-learn': <SiScikitlearn />,
  'HTML5': <FaHtml5 />,
  'CSS3': <FaCss3Alt />,
  'Streamlit': <SiStreamlit />
};

// --- AUTHENTIC DATA: FROM YOUR LIST ---

export default function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const { data, loading, error } = useData();
  const projects = data.projects;

  if (loading) {
    return (
      <section className="min-h-screen py-24 relative overflow-hidden bg-[#050505] flex items-center justify-center">
        <div className="text-cyan-500 font-mono text-sm">Loading projects...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen py-24 relative overflow-hidden bg-[#050505] flex items-center justify-center">
        <div className="text-red-500 font-mono text-sm">Error loading projects. Using default data.</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-24 relative overflow-hidden bg-[#050505]">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-cyan-500 font-mono text-xs mb-4"
            >
              <FaFolder />
              <span>/ROOT/PROJECTS_DIRECTORY</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight"
            >
              DEPLOYED <span className="text-gray-600">SYSTEMS</span>
            </motion.h2>
          </div>
          <div className="text-right hidden md:block">
             <div className="text-xs font-mono text-gray-500">TOTAL_MODULES: {projects.length}</div>
             <div className="text-xs font-mono text-gray-500">STATUS: ALL_SYSTEMS_OPERATIONAL</div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedId(project.id)}
              className="group cursor-pointer"
            >
              {/* The "Cartridge" Card */}
              <div className="relative h-full bg-[#0a0a0a] border border-white/10 hover:border-cyan-500/50 transition-colors duration-500 rounded-lg overflow-hidden flex flex-col">
                
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden border-b border-white/5">
                   <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   {/* Fallback to gray box if image fails, or use real image */}
                   <img 
                     src={project.image} 
                     alt={project.title}
                     className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                     onError={(e) => {
                       e.target.style.display = 'none'; // Hide broken image
                       e.target.nextSibling.style.display = 'flex'; // Show fallback
                     }}
                   />
                   {/* Fallback Placeholder (Hidden by default) */}
                   <div className="hidden absolute inset-0 bg-gray-900 items-center justify-center text-gray-700 font-mono text-xs">
                     NO_IMG_DATA
                   </div>
                   
                   {/* Status Badge */}
                   <div className="absolute top-3 right-3 z-20">
                      <span className="px-2 py-1 bg-black/80 border border-white/20 text-[10px] font-mono text-cyan-400 rounded">
                        {project.status}
                      </span>
                   </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-mono text-gray-500 mb-1 block">{project.id}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                      <FaExternalLinkAlt className="text-gray-600 group-hover:text-white transition-colors text-xs" />
                   </div>

                   <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                     {project.description}
                   </p>

                   {/* Tech Tags */}
                   <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {project.tech.slice(0, 3).map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-gray-300">
                           {techIcons[t] || <FaMicrochip />} 
                           <span>{t}</span>
                        </div>
                      ))}
                      {project.tech.length > 3 && (
                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-gray-500">
                          +{project.tech.length - 3}
                        </div>
                      )}
                   </div>
                </div>

                {/* Hover Scanning Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-500 group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- MODAL (The "File Details" View) --- */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 cursor-pointer"
            />
            
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              {projects.filter(p => p.id === selectedId).map(project => (
                <motion.div
                  key={project.id}
                  layoutId={`card-${project.id}`}
                  className="w-full max-w-3xl bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col"
                >
                  {/* Modal Header */}
                  <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                       <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="font-mono text-xs text-gray-500">system_preview.exe</div>
                    <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-white">✕</button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="grid md:grid-cols-2 h-full">
                       {/* Left: Image */}
                       <div className="h-48 md:h-auto relative overflow-hidden bg-black">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                       </div>

                       {/* Right: Details */}
                       <div className="p-6 md:p-8 flex flex-col">
                          <div className="mb-6">
                             <span className="text-cyan-500 font-mono text-xs">{project.category}</span>
                             <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 leading-tight">{project.title}</h2>
                          </div>

                          <div className="space-y-6 flex-1">
                             <div className="border-l-2 border-white/10 pl-4">
                                <h4 className="text-white text-sm font-bold mb-1">Architecture & Impact</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{project.details}</p>
                             </div>
                             
                             <div>
                                <h4 className="text-white text-sm font-bold mb-2">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                   {project.tech.map((t, i) => (
                                      <span key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-gray-300 text-xs border border-white/10 rounded">
                                         {techIcons[t]} {t}
                                      </span>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                             {project.links.live && (
                               <a href={project.links.live} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-white text-black text-center text-sm font-bold hover:bg-cyan-400 transition-colors rounded">
                                  LAUNCH LIVE
                               </a>
                             )}
                             {project.links.code && (
                               <a href={project.links.code} target="_blank" rel="noreferrer" className="flex-1 py-3 border border-white/20 text-white text-center text-sm font-bold hover:bg-white/10 transition-colors rounded flex items-center justify-center gap-2">
                                  <FaGithub /> CODE
                               </a>
                             )}
                          </div>
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