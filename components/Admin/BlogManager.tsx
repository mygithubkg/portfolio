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
        required={required}
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

const LIVE_TAB     = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
const DEFAULT_TAB  = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
const INACTIVE_TAB = 'text-gray-500 hover:text-white border-transparent';

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
      hashtags: formData.hashtags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
    };

    try {
      if (editingBlog) {
        mode === 'live'
          ? await updateBlog(editingBlog.id, blogData)
          : await updateDefaultBlog(editingBlog.id, blogData);
      } else {
        mode === 'live'
          ? await addBlog(blogData)
          : await addDefaultBlog(blogData);
      }
      await loadBlogs();
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error saving blog:', error);
      showStatus('Error saving blog. Please try again.', true);
    }
  };

  const openDeleteModal = (blog: any) => setDeleteModal({ open: true, blogId: blog.id, blogTitle: blog.title });

  const handleDelete = async () => {
    try {
      mode === 'live'
        ? await deleteBlog(deleteModal.blogId)
        : await deleteDefaultBlog(deleteModal.blogId);
      await loadBlogs();
      setDeleteModal({ open: false, blogId: null, blogTitle: '' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      showStatus('Error deleting blog. Please try again.', true);
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
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-cyan-500" size={24} />
            BLOG MANAGEMENT
          </h2>
          <p className="text-xs font-mono text-gray-500 mt-1">
            SYSTEM_STATUS: {blogs.length} ENTRIES_LOADED
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode toggle */}
          <div className="flex gap-1 bg-white/5 border border-white/10 p-1">
            {[['live', '⬤ LIVE_DATA', LIVE_TAB], ['defaults', '◎ DEFAULTS', DEFAULT_TAB]].map(([val, label, active]) => (
              <button key={val} onClick={() => setMode(val)}
                className={`px-4 py-2 text-xs font-mono transition-all border ${mode === val ? active : INACTIVE_TAB}`}>
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-mono text-xs transition-all"
          >
            <Plus size={16} /> ADD_NEW_POST
          </button>
        </div>
      </div>

      {/* Status bar */}
      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${status.isError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect live visitors.
        </div>
      )}

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/10 p-6 hover:border-cyan-500/50 transition-all"
          >
            {/* Blog Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <span className="text-[9px] font-mono text-gray-600">{blog.id}</span>
                <h3 className="text-base font-bold text-white mt-1 line-clamp-2">{blog.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                  <Calendar size={10} />
                  <span>{blog.publishDate}</span>
                  <span>•</span>
                  <Eye size={10} />
                  <span>{blog.views || 0}</span>
                </div>
              </div>
            </div>

            {/* Blog Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <User size={12} className="text-gray-600" />
                <span className="text-gray-400">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Tag size={12} className="text-gray-600" />
                <span className="text-gray-400">{blog.category}</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{blog.excerpt}</p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {blog.hashtags?.slice(0, 3).map((tag: string, i: number) => (
                <span key={i} className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleOpenModal(blog)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-mono transition-all"
                >
                  <Edit size={12} /> EDIT
                </button>
                <button
                  onClick={() => openDeleteModal(blog)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/10 hover:red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono transition-all"
                >
                  <Trash2 size={12} /> DELETE
                </button>
              </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-cyan-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex justify-between items-center z-10">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <BookOpen className="text-cyan-500" />
                  {editingBlog ? 'EDIT_BLOG_ENTRY' : 'NEW_BLOG_ENTRY'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TechInput
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    required
                  />
                  <TechInput
                    label="Author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TechInput
                    label="Publish Date"
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required
                  />
                  <TechInput
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web Development"
                    required
                  />
                  <TechInput
                    label="Read Time"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="e.g., 5 min read"
                  />
                </div>

                <TechInput
                  label="Hashtags"
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleChange}
                  placeholder="react, firebase, javascript (comma separated)"
                />

                <TechInput
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/blog-image.png or https://..."
                />

                <TechInput
                  label="Excerpt"
                  name="excerpt"
                  type="textarea"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the blog post (shown on listing page)"
                  required
                />

                <TechInput
                  label="Content (Markdown Supported)"
                  name="content"
                  type="textarea"
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Full blog content with markdown formatting..."
                  required
                />

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-mono text-sm transition-all"
                  >
                    <Save size={16} />
                    {editingBlog ? 'UPDATE_ENTRY' : 'CREATE_ENTRY'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-mono text-sm transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-red-500/50 shadow-2xl z-10">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-red-500/30 bg-red-500/10">
                <AlertTriangle size={18} className="text-red-500" />
                <h2 className="text-sm font-bold text-white font-mono">DELETION_WARNING</h2>
                <button onClick={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })} className="ml-auto text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6">
                <p className="text-gray-300 text-sm mb-3">Permanently delete:</p>
                <div className="bg-white/5 border border-white/10 p-3 mb-6 font-mono">
                  <p className="text-cyan-400 text-sm font-bold">{deleteModal.blogTitle}</p>
                  <p className="text-gray-600 text-xs mt-1">{deleteModal.blogId}</p>
                </div>
                <p className="text-red-400 text-xs font-mono mb-6">⚠ THIS ACTION CANNOT BE UNDONE</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })}
                    className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold font-mono">CANCEL</button>
                  <button onClick={handleDelete}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white text-xs font-bold font-mono flex items-center justify-center gap-2">
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
        <button onClick={() => setShowReset(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-mono transition-colors shadow-xl">
          <RotateCcw size={14} /> RESET_BLOGS_TO_DEFAULT
        </button>
      </div>
    </div>
  );
};

export default BlogManager;
