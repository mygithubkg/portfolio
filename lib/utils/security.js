import DOMPurify from 'dompurify';
import { auth } from '@/lib/firebase';

// ============================================
// INPUT SANITIZATION - XSS Protection
// ============================================

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove all HTML tags and dangerous characters
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize URL to prevent XSS and ensure valid protocols
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const sanitized = DOMPurify.sanitize(url, { ALLOWED_TAGS: [] });
    const urlObj = new URL(sanitized);
    
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }
    
    return sanitized;
  } catch (error) {
    console.warn('Invalid URL provided:', url);
    return '';
  }
};

/**
 * Sanitize an object's properties recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// ============================================
// ERROR HANDLING - Prevent Information Leakage
// ============================================

/**
 * Handle errors securely without exposing sensitive information
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @returns {string} - User-friendly error message
 */
export const handleSecureError = (error, context = '') => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // In development, log full error for debugging
  if (isDevelopment) {
    console.error(`[${context}]`, error);
  } else {
    // In production, log minimal info (could send to monitoring service)
    console.error(`Error in ${context}`);
    
    // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
    // logToMonitoringService(error, context);
  }
  
  // Return generic message to user
  const genericMessages = {
    'auth': 'Authentication failed. Please try logging in again.',
    'network': 'Network error. Please check your connection and try again.',
    'permission': 'You do not have permission to perform this action.',
    'validation': 'Please check your input and try again.',
    'default': 'An unexpected error occurred. Please try again later.'
  };
  
  // Try to categorize error
  if (error.code === 'permission-denied' || error.message?.includes('permission')) {
    return genericMessages.permission;
  }
  if (error.code === 'auth' || error.message?.includes('auth')) {
    return genericMessages.auth;
  }
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return genericMessages.network;
  }
  
  return genericMessages.default;
};

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate a CSRF token
 * @returns {string} - CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Get CSRF token from session storage
 * @returns {string|null} - CSRF token or null
 */
export const getCSRFToken = () => {
  return sessionStorage.getItem('csrfToken');
};

/**
 * Set CSRF token in session storage
 * @param {string} token - CSRF token
 */
export const setCSRFToken = (token) => {
  sessionStorage.setItem('csrfToken', token);
};

/**
 * Validate CSRF token
 * @param {string} token - Token to validate
 * @returns {boolean} - Whether token is valid
 */
export const validateCSRFToken = (token) => {
  const storedToken = getCSRFToken();
  return storedToken && storedToken === token;
};

// ============================================
// RATE LIMITING (Client-side basic throttling)
// ============================================

const rateLimitCache = new Map();

/**
 * Basic client-side rate limiting
 * @param {string} key - Unique key for the action
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - Whether action is allowed
 */
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const record = rateLimitCache.get(key) || { attempts: 0, resetTime: now + windowMs };
  
  // Reset if window has passed
  if (now > record.resetTime) {
    record.attempts = 0;
    record.resetTime = now + windowMs;
  }
  
  // Check if limit exceeded
  if (record.attempts >= maxAttempts) {
    return false;
  }
  
  // Increment attempts
  record.attempts++;
  rateLimitCache.set(key, record);
  
  return true;
};

// ============================================
// AUTHENTICATION UTILITIES
// ============================================

/**
 * Check if user is authenticated
 * Primary: checks Firebase Auth current user (set by onAuthStateChanged).
 * Fallback: checks legacy sessionStorage token for backward compatibility.
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = () => {
  // Primary: Firebase Auth current user (set after onAuthStateChanged resolves)
  if (auth && auth.currentUser) {
    return true;
  }
  // Secondary: CSRF token in sessionStorage — only written by onAuthStateChanged
  // on successful Firebase login, so its presence reliably means the user is authenticated.
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('csrfToken')) {
    return true;
  }
  // Fallback: legacy sessionStorage token for backward compatibility
  const token = sessionStorage.getItem('adminToken');
  const expiry = sessionStorage.getItem('adminTokenExpiry');
  if (!token || !expiry) return false;
  return Date.now() < parseInt(expiry);
};

/**
 * Get authentication token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  if (!isAuthenticated()) return null;
  return sessionStorage.getItem('adminToken');
};

/**
 * Clear authentication artifacts from sessionStorage.
 * Firebase Auth manages its own session (IndexedDB) — call signOut(auth)
 * separately to log out of Firebase. This function clears the CSRF token
 * and any legacy pseudo-auth tokens.
 */
export const clearAuth = () => {
  sessionStorage.removeItem('csrfToken');
  // Legacy cleanup (safe to keep for compatibility)
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminTokenExpiry');
};

// ============================================
// DATA VALIDATION HELPERS
// ============================================

/**
 * Validate that a value is not empty
 * @param {any} value - Value to check
 * @returns {boolean} - Whether value is not empty
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate year is reasonable
 * @param {number} year - Year to validate
 * @returns {boolean} - Whether year is valid
 */
export const isValidYear = (year) => {
  const numYear = parseInt(year);
  return !isNaN(numYear) && numYear >= 2000 && numYear <= 2100;
};

// ============================================
// CONTENT SECURITY
// ============================================

/**
 * Strip potentially dangerous content from markdown/HTML
 * @param {string} content - Content to clean
 * @returns {string} - Cleaned content
 */
export const sanitizeMarkdown = (content) => {
  if (!content || typeof content !== 'string') return '';
  
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?):\/\/|\/)/i
  });
};

// ============================================
// SECURE LOGGING
// ============================================

/**
 * Securely log actions for audit trail
 * @param {string} action - Action performed
 * @param {Object} metadata - Additional metadata
 */
export const auditLog = (action, metadata = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    user: sessionStorage.getItem('adminToken') ? 'admin' : 'anonymous',
    ...metadata
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 AUDIT:', logEntry);
  }
  
  // In production, send to logging service
  // TODO: Implement actual logging service integration
  // sendToLoggingService(logEntry);
};
