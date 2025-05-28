import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="font-sans flex justify-between items-center px-10 py-6 bg-gradient-to-r from-[#0B3D91] to-[#1976D2] shadow-lg sticky top-0 w-full z-50">
      {/* Logo */}
      <div className="text-4xl md:text-5xl font-extrabold text-[#00E5FF] tracking-wider animate-pulse">
        Karrtik
      </div>

      {/* Navigation */}
      <ul className="hidden md:flex gap-12 text-lg font-semibold">
        {[
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About' },
          { to: '/services', label: 'Interests' },
          { to: '/projects', label: 'Projects' },
        ].map(({ to, label }) => (
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
      <Link
        to="/contact"
        className="bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0D47A1] px-6 py-3 rounded-full font-bold shadow-md transition duration-300"
      >
        Contact Me
      </Link>
    </nav>
  );
}