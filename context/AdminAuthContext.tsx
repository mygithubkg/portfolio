"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { generateCSRFToken, setCSRFToken, clearAuth, auditLog } from '@/lib/utils/security';

const AdminAuthContext = createContext<any>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

// ─── Persistent lockout helpers (H-2 fix) ──────────────────────────────────
// Storing in sessionStorage so a page refresh does NOT reset the counter,
// but closing the tab/browser does (avoids permanent self-lockout).

const SS_ATTEMPTS_KEY  = 'adminLoginAttempts';
const SS_LOCKOUT_KEY   = 'adminLockoutUntil';

const readAttempts  = (): number => parseInt(sessionStorage.getItem(SS_ATTEMPTS_KEY)  ?? '0', 10);
const readLockout   = (): number | null => {
  const v = sessionStorage.getItem(SS_LOCKOUT_KEY);
  return v ? parseInt(v, 10) : null;
};
const writeAttempts = (n: number)          => sessionStorage.setItem(SS_ATTEMPTS_KEY, String(n));
const writeLockout  = (t: number | null)   => {
  if (t === null) sessionStorage.removeItem(SS_LOCKOUT_KEY);
  else            sessionStorage.setItem(SS_LOCKOUT_KEY, String(t));
};
const clearLockout  = () => {
  sessionStorage.removeItem(SS_ATTEMPTS_KEY);
  sessionStorage.removeItem(SS_LOCKOUT_KEY);
};

// ─── Session cookie helpers (H-1 fix) ──────────────────────────────────────
const setSessionCookie  = () => fetch('/api/admin-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'set'   }) });
const clearSessionCookie = () => fetch('/api/admin-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'clear' }) });

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);
  const [firebaseUser, setFirebaseUser]        = useState<User | null>(null);

  // Hydrate lockout state from sessionStorage (H-2 fix)
  const [loginAttempts, setLoginAttempts] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return readAttempts();
  });
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    return readLockout();
  });

  // Sync attempts to sessionStorage whenever they change
  useEffect(() => { writeAttempts(loginAttempts); }, [loginAttempts]);
  useEffect(() => { writeLockout(lockoutUntil);   }, [lockoutUntil]);

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
   * On success, sets the httpOnly adminSession cookie so middleware.ts can
   * verify authentication before JS hydration (H-1).
   */
  const login = async (email: string, password: string) => {
    // Check lockout (H-2: reads from sessionStorage-backed state)
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

      // Set the httpOnly session cookie for middleware.ts (H-1 fix)
      await setSessionCookie();

      // onAuthStateChanged will handle setIsAuthenticated(true) + CSRF generation
      setLoginAttempts(0);
      setLockoutUntil(null);
      clearLockout();
      auditLog('LOGIN_SUCCESS', { uid: user.uid, timestamp: new Date().toISOString() });
      return { success: true, message: 'Login successful.' };
    } catch (error: any) {
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
   * Sign out from Firebase Auth and clear all local auth artifacts,
   * including the httpOnly session cookie (H-1 fix).
   */
  const logout = async () => {
    auditLog('LOGOUT', { timestamp: new Date().toISOString() });
    // Clear the session cookie so middleware.ts redirects on next visit
    await clearSessionCookie();
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
