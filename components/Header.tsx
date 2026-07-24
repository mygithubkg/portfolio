"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Home, User, Layers, BookOpen, Send, Award, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Index', icon: Home },
    { path: '/about', label: 'Identity', icon: User },
    { path: '/projects', label: 'Systems', icon: Layers },
    { path: '/blog', label: 'Journal', icon: BookOpen },
    { path: '/certifications', label: 'Badges', icon: Award },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP HEADER — Capsule Nav                               */}
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
              ? 'backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              : 'backdrop-blur-md border'
            }
          `}
          style={{
            background: isScrolled ? 'var(--nav-bg-scroll)' : 'var(--nav-bg)',
            borderColor: 'var(--border-nav)',
          }}
        >
          {/* LOGO: Left Side */}
          <Link
            href="/"
            className="flex items-center gap-2 pl-3 pr-4 py-2 group"
          >
            <Image
              src="https://res.cloudinary.com/f8njovya/image/upload/v1783444604/logo_ejmhtr.png"
              alt="Karrtik Gupta Logo"
              width={32}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="rounded-full object-contain"
            />
            <span
              className="font-bold text-base md:text-sm tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              Karrtik Gupta
            </span>
          </Link>

          {/* DESKTOP NAVIGATION: Center (Hidden on Mobile) */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  <span
                    className="relative z-10 transition-colors"
                    style={{ color: isActive ? 'var(--ink)' : 'var(--ink-dim)' }}
                  >
                    {link.label}
                  </span>

                  {hoveredPath === link.path && (
                    <motion.div
                      layoutId="desktop-nav-hover"
                      className="absolute inset-0 rounded-full z-0"
                      style={{ background: 'var(--rule)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {isActive && !hoveredPath && (
                    <motion.div
                      layoutId="desktop-nav-active"
                      className="absolute inset-x-4 -bottom-1 h-px z-0"
                      style={{
                        background: `linear-gradient(to right, transparent, var(--accent), transparent)`,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Theme Toggle + CTA */}
          <div className="flex items-center gap-2 pr-1.5">

            {/* Theme Toggle — shown on both desktop & mobile */}
            <motion.button
              id="theme-toggle"
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
              style={{
                background: 'var(--bg-pill)',
                border: '1px solid var(--rule)',
                color: 'var(--ink-dim)',
              }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Desktop CTA */}
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: 'var(--ink)',
                color: 'var(--ink-invert)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                (e.currentTarget as HTMLElement).style.color = '#000';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--ink)';
                (e.currentTarget as HTMLElement).style.color = 'var(--ink-invert)';
              }}
            >
              Initiate
              <ArrowUpRight size={16} />
            </Link>

            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{ background: 'var(--ink)', color: 'var(--ink-invert)' }}
            >
              <Send size={15} className="ml-0.5" />
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
          className="pointer-events-auto w-full max-w-sm p-2 rounded-[2rem] flex items-center justify-between gap-1.5"
          style={{
            background: 'var(--dock-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border-nav)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className={`
                  relative flex items-center justify-center h-14 rounded-[1.5rem] transition-all duration-500 overflow-hidden
                  ${isActive ? 'flex-grow' : 'w-14 flex-shrink-0'}
                `}
                style={{
                  background: isActive ? 'var(--rule)' : 'transparent',
                  color: isActive ? 'var(--ink)' : 'var(--ink-faint)',
                }}
              >
                <div className="flex items-center justify-center gap-2.5 relative z-10">
                  <link.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ color: isActive ? 'var(--accent)' : undefined }}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, scale: 0.8 }}
                        animate={{ opacity: 1, width: 'auto', scale: 1 }}
                        exit={{ opacity: 0, width: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm font-bold tracking-wide whitespace-nowrap"
                        style={{ color: 'var(--ink)' }}
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
                    style={{ background: `linear-gradient(135deg, var(--accent-dim), transparent)` }}
                  />
                )}
              </Link>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
