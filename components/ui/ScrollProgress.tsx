"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 right-0 w-[3px] h-full bg-accent origin-top z-50 mix-blend-difference opacity-50"
      style={{ scaleY: scrollYProgress }}
    />
  );
}
