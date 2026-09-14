"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  isHero?: boolean;
}

export default function ScrollSection({ children, className = "", isHero = false }: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [isHero ? 1 : 0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [isHero ? 1 : 0, 1, 1, 0]);
  const filter = useTransform(scrollYProgress, [0, 0.3], [isHero ? "blur(0px)" : "blur(10px)", "blur(0px)"]);
  const y = useTransform(scrollYProgress, [0.7, 1], ["0%", "20%"]);

  return (
    <motion.section
      ref={ref}
      style={{ scale, opacity, filter, y }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
