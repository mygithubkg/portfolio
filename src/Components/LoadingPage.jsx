import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FancyLoadingPage() {
  const quotes = [
    "Believe in yourself and all that you are.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Dream big and dare to fail.",
    "Act as if what you do makes a difference. It does.",
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    const pickQuote = () =>
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    pickQuote();
    const interval = setInterval(pickQuote, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700 text-white font-sans px-4">
      <motion.div
        className="p-8 bg-black bg-opacity-70 border border-blue-500 rounded-2xl shadow-xl w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence exitBeforeEnter>
          <motion.p
            key={quote}
            className="text-base italic mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {quote}
          </motion.p>
        </AnimatePresence>
        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" />
      </motion.div>
    </div>
  );
}
