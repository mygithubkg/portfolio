"use client";
import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none select-none overflow-hidden bg-[var(--bg)]">
      
      {/* Layer 1: The Dot Grid (Engineering Blueprint Vibe) */}
      {/* Uses radial-gradient to draw 1px dots spaced 24px apart. Uses the --border variable so it adapts to light/dark automatically. */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Layer 2: Center Glow (Soft focus for the middle of the screen) */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 60%)',
        }}
      />

      {/* Layer 3: Tactile Noise / Grain (Paper Texture) */}
      {/* An inline SVG filter applied as a background image. Very low opacity so it feels like paper, not static. */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Layer 4: Vignette / Fade out at edges to keep focus centered */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, var(--bg) 110%)',
        }}
      />
    </div>
  );
}
