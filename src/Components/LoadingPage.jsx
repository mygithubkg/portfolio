import React, { useState, useEffect } from 'react';

export default function LoadingPage() {
  const quotes = [
    "Believe in yourself and all that you are.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Dream big and dare to fail.",
    "Act as if what you do makes a difference. It does.",
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select a random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <p className="text-sm mb-4">{quote}</p>
        <div className="loader"></div>
      </div>

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
