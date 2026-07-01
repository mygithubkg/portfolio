import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Search,
  X,
  ArrowRight,
  Clock,
  Eye,
  Filter
} from 'lucide-react';
import { getBlogs } from '../utils/blogData';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, selectedCategory, selectedHashtag, sortBy]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBlogs = () => {
    let filtered = [...blogs];

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (selectedHashtag) {
      filtered = filtered.filter(blog =>
        blog.hashtags?.some(tag => tag.toLowerCase() === selectedHashtag.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.publishDate) - new Date(a.publishDate);
        case 'date-asc':
          return new Date(a.publishDate) - new Date(b.publishDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredBlogs(filtered);
  };

  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];
  const allHashtags = [...new Set(blogs.flatMap(blog => blog.hashtags || []))];

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  if (loading) {
    return (
      <section className="min-h-screen py-24 bg-[#030303] flex items-center justify-center">
        <div className="text-cyan-500 font-mono text-sm flex items-center gap-3 tracking-widest">
          <div className="w-2 h-2 bg-cyan-500 animate-ping rounded-full" />
          INITIALIZING_JOURNAL...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-24 relative bg-[#030303] text-gray-300 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Subtle Ambient Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-900/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Container set exactly to 80% width */}
      <div className="w-[80%] mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs mb-6 tracking-widest uppercase">
              <Terminal size={14} />
              <span>/ROOT/PUBLICATIONS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Dev <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">Journal.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm md:text-base font-light max-w-sm"
          >
            A curated collection of technical insights, architectural teardowns, and engineering philosophies.
          </motion.p>
        </div>

        {/* --- COMMAND BAR (SEARCH & FILTER) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 text-cyan-500/50" size={18} />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none font-mono text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-mono text-xs tracking-wider transition-all flex items-center gap-2 justify-center ${showFilters ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Filter size={14} />
              PARAMETERS
            </button>
          </div>

          {/* Expandable Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Category Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-cyan-600 mb-3 uppercase tracking-widest">
                      Filter by Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${selectedCategory === category
                              ? 'bg-white text-black font-bold'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Selection */}
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-600 mb-3 uppercase tracking-widest">
                      Sort Chronology
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-white/5 border-none rounded-lg p-3 text-gray-300 font-mono text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none"
                    >
                      <option value="date-desc">Latest Discoveries</option>
                      <option value="date-asc">Archival First</option>
                      <option value="title">Alphabetical (A-Z)</option>
                      <option value="views">Highest Engagement</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- EDITORIAL LIST VIEW --- */}
        <div className="border-t border-white/10">
          <AnimatePresence mode="wait">
            {filteredBlogs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 text-center"
              >
                <Terminal className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Null_Results_Found</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-6 px-6 py-2 rounded-full border border-white/10 text-xs text-white hover:bg-white hover:text-black transition-colors"
                >
                  Reset Parameters
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col">
                {filteredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleBlogClick(blog.id)}
                    className="group border-b border-white/10 py-8 md:py-12 cursor-pointer relative"
                  >
                    {/* Hover Background Shift */}
                    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mx-6 px-6 rounded-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12">

                      {/* Left: Meta Column */}
                      <div className="md:w-48 flex-shrink-0 flex flex-col gap-2">
                        <span className="text-xs font-mono text-cyan-500">
                          {new Date(blog.publishDate).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'
                          }).replace(/\//g, '.')}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase border border-white/10 px-2 py-1 rounded w-fit group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                          {blog.category}
                        </span>
                      </div>

                      {/* Middle: Content Block */}
                      <div className="flex-1 space-y-4">
                        <h2 className="text-2xl md:text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight leading-tight">
                          {blog.title}
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-2xl">
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {blog.hashtags?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Metrics & Arrow */}
                      <div className="md:w-32 flex-shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 text-[10px] font-mono text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {blog.readTime}
                          </div>
                          {blog.views > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Eye size={12} />
                              {blog.views}
                            </div>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-300">
                          <ArrowRight size={16} className="text-gray-400 group-hover:text-black group-hover:-rotate-45 transition-all duration-300" />
                        </div>
                      </div>

                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Blog;