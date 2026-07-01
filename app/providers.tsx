"use client"

import { DataProvider } from '@/context/DataContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </DataProvider>
  );
}
