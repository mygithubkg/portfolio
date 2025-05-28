import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="font-sans flex justify-between items-center px-8 py-4 bg-gradient-to-r from-[#0D47A1] to-[#1565C0] shadow-md sticky top-0 w-full z-50">
      {/* Logo */}
      <div className="text-3xl font-bold text-[#00B0FF] tracking-wide">Karrtik</div>

      {/* Navigation */}
      <ul className="hidden md:flex gap-10 text-base font-medium">
        {[
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About' },
          { to: '/services', label: 'Interests' },
          { to: '/projects', label: 'Projects' },
        ].map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="relative text-[#ECEFF1] hover:text-[#00B0FF] transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#00B0FF] after:transition-all after:duration-300"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Contact Button */}
      <Link
        to="/contact"
        className="bg-[#00B0FF] hover:bg-[#0288D1] text-white px-6 py-2 rounded-full font-medium shadow-md transition duration-300"
      >
        Contact Me
      </Link>
    </nav>
  );
}
