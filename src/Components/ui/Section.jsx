import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ 
  children, 
  className = '', 
  container = true,
  maxWidth = '6xl',
  padding = 'py-16 sm:py-20',
  background = 'bg-transparent',
  fullHeight = false,
  ...props 
}) => {
  const containerClasses = container ? `max-w-${maxWidth} mx-auto px-4 sm:px-6` : '';
  const heightClass = fullHeight ? 'min-h-screen' : '';
  const classes = `relative w-full ${heightClass} flex flex-col items-center justify-center ${padding} ${background} ${className}`;
  
  return (
    <motion.section
      className={classes}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      {...props}
    >
      {container ? (
        <div className={containerClasses}>
          {children}
        </div>
      ) : (
        children
      )}
    </motion.section>
  );
};

export default Section; 