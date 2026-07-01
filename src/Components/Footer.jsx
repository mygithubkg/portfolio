import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Copy, Check, MapPin, Clock, Mail, Terminal } from 'lucide-react';

export default function Footer() {
  const [time, setTime] = useState(new Date());
  const [copied, setCopied] = useState(false);

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("karrtikgupta9@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#030303] text-white pt-24 pb-12 md:pb-24 border-t border-white/5 relative overflow-hidden select-none">

      {/* Subtle Ambient Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-t-full pointer-events-none" />

      <div className="w-[80%] mx-auto px-4 md:px-8 relative z-10">

        {/* --- HEADER (Adapts from Mobile to Desktop) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-[10px] uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              System Online
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
              Let's <span className="text-cyan-500">Connect.</span>
            </h2>
          </div>

          {/* Desktop Telemetry (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-gray-500 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-cyan-500" />
              <span>GZB_IND</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-cyan-500" />
              <span>{time.toLocaleTimeString('en-US', { hour12: false })} IST</span>
            </div>
          </div>
        </div>

        {/* --- BENTO CONTROL CENTER (The App UI) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {/* 1. PRIMARY ACTION: EMAIL WIDGET (Spans full width on mobile, 2 cols on desktop) */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyEmail}
            className="col-span-2 bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-6 md:p-8 cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[200px]"
          >
            {/* Hover/Tap Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-colors duration-300">
                <Mail size={20} />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-gray-400 flex items-center gap-2">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? 'COPIED' : 'COPY'}
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <p className="text-xs font-mono text-gray-500 mb-1">Direct Line</p>
              <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors break-all">
                karrtikgupta9@gmail.com
              </h3>
            </div>
          </motion.div>

          {/* 2. SECONDARY ACTION: LINKEDIN */}
          <motion.a
            href="https://www.linkedin.com/in/karrtik-gupta/"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="col-span-1 bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-6 cursor-pointer group flex flex-col justify-between min-h-[160px] md:min-h-[200px] hover:border-[#0A66C2]/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#0A66C2] group-hover:text-white transition-colors duration-300">
              <Linkedin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-500 mb-1">Network</p>
              <p className="font-bold text-white text-sm md:text-base">LinkedIn</p>
            </div>
          </motion.a>

          {/* 3. SECONDARY ACTION: GITHUB */}
          <motion.a
            href="https://github.com/mygithubkg"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="col-span-1 bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-6 cursor-pointer group flex flex-col justify-between min-h-[160px] md:min-h-[200px] hover:border-white/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-colors duration-300">
              <Github size={18} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-500 mb-1">Repositories</p>
              <p className="font-bold text-white text-sm md:text-base">GitHub</p>
            </div>
          </motion.a>

          {/* 4. MOBILE TELEMETRY ROW (Hidden on Desktop) */}
          <div className="col-span-2 md:hidden flex gap-3 mt-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1">
              <MapPin size={16} className="text-cyan-500" />
              <span className="font-mono text-[10px] text-gray-400">GZB, INDIA</span>
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1">
              <Clock size={16} className="text-cyan-500" />
              <span className="font-mono text-[10px] text-gray-400">
                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SYSTEM BAR --- */}
        <div className="mt-12 md:mt-24 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Karrtik Gupta</p>

          <a href="/admin/login" className="flex items-center gap-2 hover:text-cyan-500 transition-colors pb-4 md:pb-0">
            <Terminal size={12} />
            <span>Sys_Admin</span>
          </a>
        </div>

      </div>
    </footer>
  );
}