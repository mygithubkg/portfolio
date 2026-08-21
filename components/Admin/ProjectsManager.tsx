"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, FolderGit2, Globe, Star, Image, Calendar, Tag, Terminal, AlertTriangle, RotateCcw } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/utils/dataManager';
import { getDefaultProjects, addDefaultProject, updateDefaultProject, deleteDefaultProject, resetSectionToDefault } from '@/lib/utils/defaultsManager';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { projectSchema, validateData } from '@/lib/utils/validation';
import { sanitizeInput, handleSecureError, auditLog } from '@/lib/utils/security';
import { useRouter } from 'next/navigation';
import ResetToDefaultModal from './ResetToDefaultModal';

// Reusable "Tech" Input Style
const TechInput = ({ label, name, value, onChange, placeholder, type = "text", required = false, rows, options, error, className }: any) => {
  const baseClasses = className || `w-full bg-background/40 border ${error ? 'border-error' : 'border-border'} p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors placeholder-gray-700`;
  
  return (
    <div className="group relative w-full">
      <label className="block text-[10px] font-mono text-accent/70 mb-1 uppercase tracking-widest group-focus-within:text-accent">
        {label} {required && '*'}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          <option value="" disabled>{placeholder || 'Select an option'}</option>
          {options && options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      )}
      {error && <p className="mt-1 text-[10px] text-error font-mono animate-pulse">{error}</p>}
    </div>
  );
};

const DesktopGrid = ({ projects, handleOpenModal, openDeleteConfirmation }: any) => {
  const spotlightProjects = projects.filter((p: any) => p.spotlightRank > 0).sort((a: any, b: any) => a.spotlightRank - b.spotlightRank).slice(0, 3);
  
  return (
    <div className="hidden md:block">
      {spotlightProjects.length > 0 && (
        <div className="mb-8">
          <div className="font-mono text-xs text-textSecondary mb-4">
            &gt;_ CURRENT SPOTLIGHT (TOP 3)
          </div>
          <div className="grid grid-cols-3 gap-4">
            {spotlightProjects.map((project: any) => (
              <div key={project.id} className="bg-surface border border-border p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-accent">#{project.spotlightRank} Spotlight</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(project)} className="text-text hover:text-accent"><Edit size={12} /></button>
                    <button onClick={() => openDeleteConfirmation(project)} className="text-text hover:text-error"><Trash2 size={12} /></button>
                  </div>
                </div>
                <h4 className="font-bold text-text truncate">{project.title}</h4>
                <p className="text-xs text-text/70 line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border bg-surface">
        {projects.map((project: any) => (
          <div key={project.id} className="border-b border-r border-border p-6 flex flex-col gap-4 hover:bg-background/50 transition-colors">
             <div className="flex justify-between items-center">
               <span className="font-mono text-xs text-accent">
                 {project.spotlightRank > 0 ? `#${project.spotlightRank} Spotlight` : 'Archive'}
               </span>
               <div className="flex gap-3">
                 <button onClick={() => handleOpenModal(project)} className="text-text hover:text-accent font-mono text-[10px] uppercase">Edit</button>
                 <button onClick={() => openDeleteConfirmation(project)} className="text-text hover:text-error font-mono text-[10px] uppercase">Delete</button>
               </div>
             </div>
             <div>
               <h3 className="font-bold text-lg text-text mb-1 truncate">{project.title}</h3>
               <p className="text-xs text-text/70">{project.category} // {project.year}</p>
             </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full p-20 text-center border-b border-r border-border">
            <Terminal size={40} className="mx-auto text-text/50 mb-4" />
            <p className="text-text/50 text-sm font-mono tracking-widest">[ DATABASE_EMPTY ]</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileGrid = ({ projects, handleOpenModal, openDeleteConfirmation }: any) => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {projects.map((project: any) => (
        <div key={project.id} className="bg-surface border border-border flex flex-col">
          <div className="p-4 flex flex-col gap-2">
            <span className="font-mono text-xs text-accent">
              {project.spotlightRank > 0 ? `#${project.spotlightRank} Spotlight` : 'Archive'}
            </span>
            <h3 className="font-bold text-lg text-text">{project.title}</h3>
            <p className="text-xs text-text/70">{project.category} // {project.year}</p>
          </div>
          <div className="grid grid-cols-2 border-t border-border mt-auto">
            <button onClick={() => handleOpenModal(project)} className="p-4 text-text hover:bg-background border-r border-border font-mono text-xs uppercase flex items-center justify-center gap-2">
              <Edit size={14} /> Edit
            </button>
            <button onClick={() => openDeleteConfirmation(project)} className="p-4 text-error hover:bg-background font-mono text-xs uppercase flex items-center justify-center gap-2">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="border border-border p-12 text-center">
          <Terminal size={32} className="mx-auto text-text/50 mb-4" />
          <p className="text-text/50 text-xs font-mono tracking-widest">[ DATABASE_EMPTY ]</p>
        </div>
      )}
    </div>
  );
};

const DesktopModal = ({ formData, handleChange, handleSubmit, setIsModalOpen, editingProject, isSubmitting, errors }: any) => {
  const desktopInputClass = "w-full bg-transparent border-b border-border py-2 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors placeholder-gray-700";
  
  return (
    <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsModalOpen(false)}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent animate-pulse" />
            <h2 className="text-sm font-bold text-text tracking-widest">
              {editingProject ? 'MODIFY_ENTITY_PARAMETERS' : 'NEW_ENTRY_PROTOCOL'}
            </h2>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="text-text/70 hover:text-text"><X size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-2 divide-x divide-border overflow-y-auto custom-scrollbar h-full">
            {/* Left Column */}
            <div className="p-6 flex flex-col gap-6">
              <TechInput label="PROJECT_TITLE" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Neural Network V1" error={errors.title} className={desktopInputClass} />
              
              <div className="grid grid-cols-2 gap-6">
                <TechInput
                  label="CATEGORY"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  type="select"
                  options={['Web Development', 'Mobile App', 'AI/ML', 'Desktop App', 'Game Development', 'Other']}
                  error={errors.category}
                  className={desktopInputClass}
                />
                <TechInput label="RELEASE_YEAR" name="year" value={formData.year} onChange={handleChange} required placeholder="2025" error={errors.year} className={desktopInputClass} />
              </div>
              
              <TechInput label="IMAGE_ASSET_PATH" name="image" value={formData.image} onChange={handleChange} placeholder="/images/project.png or URL" error={errors.image} className={desktopInputClass} />
              
              {formData.image && (
                <div className="mt-4 border border-border bg-background aspect-video flex items-center justify-center overflow-hidden">
                   <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[10px] font-mono text-accent/70 uppercase tracking-widest">Spotlight Rank</label>
                <div className="flex gap-4">
                  {[0, 1, 2, 3].map((num) => (
                    <label key={num} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="spotlightRank" 
                        value={num} 
                        checked={formData.spotlightRank === num} 
                        onChange={handleChange}
                        className="accent-accent"
                      />
                      <span className="text-xs font-mono text-text">{num === 0 ? 'Archive (0)' : `Spotlight ${num}`}</span>
                    </label>
                  ))}
                </div>
              </div>

              <TechInput label="SHORT_DESCRIPTION" name="description" value={formData.description} onChange={handleChange} type="textarea" rows={2} required placeholder="Brief overview for the card..." error={errors.description} className={desktopInputClass} />
              <TechInput label="FULL_TECHNICAL_DETAILS" name="details" value={formData.details} onChange={handleChange} type="textarea" rows={4} placeholder="In-depth explanation..." error={errors.details} className={desktopInputClass} />
              <TechInput label="LIVE_DEPLOYMENT_URL" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." error={errors.link} className={desktopInputClass} />
              <TechInput label="SOURCE_CODE_REPO" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." error={errors.github} className={desktopInputClass} />
              <TechInput label="TECHNOLOGIES (CSV)" name="tech" value={formData.tech} onChange={handleChange} placeholder="React, Node.js, Python..." error={errors.tech} className={desktopInputClass} />
              
              {errors.submit && (
                <div className="p-3 bg-error/10 border border-error/50 text-error text-xs font-mono">
                  {errors.submit}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-text/70 hover:text-text hover:bg-surface text-xs font-bold transition-colors">
              ABORT
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-accent hover:bg-accent/90 text-background text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={14} /> {isSubmitting ? 'PROCESSING...' : (editingProject ? 'UPDATE_RECORDS' : 'EXECUTE_WRITE')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const MobileModal = ({ formData, handleChange, handleSubmit, setIsModalOpen, editingProject, isSubmitting, errors }: any) => {
  const mobileInputClass = "w-full bg-background border border-border p-4 text-text font-mono text-sm focus:border-accent focus:outline-none transition-colors";
  
  return (
    <div className="md:hidden fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex justify-between items-center">
        <span className="text-sm font-bold text-text">
          {editingProject ? 'EDIT_PROJECT' : 'NEW_PROJECT'}
        </span>
        <button onClick={() => setIsModalOpen(false)} className="text-text/70 p-2"><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 pb-32">
        <TechInput label="PROJECT_TITLE" name="title" value={formData.title} onChange={handleChange} required placeholder="Title" error={errors.title} className={mobileInputClass} />
        
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono text-accent/70 uppercase tracking-widest">Spotlight Rank</label>
          <select 
            name="spotlightRank" 
            value={formData.spotlightRank} 
            onChange={handleChange}
            className={mobileInputClass}
          >
            <option value={0}>Archive (0)</option>
            <option value={1}>Spotlight 1</option>
            <option value={2}>Spotlight 2</option>
            <option value={3}>Spotlight 3</option>
          </select>
        </div>

        <TechInput
          label="CATEGORY"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          type="select"
          options={['Web Development', 'Mobile App', 'AI/ML', 'Desktop App', 'Game Development', 'Other']}
          error={errors.category}
          className={mobileInputClass}
        />
        <TechInput label="RELEASE_YEAR" name="year" value={formData.year} onChange={handleChange} required placeholder="2025" error={errors.year} className={mobileInputClass} />
        
        <TechInput label="SHORT_DESCRIPTION" name="description" value={formData.description} onChange={handleChange} type="textarea" rows={3} required placeholder="Brief overview..." error={errors.description} className={mobileInputClass} />
        <TechInput label="FULL_TECHNICAL_DETAILS" name="details" value={formData.details} onChange={handleChange} type="textarea" rows={5} placeholder="In-depth explanation..." error={errors.details} className={mobileInputClass} />
        <TechInput label="LIVE_DEPLOYMENT_URL" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." error={errors.link} className={mobileInputClass} />
        <TechInput label="SOURCE_CODE_REPO" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." error={errors.github} className={mobileInputClass} />
        <TechInput label="IMAGE_ASSET_PATH" name="image" value={formData.image} onChange={handleChange} placeholder="URL" error={errors.image} className={mobileInputClass} />
        <TechInput label="TECHNOLOGIES (CSV)" name="tech" value={formData.tech} onChange={handleChange} placeholder="React, Node.js..." error={errors.tech} className={mobileInputClass} />
        
        {errors.submit && (
          <div className="p-4 bg-error/10 border border-error/50 text-error text-xs font-mono">
            {errors.submit}
          </div>
        )}
      </form>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-4">
        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-border text-text/70 text-sm font-bold">
          ABORT
        </button>
        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-4 bg-accent text-background text-sm font-bold disabled:opacity-50">
          {isSubmitting ? 'WAIT...' : 'UPDATE RECORDS'}
        </button>
      </div>
    </div>
  );
};


const ProjectsManager = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();
  const [mode, setMode] = useState('live'); // 'live' | 'defaults'
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState<any>({ open: false, projectId: null, projectTitle: '' });
  const [confirmText, setConfirmText] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // Initial Form State
  const initialFormState = {
    title: '', description: '', details: '', link: '',
    github: '', image: '', category: 'Web Development',
    tech: '', featured: false, year: new Date().getFullYear().toString(),
    spotlightRank: 0,
  };
  const [formData, setFormData] = useState(initialFormState);

  // Security: Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadProjects();
  }, [mode]); // reload whenever mode changes

  const loadProjects = async () => {
    try {
      const data = mode === 'live' ? await getProjects() : await getDefaultProjects();
      setProjects(data);
      if (mode === 'live') window.dispatchEvent(new Event('projectsUpdated'));
    } catch (error) {
      const errorMessage = handleSecureError(error as Error, 'Loading projects');
      console.error(errorMessage);
    }
  };

  const handleOpenModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        spotlightRank: project.spotlightRank || 0,
        tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech,
      });
    } else {
      setEditingProject(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    if (e && e.preventDefault) e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    console.log('[submit] mode:', mode, 'editingProject:', editingProject);
    console.log('[submit] formData before validation:', formData);

    // Prepare project data
    const projectData: any = {
      ...formData,
      tech: formData.tech ? formData.tech.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
      year: parseInt(formData.year)
    };

    // Strip empty strings for optional URL/image fields to prevent Yup validation errors
    if (projectData.link === '') projectData.link = null;
    if (projectData.github === '') projectData.github = null;
    if (projectData.image === '') projectData.image = null;

    // Validate data
    const validation = await validateData(projectData, projectSchema) as {
      isValid: boolean;
      errors: Record<string, string>;
      data: typeof projectData | null;
    };

    console.log('[submit] validation result:', validation);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      auditLog('VALIDATION_FAILED', { errors: validation.errors });
      return;
    }

    try {
      let result: { success: boolean; message?: string } | undefined;
      if (editingProject) {
        if (mode === 'live') {
          result = await updateProject(editingProject.id, validation.data);
        } else {
          result = await updateDefaultProject(editingProject.id, validation.data);
        }
        auditLog(`PROJECT_UPDATED_${mode.toUpperCase()}`, { projectId: editingProject.id });
      } else {
        if (mode === 'live') {
          result = await addProject(validation.data);
        } else {
          result = await addDefaultProject(validation.data);
        }
        auditLog(`PROJECT_ADDED_${mode.toUpperCase()}`);
      }
      // Surface Firestore-level failures (permission denied, network, etc.)
      if (result && !result.success) {
        throw new Error(result.message || 'Failed to save project to database.');
      }
      await loadProjects();
      setIsModalOpen(false);
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      console.log('[submit] catch error:', error);
      const errorMessage = handleSecureError(error as Error, 'Saving project');
      setErrors({ submit: errorMessage });
      auditLog('PROJECT_SAVE_ERROR', { error: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.projectId) return;
    if (confirmText !== 'DELETE') {
      setErrors({ delete: 'You must type DELETE to confirm' });
      return;
    }
    try {
      let result: { success: boolean; message?: string } | undefined;
      if (mode === 'live') {
        result = await deleteProject(deleteConfirmation.projectId);
      } else {
        result = await deleteDefaultProject(deleteConfirmation.projectId);
      }
      if (result && !result.success) {
        throw new Error(result.message || 'Failed to delete project from database.');
      }
      await loadProjects();
      setDeleteConfirmation({ open: false, projectId: null, projectTitle: '' });
      setConfirmText('');
      setErrors({});
      auditLog(`PROJECT_DELETED_${mode.toUpperCase()}`, { projectId: deleteConfirmation.projectId });
    } catch (error) {
      const errorMessage = handleSecureError(error as Error, 'Deleting project');
      setErrors({ delete: errorMessage });
      auditLog('PROJECT_DELETE_ERROR', { error: errorMessage });
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSectionToDefault('projects');
      setResetStatus(result.success ? 'LIVE_PROJECTS_RESET_TO_DEFAULTS' : result.message);
      setShowReset(false);
      if (mode === 'live') await loadProjects();
    } catch (err: any) {
      setResetStatus(`ERROR: ${err.message}`);
    } finally {
      setIsResetting(false);
      setTimeout(() => setResetStatus(null), 4000);
    }
  };

  const openDeleteConfirmation = (project: any) => {
    setDeleteConfirmation({
      open: true,
      projectId: project.id,
      projectTitle: project.title
    });
    setConfirmText('');
    setErrors({});
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    if (name === 'spotlightRank') {
      finalValue = parseInt(value, 10);
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  return (
    <div className="w-full relative z-10 flex flex-col min-h-full pb-20">
      {/* --- HEADER --- */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-text/50 mb-4">
          / ROOT / PROJECTS_DB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h1 className="font-display text-5xl xl:text-6xl text-text tracking-tight">
            Project Manifest.
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button 
                onClick={() => setMode('live')}
                className={`px-4 py-2 font-mono text-xs transition-colors border ${mode === 'live' ? 'border-accent text-accent' : 'border-transparent text-text/50 hover:text-text'}`}
              >
                [ LIVE_DATA ]
              </button>
              <button 
                onClick={() => setMode('defaults')}
                className={`px-4 py-2 font-mono text-xs transition-colors border ${mode === 'defaults' ? 'border-accent text-accent' : 'border-transparent text-text/50 hover:text-text'}`}
              >
                [ DEFAULTS ]
              </button>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="border border-border hover:border-accent hover:text-accent px-4 py-2 font-mono text-xs transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              + Initialize New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      {resetStatus && (
        <div className={`mb-6 px-4 py-2 text-xs font-mono border ${resetStatus.startsWith('ERROR') ? 'bg-error/10 border-error/30 text-error' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
          {resetStatus}
        </div>
      )}

      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect live visitors.
        </div>
      )}

      {/* --- GRID LAYOUT --- */}
      <DesktopGrid projects={projects} handleOpenModal={handleOpenModal} openDeleteConfirmation={openDeleteConfirmation} />
      <MobileGrid projects={projects} handleOpenModal={handleOpenModal} openDeleteConfirmation={openDeleteConfirmation} />

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <DesktopModal 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit} 
              setIsModalOpen={setIsModalOpen} 
              editingProject={editingProject} 
              isSubmitting={isSubmitting} 
              errors={errors} 
            />
            <MobileModal 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit} 
              setIsModalOpen={setIsModalOpen} 
              editingProject={editingProject} 
              isSubmitting={isSubmitting} 
              errors={errors} 
            />
          </>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteConfirmation.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmation({ open: false, projectId: null, projectTitle: '' })}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-surface border border-error shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-error/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-error" />
                  <h2 className="text-sm font-bold text-text tracking-widest">DELETION_WARNING</h2>
                </div>
                <button
                  onClick={() => setDeleteConfirmation({ open: false, projectId: null, projectTitle: '' })}
                  className="text-text/70 hover:text-text"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-text/70 text-sm mb-4">
                  You are about to permanently delete:
                </p>
                <div className="bg-surface border border-border p-4 mb-6">
                  <p className="text-accent font-mono text-sm font-bold">{deleteConfirmation.projectTitle}</p>
                  <p className="text-text/50 text-xs mt-1">ID: {deleteConfirmation.projectId}</p>
                </div>

                <p className="text-error text-xs mb-4 font-mono">
                  ⚠️ THIS ACTION CANNOT BE UNDONE
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-mono text-text/50 mb-2">
                    Type <span className="text-error font-bold">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full bg-background/40 border border-border p-3 text-text font-mono text-xs focus:border-error focus:outline-none transition-colors"
                  />
                </div>

                {errors.delete && (
                  <div className="mb-4 p-3 bg-error/10 border border-error text-error text-xs font-mono">
                    {errors.delete}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation({ open: false, projectId: null, projectTitle: '' });
                      setConfirmText('');
                      setErrors({});
                    }}
                    className="flex-1 py-3 border border-border text-text/50 hover:text-text hover:bg-surface text-xs font-bold transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={confirmText !== 'DELETE'}
                    className="flex-1 py-3 bg-error hover:bg-error/80 text-background text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                    CONFIRM_DELETE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManager;
