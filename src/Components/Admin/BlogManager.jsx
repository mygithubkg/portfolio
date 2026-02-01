import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, BookOpen, Calendar, Tag, User, Hash, Eye } from 'lucide-react';
import { getBlogs, addBlog, updateBlog, deleteBlog } from '../../utils/blogData';

// Reusable Input Component
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

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  
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
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  };

  const handleOpenModal = (blog = null) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      hashtags: formData.hashtags.split(',').map(t => t.trim()).filter(t => t),
    };

    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, blogData);
      } else {
        await addBlog(blogData);
      }
      await loadBlogs();
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error adding/updating blog:', error);
      alert('Error saving blog. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('CONFIRM DELETION: This action cannot be undone. Proceed?')) {
      try {
        await deleteBlog(id);
        await loadBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-cyan-500" size={24} />
            BLOG MANAGEMENT
          </h2>
          <p className="text-xs font-mono text-gray-500 mt-1">
            SYSTEM_STATUS: {blogs.length} ENTRIES_LOADED
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-mono text-xs transition-all"
        >
          <Plus size={16} /> ADD_NEW_POST
        </button>
      </div>

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
              {blog.hashtags?.slice(0, 3).map((tag, i) => (
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
                onClick={() => handleDelete(blog.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono transition-all"
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
    </div>
  );
};

export default BlogManager;
