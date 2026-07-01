import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  href, 
  onClick, 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accentDark shadow-sm hover:shadow-glow',
    secondary: 'border border-accent text-accent hover:bg-accent hover:text-white',
    ghost: 'text-textSecondary hover:text-accent hover:bg-accent/10',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
    gradient: 'bg-gradient-to-r from-accent to-accentLight text-white hover:from-accentDark hover:to-accent shadow-sm hover:shadow-glow',
    danger: 'bg-error text-white hover:bg-error/90',
    success: 'bg-success text-white hover:bg-success/90',
  };
  
  const sizes = {
    sm: 'px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base',
    md: 'px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg',
    lg: 'px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl',
    xl: 'px-8 sm:px-10 py-5 sm:py-6 text-xl sm:text-2xl',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${loading ? 'cursor-wait' : ''} ${className}`;
  
  const buttonContent = (
    <motion.button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      {...props}
    >
      {loading && (
        <motion.div
          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </motion.button>
  );
  
  if (href) {
    return (
      <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {buttonContent}
      </motion.a>
    );
  }
  
  return buttonContent;
};

export default Button; 