import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateCSRFToken, setCSRFToken, clearAuth, auditLog } from '../utils/security';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = sessionStorage.getItem('adminToken');
    const tokenExpiry = sessionStorage.getItem('adminTokenExpiry');
    
    if (adminToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiry)) {
        setIsAuthenticated(true);
        // Generate CSRF token on auth check
        const csrfToken = generateCSRFToken();
        setCSRFToken(csrfToken);
        auditLog('AUTH_VERIFIED', { timestamp: new Date().toISOString() });
      } else {
        // Token expired - clear everything
        clearAuth();
        auditLog('AUTH_EXPIRED', { timestamp: new Date().toISOString() });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    // Check if account is locked
    if (lockoutUntil && new Date().getTime() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - new Date().getTime()) / 1000);
      auditLog('LOGIN_ATTEMPT_LOCKED', { remainingTime });
      return { 
        success: false, 
        message: `Too many failed attempts. Try again in ${remainingTime} seconds.` 
      };
    }

    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    // Validate credentials
    if (!username || !password) {
      auditLog('LOGIN_FAILED', { reason: 'EMPTY_CREDENTIALS' });
      return { success: false, message: 'Username and password are required.' };
    }

    if (username === adminUsername && password === adminPassword) {
      // Generate secure token with random component
      const randomComponent = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      const token = btoa(`${username}:${Date.now()}:${randomComponent}`);
      const expiry = new Date().getTime() + (8 * 60 * 60 * 1000); // 8 hours (reduced from 24)
      
      sessionStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminTokenExpiry', expiry.toString());
      
      // Generate CSRF token
      const csrfToken = generateCSRFToken();
      setCSRFToken(csrfToken);
      
      setIsAuthenticated(true);
      setLoginAttempts(0);
      setLockoutUntil(null);
      
      auditLog('LOGIN_SUCCESS', { username, timestamp: new Date().toISOString() });
      return { success: true, message: 'Login successful.' };
    }
    
    // Failed login attempt
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    // Lock account after 5 failed attempts for 15 minutes
    if (newAttempts >= 5) {
      const lockTime = new Date().getTime() + (15 * 60 * 1000);
      setLockoutUntil(lockTime);
      auditLog('ACCOUNT_LOCKED', { attempts: newAttempts, lockUntil: new Date(lockTime).toISOString() });
      return { 
        success: false, 
        message: 'Too many failed attempts. Account locked for 15 minutes.' 
      };
    }
    
    auditLog('LOGIN_FAILED', { 
      reason: 'INVALID_CREDENTIALS', 
      attempts: newAttempts,
      remainingAttempts: 5 - newAttempts 
    });
    
    return { 
      success: false, 
      message: `Invalid credentials. ${5 - newAttempts} attempts remaining.` 
    };
  };

  const logout = () => {
    auditLog('LOGOUT', { timestamp: new Date().toISOString() });
    clearAuth();
    setIsAuthenticated(false);
  };

  // Auto-logout on token expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      const tokenExpiry = sessionStorage.getItem('adminTokenExpiry');
      if (tokenExpiry) {
        const now = new Date().getTime();
        if (now >= parseInt(tokenExpiry)) {
          auditLog('AUTO_LOGOUT', { reason: 'TOKEN_EXPIRED' });
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isAuthenticated]);

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      loginAttempts,
      isLocked: lockoutUntil && new Date().getTime() < lockoutUntil
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
