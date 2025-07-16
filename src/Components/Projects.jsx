import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaCss3Alt, FaPython, FaHtml5, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiScikitlearn, SiTailwindcss, SiPostgresql, SiNodedotjs, SiExpress, SiTypescript, SiMongodb, SiNextdotjs, SiVercel } from 'react-icons/si';
import { Card, Section, Button } from './ui';

const projects = [
  {
    title: 'EIC PEC Website',
    description:
      'Designed and maintained the official website for EIC PEC, streamlining event listings, real-time updates, and dynamic registration workflows. Integrated Firebase for authentication and data collection, reducing manual entry effort by 60%. Implemented a responsive design ensuring mobile accessibility.',
    link: 'https://eicpec.in',
    github: 'https://github.com/karrtik/eic-website',
    tech: [<FaHtml5 key="html" />, <FaCss3Alt key="css" />, <SiFirebase key="firebase" />],
    details: 'A full-featured event platform for EIC PEC with real-time updates, Firebase integration, and mobile-first design.',
    image: '/eic.png',
    category: 'Web Development',
    featured: true,
    year: '2024'
  },
  {
    title: 'Personal Portfolio Website',
    description:
      'Designed and developed a modern, fully responsive personal portfolio using React and Tailwind CSS. Showcases projects, skills, and resume with smooth animations and scroll-based transitions. Integrated dark mode and deployed using Vercel.',
    link: 'https://portfolio-tau-kohl-30.vercel.app/',
    github: 'https://github.com/karrtik/portfolio',
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
    link: 'https://github.com/mygithubkg/ticket_reselling',
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
    category: 'Full Stack Web Development',
    featured: true,
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

const categories = ['All', 'Web Development', 'Full Stack', 'Machine Learning', 'Game Development'];

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

  return (
    <Section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden" container={false}>
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
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                layout
                onHoverStart={() => setHoveredIndex(idx)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Card
                  variant="interactive"
                  className="h-full overflow-hidden relative"
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
                      <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    
                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {project.year}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
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
                          className="text-lg sm:text-xl text-accent"
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaExternalLinkAlt size={14} />
                        Live Demo
                      </motion.a>
                      
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface/50 text-white rounded-lg hover:bg-surface/80 transition-colors text-sm sm:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaGithub size={14} />
                        Code
                      </motion.a>
                    </div>
                  </div>
                </Card>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-surface/95 backdrop-blur-md border border-border rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{selected.title}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-textSecondary hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-48 sm:h-56 object-cover rounded-lg mb-6"
                />
                
                <p className="text-textSecondary mb-6 text-sm sm:text-base">
                  {selected.details}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tech.map((tech, index) => (
                    <div
                      key={index}
                      className="text-lg sm:text-xl text-accent"
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <FaExternalLinkAlt size={14} />
                    View Live Demo
                  </a>
                  
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface/50 text-white rounded-lg hover:bg-surface/80 transition-colors"
                  >
                    <FaGithub size={14} />
                    View Code
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
