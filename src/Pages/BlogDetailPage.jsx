import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../Components/Layout';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Eye,
  Hash,
  Tag
} from 'lucide-react';
import { getBlogById, incrementBlogViews } from '../utils/blogData';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogById(id);
      if (data) {
        setBlog(data);
        // Increment views
        await incrementBlogViews(id);
      } else {
        // Blog not found
        setBlog(null);
      }
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-screen py-24 relative overflow-hidden bg-[#050505] flex items-center justify-center">
          <div className="text-cyan-500 font-mono text-sm flex items-center gap-2">
            <div className="animate-spin">⟳</div>
            LOADING_BLOG_CONTENT...
          </div>
        </section>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <section className="min-h-screen py-24 relative overflow-hidden bg-[#050505] flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="mx-auto text-gray-700 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-white mb-2">Blog Not Found</h2>
            <p className="text-gray-500 font-mono text-sm mb-6">ERROR_404: ENTRY_NOT_FOUND</p>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-all"
            >
              ← BACK_TO_BLOG
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="min-h-screen py-24 relative overflow-hidden bg-[#050505]">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 font-mono text-xs mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK_TO_BLOG_INDEX</span>
          </motion.button>

          {/* Blog Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-mono">
                {blog.category}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                <Eye size={12} />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-400 leading-relaxed mb-6">
              {blog.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-600" />
                <span>{blog.author}</span>
              </div>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-600" />
                <span>
                  {new Date(blog.publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-600" />
                <span>{blog.readTime}</span>
              </div>
              <span className="text-gray-700">•</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                <Share2 size={16} />
                <span className="font-mono text-xs">SHARE</span>
              </button>
            </div>
          </motion.header>

          {/* Featured Image */}
          {blog.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-lg overflow-hidden border border-white/10"
            >
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          )}

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert prose-cyan max-w-none mb-12"
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg border border-white/10 my-4"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-3">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-white mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4 ml-4">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-cyan-500/5 text-gray-300 italic">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </motion.div>

          {/* Hashtags */}
          {blog.hashtags && blog.hashtags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/10 mb-12"
            >
              <Tag size={16} className="text-gray-600" />
              {blog.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Back to Blog Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-12 border-t border-white/10"
          >
            <button
              onClick={() => navigate('/blog')}
              className="px-8 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-all flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              RETURN_TO_BLOG_INDEX
            </button>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
}

export default BlogDetailPage;
