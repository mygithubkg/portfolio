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
const TechInput = ({ label, name, value, onChange, placeholder, type = "text", required = false, rows, options, error }: any) => (
  <div className="group relative">
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
        className={`w-full bg-background/40 border ${error ? 'border-red-500' : 'border-border'} p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors resize-none placeholder-gray-700`}
      />
    ) : type === 'select' ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-background/40 border ${error ? 'border-red-500' : 'border-border'} p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors`}
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
        className={`w-full bg-background/40 border ${error ? 'border-red-500' : 'border-border'} p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors placeholder-gray-700`}
      />
    )}
    {error && <p className="mt-1 text-[10px] text-red-500 font-mono animate-pulse">{error}</p>}
  </div>
);

const LIVE_TAB = 'bg-accent/15 text-accent border-accent/30';
const DEFAULT_TAB = 'bg-accent/15 text-accent border-accent/30';
const INACTIVE_TAB = 'text-textSecondary hover:text-text border-transparent';

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
        tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech,
      });
    } else {
      setEditingProject(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="w-full relative z-10 flex flex-col min-h-full">
      {/* --- HEADER --- */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
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
                className={`px-4 py-2 font-mono text-xs transition-colors border ${mode === 'live' ? 'border-accent text-accent' : 'border-transparent text-textSecondary hover:text-text'}`}
              >
                [ LIVE_DATA ]
              </button>
              <button 
                onClick={() => setMode('defaults')}
                className={`px-4 py-2 font-mono text-xs transition-colors border ${mode === 'defaults' ? 'border-accent text-accent' : 'border-transparent text-textSecondary hover:text-text'}`}
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
          <div className={`mb-6 px-4 py-2 text-xs font-mono border ${resetStatus.startsWith('ERROR') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {resetStatus}
          </div>
        )}

        {mode === 'defaults' && (
          <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
            ◎ EDITING DEFAULTS — Changes here do not affect live visitors.
          </div>
        )}

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="group relative bg-surface border border-border flex flex-col hover:border-accent transition-colors overflow-hidden"
              >
                {/* Image Preview on Top */}
                <div className="w-full aspect-video border-b border-border bg-background relative overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-textSecondary uppercase tracking-widest">
                      [ NO_MEDIA ]
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-background border border-border px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-text">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-sans font-bold text-lg text-text mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="flex flex-col gap-1 font-mono text-[10px] text-textSecondary mb-4 uppercase tracking-widest">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-text">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year:</span>
                      <span className="text-text">{project.year}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-mono text-[10px] text-textSecondary">ID: {project.id.toString().padStart(4, '0')}</span>
                    <div className="flex gap-4">
                      <button onClick={() => handleOpenModal(project)} className="text-textSecondary hover:text-accent transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-1"><Edit size={10} /> Edit</button>
                      <button onClick={() => openDeleteConfirmation(project)} className="text-textSecondary hover:text-error transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-1"><Trash2 size={10} /> Delete</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- EMPTY STATE --- */}
        {projects.length === 0 && (
          <div className="border border-dashed border-border rounded-lg p-20 text-center">
            <Terminal size={40} className="mx-auto text-textSecondary mb-4" />
            <p className="text-textSecondary text-sm font-mono tracking-widest">[ DATABASE_EMPTY ]</p>
          </div>
        )}

      {/* --- MODAL (SYSTEM PROMPT) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
              className="relative w-full max-w-2xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent animate-pulse" />
                  <h2 className="text-sm font-bold text-text tracking-widest">
                    {editingProject ? 'MODIFY_ENTITY_PARAMETERS' : 'NEW_ENTRY_PROTOCOL'}
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-textSecondary hover:text-text"><X size={18} /></button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">

                  {/* Basic Info */}
                  <div className="col-span-2">
                    <TechInput label="PROJECT_TITLE" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Neural Network V1" error={errors.title} />
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
                  />
                  <TechInput label="RELEASE_YEAR" name="year" value={formData.year} onChange={handleChange} required placeholder="2025" error={errors.year} />

                  {/* Descriptions */}
                  <div className="col-span-2">
                    <TechInput label="SHORT_DESCRIPTION" name="description" value={formData.description} onChange={handleChange} type="textarea" rows={2} required placeholder="Brief overview for the card..." error={errors.description} />
                  </div>
                  <div className="col-span-2">
                    <TechInput label="FULL_TECHNICAL_DETAILS" name="details" value={formData.details} onChange={handleChange} type="textarea" rows={4} placeholder="In-depth explanation..." error={errors.details} />
                  </div>

                  {/* Links & Assets */}
                  <TechInput label="LIVE_DEPLOYMENT_URL" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." error={errors.link} />
                  <TechInput label="SOURCE_CODE_REPO" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." error={errors.github} />

                  <div className="col-span-2">
                    <TechInput label="IMAGE_ASSET_PATH" name="image" value={formData.image} onChange={handleChange} placeholder="/images/project.png or URL" error={errors.image} />
                  </div>

                  {/* Tech Stack */}
                  <div className="col-span-2">
                    <TechInput label="TECHNOLOGIES (CSV)" name="tech" value={formData.tech} onChange={handleChange} placeholder="React, Node.js, Python..." error={errors.tech} />
                  </div>

                  {/* Featured Toggle */}
                  <div className="col-span-2 flex items-center gap-3 border border-border p-4 bg-surface">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 accent-accent bg-background border-border"
                    />
                    <label className="text-xs font-mono text-gray-300">FLAG_AS_FEATURED_ENTRY</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-border text-gray-400 hover:text-text hover:bg-surface text-xs font-bold transition-colors"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-accent hover:bg-accent text-black text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={14} />
                    {isSubmitting ? 'PROCESSING...' : (editingProject ? 'UPDATE_RECORDS' : 'EXECUTE_WRITE')}
                  </button>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-mono flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>{errors.submit}</span>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
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
              className="relative w-full max-w-md bg-surface border border-red-500/50 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/30 bg-red-500/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-500" />
                  <h2 className="text-sm font-bold text-text tracking-widest">DELETION_WARNING</h2>
                </div>
                <button
                  onClick={() => setDeleteConfirmation({ open: false, projectId: null, projectTitle: '' })}
                  className="text-textSecondary hover:text-text"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-300 text-sm mb-4">
                  You are about to permanently delete:
                </p>
                <div className="bg-surface border border-border p-4 mb-6">
                  <p className="text-accent font-mono text-sm font-bold">{deleteConfirmation.projectTitle}</p>
                  <p className="text-textSecondary text-xs mt-1">ID: {deleteConfirmation.projectId}</p>
                </div>

                <p className="text-red-400 text-xs mb-4 font-mono">
                  ⚠️ THIS ACTION CANNOT BE UNDONE
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-mono text-gray-400 mb-2">
                    Type <span className="text-red-500 font-bold">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full bg-background/40 border border-border p-3 text-text font-mono text-xs focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                {errors.delete && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-mono">
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
                    className="flex-1 py-3 border border-border text-gray-400 hover:text-text hover:bg-surface text-xs font-bold transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={confirmText !== 'DELETE'}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-text text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
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
      {/* Reset modal */}
      <ResetToDefaultModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        sectionName="Projects"
        isLoading={isResetting}
      />

      {/* Reset to default button (floating, bottom-right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setShowReset(true)}
          className="flex items-center gap-2 px-4 py-3 bg-surface border border-accent/40 text-accent hover:bg-accent/10 text-xs font-mono transition-colors shadow-xl">
          <RotateCcw size={14} /> RESET_PROJECTS_TO_DEFAULT
        </button>
      </div>
    </div>
  );
};

export default ProjectsManager;
