"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  generation: number;

  constructor(x: number, y: number, vx: number, vy: number, radius: number, generation: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.generation = generation;
  }
}

export default function BackgroundBubble() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let particles: Particle[] = [];
    let animationFrameId: number;
    let colorHex = "#C4552B";
    let resetTimer = 120; // 2 seconds to fade out when max reached

    const updateColor = () => {
      const el = document.documentElement;
      const computed = getComputedStyle(el).getPropertyValue('--accent').trim();
      if (computed) colorHex = computed;
    };
    updateColor();

    const hexToRgba = (hex: string, alpha: number) => {
      let r = 0, g = 0, b = 0;
      if (hex.startsWith('#')) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          r = parseInt(hex.substring(0, 2), 16);
          g = parseInt(hex.substring(2, 4), 16);
          b = parseInt(hex.substring(4, 6), 16);
        }
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const preRenderedCaches = new Map<number, HTMLCanvasElement>();

    const getCachedBubble = (generation: number, radius: number) => {
      if (preRenderedCaches.has(generation)) {
        return preRenderedCaches.get(generation)!;
      }

      const offscreen = document.createElement('canvas');
      const size = Math.ceil(radius * 2);
      offscreen.width = size;
      offscreen.height = size;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        const grad = offCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);

        const intensityCenter = resolvedTheme === 'dark' ? 0.4 : 0.15;
        const intensityEdge = resolvedTheme === 'dark' ? 0.2 : 0.05;

        grad.addColorStop(0, hexToRgba(colorHex, intensityCenter));
        grad.addColorStop(0.4, hexToRgba(colorHex, intensityEdge));
        grad.addColorStop(1, "transparent");

        offCtx.beginPath();
        offCtx.arc(radius, radius, radius, 0, Math.PI * 2);
        offCtx.fillStyle = grad;
        offCtx.fill();
      }
      preRenderedCaches.set(generation, offscreen);
      return offscreen;
    };

    const init = () => {
      preRenderedCaches.clear();
      resetTimer = 120; // reset the fade-out timer
      // Start with 1 bigger bubble at bottom left, moving to top right
      // Radius 400 is massive
      particles = [new Particle(200, h - 200, 5, -5, 400, 0)];
    };

    init();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      let nextParticles: Particle[] = [];

      // Handle reset phase
      if (particles.length >= 256) {
        resetTimer--;
        if (resetTimer <= 0) {
          init();
          animationFrameId = requestAnimationFrame(draw);
          return;
        }
        // Smoothly fade them out as they bounce around
        ctx.globalAlpha = Math.max(0, resetTimer / 120);
      } else {
        ctx.globalAlpha = 1.0;
      }

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        let didBounce = false;

        // Edge Reflection Logic
        if (p.x - p.radius <= 0) {
          p.x = p.radius;
          p.vx = Math.abs(p.vx);
          didBounce = true;
        } else if (p.x + p.radius >= w) {
          p.x = w - p.radius;
          p.vx = -Math.abs(p.vx);
          didBounce = true;
        }

        if (p.y - p.radius <= 0) {
          p.y = p.radius;
          p.vy = Math.abs(p.vy);
          didBounce = true;
        } else if (p.y + p.radius >= h) {
          p.y = h - p.radius;
          p.vy = -Math.abs(p.vy);
          didBounce = true;
        }

        const radius = Math.max(1, p.radius);
        const bubbleCanvas = getCachedBubble(p.generation, radius);

        ctx.drawImage(bubbleCanvas, p.x - radius, p.y - radius);

        // Multiply only when hitting an edge, up to exactly 256 particles max
        if (didBounce && particles.length < 256 && (nextParticles.length + particles.length) <= 512) {
          // Shrink size on split
          const newRadius = Math.max(p.radius * 0.75, 40);

          // Slightly offset velocities so they separate smoothly off the wall
          const spreadVx = (Math.random() - 0.5) * 2;
          const spreadVy = (Math.random() - 0.5) * 2;

          nextParticles.push(new Particle(p.x, p.y, p.vx + spreadVx, p.vy + spreadVy, newRadius, p.generation + 1));
          nextParticles.push(new Particle(p.x, p.y, p.vx - spreadVx, p.vy - spreadVy, newRadius, p.generation + 1));
        } else {
          nextParticles.push(p);
        }
      }

      particles = nextParticles;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
