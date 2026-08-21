"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  Menu,
  X,
  List
} from 'lucide-react';
import { incrementBlogViews } from '@/lib/utils/blogData';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EASE = [0.16, 1, 0.3, 1] as const;

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) return extractText((node.props as any).children);
  return '';
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function formatDate(d: string) {
  return new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-8 rounded-xl overflow-hidden border border-border bg-surface w-full max-w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-accent transition-colors font-mono">
          {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto w-full hide-scrollbar">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: 0, background: 'transparent', padding: '1.25rem', fontSize: '0.875rem' }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function BlogDetailClient({ blog, id }: { blog: any; id: string }) {
  const router = useRouter();
  const [activeHeading, setActiveHeading] = useState('');
  const [isTocMobileOpen, setIsTocMobileOpen] = useState(false);
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    incrementBlogViews(id).catch(() => {});
  }, [id]);

  const tocItems = useMemo(() => {
    if (!blog?.content) return [];
    // Legacy Markdown headings
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const items = [];
    let m;
    while ((m = regex.exec(blog.content)) !== null) {
      items.push({ id: slugify(m[2]), text: m[2], level: m[1].length });
    }
    return items;
  }, [blog?.content]);

  useEffect(() => {
    if (tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (headingElementsRef.current[entry.target.id] = entry));
        const visible = Object.values(headingElementsRef.current).filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveHeading(top[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -40% 0px' }
    );
    const timer = setTimeout(() => {
      tocItems.forEach(({ id: hid }) => {
        const el = document.getElementById(hid);
        if (el) observer.observe(el);
      });
    }, 600);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [tocItems]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href }); } catch { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const currentH2Text = useMemo(() => {
    if (!activeHeading) return "Introduction";
    const activeItem = tocItems.find(t => t.id === activeHeading);
    return activeItem?.text || "Introduction";
  }, [activeHeading, tocItems]);

  const mdComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline) {
        return (
          <CodeBlock language={match ? match[1] : 'text'}>
            {String(children).replace(/\n$/, '')}
          </CodeBlock>
        );
      }
      return (
        <code className="font-mono bg-surface text-accent px-1.5 py-0.5 rounded-[4px] text-[0.85em] border border-border" {...props}>
          {children}
        </code>
      );
    },
    h2: ({ children }: any) => { 
      const hid = slugify(extractText(children)); 
      return <h2 id={hid} className="scroll-mt-32 text-text font-display tracking-tight text-3xl">{children}</h2>; 
    },
    h3: ({ children }: any) => { 
      const hid = slugify(extractText(children)); 
      return <h3 id={hid} className="scroll-mt-32 text-text font-display tracking-tight text-2xl">{children}</h3>; 
    },
    pre: ({ children }: any) => {
       return <>{children}</>;
    }
  };

  const ProseContent = () => (
    <div className="prose prose-lg dark:prose-invert max-w-[65ch] w-full
      prose-p:font-sans prose-p:leading-relaxed prose-p:text-textSecondary
      prose-headings:font-display prose-headings:tracking-tight prose-headings:text-text
      prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border
      prose-h3:mt-8 prose-h3:mb-4
      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-[3px] prose-blockquote:border-accent prose-blockquote:bg-surface prose-blockquote:not-italic prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-textSecondary
      prose-strong:text-text prose-strong:font-bold
      prose-ul:text-textSecondary prose-ol:text-textSecondary
      prose-li:marker:text-accent
      prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:w-full prose-img:object-cover
      prose-code:font-mono prose-code:text-sm prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-border
      prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-0
    ">
      <ReactMarkdown components={mdComponents}>{blog.content}</ReactMarkdown>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background text-text selection:bg-accent/20 selection:text-accent relative">
      
      {/* --- DESKTOP VIEW --- */}
      <div className="hidden lg:grid grid-cols-12 gap-8 max-w-[1400px] mx-auto px-12 pt-32 pb-64">
        
        {/* Left Column (Metadata) */}
        <div className="col-span-2">
          <div className="sticky top-32 flex flex-col gap-12">
            <button onClick={() => router.push('/blog')} className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-textSecondary hover:text-text transition-colors w-fit group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <div className="flex flex-col gap-4">
               <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Author</div>
               <div className="font-sans font-medium text-text">{blog.author || 'Karrtik Gupta'}</div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Published</div>
               <div className="font-sans font-medium text-text">{formatDate(blog.publishDate)}</div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Reading Time</div>
               <div className="font-sans font-medium text-text">{blog.readTime || '5 min read'}</div>
            </div>
            <div className="flex flex-col gap-4 pt-8 border-t border-border">
               <button onClick={handleShare} className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-textSecondary hover:text-accent transition-colors w-fit">
                 <Share2 size={16} /> Share Post
               </button>
            </div>
          </div>
        </div>

        {/* Center Column (Content) */}
        <div className="col-span-7 col-start-4">
           {/* Hero */}
           <div className="flex flex-col pt-12 pb-16">
             <h1 className="font-display text-5xl xl:text-7xl tracking-tight leading-tight text-text mb-8 text-balance">
               {blog.title}
             </h1>
             <p className="font-sans text-xl xl:text-2xl italic text-textSecondary leading-relaxed text-balance">
               {blog.excerpt}
             </p>
           </div>
           
           {/* Article Body */}
           <ProseContent />
        </div>

        {/* Right Column (TOC) */}
        <div className="col-span-2 col-start-11">
          <div className="sticky top-32 flex flex-col gap-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Table of Contents</span>
            <div className="flex flex-col relative border-l border-border pl-6 space-y-4">
               {tocItems.map((item) => (
                 <a 
                   key={item.id} 
                   href={`#${item.id}`} 
                   className={`font-sans text-sm transition-colors duration-300 relative ${activeHeading === item.id ? 'text-accent font-medium' : 'text-textSecondary hover:text-text'}`}
                   style={{ marginLeft: item.level === 3 ? '1rem' : '0' }}
                 >
                   {activeHeading === item.id && (
                     <motion.div 
                       layoutId="tocIndicator"
                       className="absolute -left-[25px] top-[0.1em] bottom-0 w-[2px] bg-accent h-full"
                     />
                   )}
                   {item.text}
                 </a>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="block lg:hidden w-full pb-32">
        <div className="w-[90%] mx-auto pt-24">
           {/* Hero */}
           <div className="flex flex-col gap-6 pb-12">
             <button onClick={() => router.push('/blog')} className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-textSecondary hover:text-text transition-colors w-fit group">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
             </button>
             <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-accent">
                <span>{formatDate(blog.publishDate)}</span>
                <span className="w-1 h-1 rounded-full bg-accent" />
                <span>{blog.readTime || '5 min read'}</span>
             </div>
             <h1 className="font-display text-4xl tracking-tight leading-tight text-text text-balance">
               {blog.title}
             </h1>
             <p className="font-sans text-lg italic text-textSecondary leading-relaxed text-balance">
               {blog.excerpt}
             </p>
           </div>

           {/* Article Body */}
           <div className="w-full overflow-hidden">
             <ProseContent />
           </div>
        </div>

        {/* Sticky Reading Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-t border-border">
          {/* Progress Bar */}
          <motion.div className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left" style={{ scaleX }} />
          
          <button 
            onClick={() => setIsTocMobileOpen(true)}
            className="w-full flex items-center justify-between px-6 py-4"
          >
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Reading</span>
              <span className="font-sans text-sm font-medium text-text truncate max-w-[250px]">{currentH2Text}</span>
            </div>
            <List size={20} className="text-textSecondary" />
          </button>
        </div>

        {/* Mobile Full-Screen TOC Overlay */}
        <AnimatePresence>
          {isTocMobileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="fixed inset-0 z-[100] bg-background flex flex-col"
            >
               <div className="flex items-center justify-between px-6 py-6 border-b border-border">
                 <span className="font-mono text-xs uppercase tracking-widest text-textSecondary">Table of Contents</span>
                 <button onClick={() => setIsTocMobileOpen(false)} className="p-2 rounded-full border border-border bg-surface text-text">
                   <X size={18} />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto px-6 py-8">
                 <div className="flex flex-col gap-6 relative border-l border-border pl-6">
                    {tocItems.map((item) => (
                      <a 
                        key={item.id} 
                        href={`#${item.id}`} 
                        onClick={() => setIsTocMobileOpen(false)}
                        className={`font-sans text-lg transition-colors duration-300 relative ${activeHeading === item.id ? 'text-accent font-medium' : 'text-textSecondary'}`}
                        style={{ marginLeft: item.level === 3 ? '1.5rem' : '0' }}
                      >
                        {activeHeading === item.id && (
                          <motion.div 
                            layoutId="tocIndicatorMobile"
                            className="absolute -left-[25px] top-0 bottom-0 w-[2px] bg-accent h-full"
                          />
                        )}
                        {item.text}
                      </a>
                    ))}
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
