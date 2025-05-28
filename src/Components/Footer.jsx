import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#102027] text-[#ECEFF1] py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} Karrtik. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/karrtik-gupta/" target="_blank" rel="noopener noreferrer" className="text-[#00B0FF] hover:text-[#1565C0]">LinkedIn</a>
          <a href="https://github.com/mygithubkg" target="_blank" rel="noopener noreferrer" className="text-[#00B0FF] hover:text-[#1565C0]">GitHub</a>
          <a href="mailto:karrtikgupta9@gmail.com" className="text-[#00B0FF] hover:text-[#1565C0]">Email</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
