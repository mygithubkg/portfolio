import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaEnvelope, FaGithub } from 'react-icons/fa';

export default function Contact() {
  const socials = [
    { Icon: FaLinkedin, url: 'https://www.linkedin.com/in/karrtik-gupta/', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { Icon: FaInstagram, url: 'https://www.instagram.com/karrtik_gupta/', label: 'Instagram', color: 'hover:text-pink-500' },
    { Icon: FaGithub, url: 'https://github.com/mygithubkg', label: 'GitHub', color: 'hover:text-gray-300' },
    { Icon: FaEnvelope, url: 'mailto:karrtikgupta9@gmail.com', label: 'Email', color: 'hover:text-cyan-400' },
  ];

  return (
    <section
      id="contact"
      className="relative flex items-center justify-center w-full min-h-screen bg-black overflow-hidden font-inter"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-blue-900 via-black to-blue-800 opacity-80"></div>

      <motion.div
        className="relative z-10 p-10 bg-black bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mb-4 text-5xl font-extrabold text-white">Let's Connect</h2>
        <p className="mb-8 text-lg text-gray-300">
          I’d love to hear from you. Choose a platform below!
        </p>
        <div className="grid grid-cols-2 gap-6">
          {socials.map(({ Icon, url, label, color }) => (
            <motion.a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-6 bg-gray-900 bg-opacity-50 rounded-xl shadow-lg transition-transform duration-300 ${color}`}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Icon className="w-12 h-12 text-white mb-2 transition-colors duration-300" />
              <span className="text-xl font-medium text-white">{label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Gradient animation keyframes */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </section>
  );
}
