"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, ShieldCheck, Wifi, Fingerprint } from 'lucide-react';

const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Innovation is saying no to a thousand things.", author: "Steve Jobs" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
];

const LoadingPage = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [bootLog, setBootLog] = useState<string[]>([]);

  // System Boot Sequence Messages
  const bootSequence = [
    "INITIALIZING_KERNEL_v4.0...",
    "LOADING_NEURAL_NETWORKS...",
    "MOUNTING_FILE_SYSTEM...",
    "ESTABLISHING_WSS_CONNECTION...",
    "SYNCING_WITH_MAIN_SERVER...",
    "OPTIMIZING_RENDER_TREE...",
    "DECRYPTING_ASSETS...",
    "SYSTEM_READY."
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const duration = 1800;
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      // Add log messages based on progress
      const logIndex = Math.floor((newProgress / 100) * bootSequence.length);
      if (bootSequence[logIndex] && !bootLog.includes(bootSequence[logIndex])) {
        setBootLog(prev => {
          if (prev.includes(bootSequence[logIndex])) return prev;
          return [...prev.slice(-4), bootSequence[logIndex]];
        });
      }

      if (currentStep >= steps) {
        setIsComplete(true);
        setTimeout(onComplete, 1000);
        clearInterval(timer);
      }
    }, intervalTime);

    // FIX: Removed bootLog from the dependency array below!
    return () => clearInterval(timer);
  }, [onComplete]);

  // Generate the "Hardware LED" progress bar
  const renderProgressBar = () => {
    const totalBlocks = 24;
    const filledBlocks = Math.floor((progress / 100) * totalBlocks);
    return (
      <div className="flex gap-[2px] md:gap-1 w-full">
        {[...Array(totalBlocks)].map((_, i) => (
          <div
            key={i}
            className={`h-2.5 md:h-3 w-full rounded-[1px] transition-colors duration-75 ${i < filledBlocks
                ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                : 'bg-white/[0.03]'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 bg-[#030303] flex flex-col items-center justify-center z-[9999] px-6 font-mono select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Ambient Background Grid & Glows */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

          {/* ============================================================== */}
          {/* DESKTOP VIEW: Holographic Terminal Box                           */}
          {/* ============================================================== */}
          <div className="hidden md:flex w-full max-w-2xl relative z-10 flex-col bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">

            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-cyan-500 tracking-[0.2em] uppercase flex items-center gap-2">
                  <Fingerprint size={12} /> Authentication By-Pass
                </span>
                <span className="text-2xl font-bold text-white tracking-widest uppercase">Karrtik_OS <span className="text-cyan-500 font-light">v4.0</span></span>
              </div>
              <div className="flex gap-4 text-gray-600">
                <Wifi size={18} className={progress > 20 ? "text-cyan-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : ""} />
                <Cpu size={18} className={progress > 50 ? "text-cyan-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : ""} />
                <ShieldCheck size={18} className={progress > 80 ? "text-cyan-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : ""} />
              </div>
            </div>

            <div className="mb-10">
              <div className="flex justify-between text-[11px] text-cyan-400 mb-3 font-bold uppercase tracking-widest">
                <span>Deploying Modules</span>
                <span className="tabular-nums">{Math.round(progress)}%</span>
              </div>
              {renderProgressBar()}
            </div>

            <div className="h-32 flex flex-col justify-end overflow-hidden mb-8 space-y-1.5 relative mask-image-gradient-to-t">
              {bootLog.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs"
                >
                  <span className="text-gray-600 mr-3">{`[${new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}]`}</span>
                  <span className="text-gray-300">{log}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="border border-white/5 bg-white/[0.02] p-5 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                <Terminal size={12} />
                <span>SYS_MOTD</span>
              </div>
              <p className="text-gray-300 italic text-sm mb-2 leading-relaxed">"{quote.text}"</p>
              <p className="text-cyan-500 text-xs text-right font-bold tracking-wider">— {quote.author}</p>
            </motion.div>

          </div>

          {/* ============================================================== */}
          {/* MOBILE VIEW: App Splash Screen                                 */}
          {/* ============================================================== */}
          <div className="md:hidden w-full h-full flex flex-col justify-between py-12 relative z-10">

            <div className="flex flex-col items-center mt-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              >
                <Terminal size={32} />
              </motion.div>
              <h1 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">Karrtik_OS</h1>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase tracking-widest">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
                Booting Sequence
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center px-4"
            >
              <p className="text-gray-400 italic text-sm mb-3 leading-relaxed">"{quote.text}"</p>
              <p className="text-cyan-500 text-[10px] font-bold tracking-wider uppercase">— {quote.author}</p>
            </motion.div>

            <div className="w-full mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Loading Engine</span>
                <span className="text-sm text-cyan-400 font-bold tabular-nums">{Math.round(progress)}%</span>
              </div>
              {renderProgressBar()}
            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;
