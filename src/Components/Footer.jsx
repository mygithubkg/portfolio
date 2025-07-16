import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

function Footer() {
  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/karrtik-gupta/",
      icon: Linkedin,
      label: "LinkedIn"
    },
    {
      href: "https://github.com/mygithubkg",
      icon: Github,
      label: "GitHub"
    },
    {
      href: "mailto:karrtikgupta9@gmail.com",
      icon: Mail,
      label: "Email"
    }
  ];

  return (
    <footer className="bg-[#12161d] border-t border-border text-textSecondary py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Copyright */}
        <div className="mb-4 md:mb-0">
          <p className="text-[15px] font-['Inter_Tight'] font-normal tracking-wide">
            &copy; {new Date().getFullYear()} Karrtik. All rights reserved.
          </p>
          <p className="text-[14px] font-['Playfair_Display'] font-normal text-textSecondary/70 mt-1">
            Crafted with passion and precision
          </p>
        </div>
        
        {/* Social Links */}
        <div className="flex gap-8">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-[15px] font-['Inter_Tight'] font-normal hover:text-accent transition-colors duration-200"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-accent origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Icon with hover effect */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="text-textSecondary group-hover:text-accent transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon size={18} />
                </motion.div>
                <span>{label}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
