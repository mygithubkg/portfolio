"use client"
import React, { useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';
import ErrorBoundary from './ErrorBoundary';
import { clarity } from 'react-microsoft-clarity';

export default function ClientLoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace 'YOUR_PROJECT_ID' with your actual Project ID from Microsoft Clarity
    const clarityProjectId = 'xa0yfqw4yh';

    // Initialize Clarity
    if (typeof window !== 'undefined') {
      clarity.init(clarityProjectId);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <ErrorBoundary>
        <LoadingPage onComplete={handleLoadingComplete} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
