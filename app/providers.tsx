"use client"

import { DataProvider } from '@/context/DataContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DataProvider>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
