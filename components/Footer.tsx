"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, MapPin, Clock, Mail, Terminal } from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const [time, setTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("karrtikgupta9@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      className="py-section relative overflow-hidden select-none bg-surface border-t border-border"
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] rounded-t-full blur-[100px] pointer-events-none opacity-40 bg-accent/20"
      />

      <div className="w-[90%] md:w-[80%] mx-auto px-4 md:px-8 relative z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-group">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest mb-4 bg-background border border-border text-accent"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse bg-accent"
              />
              System Online
            </div>
            <h2
              className="text-4xl md:text-6xl font-display text-text tracking-tight leading-none"
            >
              Let's{' '}
              <span className="text-accent italic font-serif">collaborate.</span>
            </h2>
          </div>

          {/* Desktop Telemetry */}
          <div
            className="hidden md:flex items-center gap-6 font-mono text-xs px-4 py-2 rounded-xl"
            style={{
              background: 'var(--bg-pill)',
              border: '1px solid var(--border-nav)',
              color: 'var(--ink-dim)',
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: 'var(--accent)' }} />
              <span>GZB_IND</span>
            </div>
            <div className="w-px h-4" style={{ background: 'var(--rule-strong)' }} />
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: 'var(--accent)' }} />
              <span>{mounted ? time.toLocaleTimeString('en-US', { hour12: false }) : '--:--:--'} IST</span>
            </div>
          </div>
        </div>

        {/* --- BENTO CONTACT GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {/* 1. EMAIL WIDGET */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyEmail}
            className="col-span-2 rounded-[2rem] p-6 md:p-8 cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[200px] transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-nav)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, var(--accent-dim), transparent)' }}
            />

            <div className="flex justify-between items-start relative z-10">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ background: 'var(--rule)', color: 'var(--accent)' }}
              >
                <Mail size={20} />
              </div>
              <div
                className="px-3 py-1 rounded-full font-mono text-[10px] flex items-center gap-2"
                style={{
                  background: 'var(--bg-pill)',
                  border: '1px solid var(--border-nav)',
                  color: 'var(--ink-dim)',
                }}
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? 'COPIED' : 'COPY'}
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <p className="text-xs font-mono mb-1" style={{ color: 'var(--ink-faint)' }}>
                Direct Line
              </p>
              <h3
                className="text-lg md:text-2xl font-bold break-all transition-colors"
                style={{ color: 'var(--ink)' }}
              >
                karrtikgupta9@gmail.com
              </h3>
            </div>
          </motion.div>

          {/* 2. LINKEDIN */}
          <motion.a
            href="https://www.linkedin.com/in/karrtik-gupta/"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="col-span-1 rounded-[2rem] p-6 cursor-pointer group flex flex-col justify-between min-h-[160px] md:min-h-[200px] transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-nav)',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ background: 'var(--rule)', color: 'var(--ink-dim)' }}
            >
              <Linkedin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--ink-faint)' }}>
                Network
              </p>
              <p className="font-bold text-sm md:text-base" style={{ color: 'var(--ink)' }}>
                LinkedIn
              </p>
            </div>
          </motion.a>

          {/* 3. GITHUB */}
          <motion.a
            href="https://github.com/mygithubkg"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="col-span-1 rounded-[2rem] p-6 cursor-pointer group flex flex-col justify-between min-h-[160px] md:min-h-[200px] transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-nav)',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ background: 'var(--rule)', color: 'var(--ink-dim)' }}
            >
              <Github size={18} />
            </div>
            <div>
              <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--ink-faint)' }}>
                Repositories
              </p>
              <p className="font-bold text-sm md:text-base" style={{ color: 'var(--ink)' }}>
                GitHub
              </p>
            </div>
          </motion.a>

          {/* 4. MOBILE TELEMETRY ROW */}
          <div className="col-span-2 md:hidden flex gap-3 mt-2">
            <div
              className="flex-1 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1"
              style={{ background: 'var(--bg-pill)', border: '1px solid var(--border-nav)' }}
            >
              <MapPin size={16} style={{ color: 'var(--accent)' }} />
              <span className="font-mono text-[10px]" style={{ color: 'var(--ink-dim)' }}>
                GZB, INDIA
              </span>
            </div>
            <div
              className="flex-1 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1"
              style={{ background: 'var(--bg-pill)', border: '1px solid var(--border-nav)' }}
            >
              <Clock size={16} style={{ color: 'var(--accent)' }} />
              <span className="font-mono text-[10px]" style={{ color: 'var(--ink-dim)' }}>
                {mounted
                  ? time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
                  : '--:--'}
              </span>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SYSTEM BAR --- */}
        <div
          className="mt-12 md:mt-24 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest"
          style={{ borderTop: '1px solid var(--border-card)', color: 'var(--ink-faint)' }}
        >
          <p>© {new Date().getFullYear()} Karrtik Gupta</p>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 pb-4 md:pb-0 transition-colors"
            style={{ color: 'var(--ink-faint)' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--ink-faint)'}
          >
            <Terminal size={12} />
            <span>Sys_Admin</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
