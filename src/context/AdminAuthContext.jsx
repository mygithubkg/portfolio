import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
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
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth not initialized — admin login unavailable');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setIsAuthenticated(true);
        // Generate CSRF token on auth restore / login
        const csrfToken = generateCSRFToken();
        setCSRFToken(csrfToken);
        auditLog('AUTH_STATE_RESTORED', { uid: user.uid, timestamp: new Date().toISOString() });
      } else {
        setFirebaseUser(null);
        setIsAuthenticated(false);
        clearAuth();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Authenticate with Firebase Auth (email + password).
   * Keeps client-side lockout as defense-in-depth before hitting Firebase.
   */
  const login = async (email, password) => {
    // Check lockout
    if (lockoutUntil && new Date().getTime() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - new Date().getTime()) / 1000);
      auditLog('LOGIN_ATTEMPT_LOCKED', { remainingTime });
      return {
        success: false,
        message: `Too many failed attempts. Try again in ${remainingTime} seconds.`
      };
    }

    if (!email || !password) {
      auditLog('LOGIN_FAILED', { reason: 'EMPTY_CREDENTIALS' });
      return { success: false, message: 'Email and password are required.' };
    }

    if (!auth) {
      return { success: false, message: 'Authentication service unavailable. Check Firebase config.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // onAuthStateChanged will handle setIsAuthenticated(true) + CSRF generation
      setLoginAttempts(0);
      setLockoutUntil(null);
      auditLog('LOGIN_SUCCESS', { uid: user.uid, timestamp: new Date().toISOString() });
      return { success: true, message: 'Login successful.' };
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Lock after 5 failed attempts for 15 minutes
      if (newAttempts >= 5) {
        const lockTime = new Date().getTime() + (15 * 60 * 1000);
        setLockoutUntil(lockTime);
        auditLog('ACCOUNT_LOCKED', {
          attempts: newAttempts,
          lockUntil: new Date(lockTime).toISOString()
        });
        return {
          success: false,
          message: 'Too many failed attempts. Account locked for 15 minutes.'
        };
      }

      auditLog('LOGIN_FAILED', {
        reason: error.code || 'UNKNOWN',
        attempts: newAttempts,
        remainingAttempts: 5 - newAttempts
      });
      return {
        success: false,
        message: `Invalid credentials. ${5 - newAttempts} attempts remaining.`
      };
    }
  };

  /**
   * Sign out from Firebase Auth and clear local auth artifacts.
   */
  const logout = async () => {
    auditLog('LOGOUT', { timestamp: new Date().toISOString() });
    clearAuth();
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    // onAuthStateChanged will handle setting isAuthenticated to false
  };

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout,
      loginAttempts,
      firebaseUser,
      isLocked: lockoutUntil && new Date().getTime() < lockoutUntil
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
