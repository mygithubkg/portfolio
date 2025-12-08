import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = sessionStorage.getItem('adminToken');
    const tokenExpiry = sessionStorage.getItem('adminTokenExpiry');
    
    if (adminToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiry)) {
        setIsAuthenticated(true);
      } else {
        // Token expired
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminTokenExpiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      const token = btoa(`${username}:${Date.now()}`);
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      
      sessionStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminTokenExpiry', expiry.toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminTokenExpiry');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
