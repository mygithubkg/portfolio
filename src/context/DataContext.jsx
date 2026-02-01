import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProjects, 
  getTimeline, 
  getTechStack, 
  getContactContent, 
  getSocials,
  getServicesContent 
} from '../utils/dataManager';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    projects: [],
    timeline: [],
    techStack: [],
    contact: null,
    socials: [],
    services: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel for maximum performance
        const [projects, timeline, techStack, contact, socials, services] = await Promise.all([
          getProjects(),
          getTimeline(),
          getTechStack(),
          getContactContent(),
          getSocials(),
          getServicesContent()
        ]);

        setData({ projects, timeline, techStack, contact, socials, services });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
