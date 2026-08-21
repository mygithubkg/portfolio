"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, BookOpen, Calendar, Tag, User, Hash, Eye, RotateCcw, AlertTriangle } from 'lucide-react';
import { getBlogs, addBlog, updateBlog, deleteBlog } from '@/lib/utils/blogData';
import { getDefaultBlogs, addDefaultBlog, updateDefaultBlog, deleteDefaultBlog, resetSectionToDefault } from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';

// Reusable Input Component
const TechInput = ({ label, name, value, onChange, placeholder, type = "text", required = false, rows }: any) => (
  <div className="group relative">
    <label className="block text-[10px] font-mono text-textSecondary mb-1 uppercase tracking-widest group-focus-within:text-accent">
      {label} {required && '*'}
    </label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows || 3}
        placeholder={placeholder}
        required={required}
        className="w-full bg-background border border-border p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors resize-none placeholder-textSecondary/40"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-background border border-border p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors placeholder-textSecondary/40"
      />
    )}
  </div>
);

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

      {/* --- ADD/EDIT MODAL --- */}
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
              className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent animate-pulse" />
                  <h2 className="text-xs font-mono font-bold text-text uppercase tracking-widest">
                    {editingBlog ? 'MODIFY_JOURNAL_ENTRY' : 'INITIALIZE_JOURNAL_ENTRY'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-textSecondary hover:text-text transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TechInput
                    label="ENTRY_TITLE"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    required
                  />
                  <TechInput
                    label="AUTHOR"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TechInput
                    label="PUBLISH_DATE"
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required
                  />
                  <TechInput
                    label="CATEGORY"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web Development"
                    required
                  />
                  <TechInput
                    label="READ_TIME"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="e.g., 5 min read"
                  />
                </div>

                <TechInput
                  label="HASHTAGS"
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleChange}
                  placeholder="react, firebase, javascript (comma separated)"
                />

                <TechInput
                  label="IMAGE_ASSET_URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/blog-image.png or https://..."
                />

                <TechInput
                  label="EXCERPT"
                  name="excerpt"
                  type="textarea"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the blog post (shown on listing page)"
                  required
                />

                <TechInput
                  label="CONTENT (MARKDOWN)"
                  name="content"
                  type="textarea"
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Full blog content with markdown formatting..."
                  required
                />

                {/* Submit Button */}
                <div className="flex gap-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-border text-textSecondary hover:text-text hover:bg-background/50 font-mono text-xs font-bold transition-colors uppercase tracking-widest"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-accent text-background hover:opacity-90 font-mono text-xs font-bold transition-opacity flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Save size={14} />
                    {editingBlog ? 'UPDATE_RECORD' : 'EXECUTE_WRITE'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
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

      {/* Reset to Default */}
      <ResetToDefaultModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        sectionName="Blogs"
        isLoading={isResetting}
      />

      {/* Reset button (floating) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-2 px-4 py-3 bg-surface border border-accent/40 text-accent hover:bg-accent/10 text-xs font-mono transition-colors shadow-xl"
        >
          <RotateCcw size={14} /> RESET_BLOGS_TO_DEFAULT
        </button>
      </div>
    </div>
  );
};

export default BlogManager;
