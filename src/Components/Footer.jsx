import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight, Copy, Check, Terminal, Clock, MapPin } from 'lucide-react';

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

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/karrtik-gupta/",
      icon: Linkedin,
      label: "LINKEDIN",
      id: "NET_01"
    },
    {
      href: "https://github.com/mygithubkg",
      icon: Github,
      label: "GITHUB",
      id: "REP_02"
    },
  ];

  return (
    <footer className="relative bg-[#050505] text-white overflow-hidden mt-20 border-t border-white/10">
      
      {/* --- DESIGN ELEMENT: Scanning Laser Border --- */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* --- BLOCK 1: The "Call to Action" (Main Heading) --- */}
          <div className="md:col-span-6 flex flex-col justify-between h-full">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-4 text-cyan-400 font-mono text-xs tracking-widest"
              >
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                SYSTEM_STATUS: OPEN FOR WORK
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                Let's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white hover:from-cyan-400 hover:to-blue-600 transition-all duration-500">
                  Initiate.
                </span>
              </h2>
              
              <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                Building the future with neural networks and clean code. 
                Ready to deploy on your next ambitious project.
              </p>
            </div>

            {/* Live Location/Time Data */}
            <div className="mt-12 flex flex-col gap-2 font-mono text-xs text-gray-600 border-l-2 border-white/10 pl-4">
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span>INDIA, GHAZIABAD (UP)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>{time.toLocaleTimeString('en-US', { hour12: false })} IST</span>
              </div>
            </div>
          </div>

          {/* --- BLOCK 2: Interaction Grid --- */}
          <div className="md:col-span-6 flex flex-col gap-4">
            
            {/* 2.1 Email Command Center */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="group relative p-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
              onClick={handleCopyEmail}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
                <Terminal size={20} />
              </div>
              
              <h3 className="text-gray-400 text-sm font-mono mb-2">EMAIL_PROTOCOL</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  karrtikgupta9@gmail.com
                </span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/10 hover:bg-cyan-500/20 text-white transition-colors"
                >
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </motion.button>
              </div>
              
              {/* Decorative "Scanning" Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </motion.div>

            {/* 2.2 Social Uplinks */}
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="group p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col justify-between h-32 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden"
                >
                   {/* Background Noise Texture */}
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                   
                   <div className="flex justify-between items-start z-10">
                     <link.icon size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                     <ArrowUpRight size={16} className="text-gray-600 group-hover:text-cyan-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </div>
                   
                   <div className="z-10">
                     <span className="text-[10px] font-mono text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity block mb-1">
                       {link.id}
                     </span>
                     <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">
                       {link.label}
                     </span>
                   </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* --- BLOCK 3: The Footer Bottom Line --- */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600">
           <div className="flex items-center gap-6">
             <span>© {new Date().getFullYear()} Karrtik_Gupta</span>
             <span className="hidden md:inline text-white/10">|</span>
             <span>BUILD_VER: 2.4.0</span>
           </div>
           
           {/* The "Hidden" Admin Access */}
           <a 
             href="/admin/login" 
             className="group flex items-center gap-2 hover:text-cyan-400 transition-colors"
           >
             <div className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400" />
             <span>ADMIN_ACCESS</span>
           </a>
        </div>
      </div>
      
      {/* Background Grid Pattern (Very Subtle) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
    </footer>
  );
}