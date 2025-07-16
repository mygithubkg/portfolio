import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import particlesConfig from '../particles-config';
import Header from './header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      <div className="relative z-10">
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 