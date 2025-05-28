import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Know More' },
    { to: '/projects', label: 'Projects' },
  ];

  return (
    <nav className="font-sans bg-gradient-to-r from-[#0B3D91] to-[#1976D2] shadow-lg sticky top-0 w-full z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-[#00E5FF] tracking-wider animate-pulse">
          Karrtik
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10 text-lg font-semibold">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="relative text-[#E1F5FE] hover:text-[#00E5FF] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[3px] after:bg-[#00E5FF] after:transition-all after:duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact Button */}
        <div className="hidden md:block">
          <Link
            to="/contact"
            className="bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0D47A1] px-6 py-3 rounded-full font-bold shadow-md transition duration-300"
          >
            Contact Me
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4 text-lg font-semibold text-white">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="block w-full py-2 px-4 rounded hover:bg-[#00B8D4]"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="block w-full text-center py-2 px-4 bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0D47A1] rounded-full font-bold"
                onClick={() => setMenuOpen(false)}
              >
                Contact Me
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}