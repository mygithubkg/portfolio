import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ArrowUp, Cpu } from 'lucide-react';

// --- SUB-COMPONENT: The AI Text Decoder ---
// This creates the effect of text being "computed" in real-time
const ScrambleText = ({ text, isActive }) => {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const [display, setDisplay] = useState(text);
  
  useEffect(() => {
    let interval;
    let iteration = 0;
    
    // Only scramble on hover start or active state change
    const runScramble = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplay(prev => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 2; // Speed of decoding
      }, 30);
    };

    runScramble();
    return () => clearInterval(interval);
  }, [text, isActive]); // Re-run if text changes or active state triggers

  return <span className="font-mono tracking-wider">{display}</span>;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Transform header width based on scroll for a dynamic feel
  const headerWidth = useTransform(scrollY, [0, 100], ["100%", "60%"]);
  const headerY = useTransform(scrollY, [0, 100], [0, 20]);
  const borderRadius = useTransform(scrollY, [0, 100], [0, 24]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.2]);

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT' },
    { to: '/projects', label: 'WORKS' },
    { to: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-50 pt-0 md:pt-4">
        <motion.nav
          style={{ 
            width: window.innerWidth > 768 ? headerWidth : "100%",
            y: window.innerWidth > 768 ? headerY : 0,
            borderRadius: window.innerWidth > 768 ? borderRadius : 0,
            borderColor: `rgba(255, 255, 255, ${borderOpacity})`
          }}
          className={`
            relative flex items-center justify-between
            px-6 py-4 md:px-8 md:py-3
            bg-[#050505]/70 backdrop-blur-xl
            border-b md:border border-white/5
            shadow-[0_0_30px_-10px_rgba(0,0,0,0.8)]
            transition-colors duration-500
          `}
        >
          {/* --- The "System Status" Logo --- */}
          <Link to="/" className="group flex items-center gap-3 z-10">
            <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden rounded bg-white/5 border border-white/10 group-hover:border-cyan-400/50 transition-colors">
               {/* Spinning AI Core Animation */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               >
                 <Cpu size={16} className="text-gray-400 group-hover:text-cyan-400" />
               </motion.div>
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white tracking-[0.2em] text-xs uppercase">
                Karrtik
              </span>
              <span className="text-[10px] text-gray-500 font-mono group-hover:text-cyan-400 transition-colors">
                SYS.ONLINE
              </span>
            </div>
          </Link>

          {/* --- Desktop "Holographic" Navigation --- */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredLink(link.to)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-6 py-2 group"
              >
                {/* Active/Hover Background Glow */}
                {(hoveredLink === link.to || location.pathname === link.to) && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-white/5 rounded-md -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Text Scramble Effect */}
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.to ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {/* If hovered, scramble. If not, show static text */}
                  {hoveredLink === link.to ? (
                    <ScrambleText text={link.label} isActive={true} />
                  ) : (
                    <span className="tracking-widest">{link.label}</span>
                  )}
                </div>

                {/* Cyberpunk accent markers */}
                {location.pathname === link.to && (
                  <>
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/50" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/50" />
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* --- Action Button (Outlined) --- */}
          <div className="hidden md:flex items-center z-10">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-xs font-bold text-black bg-white hover:bg-cyan-400 transition-colors rounded shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            >
              INITIATE_PROJECT
            </motion.a>
          </div>

          {/* --- Mobile Menu Button --- */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </motion.nav>
      </div>

      {/* --- Full Screen Mobile Menu (Cyber Overlay) --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            {/* Background Grid Decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            
            <div className="flex flex-col gap-8 text-center relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white hover:from-cyan-400 hover:to-blue-500 transition-all uppercase tracking-tighter"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}