import { initializeData, getProjects, saveProjects } from './dataManager';

// Default projects data
const defaultProjects = [
  {
    id: '1',
    title: 'E-Summit \'25 Official Platform',
    description: 'Architected the official website and registration portal for PEC\'s flagship E-Summit, built to serve over 2,000 participants. Engineered a scalable backend with Firebase to manage dynamic event content and user registrations, ensuring high availability during peak traffic.',
    link: 'eicpec.in',
    github: '',
    tech: ['React', 'Node.js', 'Firebase'],
    details: 'A full-featured event platform for PEC\'s E-Summit, serving over 2,000 participants.',
    image: '/eic.png',
    category: 'Web Development',
    featured: true,
    year: '2025'
  },
  {
    id: '2',
    title: 'AI Summary Pro GenAI Problem Solver',
    description: 'Leveraged the Gemini GenAI API to transform vague problem statements into structured, clear outputs. Developed sophisticated prompt strategies to handle complex input ambiguities, demonstrating deep problem-solving acumen.',
    link: '',
    github: 'https://github.com/mygithubkg/ai_use_solver',
    tech: ['Python'],
    details: 'A GenAI tool that refines problem statements using the Gemini API and advanced prompt engineering.',
    image: '/solver.png',
    category: 'GenAI',
    featured: true,
    year: '2025'
  },
  {
    id: '3',
    title: 'Personal Portfolio Website',
    description: 'Designed and developed a modern, fully responsive personal portfolio using React and Tailwind CSS. Showcases projects, skills, and resume with smooth animations and scroll-based transitions. Integrated dark mode and deployed using Vercel.',
    link: 'https://karrtikgupta.vercel.app/',
    github: 'https://github.com/mygithubkg/portfolio',
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
    details: 'A showcase of my work, skills, and resume, built with React and Tailwind, featuring smooth animations and dark mode.',
    image: '/portfolio.png',
    category: 'Web Development',
    featured: true,
    year: '2025'
  },
  {
    id: '4',
    title: 'TradeMyTicket – Ticket Reselling Platform',
    description: 'Engineered the backend architecture of a full-stack ticket reselling platform using PostgreSQL for scalable data management and Express.js for RESTful APIs. Implemented secure authentication workflows including user sign-up, login, and session handling. Built auction-style live bidding and instant buy functionality.',
    link: '',
    github: 'https://github.com/mygithubkg/ticket_reselling',
    tech: ['React', 'PostgreSQL', 'Node.js', 'Express', 'JavaScript'],
    details: 'A full-stack ticket reselling platform with live bidding, instant buy, and secure authentication.',
    image: '/trade.png',
    category: 'Web Development',
    featured: true,
    year: '2024'
  },
  {
    id: '5',
    title: 'End-to-End Vehicle & Pedestrian Tracking System',
    description: 'Engineered a complete computer vision pipeline for real-time object segmentation and tracking. This project integrates a custom-trained YOLOv8-Seg model with the ByteTrack algorithm, deployed as an interactive web application using Streamlit. It demonstrates the full MLOps lifecycle, from data annotation on the Labellerr platform to model training and live deployment.',
    link: 'https://vehiclehumantracker1234.streamlit.app/',
    github: 'https://github.com/mygithubkg/Karrtik_Gupta',
    tech: ['Python'],
    details: 'An AI-powered system for segmenting and tracking objects in video streams, deployed as an interactive web app.',
    image: '/vehicle.png',
    category: 'Computer Vision',
    featured: true,
    year: '2025'
  },
  {
    id: '6',
    title: 'Voice-Enabled E-Commerce Platform',
    description: 'Developed a scalable, voice-interactive shopping prototype to improve accessibility. Integrated the Web Speech API for hands-free navigation and real-time cart updates, and included PDF invoice generation.',
    link: '',
    github: 'https://github.com/mygithubkg/voice-ecommerce',
    tech: ['React', 'JavaScript'],
    details: 'An accessible e-commerce prototype with voice navigation and PDF invoice functionality.',
    image: '/voice.png',
    category: 'Web Development',
    featured: false,
    year: '2024'
  },
  {
    id: '7',
    title: 'Heart Disease Predictor',
    description: 'Built a predictive machine learning model to detect the likelihood of heart disease using real-world medical data (UCI dataset). Applied data preprocessing, feature engineering, and model selection (Logistic Regression, Random Forest, SVM) to reach 85% accuracy.',
    link: 'https://github.com/mygithubkg/HeartDiseasePredictor',
    github: 'https://github.com/mygithubkg/HeartDiseasePredictor',
    tech: ['Python', 'Scikit-learn'],
    details: 'A machine learning model for heart disease prediction using real-world data and multiple algorithms.',
    image: '/heart.png',
    category: 'Machine Learning',
    featured: false,
    year: '2025'
  },
  {
    id: '8',
    title: 'Simon Game',
    description: 'Recreated the classic memory-based Simon Game using vanilla JavaScript and jQuery. Implemented dynamic color patterns, progressive difficulty scaling. A fun and challenging browser game that demonstrates core DOM manipulation and event handling skills.',
    link: 'https://mygithubkg.github.io/mysimongame/',
    github: 'https://github.com/mygithubkg/mysimongame',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    details: 'A browser-based Simon Game with dynamic color patterns and progressive difficulty.',
    image: '/simon.png',
    category: 'Game Development',
    featured: false,
    year: '2023'
  }
];

// Initialize data with defaults if localStorage is empty
export const initializeDefaultData = () => {
  initializeData();
  
  const existingProjects = getProjects();
  if (existingProjects.length === 0) {
    saveProjects(defaultProjects);
  }
};
