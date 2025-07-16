import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      const shouldShowScrollTop = window.scrollY > 300;
      setScrolled(isScrolled);
      setShowScrollTop(shouldShowScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Skills' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav 
        className={`font-['Inter_Tight'] backdrop-blur-md border-b border-border sticky top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 shadow-lg' : 'bg-background/80'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-6">
          {/* Logo */}
          <motion.div 
            className="text-2xl font-extrabold text-white tracking-tight select-none"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="gradient-text">Karrtik</Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-10 text-lg font-normal">
            {navLinks.map(({ to, label }) => (
              <motion.li key={to} whileHover={{ y: -2 }}>
                <Link
                  to={to}
                  className={`px-5 py-2 rounded-lg transition-all duration-200 relative group ${
                    location.pathname === to 
                      ? 'text-accent font-semibold' 
                      : 'text-text hover:text-accent'
                  }`}
                >
                  {label}
                  {/* Animated underline on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  {/* Active link indicator - colored dot */}
                  {location.pathname === to && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
          
          {/* Contact Button */}
          <div className="hidden md:block">
            <Button href="/contact" variant="primary" size="sm">
              Contact
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-surface/60 transition-colors"
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden px-6 pb-6 bg-background/95 backdrop-blur-md border-b border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="flex flex-col gap-3 text-lg font-normal py-6">
                {navLinks.map(({ to, label }) => (
                  <motion.li key={to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link
                      to={to}
                      className={`block w-full py-3 px-4 rounded-lg transition-all duration-200 relative group ${
                        location.pathname === to 
                          ? 'text-accent font-semibold' 
                          : 'text-text hover:text-accent hover:bg-surface/60'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                      {/* Active link indicator for mobile */}
                      {location.pathname === to && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.li>
                ))}
                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mt-3">
                  <Button 
                    href="/contact" 
                    variant="primary" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Button>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-white rounded-full shadow-lg hover:shadow-glow transition-all duration-200"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}