import React from 'react';
import Header from './header'; // Ensure filename casing matches
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    // Set base background to #050505 (Deep Neural Black) and text color
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* --- DESIGN ELEMENT: Global Noise Overlay --- 
          This replaces particles. It adds a very subtle "static" texture 
          over the entire site, making it feel like a digital display. 
      */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* --- LAYOUT STRUCTURE --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        {/* Removed 'pt-20' here because the Home page creates its own 
           immersive background that needs to touch the top edge. 
           Individual pages should handle their own top padding if needed.
        */}
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;