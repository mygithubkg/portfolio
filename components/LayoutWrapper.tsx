"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AmbientBackground from './AmbientBackground';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <AmbientBackground />
      <Header />
      <main className="flex-1 w-full flex flex-col pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
