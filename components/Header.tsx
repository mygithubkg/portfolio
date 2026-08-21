"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'Identity' },
    { path: '/projects', label: 'Systems' },
    { path: '/blog', label: 'Journal' },
    { path: '/certifications', label: 'Badges' },
  ];

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  // Hamburger animation variants
  const topLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 6 }
  };
  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 }
  };
  const bottomLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -6 }
  };

  // Mobile menu stagger variants
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const linkVariants: any = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -10 }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out flex items-center justify-between px-6 md:px-12 h-20 ${isScrolled
            ? 'bg-surface/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent border-b border-transparent'
          }`}
      >
        {/* LOGO: Left */}
        <Link
          href="/"
          className="font-display font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity z-50 relative text-text"
        >
          Karrtik Gupta
        </Link>

        {/* DESKTOP NAV: Right */}
        <div className="hidden md:flex items-center gap-group">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative group font-mono text-xs uppercase tracking-[0.15em] text-textSecondary hover:text-text transition-colors"
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-5 ml-4 border-l border-border pl-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="text-textSecondary hover:text-text transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full p-1"
              aria-label="Toggle theme"
            >
              {mounted && (
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Sun size={18} strokeWidth={1.5} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Moon size={18} strokeWidth={1.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </button>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest text-accent border border-accent hover:bg-accent hover:text-background transition-all duration-300"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex items-center gap-4 z-50 relative">
          {/* Theme Toggle (Mobile) */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="text-textSecondary hover:text-text transition-colors p-1"
            aria-label="Toggle theme"
          >
            {mounted && (
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Sun size={18} strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Moon size={18} strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 outline-none"
            aria-label="Toggle menu"
          >
            <motion.span
              variants={topLineVariants}
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-5 h-[1.5px] bg-text block origin-center"
            />
            <motion.span
              variants={middleLineVariants}
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-5 h-[1.5px] bg-text block"
            />
            <motion.span
              variants={bottomLineVariants}
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-5 h-[1.5px] bg-text block origin-center"
            />
          </button>
        </div>
      </header>

      {/* FULL SCREEN MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2 } }}
            className="fixed inset-0 z-40 bg-surface flex flex-col justify-center px-8"
          >
            {/* Subtle grain texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }} />

            <motion.nav
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6 relative z-10"
            >
              {[...navLinks, { path: '/contact', label: 'Contact' }].map((link) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div key={link.path} variants={linkVariants}>
                    <Link
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-display text-4xl sm:text-5xl transition-colors ${isActive ? 'text-accent' : 'text-text hover:text-accentLight'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}