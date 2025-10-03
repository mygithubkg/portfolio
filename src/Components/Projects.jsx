import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaCss3Alt, FaPython, FaHtml5, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiScikitlearn, SiTailwindcss, SiPostgresql, SiNodedotjs, SiExpress, SiTypescript, SiMongodb, SiNextdotjs, SiVercel } from 'react-icons/si';
import { Card, Section, Button } from './ui';

const projects = [
  {
    title: 'E-Summit \'25 Official Platform',
    description:
      'Architected the official website and registration portal for PEC\'s flagship E-Summit, built to serve over 2,000 participants. Engineered a scalable backend with Firebase to manage dynamic event content and user registrations, ensuring high availability during peak traffic.',
    link: 'eicpec.in', // Add live link if available
    github: '', // Add GitHub link if available
    tech: [<FaReact key="react" />, <SiNodedotjs key="node" />, <SiFirebase key="firebase" />],
    details: 'A full-featured event platform for PEC\'s E-Summit, serving over 2,000 participants.',
    image: '/eic.png',
    category: 'Web Development',
    featured: true,
    year: '2025'
  },
  {
     title: 'AI Summary Pro GenAI Problem Solver',
    description:
      'Leveraged the Gemini GenAI API to transform vague problem statements into structured, clear outputs. Developed sophisticated prompt strategies to handle complex input ambiguities, demonstrating deep problem-solving acumen.',
    link: '', //'https://ai-use-solver.onrender.com/', // Add live link if available
    github: 'https://github.com/mygithubkg/ai_use_solver', // Add GitHub link if available
    tech: [<FaPython key="python" />], // Assuming an icon for Gemini
    details: 'A GenAI tool that refines problem statements using the Gemini API and advanced prompt engineering.',
    image: '/solver.png',
    category: 'GenAI',
    featured: true,
    year: '2025'
  },
  {
    title: 'Personal Portfolio Website',
    description:
      'Designed and developed a modern, fully responsive personal portfolio using React and Tailwind CSS. Showcases projects, skills, and resume with smooth animations and scroll-based transitions. Integrated dark mode and deployed using Vercel.',
    link: 'https://karrtikgupta.vercel.app/',
    github: 'https://github.com/mygithubkg/portfolio',
    tech: [<FaReact key="react" />, <SiTailwindcss key="tailwind" />, <SiJavascript key="js" />],
    details: 'A showcase of my work, skills, and resume, built with React and Tailwind, featuring smooth animations and dark mode.',
    image: '/portfolio.png',
    category: 'Web Development',
    featured: true,
    year: '2025'
  },
  {
    title: 'TradeMyTicket – Ticket Reselling Platform',
    description:
      'Engineered the backend architecture of a full-stack ticket reselling platform using PostgreSQL for scalable data management and Express.js for RESTful APIs. Implemented secure authentication workflows including user sign-up, login, and session handling. Built auction-style live bidding and instant buy functionality.',
    link: '',
    github: 'https://github.com/mygithubkg/ticket_reselling',
    tech: [
      <FaReact key="react" />,
      <SiPostgresql key="postgresql" />,
      <SiNodedotjs key="node" />,
      <SiExpress key="express" />,
      <SiJavascript key="js" />
    ],
    details: 'A full-stack ticket reselling platform with live bidding, instant buy, and secure authentication.',
    image: '/trade.png',
    category: 'Web Development',
    featured: true,
    year: '2024'
  },
  {
    title: 'End-to-End Vehicle & Pedestrian Tracking System',
    description:
      'Engineered a complete computer vision pipeline for real-time object segmentation and tracking. This project integrates a custom-trained YOLOv8-Seg model with the ByteTrack algorithm, deployed as an interactive web application using Streamlit. It demonstrates the full MLOps lifecycle, from data annotation on the Labellerr platform to model training and live deployment.',
    link: 'https://vehiclehumantracker1234.streamlit.app/',
    github: 'https://github.com/mygithubkg/Karrtik_Gupta', // Replace with your actual GitHub link
    tech: [
      // <SiPython key="python" />,
      // <SiPytorch key="pytorch" />,
      // <SiOpencv key="opencv" />,
      // <SiStreamlit key="streamlit" />,
      // <SiYolo key="yolo" /> // Assuming a YOLO icon exists
    ],
    details: 'An AI-powered system for segmenting and tracking objects in video streams, deployed as an interactive web app.',
    image: '/vehicle.png', // Replace with your project image path
    category: 'Computer Vision',
    featured: true,
    year: '2025' // Update with the correct year
  },
  {
    title: 'Voice-Enabled E-Commerce Platform',
    description:
      'Developed a scalable, voice-interactive shopping prototype to improve accessibility. Integrated the Web Speech API for hands-free navigation and real-time cart updates, and included PDF invoice generation.',
    link: '',//'https://voice-ecommerce-33wx.onrender.com/', 
    github: 'https://github.com/mygithubkg/voice-ecommerce', 
    tech: [<FaReact key="react" />, <SiJavascript key="js" />], // Assuming an icon for jsPDF
    details: 'An accessible e-commerce prototype with voice navigation and PDF invoice functionality.',
    image: '/voice.png',
    category: 'Web Development',
    featured: false,
    year: '2024'
  },
  {
    title: 'Heart Disease Predictor',
    description:
      'Built a predictive machine learning model to detect the likelihood of heart disease using real-world medical data (UCI dataset). Applied data preprocessing, feature engineering, and model selection (Logistic Regression, Random Forest, SVM) to reach 85% accuracy.',
    link: 'https://github.com/mygithubkg/HeartDiseasePredictor',
    github: 'https://github.com/mygithubkg/HeartDiseasePredictor',
    tech: [<FaPython key="python" />, <SiScikitlearn key="sklearn" />],
    details: 'A machine learning model for heart disease prediction using real-world data and multiple algorithms.',
    image: '/heart.png',
    category: 'Machine Learning',
    featured: false,
    year: '2025'
  },
  {
    title: 'Simon Game',
    description:
      'Recreated the classic memory-based Simon Game using vanilla JavaScript and jQuery. Implemented dynamic color patterns, progressive difficulty scaling. A fun and challenging browser game that demonstrates core DOM manipulation and event handling skills.',
    link: 'https://mygithubkg.github.io/mysimongame/',
    github: 'https://github.com/mygithubkg/mysimongame',
    tech: [<SiJavascript key="js" />, <FaHtml5 key="html" />, <FaCss3Alt key="css" />],
    details: 'A browser-based Simon Game with dynamic color patterns and progressive difficulty.',
    image: '/simon.png',
    category: 'Game Development',
    featured: false,
    year: '2023'
  },
];

const categories = ['All', 'Web Development', 'Machine Learning', 'Game Development'];

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === category));
    }
  };

  // 3D tilt effect handler
  const handleMouseMove = (e, idx) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    card.style.boxShadow = '0 8px 40px 0 rgba(80,200,255,0.18), 0 1.5px 8px 0 rgba(255,0,255,0.10)';
  };
  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = '';
    card.style.boxShadow = '';
  };

  return (
    <Section className="py-16 sm:py-24 lg:py-4 relative overflow-hidden" container={false}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/10 to-background" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-accentLight/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-accent font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Featured Work
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Projects That{' '}
            <span className="bg-gradient-to-r from-accent to-accentLight bg-clip-text text-blue-300">
              Make a Difference
            </span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-textSecondary max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            A collection of my best work, showcasing my passion for creating impactful solutions 
            and my expertise across different technologies and domains.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category
                  ? 'bg-accent text-white shadow-glow'
                  : 'bg-surface/50 text-textSecondary hover:bg-surface/80 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
          layout
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                className="group relative"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ delay: idx * 0.12, duration: 0.7, type: 'spring' }}
                layout
                onHoverStart={() => setHoveredIndex(idx)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <div
                  onMouseMove={e => handleMouseMove(e, idx)}
                  onMouseLeave={handleMouseLeave}
                  className="h-full overflow-visible relative transition-transform duration-300"
                  style={{ willChange: 'transform' }}
                >
                  <Card
                    variant="interactive"
                    className="h-full overflow-hidden relative bg-gradient-to-br from-[#1e293b]/80 via-[#0ea5e9]/40 to-[#a21caf]/60 backdrop-blur-xl border-2 border-fuchsia-400/20 shadow-2xl group"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-xl">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md animate-pulse">
                          Featured
                        </div>
                      )}
                      {/* Year Badge */}
                      <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-fuchsia-400/30">
                        {project.year}
                      </div>
                    </div>
                    {/* Project Content */}
                    <div className="p-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-fuchsia-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-textSecondary text-sm sm:text-base mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech, techIndex) => (
                          <div
                            key={techIndex}
                            className="text-lg sm:text-xl text-sky-400 drop-shadow-glow"
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                      {/* Project Links */}
                      <div className="flex gap-3">
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2  text-sm sm:text-base shadow-md"
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaExternalLinkAlt size={14} className="animate-bounce" />
                          Live Demo
                        </motion.a>
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface/60 text-white rounded-lg hover:bg-surface/90 transition-colors text-sm sm:text-base shadow-md"
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaGithub size={14} className="animate-spin-slow" />
                            Code
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-accent/10 to-accentLight/10 border border-accent/20 rounded-card p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Want to See More?
            </h3>
            <p className="text-textSecondary mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              I'm constantly working on new projects and exploring cutting-edge technologies. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary" size="md" className="w-full sm:w-auto">
                Start a Project
              </Button>
              <Button href="/contact" variant="secondary" size="md" className="w-full sm:w-auto">
                Get In Touch
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-fuchsia-900/80 via-sky-900/80 to-emerald-900/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-[#1e293b]/95 via-[#0ea5e9]/80 to-[#a21caf]/80 border-2 border-fuchsia-400/30 rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                    {selected.title}
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-fuchsia-400 hover:text-white transition-colors text-2xl font-bold animate-pulse"
                    aria-label="Close project details"
                  >
                    ✕
                  </button>
                </div>
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-48 sm:h-56 object-cover rounded-lg mb-6 shadow-lg"
                />
                <p className="text-sky-200 mb-6 text-sm sm:text-base">
                  {selected.details}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tech.map((tech, index) => (
                    <div
                      key={index}
                      className="text-lg sm:text-xl text-emerald-300 drop-shadow-glow"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 text-white rounded-lg hover:from-emerald-400 hover:to-fuchsia-500 hover:via-sky-400 hover:text-black transition-colors shadow-md"
                  >
                    <FaExternalLinkAlt size={14} className="animate-bounce" />
                    View Live Demo
                  </a>
                  {selected.github && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface/60 text-white rounded-lg hover:bg-surface/90 transition-colors shadow-md"
                    >
                      <FaGithub size={14} className="animate-spin-slow" />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
