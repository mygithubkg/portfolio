"use client"

import { DataProvider } from '@/context/DataContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DataProvider>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
