import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Terminal, Home, User, Layers, BookOpen, Send } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();

  // Detect scroll to add slight shadow/border changes
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Added icons for the mobile app dock
  const navLinks = [
    { path: '/', label: 'Index', icon: Home },
    { path: '/about', label: 'Identity', icon: User },
    { path: '/projects', label: 'Systems', icon: Layers },
    { path: '/blog', label: 'Journal', icon: BookOpen },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP HEADER (Capsule for Desktop, Minimal Bar for Mobile) */}
      {/* ========================================================= */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className={`
            pointer-events-auto relative flex items-center justify-between
            p-1.5 rounded-full transition-all duration-500 w-full md:w-auto
            ${isScrolled
              ? 'bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'bg-[#0a0a0c]/40 backdrop-blur-md border border-white/5'}
          `}
        >
          {/* LOGO: Left Side */}
          <Link
            to="/"
            className="flex items-center gap-2 pl-3 pr-4 py-2 group"
          >
            <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
              <Terminal size={14} />
            </div>
            <span className="font-bold text-white text-base md:text-sm tracking-tight">Karrtik Gupta</span>
          </Link>

          {/* DESKTOP NAVIGATION: Center (Hidden on Mobile) */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                    {link.label}
                  </span>

                  {/* Magnetic Hover/Active Pill */}
                  {hoveredPath === link.path && (
                    <motion.div
                      layoutId="desktop-nav-hover"
                      className="absolute inset-0 bg-white/10 rounded-full z-0"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {isActive && !hoveredPath && (
                    <motion.div
                      layoutId="desktop-nav-active"
                      className="absolute inset-x-4 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-0"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ACTION BUTTON: Right Side */}
          <div className="flex items-center gap-2 pr-1.5">
            {/* Desktop Action Button */}
            <Link
              to="/contact"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
            >
              Initiate
              <ArrowUpRight size={16} />
            </Link>

            {/* Mobile Action Button (Replaces Hamburger Menu) */}
            <Link
              to="/contact"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-cyan-400 transition-colors"
            >
              <Send size={16} className="ml-0.5" />
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE APP BOTTOM DOCK (Hidden on Desktop)             */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden pointer-events-none flex justify-center">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
          className="pointer-events-auto w-full max-w-sm bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center justify-between gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative flex items-center justify-center h-14 rounded-full transition-all duration-500 overflow-hidden
                  ${isActive
                    ? 'flex-grow bg-white/10 text-white'
                    : 'w-14 flex-shrink-0 text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2.5 relative z-10">
                  <link.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-cyan-400' : ''}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, scale: 0.8 }}
                        animate={{ opacity: 1, width: 'auto', scale: 1 }}
                        exit={{ opacity: 0, width: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm font-bold tracking-wide whitespace-nowrap"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subtle active glow inside the pill */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                )}
              </Link>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}