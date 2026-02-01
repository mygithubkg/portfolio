import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  Search, 
  Filter, 
  X,
  ChevronRight,
  Eye,
  TrendingUp
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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by hashtag
    if (selectedHashtag) {
      filtered = filtered.filter(blog =>
        blog.hashtags?.some(tag => tag.toLowerCase() === selectedHashtag.toLowerCase())
      );
    }

    // Sort blogs
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

  // Get unique categories
  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

  // Get all unique hashtags
  const allHashtags = [...new Set(blogs.flatMap(blog => blog.hashtags || []))];

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  if (loading) {
    return (
      <section className="min-h-screen py-24 relative overflow-hidden bg-[#050505] flex items-center justify-center">
        <div className="text-cyan-500 font-mono text-sm flex items-center gap-2">
          <div className="animate-spin">⟳</div>
          LOADING_BLOG_ENTRIES...
        </div>
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
        <div className="mb-12 border-b border-white/10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-cyan-500 font-mono text-xs mb-4"
          >
            <BookOpen size={16} />
            <span>/ROOT/BLOG_DIRECTORY</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
          >
            TECH <span className="text-gray-600">JOURNAL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm max-w-2xl"
          >
            Insights, tutorials, and thoughts on web development, software engineering, and technology.
          </motion.p>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 space-y-4"
        >
          {/* Search and Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
              <input
                type="text"
                placeholder="Search blogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors font-mono"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-white/10 hover:border-cyan-500/50 text-white font-mono text-xs transition-all"
            >
              <Filter size={16} />
              {showFilters ? 'HIDE_FILTERS' : 'SHOW_FILTERS'}
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-600 mb-2 uppercase tracking-widest">
                      SORT_BY
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="date-desc">Latest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="views">Most Viewed</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-600 mb-2 uppercase tracking-widest">
                      CATEGORY
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1.5 text-xs font-mono transition-all ${
                            selectedCategory === category
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          } border`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hashtag Filter */}
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-600 mb-2 uppercase tracking-widest">
                      HASHTAGS
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {selectedHashtag && (
                        <button
                          onClick={() => setSelectedHashtag('')}
                          className="px-3 py-1.5 text-xs font-mono bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center gap-1"
                        >
                          #{selectedHashtag}
                          <X size={12} />
                        </button>
                      )}
                      {allHashtags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedHashtag(tag)}
                          className={`px-3 py-1.5 text-xs font-mono transition-all ${
                            selectedHashtag === tag
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          } border`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Summary */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <span>SHOWING: {filteredBlogs.length} / {blogs.length} POSTS</span>
            {(searchTerm || selectedCategory !== 'All' || selectedHashtag) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedHashtag('');
                }}
                className="text-cyan-500 hover:text-cyan-400 underline"
              >
                CLEAR_ALL_FILTERS
              </button>
            )}
          </div>
        </motion.div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500 font-mono text-sm">NO_MATCHING_POSTS_FOUND</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedHashtag('');
              }}
              className="mt-4 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-xs"
            >
              RESET_FILTERS
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBlogClick(blog.id)}
                className="group cursor-pointer bg-[#0a0a0a] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback */}
                  <div className={`${blog.imageUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 items-center justify-center`}>
                    <BookOpen className="text-gray-700" size={48} />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-2 py-1 bg-black/80 border border-white/20 text-[10px] font-mono text-cyan-400">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>{new Date(blog.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{blog.readTime}</span>
                    </div>
                    {blog.views > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye size={10} />
                          <span>{blog.views}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Author */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <User size={12} />
                    <span>{blog.author}</span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {blog.hashtags?.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 group-hover:text-cyan-400 transition-colors pt-3 border-t border-white/5">
                    <span>READ_MORE</span>
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
