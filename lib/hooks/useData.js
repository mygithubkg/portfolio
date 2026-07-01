import { useState, useEffect } from 'react';
import { 
  getAboutContent, 
  getContactContent, 
  getServicesContent, 
  getProjects,
  getTimeline,
  getTechStack,
  getSocials
} from '@/lib/utils/dataManager';

/**
 * Custom hook to fetch About data from Firebase with fallback
 */
export const useAboutData = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAboutContent();
        setAboutData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { aboutData, loading, error };
};

/**
 * Custom hook to fetch Timeline data
 */
export const useTimelineData = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTimeline();
        setTimeline(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching timeline:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { timeline, loading, error };
};

/**
 * Custom hook to fetch Tech Stack data
 */
export const useTechStackData = () => {
  const [techStack, setTechStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTechStack();
        setTechStack(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tech stack:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { techStack, loading, error };
};

/**
 * Custom hook to fetch Contact data from Firebase with fallback
 */
export const useContactData = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getContactContent();
        setContactData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { contactData, loading, error };
};

/**
 * Custom hook to fetch Socials data
 */
export const useSocialsData = () => {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSocials();
        setSocials(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching socials:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { socials, loading, error };
};

/**
 * Custom hook to fetch Services data from Firebase with fallback
 */
export const useServicesData = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getServicesContent();
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching services data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { services, loading, error };
};

/**
 * Custom hook to fetch Projects data from Firebase with fallback
 */
export const useProjectsData = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();

    // Listen for custom event from ProjectsManager
    const handleProjectsUpdate = () => {
      refreshProjects();
    };

    window.addEventListener('projectsUpdated', handleProjectsUpdate);

    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
    };
  }, []);

  return { projects, loading, error, refreshProjects };
};
