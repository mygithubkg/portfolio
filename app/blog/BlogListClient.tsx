"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();

  // Dynamically extract unique categories/hashtags from real blogs
  const FILTER_TAGS = ["All", ...Array.from(new Set(initialBlogs.map(b => b.category).filter(Boolean)))];

  const filteredPosts = initialBlogs.filter(post => {
    const matchesSearch = 
      (post.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if it matches category or tags
    const matchesFilter = activeFilter === "All" || 
                          post.category === activeFilter || 
                          (post.hashtags && post.hashtags.includes(activeFilter));
    return matchesSearch && matchesFilter;
  });

  // Sort by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime();
  });

  // Use the top 2 latest/most viewed as Featured
  const featuredPosts = sortedPosts.filter(p => p.isFeatured).length >= 2 
    ? sortedPosts.filter(p => p.isFeatured).slice(0, 2)
    : sortedPosts.slice(0, 2);
    
  const archivePosts = sortedPosts.filter(p => !featuredPosts.includes(p));

  // --- THE GATEWAY ---
  const renderGateway = (isMobile: boolean) => (
    <div className={`sticky top-6 z-50 mx-auto ${isMobile ? 'w-[90%]' : 'w-full max-w-4xl'} backdrop-blur-xl bg-background/80 border border-border rounded-2xl flex flex-col md:flex-row items-center md:h-16 px-2 shadow-2xl`}>
       {/* Left: Search Input */}
       <div className={`w-full md:w-1/2 flex items-center h-14 md:h-full border-b md:border-b-0 md:border-r border-border px-4 ${isMobile ? 'mb-1' : ''}`}>
         <span className="font-mono text-accent mr-3">{'>_'}</span>
         <input 
           type="text"
           placeholder="Search archives..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="bg-transparent border-none outline-none font-mono text-sm w-full text-text placeholder-textSecondary"
         />
       </div>

       {/* Right: Filter Buttons */}
       <div className={`w-full md:w-1/2 flex items-center h-14 md:h-full ${isMobile ? 'overflow-x-auto snap-x hide-scrollbar' : 'justify-end'} px-2 md:pl-6 gap-6`}>
         {FILTER_TAGS.slice(0, 6).map((tag: any) => (
           <button
             key={tag}
             onClick={() => setActiveFilter(tag)}
             className={`relative font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap snap-center py-2 ${activeFilter === tag ? 'text-text' : 'text-textSecondary hover:text-text'}`}
           >
             {tag}
             {activeFilter === tag && (
               <motion.div layoutId="filterUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
             )}
           </button>
         ))}
       </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background text-text relative pb-32">
       {/* Global Gateway */}
       <div className="hidden lg:block pt-8 sticky top-0 z-50">
         {renderGateway(false)}
       </div>
       <div className="block lg:hidden pt-4 sticky top-0 z-50">
         {renderGateway(true)}
       </div>

       {/* Desktop View */}
       <div className="hidden lg:block mt-24 w-full max-w-[1600px] mx-auto px-16">
          <DesktopView featuredPosts={featuredPosts} archivePosts={archivePosts} router={router} />
       </div>

       {/* Mobile View */}
       <div className="block lg:hidden mt-8 w-full">
          <MobileView featuredPosts={featuredPosts} archivePosts={archivePosts} router={router} />
       </div>
    </div>
  );
}

// --- DESKTOP VIEW ---
function DesktopView({ featuredPosts, archivePosts, router }: any) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  
  // Custom spring config for smoother follow
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const springX = useSpring(rawMouseX, springConfig);
  const springY = useSpring(rawMouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove as any);
    return () => window.removeEventListener("mousemove", handleMouseMove as any);
  }, [rawMouseX, rawMouseY]);

  const formatDate = (d: string) => {
    return new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col">
      {/* Featured Grid (Asymmetric) */}
      {featuredPosts.length > 0 && (
        <div className="flex border-b border-l border-border mb-32 relative group/featured">
          {featuredPosts.map((post: any, i: number) => {
            const isMain = i === 0;
            return (
              <div 
                key={post.id} 
                onClick={() => router.push(`/blog/${post.id}`)}
                className={`${isMain ? 'w-[65%]' : 'w-[35%]'} border-r border-t border-border p-12 xl:p-16 flex flex-col justify-between cursor-pointer hover:bg-surface transition-colors duration-500`}
                style={{ minHeight: '600px' }}
              >
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-textSecondary mb-8">
                  <span>{formatDate(post.publishDate)}</span>
                  <span>{post.views || 0} Views</span>
                </div>
                <div className="flex flex-col gap-6">
                  <h2 className={`font-display leading-tight text-text hover:text-accent transition-colors duration-500 ${isMain ? 'text-7xl xl:text-8xl pr-12' : 'text-5xl xl:text-6xl'}`}>
                    {post.title}
                  </h2>
                  <p className="font-sans text-lg text-textSecondary text-balance">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Archive Index (Interactive Table) */}
      {archivePosts.length > 0 && (
        <div className="w-full">
           <div className="flex items-center border-b border-border pb-4 mb-4 font-mono text-xs uppercase tracking-widest text-textSecondary px-6">
             <div className="w-[20%]">Date</div>
             <div className="w-[60%]">Title</div>
             <div className="w-[20%] text-right">Tags</div>
           </div>
           
           <div className="flex flex-col relative" onMouseLeave={() => setHoveredImage(null)}>
             {archivePosts.map((post: any) => (
               <div 
                 key={post.id}
                 onMouseEnter={() => setHoveredImage(post.image || post.coverImage || "/fallback.jpg")}
                 onClick={() => router.push(`/blog/${post.id}`)}
                 className="flex items-center border-b border-border py-8 px-6 cursor-pointer hover:bg-text hover:text-background transition-colors duration-300 group"
               >
                 <div className="w-[20%] font-mono text-sm opacity-60 group-hover:opacity-100 transition-opacity">{formatDate(post.publishDate)}</div>
                 <div className="w-[60%] font-display text-4xl group-hover:translate-x-4 transition-transform duration-500 ease-out">{post.title}</div>
                 <div className="w-[20%] text-right font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity">{(post.hashtags || []).slice(0,3).join(", ")}</div>
               </div>
             ))}

             {/* Floating Cursor Image Preview */}
             <AnimatePresence>
               {hoveredImage && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                   transition={{ duration: 0.3, ease: EASE }}
                   style={{
                     position: 'fixed',
                     top: 0,
                     left: 0,
                     x: springX,
                     y: springY,
                     pointerEvents: 'none',
                     translateX: '-50%',
                     translateY: '-50%',
                     zIndex: 100,
                   }}
                   className="w-[320px] aspect-[4/3] overflow-hidden shadow-2xl border border-border pointer-events-none"
                 >
                   <Image src={hoveredImage} alt="Preview" fill sizes="320px" className="object-cover" />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      )}
    </div>
  )
}

// --- MOBILE VIEW ---
function MobileView({ featuredPosts, archivePosts, router }: any) {
  const formatDate = (d: string) => {
    return new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col w-full">
       {/* Featured Swipe (Horizontal Carousel) */}
       {featuredPosts.length > 0 && (
         <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-12 pt-4 hide-scrollbar">
           {featuredPosts.map((post: any) => (
             <div 
               key={post.id}
               onClick={() => router.push(`/blog/${post.id}`)}
               className="min-w-[85vw] snap-center flex flex-col gap-6 cursor-pointer"
             >
               <div className="w-full aspect-[4/3] relative rounded-none border border-border bg-surface">
                 <Image src={post.image || post.coverImage || "/fallback.jpg"} alt={post.title} fill sizes="(max-width: 768px) 85vw" className="object-cover grayscale" />
               </div>
               <div className="flex flex-col gap-2">
                 <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-textSecondary">
                   <span>{formatDate(post.publishDate)}</span>
                   <span>{post.readTime || "5 min read"}</span>
                 </div>
                 <h2 className="font-display text-4xl leading-tight text-text text-balance">{post.title}</h2>
               </div>
             </div>
           ))}
         </div>
       )}

       {/* The Feed (Vertical Stack) */}
       {archivePosts.length > 0 && (
         <div className="w-full px-4 flex flex-col gap-12 mt-8 border-t border-border pt-12">
            <h3 className="font-mono text-xs text-textSecondary uppercase tracking-widest block">The Archive</h3>
            
            <div className="flex flex-col gap-16">
              {archivePosts.map((post: any) => (
                <motion.div
                  key={post.id}
                  onClick={() => router.push(`/blog/${post.id}`)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex flex-col gap-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-textSecondary">
                    <span>{formatDate(post.publishDate)}</span>
                    <span>{post.readTime || "5 min read"}</span>
                  </div>
                  <h2 className="font-display text-3xl leading-tight text-text group-active:text-accent transition-colors">{post.title}</h2>
                  <p className="font-sans text-base text-textSecondary leading-relaxed line-clamp-2 text-balance">
                    {post.excerpt}
                  </p>
                  <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-text mt-2 group-active:text-accent transition-colors">
                    Read Article <ArrowRight size={14} />
                  </span>
                </motion.div>
              ))}
            </div>
         </div>
       )}
    </div>
  )
}
