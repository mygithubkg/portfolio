import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaCss3Alt, FaPython, FaHtml5 } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiScikitlearn ,SiTailwindcss,SiPostgresql, SiNodedotjs, SiExpress
} from 'react-icons/si';

const projects = [
  {
    title: 'EIC PEC Website',
    description:
      'Designed and maintained the official website for EIC PEC, streamlining event listings, real-time updates, and dynamic registration workflows. Integrated Firebase for authentication and form data collection, reducing manual entry effort by 60%. Implemented a responsive design ensuring mobile accessibility.',
    link: 'https://eicpec.in',
    tech: [<FaHtml5 key="html" />, <FaCss3Alt key="css" />, <SiFirebase key="firebase" />],
  },
  {
    title: 'Personal Portfolio Website',
    description:
      'Designed and developed a modern, fully responsive personal portfolio using React and Tailwind CSS. Showcases projects, skills, and resume with smooth animations and scroll-based transitions. Integrated dark mode and deployed using GitHub Pages. Helps build a strong digital presence.',
    link: 'https://portfolio-tau-kohl-30.vercel.app/',
    tech: [<FaReact key="react" />, <SiTailwindcss key="tailwind" />, <SiJavascript key="js" />],
  },
  {
    title: 'Simon Game',
    description:
      'Recreated the classic memory-based Simon Game using vanilla JavaScript and jQuery. Implemented dynamic color patterns, progressive difficulty scaling. A fun and challenging browser game that demonstrates core DOM manipulation and event handling skills.',
    link: 'https://mygithubkg.github.io/mysimongame/',
    tech: [<SiJavascript key="js" />, <FaHtml5 key="html" />, <FaCss3Alt key="css" />],
  },
  {
    title: 'TradeMyTicket – Ticket Reselling Platform',
  description:
    'Engineered the backend architecture of a full-stack ticket reselling platform using PostgreSQL for scalable data management and Express.js for RESTful APIs. Implemented secure authentication workflows including user sign-up, login, and session handling. Built auction-style live bidding and instant buy functionality. Also contributed to UI development with React, focusing on dynamic components and real-time bid updates for seamless user interaction.',
  link: 'https://github.com/mygithubkg/ticket_resellingt',
  tech: [
    <FaReact key="react" />,
    <SiPostgresql key="postgresql" />,
    <SiNodedotjs key="node" />,
    <SiExpress key="express" />,
    <SiJavascript key="js" />
  ],
},
  {
    title: 'Heart Disease Predictor',
    description:
      'Built a predictive machine learning model to detect the likelihood of heart disease using real-world medical data (UCI dataset). Applied data preprocessing, feature engineering, and model selection (Logistic Regression, Random Forest, SVM) to reach 85% accuracy. Deployed the model on a Flask app for interactive predictions.',
    link: 'https://github.com/mygithubkg/HeartDiseasePredictor',
    tech: [<FaPython key="python" />, <SiScikitlearn key="sklearn" />],
  },
  
  
  
];


export default function Projects() {
  return (
    <section id="projects" className="min-h-screen py-20 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-cyan-400 mb-16">✨ Projects</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              className="group relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-3xl shadow-lg hover:shadow-cyan-500/50 transition-transform transform hover:-translate-y-3 duration-300"
              whileHover={{ scale: 1.04 }}
            >
              <div className="absolute top-4 right-4 text-3xl">⚡</div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-3 text-lg text-cyan-300 mb-5">
                {project.tech.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-white transition group-hover:underline underline-offset-4 font-semibold"
              >
                ↗ Explore More
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
