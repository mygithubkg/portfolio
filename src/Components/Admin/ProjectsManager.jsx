import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, FolderGit2, Globe, Star, Image, Calendar, Tag, Terminal } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject } from '../../utils/dataManager';

// Reusable "Tech" Input Style
const TechInput = ({ label, name, value, onChange, placeholder, type = "text", required = false, rows }) => (
  <div className="group relative">
    <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase tracking-widest group-focus-within:text-cyan-400">
      {label} {required && '*'}
    </label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows || 3}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 p-3 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none transition-colors resize-none placeholder-gray-700"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-black/40 border border-white/10 p-3 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none transition-colors placeholder-gray-700"
      />
    )}
  </div>
);

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Initial Form State
  const initialFormState = {
    title: '', description: '', details: '', link: '',
    github: '', image: '', category: 'Web Development',
    tech: '', featured: false, year: new Date().getFullYear().toString(),
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const data = getProjects();
    setProjects(data);
    window.dispatchEvent(new Event('projectsUpdated'));
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech,
      });
    } else {
      setEditingProject(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()).filter(t => t),
    };

    if (editingProject) updateProject(editingProject.id, projectData);
    else addProject(projectData);

    loadProjects();
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('CONFIRM DELETION: This action cannot be undone. Proceed?')) {
      deleteProject(id);
      loadProjects();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-mono">
      
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 text-xs mb-2">
              <FolderGit2 size={16} />
              <span>/ ROOT / PROJECTS_DB</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">
              Project <span className="text-gray-600">Manifest</span>
            </h1>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-6 py-3 text-xs font-bold tracking-widest transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Plus size={16} />
            INITIALIZE_NEW_ENTRY
          </button>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group relative bg-[#0a0a0a] border border-white/10 hover:border-cyan-500/50 transition-colors"
              >
                {/* Header Bar */}
                <div className="h-8 bg-white/5 border-b border-white/10 flex items-center justify-between px-3">
                  <span className="text-[10px] text-gray-500">ID: {project.id.toString().padStart(4, '0')}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(project)} className="text-gray-500 hover:text-cyan-400 transition-colors"><Edit size={12} /></button>
                    <button onClick={() => handleDelete(project.id)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    {project.featured && <Star size={14} className="text-yellow-500 shrink-0" fill="currentColor" />}
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-gray-500 mb-4 border-l-2 border-white/10 pl-3">
                    <div>CAT: <span className="text-gray-300">{project.category}</span></div>
                    <div>YEAR: <span className="text-gray-300">{project.year}</span></div>
                    <div className="col-span-2 truncate">TECH: <span className="text-gray-300">{Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}</span></div>
                  </div>

                  {/* Image Preview (Small) */}
                  <div className="w-full h-24 bg-black border border-white/5 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100">
                    {project.image ? (
                      <img src={project.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">NO_IMG_DATA</div>
                    )}
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 group-hover:border-cyan-500 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- EMPTY STATE --- */}
        {projects.length === 0 && (
          <div className="border border-dashed border-white/10 rounded-lg p-20 text-center">
            <Terminal size={40} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 text-sm">DATABASE_EMPTY // WAITING_FOR_INPUT</p>
          </div>
        )}
      </div>

      {/* --- MODAL (SYSTEM PROMPT) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 animate-pulse" />
                  <h2 className="text-sm font-bold text-white tracking-widest">
                    {editingProject ? 'MODIFY_ENTITY_PARAMETERS' : 'NEW_ENTRY_PROTOCOL'}
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Basic Info */}
                  <div className="col-span-2">
                    <TechInput label="PROJECT_TITLE" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Neural Network V1" />
                  </div>

                  <TechInput label="CATEGORY" name="category" value={formData.category} onChange={handleChange} required placeholder="Web / AI / Mobile" />
                  <TechInput label="RELEASE_YEAR" name="year" value={formData.year} onChange={handleChange} required placeholder="2025" />

                  {/* Descriptions */}
                  <div className="col-span-2">
                    <TechInput label="SHORT_DESCRIPTION" name="description" value={formData.description} onChange={handleChange} type="textarea" rows={2} required placeholder="Brief overview for the card..." />
                  </div>
                  <div className="col-span-2">
                    <TechInput label="FULL_TECHNICAL_DETAILS" name="details" value={formData.details} onChange={handleChange} type="textarea" rows={4} placeholder="In-depth explanation..." />
                  </div>

                  {/* Links & Assets */}
                  <TechInput label="LIVE_DEPLOYMENT_URL" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
                  <TechInput label="SOURCE_CODE_REPO" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." />
                  
                  <div className="col-span-2">
                    <TechInput label="IMAGE_ASSET_PATH" name="image" value={formData.image} onChange={handleChange} placeholder="/images/project.png or URL" />
                  </div>

                  {/* Tech Stack */}
                  <div className="col-span-2">
                    <TechInput label="TECHNOLOGIES (CSV)" name="tech" value={formData.tech} onChange={handleChange} placeholder="React, Node.js, Python..." />
                  </div>

                  {/* Featured Toggle */}
                  <div className="col-span-2 flex items-center gap-3 border border-white/10 p-4 bg-white/5">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={formData.featured} 
                      onChange={handleChange}
                      className="w-4 h-4 accent-cyan-500 bg-black border-white/20"
                    />
                    <label className="text-xs font-mono text-gray-300">FLAG_AS_FEATURED_ENTRY</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors"
                  >
                    ABORT
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    {editingProject ? 'UPDATE_RECORDS' : 'EXECUTE_WRITE'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManager;