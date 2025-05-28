// import './App.css' 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ServicesPage from './Pages/ServicesPage';
import ProjectsPage from './Pages/ProjectsPage';
import ContactPage from './Pages/ContactPage';
import Footer from './Components/Footer'
import Header from './Components/header';
import ErrorBoundary from './Components/ErrorBoundary';
import LoadingPage from './Components/LoadingPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate loading and error handling
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (hasError) {
    return <LoadingPage />; // You can customize this for error-specific messages
  }

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
