import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  onClick, 
  hover = true,
  padding = 'p-6',
  shadow = 'shadow-card',
  ...props 
}) => {
  const baseClasses = 'glass-card rounded-card border border-border transition-all duration-300';
  
  const variants = {
    default: 'bg-surface/90 backdrop-blur-lg',
    elevated: 'bg-surface/95 backdrop-blur-lg shadow-lg hover:shadow-cardHover',
    interactive: 'bg-surface/90 backdrop-blur-lg cursor-pointer hover:scale-105 hover:shadow-cardHover hover:border-accent/30',
    gradient: 'bg-gradient-to-br from-surface/90 to-surfaceLight/90 backdrop-blur-lg',
    glass: 'bg-white/5 backdrop-blur-xl border-white/10',
    dark: 'bg-background/80 backdrop-blur-lg border-border/50',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${shadow} ${hover && variant === 'interactive' ? 'hover:scale-105' : ''} ${className}`;
  
  const cardContent = (
    <motion.div
      className={classes}
      onClick={onClick}
      whileHover={hover && variant === 'interactive' ? { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2, ease: "easeInOut" }
      } : {}}
      whileTap={hover && variant === 'interactive' ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      <div className={padding}>
        {children}
      </div>
    </motion.div>
  );
  
  return cardContent;
};

export default Card; 