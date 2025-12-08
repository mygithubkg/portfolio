// Local Storage Keys
const STORAGE_KEYS = {
  PROJECTS: 'portfolio_projects',
  ABOUT: 'portfolio_about',
  SERVICES: 'portfolio_services',
  CONTACT: 'portfolio_contact',
};

// Initialize default data if not exists
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ABOUT)) {
    localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACT)) {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify({}));
  }
};

// Projects CRUD
export const getProjects = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
};

export const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  window.dispatchEvent(new Event('projectsUpdated'));
};

export const addProject = (project) => {
  const projects = getProjects();
  const newProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
};

export const updateProject = (id, updates) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
    saveProjects(projects);
    return projects[index];
  }
  return null;
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  saveProjects(filtered);
  return filtered;
};

// About Content
export const getAboutContent = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ABOUT);
  return data ? JSON.parse(data) : {};
};

export const saveAboutContent = (content) => {
  localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(content));
  window.dispatchEvent(new Event('aboutUpdated'));
};

// Services Content
export const getServicesContent = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

export const saveServicesContent = (services) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  window.dispatchEvent(new Event('servicesUpdated'));
};

// Contact Content
export const getContactContent = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CONTACT);
  return data ? JSON.parse(data) : {};
};

export const saveContactContent = (content) => {
  localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(content));
  window.dispatchEvent(new Event('contactUpdated'));
};

// Export all data (for backup)
export const exportAllData = () => {
  return {
    projects: getProjects(),
    about: getAboutContent(),
    services: getServicesContent(),
    contact: getContactContent(),
    exportedAt: new Date().toISOString(),
  };
};

// Import all data (for restore)
export const importAllData = (data) => {
  if (data.projects) saveProjects(data.projects);
  if (data.about) saveAboutContent(data.about);
  if (data.services) saveServicesContent(data.services);
  if (data.contact) saveContactContent(data.contact);
};
