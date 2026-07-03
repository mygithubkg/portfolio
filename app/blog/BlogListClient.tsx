"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Terminal,
  Search,
  X,
  ArrowRight,
  Clock,
  Eye,
  ChevronDown,
  Check,
} from 'lucide-react';

const TOKENS_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

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

  @keyframes blink-cursor { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
  .blink { animation: blink-cursor 1.1s steps(1) infinite; }

  @keyframes skeleton-pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.6; } }
  .skeleton { animation: skeleton-pulse 1.6s ease-in-out infinite; background: var(--bg-raised); border-radius: 4px; }
`;

const CATEGORY_ALL = 'All';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Latest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'title', label: 'Title, A–Z' },
  { value: 'views', label: 'Most read' },
];

export default function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [blogs] = useState<any[]>(initialBlogs);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  /* ⌘K / Ctrl+K focuses search */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') setSortMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* Close sort menu on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  /* Filter + sort whenever deps change */
  useEffect(() => {
    let filtered = [...blogs];
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== CATEGORY_ALL) {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    if (selectedHashtag) {
      filtered = filtered.filter(blog =>
        blog.hashtags?.some((tag: string) => tag.toLowerCase() === selectedHashtag.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'date-asc': return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'title': return a.title.localeCompare(b.title);
        case 'views': return (b.views || 0) - (a.views || 0);
        default: return 0;
      }
    });
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory, selectedHashtag, sortBy]);

  const categories = [CATEGORY_ALL, ...Array.from(new Set(blogs.map(blog => blog.category)))];
  const handleBlogClick = (blogId: string) => router.push(`/blog/${blogId}`);
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    setSelectedHashtag(prev => (prev.toLowerCase() === tag.toLowerCase() ? '' : tag));
  };
  const resetAll = () => { setSearchTerm(''); setSelectedCategory(CATEGORY_ALL); setSelectedHashtag(''); };
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort';
  const hasActiveFilters = searchTerm || selectedCategory !== CATEGORY_ALL || selectedHashtag;

  return (
    <section className="min-h-screen py-24 relative bg-[var(--bg)] text-[var(--ink-dim)] selection:bg-[var(--accent-dim)] selection:text-[var(--accent)]">
      <style>{TOKENS_STYLE}</style>

      <div className="w-[90%] md:w-[80%] mx-auto relative z-10 max-w-5xl">

        {/* ═══════════ HEADER ═══════════ */}
        <div className="mb-16 pb-12 border-b border-[var(--rule)]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[var(--bg-raised)] border border-[var(--rule)] text-[var(--accent)] font-chrome text-xs mb-6 tracking-widest uppercase">
              <Terminal size={13} />
              <span>/root/publications</span>
            </div>
            <h1 className="font-editorial text-5xl md:text-7xl font-semibold text-[var(--ink)] tracking-tight leading-[1.02] mb-4">
              Dev Journal.
            </h1>
            <p className="text-[var(--ink-dim)] text-base font-editorial italic max-w-md">
              Technical insights, architectural teardowns, and engineering philosophies.
            </p>
          </motion.div>
        </div>

        {/* ═══════════ COMMAND BAR ═══════════ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-8">
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <div className="flex-1 relative flex items-center bg-[var(--bg-raised)] border border-[var(--rule)] rounded-[12px]">
              <Search className="absolute left-4 text-[var(--ink-faint)]" size={16} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent pl-11 pr-4 py-3 text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none font-chrome text-sm rounded-[12px]"
              />
              {searchTerm ? (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 w-7 h-7 rounded-[8px] flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--bg-raised-2)] transition-colors" aria-label="Clear search">
                  <X size={14} />
                </button>
              ) : (
                <span className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-1 rounded-[6px] border border-[var(--rule)] font-chrome text-[10px] text-[var(--ink-faint)]">⌘K</span>
              )}
            </div>

            <div ref={sortMenuRef} className="relative flex-shrink-0">
              <button
                onClick={() => setSortMenuOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortMenuOpen}
                className={`w-full md:w-auto h-full px-4 py-3 rounded-[8px] font-chrome text-xs tracking-wide transition-all flex items-center gap-2 justify-between md:justify-center border ${sortMenuOpen ? 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-rule)]' : 'bg-[var(--bg-raised)] text-[var(--ink-dim)] border-[var(--rule)] hover:text-[var(--ink)]'}`}
              >
                {activeSortLabel}
                <ChevronDown size={14} className={`transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortMenuOpen && (
                  <motion.ul role="listbox" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }} className="absolute right-0 mt-2 w-48 py-1 rounded-[12px] bg-[var(--bg-raised-2)] border border-[var(--rule)] shadow-xl z-30">
                    {SORT_OPTIONS.map(opt => (
                      <li key={opt.value} role="option" aria-selected={sortBy === opt.value}>
                        <button
                          onClick={() => { setSortBy(opt.value); setSortMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left font-chrome text-xs transition-colors ${sortBy === opt.value ? 'text-[var(--accent)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--bg-raised)]'}`}
                        >
                          {opt.label}
                          {sortBy === opt.value && <Check size={13} />}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((category: any) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-[8px] text-xs font-chrome transition-all border ${selectedCategory === category ? 'bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)] font-medium' : 'bg-transparent text-[var(--ink-faint)] border-[var(--rule)] hover:text-[var(--ink)] hover:border-[var(--rule-strong)]'}`}
                >
                  {category}
                </button>
              ))}
              {selectedHashtag && (
                <button onClick={() => setSelectedHashtag('')} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-xs font-chrome bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent-rule)]">
                  #{selectedHashtag}<X size={12} />
                </button>
              )}
            </div>
            <span className="hidden sm:block font-chrome text-[11px] text-[var(--ink-faint)] whitespace-nowrap">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </motion.div>

        {/* ═══════════ EDITORIAL LIST VIEW ═══════════ */}
        <div className="border-t border-[var(--rule)]">
          <AnimatePresence mode="wait">
            {filteredBlogs.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-24 text-center">
                <Terminal className="mx-auto text-[var(--ink-faint)] mb-4" size={36} />
                <p className="font-chrome text-sm text-[var(--ink)] mb-1">
                  {searchTerm ? `No entries match "${searchTerm}"` : 'No entries match these filters'}
                </p>
                <p className="font-chrome text-xs text-[var(--ink-faint)] mb-6">Try a different term, or clear what&apos;s applied.</p>
                <button onClick={resetAll} className="px-5 py-2 rounded-[8px] border border-[var(--rule)] font-chrome text-xs text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors">Reset filters</button>
              </motion.div>
            ) : (
              <div className="flex flex-col">
                {filteredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.4) }}
                    onClick={() => handleBlogClick(blog.id)}
                    className="group border-b border-[var(--rule)] py-8 cursor-pointer relative"
                  >
                    <div className="absolute inset-0 bg-[var(--bg-raised)] opacity-0 group-hover:opacity-40 transition-opacity duration-200 -mx-4 px-4 rounded-[12px]" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-[140px_1fr_110px] gap-4 md:gap-8 items-start">
                      <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-2">
                        <span className="font-chrome text-xs text-[var(--accent)]">
                          {new Date(blog.publishDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
                        </span>
                        <span className="font-chrome text-[10px] text-[var(--ink-faint)] tracking-widest uppercase border border-[var(--rule)] px-2 py-1 rounded-[8px] w-fit group-hover:border-[var(--accent-rule)] group-hover:text-[var(--accent)] transition-colors">
                          {blog.category}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-tight mb-2">
                          {blog.title}
                        </h2>
                        <p className="text-[var(--ink-dim)] text-[15px] leading-relaxed max-w-2xl mb-3">{blog.excerpt}</p>
                        {blog.hashtags && blog.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {blog.hashtags.slice(0, 3).map((tag: string, i: number) => (
                              <button key={i} onClick={(e) => handleTagClick(e, tag)} className={`font-chrome text-[11px] transition-colors ${selectedHashtag.toLowerCase() === tag.toLowerCase() ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)] hover:text-[var(--ink-dim)]'}`}>
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:gap-4">
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 font-chrome text-[10px] text-[var(--ink-faint)]">
                          <span className="flex items-center gap-1.5"><Clock size={11} />{blog.readTime}</span>
                          {blog.views > 0 && <span className="flex items-center gap-1.5"><Eye size={11} />{blog.views}</span>}
                        </div>
                        <div className="w-9 h-9 rounded-full border border-[var(--rule)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-200">
                          <ArrowRight size={15} className="text-[var(--ink-faint)] group-hover:text-[var(--bg)] group-hover:-rotate-45 transition-all duration-200" />
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
}
