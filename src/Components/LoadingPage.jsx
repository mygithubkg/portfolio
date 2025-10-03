import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "Code is like humor. When you have to explain it, it’s bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie"
  },
  {
    text: "Innovation is saying no to a thousand things.",
    author: "Steve Jobs"
  },
  {
    text: "It’s not a bug – it’s an undocumented feature.",
    author: "Anonymous"
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson"
  },
  {
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser"
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer"
  },
  {
    text: "Great things are done by a series of small things brought together.",
    author: "Vincent Van Gogh"
  },
];

const LoadingPage = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });

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
              <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">K</span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Karrtik <span className="font-black">Gupta</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              className="text-2xl md:text-3xl mb-12 bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Full Stack Developer & AI Enthusiast
            </motion.p>

            {/* Progress Bar */}
            <div className="w-80 mx-auto mb-6">
              <motion.div
                className="w-full h-3 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-full overflow-hidden shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 rounded-full shadow-md"
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
            <motion.div
              className="mt-8 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <p className="text-lg font-medium text-white/90 italic mb-2">“{quote.text}”</p>
              <p className="text-sm text-sky-300 font-semibold text-right pr-2">— {quote.author}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;
