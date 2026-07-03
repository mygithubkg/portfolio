"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Tag,
  Copy,
  Check,
  ChevronUp,
  Bookmark,
  Link2,
  List,
  X,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { incrementBlogViews } from '@/lib/utils/blogData';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TOKENS_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --bg: #0A0B0D;
    --bg-raised: #121417;
    --bg-raised-2: #17191D;
    --rule: rgba(255,255,255,0.08);
    --rule-strong: rgba(255,255,255,0.16);
    --ink: #ECEAE2;
    --ink-dim: #9A9D9F;
    --ink-faint: #55585C;
    --accent: #5FE0D0;
    --accent-dim: rgba(95,224,208,0.10);
    --accent-rule: rgba(95,224,208,0.28);
  }

  .font-editorial { font-family: 'Source Serif 4', Georgia, 'Iowan Old Style', ui-serif, serif; }
  .font-chrome { font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace; }

  ::selection { background: var(--accent-dim); color: var(--ink); }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--rule-strong); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.24); }

  .prose-body pre { background: transparent !important; padding: 0 !important; margin: 0 !important; border: none !important; overflow-x: auto; }
  .prose-body pre code { background: transparent !important; padding: 0 !important; border: none !important; font-size: 0.875rem !important; line-height: 1.75 !important; }
  .prose-body > *:first-child { margin-top: 0 !important; }

  .ledger-track { position: relative; }
  .ledger-track::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background: var(--rule);
  }
`;

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node))
    return extractText((node.props as any).children);
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function Toast({
  message,
  visible,
  onDone,
}: {
  message: string;
  visible: boolean;
  onDone: () => void;
}) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDone, 2200);
      return () => clearTimeout(t);
    }
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 bg-[var(--bg-raised-2)] border border-[var(--rule)] rounded-[8px] text-[var(--ink-dim)] text-[13px] font-chrome flex items-center gap-2 shadow-lg"
        >
          <Check size={13} className="text-[var(--accent)]" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 rounded-[12px] overflow-hidden border border-[var(--rule)] bg-[var(--bg-raised)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--rule)]">
        <span className="text-[11px] font-chrome text-[var(--ink-faint)] uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[var(--ink-faint)] hover:text-[var(--accent)] transition-colors font-chrome"
        >
          {copied ? <Check size={13} className="text-[var(--accent)]" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: 0, background: 'transparent', padding: '1rem' }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function HeadingWithAnchor({
  level,
  children,
  id,
  index,
}: {
  level: number;
  children: React.ReactNode;
  id: string;
  index: number | null;
}) {
  const [copied, setCopied] = useState(false);
  const HeadingTag = `h${level}` as React.ElementType;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sizeClasses: Record<number, string> = {
    1: 'text-3xl md:text-4xl font-semibold',
    2: 'text-2xl md:text-[1.75rem] font-semibold',
    3: 'text-xl md:text-2xl font-medium',
  };

  return (
    <HeadingTag
      id={id}
      className={`group/heading relative font-editorial ${sizeClasses[level]} text-[var(--ink)] mt-16 mb-4 scroll-mt-24`}
    >
      {index !== null && (
        <a
          href={`#${id}`}
          onClick={handleClick}
          className="hidden xl:flex absolute -left-12 top-[0.3em] w-8 items-center justify-end font-chrome text-[11px] text-[var(--ink-faint)] hover:text-[var(--accent)] transition-colors"
          aria-label="Copy link to this section"
        >
          {copied ? <Check size={12} /> : pad2(index)}
        </a>
      )}
      {children}
    </HeadingTag>
  );
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogDetailClient({ blog, id }: { blog: any; id: string }) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [toast, setToast] = useState({ message: '', visible: false });
  const [showDock, setShowDock] = useState(false);
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setShowDock(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Increment view counter client-side (write action stays client-side) */
  useEffect(() => {
    incrementBlogViews(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    try {
      const bm: string[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setBookmarked(bm.includes(id));
    } catch { }
  }, [id]);

  const tocItems = useMemo<TocItem[]>(() => {
    if (!blog?.content) return [];
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let m;
    while ((m = regex.exec(blog.content)) !== null) {
      items.push({ id: slugify(m[2]), text: m[2], level: m[1].length });
    }
    return items;
  }, [blog?.content]);

  const indexById = useMemo(() => {
    const map: Record<string, number> = {};
    tocItems.forEach((item, i) => (map[item.id] = i + 1));
    return map;
  }, [tocItems]);

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
      { rootMargin: '-80px 0px -65% 0px' }
    );
    const timer = setTimeout(() => {
      tocItems.forEach(({ id: hid }) => {
        const el = document.getElementById(hid);
        if (el) observer.observe(el);
      });
    }, 600);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [tocItems]);

  const showToast = useCallback((message: string) => setToast({ message, visible: true }), []);
  const hideToast = useCallback(() => setToast((p) => ({ ...p, visible: false })), []);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href }); } catch { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied');
    }
  };

  const toggleBookmark = () => {
    try {
      const bm: string[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      if (bm.includes(id)) {
        localStorage.setItem('bookmarks', JSON.stringify(bm.filter((b) => b !== id)));
        setBookmarked(false);
        showToast('Removed from bookmarks');
      } else {
        bm.push(id);
        localStorage.setItem('bookmarks', JSON.stringify(bm));
        setBookmarked(true);
        showToast('Saved to bookmarks');
      }
    } catch { }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const authorInitials = (blog?.author || 'KG')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{TOKENS_STYLE}</style>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left z-50" style={{ scaleX }} />
      <Toast message={toast.message} visible={toast.visible} onDone={hideToast} />

      <article className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: blog.title,
              description: blog.excerpt,
              author: { '@type': 'Person', name: blog.author || 'Karrtik Gupta', url: 'https://www.karrtikgupta.com' },
              datePublished: blog.createdAt || blog.publishDate,
              dateModified: blog.updatedAt || blog.createdAt || blog.publishDate,
              image: blog.imageUrl ?? 'https://www.karrtikgupta.com/og-image.png',
              url: `https://www.karrtikgupta.com/blog/${id}`,
            }),
          }}
        />

        <header className="relative w-full overflow-hidden border-b border-[var(--rule)]">
          {blog.imageUrl && (
            <div className="absolute inset-0 h-full">
              <img src={blog.imageUrl} alt="" className="w-full h-full object-cover opacity-[0.35]" onError={(e: any) => { e.target.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 to-[var(--bg)]" />
            </div>
          )}
          <div className="relative z-10 max-w-[1120px] mx-auto px-6 md:px-12 pt-24 pb-12">
            <button onClick={() => router.push('/blog')} className="inline-flex items-center gap-2 text-[var(--ink-faint)] hover:text-[var(--ink)] text-[13px] font-chrome mb-8 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              blog
            </button>
            <p className="font-chrome text-[12px] text-[var(--accent)] mb-4 tracking-wide">
              {'// '}{blog.category} · {new Date(blog.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {blog.readTime}
            </p>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="font-editorial text-4xl sm:text-5xl md:text-[3.25rem] font-semibold tracking-tight leading-[1.1] mb-6 max-w-3xl">
              {blog.title}
            </motion.h1>
            <p className="font-editorial italic text-lg md:text-xl text-[var(--ink-dim)] leading-relaxed max-w-2xl mb-8">{blog.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-chrome text-[13px] text-[var(--ink-faint)]">
              <span className="flex items-center gap-2 text-[var(--ink-dim)]">
                <span className="w-7 h-7 rounded-[6px] bg-[var(--bg-raised)] border border-[var(--rule)] flex items-center justify-center text-[10px] font-medium text-[var(--ink)]">{authorInitials}</span>
                {blog.author || 'Karrtik Gupta'}
              </span>
              <span className="w-px h-4 bg-[var(--rule)]" />
              <span className="flex items-center gap-1.5"><Eye size={13} />{blog.views || 0}</span>
            </div>
          </div>
        </header>

        <div className="max-w-[1120px] mx-auto px-6 md:px-12">
          <div className="xl:flex xl:justify-between xl:gap-16">
            <div className="mx-auto xl:mx-0 max-w-[42rem] w-full xl:pl-12">
              <div className="prose-body font-editorial">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
                      ) : (
                        <code className="font-chrome bg-[var(--bg-raised)] text-[var(--accent)] px-1.5 py-0.5 rounded-[4px] text-[0.82em] border border-[var(--rule)]" {...props}>{children}</code>
                      );
                    },
                    h1: ({ children }: any) => { const hid = slugify(extractText(children)); return <HeadingWithAnchor level={1} id={hid} index={indexById[hid] ?? null}>{children}</HeadingWithAnchor>; },
                    h2: ({ children }: any) => { const hid = slugify(extractText(children)); return <HeadingWithAnchor level={2} id={hid} index={indexById[hid] ?? null}>{children}</HeadingWithAnchor>; },
                    h3: ({ children }: any) => { const hid = slugify(extractText(children)); return <HeadingWithAnchor level={3} id={hid} index={indexById[hid] ?? null}>{children}</HeadingWithAnchor>; },
                    p: ({ children }: any) => <p className="text-[var(--ink)] leading-[1.8] text-[18px] mb-6">{children}</p>,
                    ul: ({ children }: any) => <ul className="space-y-2 mb-6">{children}</ul>,
                    ol: ({ children }: any) => <ol className="space-y-2 mb-6">{children}</ol>,
                    li: ({ children }: any) => (
                      <li className="flex items-start gap-3 text-[var(--ink)] text-[18px] leading-[1.8]">
                        <span className="mt-[13px] w-1 h-1 rounded-full bg-[var(--ink-faint)] flex-shrink-0" />
                        <span>{children}</span>
                      </li>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="my-8 pl-6 pr-4 py-4 border-l-2 border-[var(--accent-rule)] bg-[var(--accent-dim)] rounded-r-[8px]">
                        <div className="text-[var(--ink-dim)] italic text-lg leading-relaxed">{children}</div>
                      </blockquote>
                    ),
                    a: ({ children, href }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent-rule)] hover:decoration-[var(--accent)] transition-all">{children}</a>,
                    hr: () => <hr className="my-12 border-[var(--rule)]" />,
                    img: ({ src, alt }: any) => (
                      <figure className="my-8 -mx-6 md:mx-0">
                        <img src={src} alt={alt || ''} className="w-full rounded-[12px] border border-[var(--rule)]" onError={(e: any) => { e.target.style.display = 'none'; }} />
                        {alt && <figcaption className="text-center text-xs text-[var(--ink-faint)] font-chrome mt-3">{alt}</figcaption>}
                      </figure>
                    ),
                    table: ({ children }: any) => <div className="overflow-x-auto my-8 rounded-[8px] border border-[var(--rule)]"><table className="w-full text-sm">{children}</table></div>,
                    th: ({ children }: any) => <th className="px-4 py-3 text-left text-[11px] font-chrome text-[var(--ink-faint)] uppercase tracking-wider bg-[var(--bg-raised)] border-b border-[var(--rule)]">{children}</th>,
                    td: ({ children }: any) => <td className="px-4 py-3 text-[var(--ink)] border-b border-[var(--rule)] text-[15px]">{children}</td>,
                    strong: ({ children }: any) => <strong className="text-[var(--ink)] font-semibold">{children}</strong>,
                    em: ({ children }: any) => <em>{children}</em>,
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>

              <div className="mt-24 pt-8 border-t border-[var(--rule)]">
                {blog.hashtags && blog.hashtags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    <Tag size={12} className="text-[var(--ink-faint)] mr-1" />
                    {blog.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-[4px] bg-[var(--bg-raised)] text-[var(--ink-faint)] text-[12px] font-chrome border border-[var(--rule)]">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-[var(--rule)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-chrome text-[var(--ink-faint)]">Share</span>
                    <button
                      onClick={handleShare}
                      aria-label="Share this post"
                      className="w-9 h-9 rounded-[8px] bg-[var(--bg-raised)] border border-[var(--rule)] flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--accent)] hover:border-[var(--accent-rule)] transition-all"
                      title="Share"
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied'); }}
                      aria-label="Copy link to this post"
                      className="w-9 h-9 rounded-[8px] bg-[var(--bg-raised)] border border-[var(--rule)] flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--accent)] hover:border-[var(--accent-rule)] transition-all"
                      title="Copy link"
                    >
                      <Link2 size={14} />
                    </button>
                  </div>
                  <button onClick={toggleBookmark} className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-chrome transition-all border ${bookmarked ? 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-rule)]' : 'bg-[var(--bg-raised)] text-[var(--ink-faint)] border-[var(--rule)] hover:text-[var(--ink)]'}`}>
                    <Bookmark size={13} fill={bookmarked ? 'currentColor' : 'none'} />
                    {bookmarked ? 'Saved' : 'Save for later'}
                  </button>
                </div>
                <div className="py-8">
                  <div className="flex items-start gap-4 p-6 rounded-[16px] bg-[var(--bg-raised)] border border-[var(--rule)]">
                    <div className="w-11 h-11 rounded-[8px] bg-[var(--bg-raised-2)] border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] font-chrome font-medium text-[13px] flex-shrink-0">{authorInitials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--ink)] font-semibold font-editorial text-lg mb-1">{blog.author || 'Karrtik Gupta'}</p>
                      <p className="text-[var(--ink-dim)] text-sm leading-relaxed mb-3">{blog.authorBio || 'Developer, writer, and creator. Building things for the web and sharing what I learn along the way.'}</p>
                      <div className="flex items-center gap-4 font-chrome text-[12px] text-[var(--ink-faint)]">
                        <a href="https://www.instagram.com/karrtik_gupta/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Instragram →</a>
                        <a href="https://github.com/mygithubkg" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">github →</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-4 pb-8">
                  <button onClick={() => router.push('/blog')} className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] text-sm font-chrome font-medium hover:opacity-90 active:scale-[0.98] transition-all">
                    <ArrowLeft size={14} />All articles
                  </button>
                </div>
              </div>
            </div>

            {tocItems.length > 0 && (
              <aside className="hidden xl:block w-[200px] flex-shrink-0">
                <nav className="sticky top-24">
                  <p className="font-chrome text-[10px] text-[var(--ink-faint)] uppercase tracking-[0.15em] mb-4">Contents</p>
                  <ul className="ledger-track pl-4 space-y-0.5">
                    {tocItems.map((item, i) => {
                      const isActive = activeHeading === item.id;
                      return (
                        <li key={item.id} className="relative">
                          <span className={`absolute -left-4 top-0 bottom-0 w-[1px] transition-colors duration-300 ${isActive ? 'bg-[var(--accent)]' : 'bg-transparent'}`} />
                          <a href={`#${item.id}`} className={`flex items-baseline gap-2.5 py-1.5 font-chrome text-[13px] leading-snug transition-colors ${item.level === 3 ? 'pl-4' : ''} ${isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)] hover:text-[var(--ink-dim)]'}`}>
                            <span className="text-[11px] tabular-nums">{pad2(i + 1)}</span>
                            <span className="font-editorial text-[14px] not-italic">{item.text}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </aside>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showDock && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="fixed bottom-6 right-6 z-40 flex items-center gap-1 p-1 rounded-[10px] bg-[var(--bg-raised)]/95 backdrop-blur border border-[var(--rule)] shadow-lg">
              {tocItems.length > 0 && (
                <button
                  onClick={() => setShowToc(!showToc)}
                  aria-label={showToc ? 'Close table of contents' : 'Open table of contents'}
                  className="xl:hidden w-9 h-9 rounded-[8px] flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--bg-raised-2)] transition-colors"
                  title="Contents"
                >
                  {showToc ? <X size={15} /> : <List size={15} />}
                </button>
              )}
              <button
                onClick={handleShare}
                aria-label="Share this post"
                className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--accent)] hover:bg-[var(--bg-raised-2)] transition-colors"
                title="Share"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={toggleBookmark}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this post'}
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors ${bookmarked ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--bg-raised-2)]'}`}
                title="Bookmark"
              >
                <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
              </button>
              <span className="w-px h-5 bg-[var(--rule)] mx-0.5" />
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--bg-raised-2)] transition-colors"
                title="Back to top"
              >
                <ChevronUp size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showToc && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowToc(false)} className="xl:hidden fixed inset-0 z-40 bg-black/50" />
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ type: 'spring', damping: 28, stiffness: 320 }} className="xl:hidden fixed bottom-20 right-6 left-6 sm:left-auto sm:w-80 z-50 max-h-[60vh] bg-[var(--bg-raised)] border border-[var(--rule)] rounded-[12px] shadow-2xl overflow-hidden">
                <div className="p-5">
                  <p className="font-chrome text-[10px] text-[var(--ink-faint)] uppercase tracking-[0.15em] mb-4">Contents</p>
                  <ul className="space-y-0.5 max-h-[calc(60vh-80px)] overflow-y-auto pr-1">
                    {tocItems.map((item, i) => {
                      const isActive = activeHeading === item.id;
                      return (
                        <li key={item.id}>
                          <a href={`#${item.id}`} onClick={() => setShowToc(false)} className={`flex items-baseline gap-2.5 px-2 py-2 rounded-[6px] text-sm transition-all ${item.level === 3 ? 'pl-6' : ''} ${isActive ? 'text-[var(--accent)] bg-[var(--accent-dim)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--bg-raised-2)]'}`}>
                            <span className="font-chrome text-[11px] text-[var(--ink-faint)] tabular-nums">{pad2(i + 1)}</span>
                            <span className="font-editorial">{item.text}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </article>
    </>
  );
}
