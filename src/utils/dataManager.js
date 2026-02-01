import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { timeline, techStack } from './aboutData';
import { contactDetails, socials } from './contactData';
import { projects as defaultProjects } from './projectData';
import { getBlogs, addBlog } from './blogData';
import { defaultBlogs } from './blogData';
import { 
  isAuthenticated, 
  sanitizeObject, 
  handleSecureError, 
  auditLog,
  checkRateLimit 
} from './security';

// Collection names in Firebase
const COLLECTIONS = {
  ABOUT: 'about',
  CONTACT: 'contact',
  SERVICES: 'services',
  PROJECTS: 'projects',
  TIMELINE: 'timeline',
  TECH_STACK: 'techStack'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Fallback to localStorage if Firebase fails
 */
const getFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

/**
 * Generic Firebase fetch with fallback
 */
const fetchFromFirebase = async (collectionName, docId, fallbackData) => {
  if (!db) {
    console.warn('Firebase not initialized, using fallback data');
    return getFromLocalStorage(collectionName, fallbackData);
  }

  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      saveToLocalStorage(collectionName, data);
      return data;
    } else {
      console.log(`No ${collectionName} data in Firebase, using default`);
      return fallbackData;
    }
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return getFromLocalStorage(collectionName, fallbackData);
  }
};

/**
 * Generic Firebase save
 */
const saveToFirebase = async (collectionName, docId, data) => {
  if (!db) {
    console.warn('Firebase not initialized, saving to localStorage only');
    saveToLocalStorage(collectionName, data);
    return { success: false, message: 'Saved locally only' };
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    saveToLocalStorage(collectionName, data);
    return { success: true, message: 'Saved to Firebase successfully' };
  } catch (error) {
    console.error(`Error saving ${collectionName}:`, error);
    saveToLocalStorage(collectionName, data);
    return { success: false, message: error.message };
  }
};

// ============================================
// ABOUT SECTION
// ============================================

export const getAboutContent = async () => {
  const defaultAbout = {
    title: 'About Me',
    subtitle: 'Full Stack Developer & AI Enthusiast',
    description: 'Passionate about building innovative solutions.',
    skills: techStack.join(', ')
  };
  
  return await fetchFromFirebase(COLLECTIONS.ABOUT, 'content', defaultAbout);
};

export const saveAboutContent = async (content) => {
  if (!isAuthenticated()) {
    auditLog('UNAUTHORIZED_SAVE_ABOUT_ATTEMPT');
    throw new Error('Unauthorized: Authentication required');
  }
  const sanitizedContent = sanitizeObject(content);
  auditLog('ABOUT_CONTENT_SAVED');
  return await saveToFirebase(COLLECTIONS.ABOUT, 'content', sanitizedContent);
};

export const getTimeline = async () => {
  return await fetchFromFirebase(COLLECTIONS.TIMELINE, 'data', timeline);
};

export const saveTimeline = async (timelineData) => {
  return await saveToFirebase(COLLECTIONS.TIMELINE, 'data', timelineData);
};

export const getTechStack = async () => {
  return await fetchFromFirebase(COLLECTIONS.TECH_STACK, 'data', techStack);
};

export const saveTechStack = async (techStackData) => {
  return await saveToFirebase(COLLECTIONS.TECH_STACK, 'data', techStackData);
};

// ============================================
// CONTACT SECTION
// ============================================

export const getContactContent = async () => {
  const defaultContact = {
    email: contactDetails[0]?.value || 'your@email.com',
    phone: '',
    location: contactDetails[1]?.value || 'Your Location',
    availability: 'Available for opportunities'
  };
  
  return await fetchFromFirebase(COLLECTIONS.CONTACT, 'content', defaultContact);
};

export const saveContactContent = async (content) => {
  if (!isAuthenticated()) {
    auditLog('UNAUTHORIZED_SAVE_CONTACT_ATTEMPT');
    throw new Error('Unauthorized: Authentication required');
  }
  const sanitizedContent = sanitizeObject(content);
  auditLog('CONTACT_CONTENT_SAVED');
  return await saveToFirebase(COLLECTIONS.CONTACT, 'content', sanitizedContent);
};

export const getSocials = async () => {
  return await fetchFromFirebase(COLLECTIONS.CONTACT, 'socials', socials);
};

export const saveSocials = async (socialsData) => {
  return await saveToFirebase(COLLECTIONS.CONTACT, 'socials', socialsData);
};

// ============================================
// SERVICES SECTION
// ============================================

const defaultServices = [
  { 
    id: 1, 
    title: 'Web Development', 
    description: 'Building modern, responsive web applications', 
    icon: 'Code' 
  },
  { 
    id: 2, 
    title: 'AI Solutions', 
    description: 'Developing intelligent systems and ML models', 
    icon: 'Brain' 
  },
  { 
    id: 3, 
    title: 'Cloud Integration', 
    description: 'Deploying scalable cloud-based solutions', 
    icon: 'Cloud' 
  }
];

export const getServicesContent = async () => {
  return await fetchFromFirebase(COLLECTIONS.SERVICES, 'list', defaultServices);
};

export const saveServicesContent = async (services) => {
  if (!isAuthenticated()) {
    auditLog('UNAUTHORIZED_SAVE_SERVICES_ATTEMPT');
    throw new Error('Unauthorized: Authentication required');
  }
  const sanitizedServices = sanitizeObject(services);
  auditLog('SERVICES_CONTENT_SAVED');
  return await saveToFirebase(COLLECTIONS.SERVICES, 'list', sanitizedServices);
};

// ============================================
// PROJECTS SECTION
// ============================================

export const getProjects = async () => {
  if (!db) {
    return getFromLocalStorage(COLLECTIONS.PROJECTS, defaultProjects);
  }

  try {
    const projectsRef = collection(db, COLLECTIONS.PROJECTS);
    const querySnapshot = await getDocs(projectsRef);
    
    if (querySnapshot.empty) {
      console.log('No projects in Firebase, using defaults');
      return defaultProjects;
    }

    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    saveToLocalStorage(COLLECTIONS.PROJECTS, projects);
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return getFromLocalStorage(COLLECTIONS.PROJECTS, defaultProjects);
  }
};

export const addProject = async (projectData) => {
  // Security: Check authentication
  if (!isAuthenticated()) {
    auditLog('UNAUTHORIZED_ADD_PROJECT_ATTEMPT', { data: projectData });
    throw new Error('Unauthorized: Authentication required');
  }

  // Security: Rate limiting
  if (!checkRateLimit('addProject', 10, 60000)) {
    auditLog('RATE_LIMIT_EXCEEDED', { action: 'addProject' });
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Security: Sanitize input
  const sanitizedData = sanitizeObject(projectData);

  if (!db) {
    const projects = getFromLocalStorage(COLLECTIONS.PROJECTS, []);
    const newProject = { ...sanitizedData, id: Date.now().toString() };
    projects.push(newProject);
    saveToLocalStorage(COLLECTIONS.PROJECTS, projects);
    auditLog('PROJECT_ADDED_LOCALLY', { projectId: newProject.id });
    return { success: false, message: 'Saved locally only' };
  }

  try {
    const projectId = sanitizedData.id || `PROJ_${Date.now()}`;
    const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    await setDoc(docRef, { ...sanitizedData, id: projectId });
    
    auditLog('PROJECT_ADDED', { projectId });
    return { success: true, message: 'Project added successfully' };
  } catch (error) {
    const errorMessage = handleSecureError(error, 'addProject');
    return { success: false, message: errorMessage };
  }
};

export const updateProject = async (projectId, projectData) => {
  // Security: Check authentication
  if (!isAuthenticated()) {
    auditLog('UNAUTHORIZED_UPDATE_PROJECT_ATTEMPT', { projectId });
    throw new Error('Unauthorized: Authentication required');
  }

  // Security: Rate limiting
  if (!checkRateLimit('updateProject', 20, 60000)) {
    auditLog('RATE_LIMIT_EXCEEDED', { action: 'updateProject' });
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Security: Sanitize input
  const sanitizedData = sanitizeObject(projectData);

  if (!db) {
    const projects = getFromLocalStorage(COLLECTIONS.PROJECTS, []);
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...sanitizedData };
      saveToLocalStorage(COLLECTIONS.PROJECTS, projects);
    }
    auditLog('PROJECT_UPDATED_LOCALLY', { projectId });
    return { success: false, message: 'Updated locally only' };
  }

  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    await updateDoc(docRef, sanitizedData);
    auditLog('PROJECT_UPDATED', { projectId });
    return { success: true, message: 'Project updated successfully' };
  } catch (error) {
    const errorMessage = handleSecureError(error, 'updateProject');
    return { success: false, message: errorMessage };
  }
};

export const deleteProject = async (projectId) => {
  // Security: Check authentication
  if (!isAuthenticated()) {
    auditLog('UNAUTHORIZED_DELETE_PROJECT_ATTEMPT', { projectId });
    throw new Error('Unauthorized: Authentication required');
  }

  // Security: Rate limiting
  if (!checkRateLimit('deleteProject', 10, 60000)) {
    auditLog('RATE_LIMIT_EXCEEDED', { action: 'deleteProject' });
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  if (!db) {
    const projects = getFromLocalStorage(COLLECTIONS.PROJECTS, []);
    const filtered = projects.filter(p => p.id !== projectId);
    saveToLocalStorage(COLLECTIONS.PROJECTS, filtered);
    auditLog('PROJECT_DELETED_LOCALLY', { projectId });
    return { success: false, message: 'Deleted locally only' };
  }

  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    await deleteDoc(docRef);
    auditLog('PROJECT_DELETED', { projectId });
    return { success: true, message: 'Project deleted successfully' };
  } catch (error) {
    const errorMessage = handleSecureError(error, 'deleteProject');
    return { success: false, message: errorMessage };
  }
};

// ============================================
// BULK OPERATIONS (for AdminDashboard)
// ============================================

export const exportAllData = async () => {
  const data = {
    about: await getAboutContent(),
    contact: await getContactContent(),
    services: await getServicesContent(),
    projects: await getProjects(),
    blogs: await getBlogs(),
    timeline: await getTimeline(),
    techStack: await getTechStack(),
    socials: await getSocials()
  };
  return data;
};

export const importAllData = async (data) => {
  try {
    if (data.about) await saveAboutContent(data.about);
    if (data.contact) await saveContactContent(data.contact);
    if (data.services) await saveServicesContent(data.services);
    if (data.timeline) await saveTimeline(data.timeline);
    if (data.techStack) await saveTechStack(data.techStack);
    if (data.socials) await saveSocials(data.socials);
    
    // Import blogs
    if (data.blogs && Array.isArray(data.blogs)) {
      for (const blog of data.blogs) {
        await addBlog(blog);
      }
    }
    
    return { success: true, message: 'All data imported successfully' };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, message: error.message };
  }
};

// Sync default data to Firebase (run once to populate Firebase)
export const syncDefaultDataToFirebase = async () => {
  console.log('Starting sync of default data to Firebase...');
  
  try {
    await saveAboutContent({
      title: 'About Me',
      subtitle: 'Full Stack Developer & AI Enthusiast',
      description: 'Passionate about building innovative solutions.',
      skills: techStack.join(', ')
    });

    await saveContactContent({
      email: contactDetails[0]?.value || '',
      phone: '',
      location: contactDetails[1]?.value || '',
      availability: 'Available for opportunities'
    });

    await saveServicesContent(defaultServices);
    await saveTimeline(timeline);
    await saveTechStack(techStack);
    // Sync blogs
    for (const blog of defaultBlogs) {
      await addBlog(blog);
    }

    await saveSocials(socials);

    // Sync projects
    for (const project of defaultProjects) {
      await addProject(project);
    }

    console.log('✅ Default data synced to Firebase successfully!');
    return { success: true, message: 'All default data synced to Firebase' };
  } catch (error) {
    console.error('Error syncing default data:', error);
    return { success: false, message: error.message };
  }
};
