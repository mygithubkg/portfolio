import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, User, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid credentials. Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface/20 to-background px-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1], 
          opacity: [0.4, 0.7, 0.4],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accentLight/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2], 
          opacity: [0.7, 0.4, 0.7],
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        <motion.div 
          className="bg-surface/90 backdrop-blur-2xl border border-border/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          whileHover={{ boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Header */}
          <motion.div
            className="text-center mb-8 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accentLight/20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.6)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full rounded-2xl flex items-center justify-center"
              >
                <Shield className="w-10 h-10 text-accent" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-accentLight" />
              </motion.div>
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Admin Portal
            </motion.h1>
            <motion.p 
              className="text-textSecondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Enter your credentials to access the dashboard
            </motion.p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 relative overflow-hidden"
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <p className="text-red-400 text-sm relative z-10 flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ⚠️
                  </motion.span>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-textSecondary text-sm font-medium mb-2">
                Email
              </label>
              <motion.div 
                className="relative group"
                whileFocus={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <User className="w-5 h-5 text-textSecondary group-focus-within:text-accent transition-colors" />
                </motion.div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-textSecondary focus:outline-none focus:border-accent focus:bg-background/70 focus:shadow-lg focus:shadow-accent/20 transition-all duration-300"
                  placeholder="Enter admin email"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-textSecondary text-sm font-medium mb-2">
                Password
              </label>
              <motion.div 
                className="relative group"
                whileFocus={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Lock className="w-5 h-5 text-textSecondary group-focus-within:text-accent transition-colors" />
                </motion.div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-12 py-3 text-white placeholder-textSecondary focus:outline-none focus:border-accent focus:bg-background/70 focus:shadow-lg focus:shadow-accent/20 transition-all duration-300"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-white transition-colors"
                  disabled={isLoading}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-accentLight hover:from-accentLight hover:to-accent text-white font-semibold py-3 rounded-lg shadow-lg shadow-accent/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
              disabled={isLoading}
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              
              {isLoading ? (
                <motion.div 
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Authenticating...</span>
                </motion.div>
              ) : (
                <motion.span
                  className="relative z-10"
                  whileHover={{ letterSpacing: "0.05em" }}
                  transition={{ duration: 0.3 }}
                >
                  Sign In
                </motion.span>
              )}
            </motion.button>
          </form>

          {/* Back to Home */}
          <motion.div
            className="mt-6 text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.a
              href="/"
              className="text-textSecondary hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              <span className="group-hover:underline">Back to Home</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
