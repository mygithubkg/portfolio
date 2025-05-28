// import './App.css' 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ServicesPage from './Pages/ServicesPage';
import ProjectsPage from './Pages/ProjectsPage';
import ContactPage from './Pages/ContactPage';
import Footer from './Components/Footer'
import Header from './Components/header';
import ErrorBoundary from './Components/ErrorBoundary';

function App() {
  return (
    <>
      {console.log("Rendering App")}
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
