/**
 * defaultsManager.js
 *
 * CRUD layer for the `defaults_*` Firestore collections.
 * Mirrors the structure of dataManager.js but targets defaults_ prefixed
 * collections, which are admin-only and never shown to public visitors.
 *
 * Array-type data (timeline, techStack, socials, services) is stored as
 * { items: [...] } to satisfy Firestore's requirement for plain objects.
 *
 * IMPORTANT: This file does NOT import from dataManager.js to avoid
 * circular dependencies. resetSectionToDefault() uses raw Firestore calls
 * to write back to live collections.
 */

import { db } from '@/lib/firebase';
import {
  collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs
} from 'firebase/firestore';
import { timeline, techStack } from './aboutData';
import { contactDetails, socials } from './contactData';
import { projects as hardcodedProjects } from './projectData';
import { defaultBlogs } from './blogData';
import {
  isAuthenticated,
  sanitizeObject,
  auditLog,
  checkRateLimit
} from './security';

// ============================================
// DEFAULTS COLLECTION NAMES
// ============================================

const DEFAULTS = {
  ABOUT:      'defaults_about',
  CONTACT:    'defaults_contact',
  SERVICES:   'defaults_services',
  PROJECTS:   'defaults_projects',
  BLOGS:      'defaults_blogs',
  TIMELINE:   'defaults_timeline',
  TECH_STACK: 'defaults_techStack',
};

// Live collection names (used only in reset operations)
const LIVE = {
  ABOUT:      'about',
  CONTACT:    'contact',
  SERVICES:   'services',
  PROJECTS:   'projects',
  BLOGS:      'blogs',
  TIMELINE:   'timeline',
  TECH_STACK: 'techStack',
};

// Hardcoded service defaults (mirrors dataManager.js defaultServices)
const hardcodedServices = [
  { id: 1, title: 'Web Development',  description: 'Building modern, responsive web applications', icon: 'Code'  },
  { id: 2, title: 'AI Solutions',     description: 'Developing intelligent systems and ML models',  icon: 'Brain' },
  { id: 3, title: 'Cloud Integration',description: 'Deploying scalable cloud-based solutions',     icon: 'Cloud' },
];

// ============================================
// PRIVATE HELPERS
// ============================================

/**
 * Fetch a single document from a defaults collection.
 * Returns fallbackData if the document does not exist or Firebase is unavailable.
 */
const fetchFromDefaults = async (collectionName, docId, fallbackData) => {
  if (!db) return fallbackData;
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : fallbackData;
  } catch (error) {
    console.error(`[defaultsManager] Error fetching ${collectionName}/${docId}:`, error);
    return fallbackData;
  }
};

/**
 * Write data to a defaults collection document.
 */
const saveToDefaults = async (collectionName, docId, data) => {
  if (!db) return { success: false, message: 'Firebase not initialized' };
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    return { success: true, message: 'Saved to defaults successfully' };
  } catch (error) {
    console.error(`[defaultsManager] Error saving ${collectionName}/${docId}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Normalize data that might be stored as { items: [...] } or as a raw array
 * (handles both the new wrapped format and legacy data gracefully).
 */
const unwrapItems = (data, fallback = []) => {
  if (!data) return fallback;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return fallback;
};

// ============================================
// DEFAULTS — ABOUT SECTION
// ============================================

export const getDefaultAboutContent = async () => {
  const fallback = {
    title: 'About Me',
    subtitle: 'Full Stack Developer & AI Enthusiast',
    description: 'Passionate about building innovative solutions.',
    skills: techStack.join(', ')
  };
  return await fetchFromDefaults(DEFAULTS.ABOUT, 'content', fallback);
};

export const saveDefaultAboutContent = async (content) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  const sanitized = sanitizeObject(content);
  auditLog('DEFAULT_ABOUT_SAVED');
  return await saveToDefaults(DEFAULTS.ABOUT, 'content', sanitized);
};

// ============================================
// DEFAULTS — TIMELINE SECTION
// ============================================

export const getDefaultTimeline = async () => {
  const raw = await fetchFromDefaults(DEFAULTS.TIMELINE, 'data', null);
  return unwrapItems(raw, timeline);
};

export const saveDefaultTimeline = async (timelineArray) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  auditLog('DEFAULT_TIMELINE_SAVED');
  // Wrap in { items: [...] } for Firestore (documents must be plain objects)
  return await saveToDefaults(DEFAULTS.TIMELINE, 'data', { items: timelineArray });
};

// ============================================
// DEFAULTS — TECH STACK SECTION
// ============================================

export const getDefaultTechStack = async () => {
  const raw = await fetchFromDefaults(DEFAULTS.TECH_STACK, 'data', null);
  return unwrapItems(raw, techStack);
};

export const saveDefaultTechStack = async (techArray) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  auditLog('DEFAULT_TECH_STACK_SAVED');
  return await saveToDefaults(DEFAULTS.TECH_STACK, 'data', { items: techArray });
};

// ============================================
// DEFAULTS — CONTACT SECTION
// ============================================

export const getDefaultContactContent = async () => {
  const fallback = {
    email: contactDetails[0]?.value || 'your@email.com',
    phone: '',
    location: contactDetails[1]?.value || 'Your Location',
    availability: 'Available for opportunities'
  };
  return await fetchFromDefaults(DEFAULTS.CONTACT, 'content', fallback);
};

export const saveDefaultContactContent = async (content) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  const sanitized = sanitizeObject(content);
  auditLog('DEFAULT_CONTACT_SAVED');
  return await saveToDefaults(DEFAULTS.CONTACT, 'content', sanitized);
};

export const getDefaultSocials = async () => {
  const raw = await fetchFromDefaults(DEFAULTS.CONTACT, 'socials', null);
  return unwrapItems(raw, socials);
};

export const saveDefaultSocials = async (socialsArray) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  const sanitized = sanitizeObject(socialsArray);
  auditLog('DEFAULT_SOCIALS_SAVED');
  return await saveToDefaults(DEFAULTS.CONTACT, 'socials', { items: sanitized });
};

// ============================================
// DEFAULTS — SERVICES SECTION
// ============================================

export const getDefaultServices = async () => {
  const raw = await fetchFromDefaults(DEFAULTS.SERVICES, 'list', null);
  return unwrapItems(raw, hardcodedServices);
};

export const saveDefaultServices = async (servicesArray) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  const sanitized = sanitizeObject(servicesArray);
  auditLog('DEFAULT_SERVICES_SAVED');
  return await saveToDefaults(DEFAULTS.SERVICES, 'list', { items: sanitized });
};

// ============================================
// DEFAULTS — PROJECTS SECTION (collection-based)
// ============================================

export const getDefaultProjects = async () => {
  if (!db) return hardcodedProjects;
  try {
    const projectsRef = collection(db, DEFAULTS.PROJECTS);
    const snapshot = await getDocs(projectsRef);
    if (snapshot.empty) return hardcodedProjects;
    const projects = [];
    snapshot.forEach((d) => projects.push({ id: d.id, ...d.data() }));
    return projects;
  } catch (error) {
    console.error('[defaultsManager] Error fetching default projects:', error);
    return hardcodedProjects;
  }
};

export const addDefaultProject = async (projectData) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!checkRateLimit('addDefaultProject', 20, 60000)) throw new Error('Rate limit exceeded. Try again later.');
  if (!db) throw new Error('Firebase not initialized');
  const sanitized = sanitizeObject(projectData);
  const projectId = sanitized.id || `DEFAULT_PROJ_${Date.now()}`;
  const docRef = doc(db, DEFAULTS.PROJECTS, projectId);
  await setDoc(docRef, { ...sanitized, id: projectId });
  auditLog('DEFAULT_PROJECT_ADDED', { projectId });
  return { success: true, id: projectId };
};

export const updateDefaultProject = async (projectId, projectData) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!checkRateLimit('updateDefaultProject', 30, 60000)) throw new Error('Rate limit exceeded. Try again later.');
  if (!db) throw new Error('Firebase not initialized');
  const sanitized = sanitizeObject(projectData);
  const docRef = doc(db, DEFAULTS.PROJECTS, projectId);
  await updateDoc(docRef, sanitized);
  auditLog('DEFAULT_PROJECT_UPDATED', { projectId });
  return { success: true };
};

export const deleteDefaultProject = async (projectId) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!checkRateLimit('deleteDefaultProject', 20, 60000)) throw new Error('Rate limit exceeded. Try again later.');
  if (!db) throw new Error('Firebase not initialized');
  const docRef = doc(db, DEFAULTS.PROJECTS, projectId);
  await deleteDoc(docRef);
  auditLog('DEFAULT_PROJECT_DELETED', { projectId });
  return { success: true };
};

// ============================================
// DEFAULTS — BLOGS SECTION (collection-based)
// ============================================

export const getDefaultBlogs = async () => {
  if (!db) return defaultBlogs;
  try {
    const blogsRef = collection(db, DEFAULTS.BLOGS);
    const snapshot = await getDocs(blogsRef);
    if (snapshot.empty) return defaultBlogs;
    const blogs = [];
    snapshot.forEach((d) => blogs.push({ id: d.id, ...d.data() }));
    return blogs;
  } catch (error) {
    console.error('[defaultsManager] Error fetching default blogs:', error);
    return defaultBlogs;
  }
};

export const addDefaultBlog = async (blogData) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!db) throw new Error('Firebase not initialized');
  const blogId = `DEFAULT_BLOG_${Date.now()}`;
  const docRef = doc(db, DEFAULTS.BLOGS, blogId);
  const newBlog = {
    ...blogData,
    publishDate: blogData.publishDate || new Date().toISOString().split('T')[0],
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, newBlog);
  auditLog('DEFAULT_BLOG_ADDED', { blogId });
  return { id: blogId, ...newBlog };
};

export const updateDefaultBlog = async (blogId, blogData) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!db) throw new Error('Firebase not initialized');
  const docRef = doc(db, DEFAULTS.BLOGS, blogId);
  const updateData = { ...blogData, updatedAt: new Date().toISOString() };
  await setDoc(docRef, updateData, { merge: true });
  auditLog('DEFAULT_BLOG_UPDATED', { blogId });
  return { id: blogId, ...updateData };
};

export const deleteDefaultBlog = async (blogId) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!db) throw new Error('Firebase not initialized');
  const docRef = doc(db, DEFAULTS.BLOGS, blogId);
  await deleteDoc(docRef);
  auditLog('DEFAULT_BLOG_DELETED', { blogId });
  return true;
};

// ============================================
// SEED HARDCODED JS → defaults/ FIRESTORE TREE
//
// Called from admin dashboard "SEED_DEFAULTS" button.
// Safe to re-run — overwrites defaults with the original hardcoded values.
// Does NOT touch any live collections.
// ============================================

export const syncHardcodedToDefaults = async () => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!db) throw new Error('Firebase not initialized');

  console.log('🌱 [defaultsManager] Seeding hardcoded data → defaults/ tree...');

  try {
    // About content
    await saveToDefaults(DEFAULTS.ABOUT, 'content', {
      title: 'About Me',
      subtitle: 'Full Stack Developer & AI Enthusiast',
      description: 'Passionate about building innovative solutions.',
      skills: techStack.join(', ')
    });

    // Timeline (wrapped for Firestore)
    await saveToDefaults(DEFAULTS.TIMELINE, 'data', { items: timeline });

    // Tech Stack (wrapped for Firestore)
    await saveToDefaults(DEFAULTS.TECH_STACK, 'data', { items: techStack });

    // Contact content
    await saveToDefaults(DEFAULTS.CONTACT, 'content', {
      email: contactDetails[0]?.value || '',
      phone: '',
      location: contactDetails[1]?.value || '',
      availability: 'Available for opportunities'
    });

    // Socials (wrapped for Firestore)
    await saveToDefaults(DEFAULTS.CONTACT, 'socials', { items: socials });

    // Services (wrapped for Firestore)
    await saveToDefaults(DEFAULTS.SERVICES, 'list', { items: hardcodedServices });

    // Projects (each as individual document)
    for (const project of hardcodedProjects) {
      const docRef = doc(db, DEFAULTS.PROJECTS, project.id);
      await setDoc(docRef, project);
    }

    // Blogs (empty by design — add via admin panel)
    // defaultBlogs is [] so this loop does nothing unless sample blogs are added later
    for (const blog of defaultBlogs) {
      const blogId = blog.id || `DEFAULT_BLOG_${Date.now()}`;
      const docRef = doc(db, DEFAULTS.BLOGS, blogId);
      await setDoc(docRef, { ...blog, id: blogId });
    }

    console.log('✅ [defaultsManager] Defaults seeded successfully!');
    auditLog('HARDCODED_TO_DEFAULTS_SEEDED', { timestamp: new Date().toISOString() });
    return { success: true, message: 'All hardcoded defaults seeded to Firestore defaults/ tree.' };
  } catch (error) {
    console.error('[defaultsManager] Error seeding defaults:', error);
    auditLog('HARDCODED_TO_DEFAULTS_SEED_ERROR', { error: error.message });
    return { success: false, message: error.message };
  }
};

// ============================================
// RESET SECTION TO DEFAULT
//
// Copies defaults/{section} → live {section} in Firestore.
// For collection-based sections (projects, blogs): deletes all live docs
// then re-creates them from the defaults collection.
// ============================================

export const resetSectionToDefault = async (section) => {
  if (!isAuthenticated()) throw new Error('Unauthorized: Authentication required');
  if (!checkRateLimit(`resetToDefault_${section}`, 5, 60000)) {
    throw new Error('Rate limit exceeded. Wait before resetting again.');
  }
  if (!db) throw new Error('Firebase not initialized');

  auditLog('RESET_TO_DEFAULT_START', { section });

  try {
    switch (section) {

      case 'about': {
        const data = await getDefaultAboutContent();
        await setDoc(doc(db, LIVE.ABOUT, 'content'), data, { merge: true });
        break;
      }

      case 'contact': {
        const data = await getDefaultContactContent();
        await setDoc(doc(db, LIVE.CONTACT, 'content'), data, { merge: true });
        break;
      }

      case 'socials': {
        const arr = await getDefaultSocials();
        await setDoc(doc(db, LIVE.CONTACT, 'socials'), { items: arr }, { merge: true });
        break;
      }

      case 'services': {
        const arr = await getDefaultServices();
        await setDoc(doc(db, LIVE.SERVICES, 'list'), { items: arr }, { merge: true });
        break;
      }

      case 'timeline': {
        const arr = await getDefaultTimeline();
        await setDoc(doc(db, LIVE.TIMELINE, 'data'), { items: arr }, { merge: true });
        break;
      }

      case 'techStack': {
        const arr = await getDefaultTechStack();
        await setDoc(doc(db, LIVE.TECH_STACK, 'data'), { items: arr }, { merge: true });
        break;
      }

      case 'projects': {
        // Fetch defaults
        const defaultProjects = await getDefaultProjects();
        // Delete all live project docs
        const liveSnap = await getDocs(collection(db, LIVE.PROJECTS));
        for (const d of liveSnap.docs) {
          await deleteDoc(doc(db, LIVE.PROJECTS, d.id));
        }
        // Write defaults to live
        for (const p of defaultProjects) {
          await setDoc(doc(db, LIVE.PROJECTS, p.id), p);
        }
        break;
      }

      case 'blogs': {
        // Fetch defaults
        const defaultBlogList = await getDefaultBlogs();
        // Delete all live blog docs
        const liveSnap = await getDocs(collection(db, LIVE.BLOGS));
        for (const d of liveSnap.docs) {
          await deleteDoc(doc(db, LIVE.BLOGS, d.id));
        }
        // Write defaults to live
        for (const b of defaultBlogList) {
          await setDoc(doc(db, LIVE.BLOGS, b.id), b);
        }
        break;
      }

      default:
        throw new Error(`Unknown section: "${section}"`);
    }

    auditLog('RESET_TO_DEFAULT_COMPLETE', { section, timestamp: new Date().toISOString() });
    return { success: true, message: `"${section}" live data has been reset to defaults.` };
  } catch (error) {
    console.error(`[defaultsManager] Error resetting ${section}:`, error);
    auditLog('RESET_TO_DEFAULT_ERROR', { section, error: error.message });
    throw error;
  }
};
