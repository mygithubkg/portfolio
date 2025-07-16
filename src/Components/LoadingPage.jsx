import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
  "“First, solve the problem. Then, write the code.” – John Johnson",
  "“Simplicity is the soul of efficiency.” – Austin Freeman",
  "“Experience is the name everyone gives to their mistakes.” – Oscar Wilde",
  "“Make it work, make it right, make it fast.” – Kent Beck",
  "“The only way to learn a new programming language is by writing programs in it.” – Dennis Ritchie",
  "“Innovation is saying no to a thousand things.” – Steve Jobs",
  "“It’s not a bug – it’s an undocumented feature.” – Anonymous",
];

const LoadingPage = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote once
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const duration = 4000;
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);

      if (currentStep >= steps) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 500);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const getLoadingText = () => {
    if (progress < 25) return "Initializing...";
    if (progress < 50) return "Loading portfolio...";
    if (progress < 75) return "Preparing animations...";
    return "Ready to explore!";
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-background via-surface to-background flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {/* Logo */}
            <motion.div
              className="mb-12"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-accent to-accentLight rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-bold text-white">K</span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="gradient-text">Karrtik</span> Gupta
            </motion.h1>

            {/* Role */}
            <motion.p
              className="text-2xl md:text-3xl text-textSecondary mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Full Stack Developer & AI Enthusiast
            </motion.p>

            {/* Progress Bar */}
            <div className="w-80 mx-auto mb-6">
              <motion.div
                className="w-full h-3 bg-surface rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-accentLight rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>
            </div>

            {/* Loading Text */}
            <motion.p
              className="text-lg text-textSecondary mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {getLoadingText()}
            </motion.p>

            {/* Percentage */}
            <motion.p
              className="text-accent font-medium text-xl mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              {Math.round(progress)}%
            </motion.p>

            {/* Inspirational Quote */}
            <motion.p
              className="text-sm italic text-white/70 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              {quote}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;
