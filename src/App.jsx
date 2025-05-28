// import './App.css' 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ServicesPage from './Pages/ServicesPage';
import ProjectsPage from './Pages/ProjectsPage';
import ContactPage from './Pages/ContactPage';
import ErrorBoundary from './Components/ErrorBoundary';
import LoadingPage from './Components/LoadingPage';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading page during navigation
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate a 1-second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
      return (
        <ErrorBoundary>
          <LoadingPage />
        </ErrorBoundary>
     
    );
    
  }

  // if (hasError) {
  //   return (
  //       <ErrorBoundary>
  //         <LoadingPage />
  //       </ErrorBoundary>
     
  //   ); // Customize for error-specific messages
  // }

  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </>
  );
}

export default App;
