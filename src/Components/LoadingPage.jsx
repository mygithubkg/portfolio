import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, ShieldCheck, Wifi } from 'lucide-react';

const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Innovation is saying no to a thousand things.", author: "Steve Jobs" },
  { text: "It’s not a bug – it’s an undocumented feature.", author: "Anonymous" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
];

const LoadingPage = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [bootLog, setBootLog] = useState([]);

  // System Boot Sequence Messages
  const bootSequence = [
    "INITIALIZING_KERNEL...",
    "LOADING_NEURAL_NETWORKS...",
    "MOUNTING_FILE_SYSTEM...",
    "CONNECTING_TO_MAIN_SERVER...",
    "OPTIMIZING_ASSETS...",
    "ESTABLISHING_SECURE_LINK...",
    "SYSTEM_READY."
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const duration = 3500; // Slightly faster for a snappier feel
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      // Add log messages based on progress
      const logIndex = Math.floor((newProgress / 100) * bootSequence.length);
      if (bootSequence[logIndex] && !bootLog.includes(bootSequence[logIndex])) {
        setBootLog(prev => [...prev.slice(-4), bootSequence[logIndex]]); // Keep last 5 logs
      }

      if (currentStep >= steps) {
        setIsComplete(true);
        setTimeout(onComplete, 800); // Wait a bit before unmounting
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Generate the "Block" progress bar
  const renderProgressBar = () => {
    const totalBlocks = 20;
    const filledBlocks = Math.floor((progress / 100) * totalBlocks);
    return (
      <div className="flex gap-1">
        {[...Array(totalBlocks)].map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-full rounded-sm transition-colors duration-150 ${
              i < filledBlocks ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-white/10'
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
          className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[9999] p-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="w-full max-w-lg relative z-10 font-mono">
            
            {/* Header: System Info */}
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">SYSTEM_BOOT_SEQUENCE</span>
                <span className="text-xl font-bold text-white tracking-widest">KARRTIK_OS <span className="text-cyan-500">v2.4</span></span>
              </div>
              <div className="flex gap-4 text-gray-600">
                <Wifi size={16} className={progress > 30 ? "text-cyan-500 animate-pulse" : ""} />
                <Cpu size={16} className={progress > 60 ? "text-cyan-500 animate-pulse" : ""} />
                <ShieldCheck size={16} className={progress > 90 ? "text-cyan-500" : ""} />
              </div>
            </div>

            {/* Central Progress Area */}
            <div className="mb-10">
              <div className="flex justify-between text-xs text-cyan-400 mb-2 font-bold">
                <span>LOADING_MODULES</span>
                <span>{Math.round(progress)}%</span>
              </div>
              
              {/* The Block Loader */}
              {renderProgressBar()}
            </div>

            {/* Boot Log (Terminal Style) */}
            <div className="h-32 flex flex-col justify-end overflow-hidden mb-8 space-y-1">
              {bootLog.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm"
                >
                  <span className="text-gray-600">{`[${new Date().toLocaleTimeString('en-US', {hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit"})}]`}</span>
                  <span className="text-cyan-500 mx-2"></span>
                  <span className="text-gray-300">{log}</span>
                </motion.div>
              ))}
            </div>

            {/* Quote / MOTD */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="border border-white/10 bg-white/5 p-4 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 uppercase tracking-wider">
                <Terminal size={12} />
                <span>Message_Of_The_Day</span>
              </div>
              <p className="text-white/90 italic text-sm mb-2 leading-relaxed">"{quote.text}"</p>
              <p className="text-cyan-500 text-xs text-right font-bold">_ {quote.author}</p>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;