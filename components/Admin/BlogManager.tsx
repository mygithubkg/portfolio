"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, BookOpen, Calendar, Tag, User, Hash, Eye, AlertTriangle, Settings } from 'lucide-react';
import { getBlogs, addBlog, updateBlog, deleteBlog } from '@/lib/utils/blogData';
import { getDefaultBlogs, addDefaultBlog, updateDefaultBlog, deleteDefaultBlog, resetSectionToDefault } from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';

// Dynamically import TipTap editor to avoid SSR issues
const RichBlogEditor = dynamic(() => import('./RichBlogEditor'), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center"><span className="font-mono text-xs text-textSecondary animate-pulse">LOADING_EDITOR…</span></div>
});

const DesktopEditor = ({ formData, handleChange, handleSubmit, editingBlog, onClose }: any) => {
  const [showDossier, setShowDossier] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-background flex-col hidden lg:flex"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden h-full">
        {/* Top bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onClose} className="text-text hover:text-accent font-sans text-sm transition-colors flex items-center gap-2">
              &larr; Discard
            </button>
            <span className="font-mono text-xs text-textSecondary bg-surface px-2 py-1 rounded border border-border">
              {editingBlog ? 'Editing entry' : 'New entry'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowDossier(!showDossier)} className={`font-sans text-sm flex items-center gap-2 transition-colors ${showDossier ? 'text-accent' : 'text-text hover:text-accent'}`}>
              <Settings size={16} /> Dossier
            </button>
            <button type="submit" className="bg-accent text-background px-6 py-2 font-mono text-xs hover:opacity-90 transition-opacity">
              {editingBlog ? 'Update Records' : 'Publish Entry'}
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Title */}
            <div className="max-w-[750px] mx-auto w-full px-6 pt-16 pb-4">
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                placeholder="Title your journal entry..."
                className="w-full bg-transparent border-0 outline-none font-display text-5xl text-text placeholder-textSecondary/30 leading-tight"
              />
              <div className="border-b border-border mt-8 mb-0" />
            </div>

            {/* Rich editor fills remaining space */}
            <div className="max-w-[750px] mx-auto w-full px-6 flex-1 flex flex-col">
              <RichBlogEditor
                content={formData.content}
                onChange={(html: string) => handleChange({ target: { name: 'content', value: html } })}
              />
            </div>
          </div>

          {/* Dossier Sidebar */}
          <AnimatePresence>
            {showDossier && (
              <motion.div 
                initial={{ x: 320 }} 
                animate={{ x: 0 }} 
                exit={{ x: 320 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-80 border-l border-border bg-surface flex flex-col overflow-y-auto p-8 space-y-6 shrink-0"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">DOSSIER_SETTINGS</div>
                  <button type="button" onClick={() => setShowDossier(false)} className="text-textSecondary hover:text-text"><X size={14} /></button>
                </div>
                
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Author</label>
                  <input name="author" value={formData.author} onChange={handleChange} placeholder="Author name" className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40 focus:border-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Publish Date</label>
                  <input type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none focus:border-accent transition-colors">
                    <option value="Web Development">Web Development</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Read Time</label>
                  <input name="readTime" value={formData.readTime} onChange={handleChange} placeholder="5 min read" className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40 focus:border-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Excerpt</label>
                  <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={4} placeholder="Short excerpt shown in the blog list..." className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40 resize-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Cover Image URL</label>
                  <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://res.cloudinary.com/..." className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40 focus:border-accent transition-colors" />
                  {formData.imageUrl && <img src={formData.imageUrl} alt="cover" className="w-full aspect-video object-cover mt-2 border border-border" />}
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-textSecondary">Hashtags (comma separated)</label>
                  <input name="hashtags" value={formData.hashtags} onChange={handleChange} placeholder="react, nextjs, typescript" className="border-b border-border bg-transparent w-full py-2 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40 focus:border-accent transition-colors" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
};

const MobileEditor = ({ formData, handleChange, handleSubmit, editingBlog, onClose }: any) => {
  const [showDossier, setShowDossier] = useState(false);

  const insertMarkdown = (snippet: string) => {
    handleChange({ target: { name: 'content', value: formData.content + snippet } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto lg:hidden"
    >
      <form onSubmit={handleSubmit} className="flex flex-col min-h-screen relative">
        <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 sticky top-0 bg-background/90 backdrop-blur-md z-10">
          <button type="button" onClick={onClose} className="text-text hover:text-accent font-sans text-sm flex items-center gap-2">
            &larr; Discard
          </button>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowDossier(true)} className="text-text hover:text-accent">
              <Settings size={18} />
            </button>
            <button type="submit" className="bg-accent text-background px-4 py-1.5 text-xs font-mono">
              Publish
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 flex flex-col">
          <input 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Title your journal entry..."
            className="w-full bg-transparent border-0 outline-none font-display text-3xl text-text placeholder-textSecondary/30 resize-none mb-4"
          />
          <textarea 
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Begin writing..."
            className="w-full bg-transparent border-0 outline-none font-sans text-base leading-relaxed text-text placeholder-textSecondary/40 resize-none min-h-[50vh] focus:ring-0 py-4 flex-1"
          />
        </div>

        <div className="sticky bottom-0 h-12 border-t border-border bg-background/90 backdrop-blur-md flex items-center gap-4 px-4 shrink-0">
          <button type="button" onClick={() => insertMarkdown('## ')} className="font-mono text-xs text-textSecondary hover:text-accent px-3 py-2 border border-border hover:border-accent transition-colors">H</button>
          <button type="button" onClick={() => insertMarkdown('```\n\n```')} className="font-mono text-xs text-textSecondary hover:text-accent px-3 py-2 border border-border hover:border-accent transition-colors">&lt;/&gt;</button>
          <button type="button" onClick={() => insertMarkdown('![]()')} className="font-mono text-xs text-textSecondary hover:text-accent px-3 py-2 border border-border hover:border-accent transition-colors">IMG</button>
          <button type="button" onClick={() => insertMarkdown('\n---\n')} className="font-mono text-xs text-textSecondary hover:text-accent px-3 py-2 border border-border hover:border-accent transition-colors">---</button>
        </div>
      </form>

      <AnimatePresence>
        {showDossier && (
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-surface overflow-y-auto"
          >
            <div className="p-8 space-y-8 flex-1">
              <div className="flex justify-between items-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">DOSSIER_SETTINGS</div>
                <button type="button" onClick={() => setShowDossier(false)} className="text-text hover:text-accent font-sans text-sm font-bold">
                  Done
                </button>
              </div>
              <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40" />
              <input type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40" />
              <select name="category" value={formData.category} onChange={handleChange} className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none text-textSecondary">
                <option value="Web Development">Web Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Tutorial">Tutorial</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
              <input name="readTime" value={formData.readTime} onChange={handleChange} placeholder="Read Time" className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40" />
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={4} placeholder="Excerpt" className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40 resize-none" />
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40" />
              <input name="hashtags" value={formData.hashtags} onChange={handleChange} placeholder="react, nextjs, typescript" className="border-b border-border bg-transparent w-full py-3 text-text font-sans text-sm focus:outline-none placeholder-textSecondary/40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BlogManager = () => {
  const [mode, setMode] = useState('live');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>({ open: false, blogId: null, blogTitle: '' });
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [status, setStatus] = useState<any>(null);

  // Initial Form State
  const initialFormState = {
    title: '',
    author: 'Karrtik Gupta',
    publishDate: new Date().toISOString().split('T')[0],
    category: 'Web Development',
    hashtags: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    readTime: '5 min read'
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadBlogs();
  }, [mode]);

  const loadBlogs = async () => {
    try {
      const data = mode === 'live' ? await getBlogs() : await getDefaultBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  };

  const showStatus = (msg: string, isError = false) => {
    setStatus({ msg, isError });
    setTimeout(() => setStatus(null), 3500);
  };

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        ...blog,
        hashtags: Array.isArray(blog.hashtags) ? blog.hashtags.join(', ') : blog.hashtags,
      });
    } else {
      setEditingBlog(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      hashtags: typeof formData.hashtags === 'string'
        ? formData.hashtags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        : formData.hashtags,
    };

    try {
      let result: { success: boolean; message?: string } | undefined;
      if (editingBlog) {
        result = mode === 'live'
          ? await updateBlog(editingBlog.id, blogData)
          : await updateDefaultBlog(editingBlog.id, blogData);
      } else {
        result = mode === 'live'
          ? await addBlog(blogData)
          : await addDefaultBlog(blogData);
      }
      if (result && !result.success) {
        throw new Error(result.message || 'Failed to save blog to database.');
      }
      await loadBlogs();
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (error: any) {
      console.error('Error saving blog:', error);
      showStatus(error.message || 'Error saving blog. Please try again.', true);
    }
  };

  const openDeleteModal = (blog: any) => setDeleteModal({ open: true, blogId: blog.id, blogTitle: blog.title });

  const handleDelete = async () => {
    try {
      const result = mode === 'live'
        ? await deleteBlog(deleteModal.blogId)
        : await deleteDefaultBlog(deleteModal.blogId);
      if (result && !result.success) {
        throw new Error(result.message || 'Failed to delete blog.');
      }
      await loadBlogs();
      setDeleteModal({ open: false, blogId: null, blogTitle: '' });
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      showStatus(error.message || 'Error deleting blog. Please try again.', true);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSectionToDefault('blogs');
      showStatus(result.success ? 'LIVE_BLOGS_RESET_TO_DEFAULTS' : result.message, !result.success);
      setShowReset(false);
      if (mode === 'live') await loadBlogs();
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`, true);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full relative z-10 flex flex-col min-h-full">
      {/* --- HEADER --- */}
      <div className="border-b border-border mb-12 pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
          / ROOT / BLOGS_DB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-display text-5xl xl:text-6xl text-text tracking-tight">
              Journal Entries.
            </h1>
            <p className="text-xs font-mono text-textSecondary mt-2 uppercase tracking-widest">
              SYSTEM_STATUS: {blogs.length} ENTRIES_LOADED
            </p>
          </div>

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
              className="border border-border hover:border-accent hover:text-accent px-4 py-2 font-mono text-xs transition-colors flex items-center gap-2 text-text"
            >
              <Plus size={14} />
              + Initialize New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${status.isError ? 'bg-error/10 border-error/30 text-error' : 'bg-success/10 border-success/30 text-success'}`}
          >
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect live visitors.
        </div>
      )}

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="bg-surface border border-border flex flex-col hover:border-accent transition-colors overflow-hidden group relative"
            >
              {/* Image Preview on Top if present */}
              {blog.imageUrl && (
                <div className="w-full aspect-video border-b border-border bg-background relative overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Header & Meta */}
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[10px] text-textSecondary uppercase tracking-widest">{blog.id}</span>
                  <div className="flex items-center gap-2 text-[10px] text-textSecondary font-mono uppercase tracking-widest">
                    <Calendar size={11} />
                    <span>{blog.publishDate}</span>
                    <span>•</span>
                    <Eye size={11} />
                    <span>{blog.views || 0}</span>
                  </div>
                </div>

                <h3 className="font-sans font-bold text-lg text-text mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {blog.title}
                </h3>

                <div className="space-y-1.5 mb-4 font-mono text-[10px] text-textSecondary uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-textSecondary" />
                    <span className="text-text">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-textSecondary" />
                    <span className="text-text">{blog.category}</span>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-xs text-textSecondary mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Hashtags */}
                {blog.hashtags && blog.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {blog.hashtags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-mono text-[10px] text-textSecondary">{blog.readTime || '5 min read'}</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleOpenModal(blog)}
                      className="text-textSecondary hover:text-accent transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-1"
                    >
                      <Edit size={12} /> EDIT
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog)}
                      className="text-textSecondary hover:text-error transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-1"
                    >
                      <Trash2 size={12} /> DELETE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- EMPTY STATE --- */}
      {blogs.length === 0 && (
        <div className="border border-dashed border-border rounded-none p-20 text-center">
          <BookOpen size={40} className="mx-auto text-textSecondary mb-4 opacity-40" />
          <p className="text-textSecondary font-mono text-xs uppercase tracking-widest">DATABASE_EMPTY // NO_ENTRIES_FOUND</p>
        </div>
      )}

      {/* --- NEW EDITOR MODALS --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <DesktopEditor 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit}
              editingBlog={editingBlog}
              onClose={() => setIsModalOpen(false)}
            />
            <MobileEditor 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit}
              editingBlog={editingBlog}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-surface border border-error/50 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-error/30 bg-error/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-error" />
                  <h2 className="text-xs font-bold text-text font-mono tracking-widest uppercase">DELETION_WARNING</h2>
                </div>
                <button
                  onClick={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })}
                  className="text-textSecondary hover:text-text transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-textSecondary text-xs font-mono uppercase tracking-widest mb-3">Permanently delete entry:</p>
                <div className="bg-background border border-border p-4 mb-6 font-mono">
                  <p className="text-text text-sm font-bold">{deleteModal.blogTitle}</p>
                  <p className="text-textSecondary text-xs mt-1">ID: {deleteModal.blogId}</p>
                </div>
                <p className="text-error text-xs font-mono mb-6 uppercase tracking-widest">⚠️ THIS ACTION CANNOT BE UNDONE</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })}
                    className="flex-1 py-3 border border-border text-textSecondary hover:text-text hover:bg-background text-xs font-bold font-mono uppercase tracking-widest transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-error text-white hover:bg-error/90 text-xs font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={14} /> CONFIRM_DELETE
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

export default BlogManager;
