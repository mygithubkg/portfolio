"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      if (glowRef.current) {
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
            glowRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
          }
        });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      ref={glowRef}
      className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: `radial-gradient(
          600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          var(--glow-color, rgba(196, 85, 43, 0.1)),
          transparent 40%
        )`
      }}
    />
  );
}
