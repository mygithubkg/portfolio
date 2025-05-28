import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaCss3Alt, FaPython, FaHtml5 } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiScikitlearn } from 'react-icons/si'; // Added SiJavascript and SiScikitlearn

// Correct import for SiFirebase
// const projects = [
//   {
//     title: 'Personal Portfolio',
//     description: 'A modern, responsive portfolio website built with React and Tailwind CSS.',
//     link: 'https://yourportfolio.com',
//     tech: [<FaReact key="react" />, <FaCss3Alt key="css" />],
//   },
//   {
//     title: 'E-commerce Store',
//     description: 'A full-stack e-commerce app with cart, checkout, and Stripe payment integration.',
//     link: '#',
//     tech: [<FaReact key="react" />, <FaNodeJs key="node" />],
//   },
//   {
//     title: 'Blog Platform',
//     description: 'A blog platform supporting markdown and user auth using JWT.',
//     link: '#',
//     tech: [<FaReact key="react" />, <FaNodeJs key="node" />],
//   },
// ];
const projects = [
  {
    title: 'TradeMyTicket – Ticket Reselling Platform',
    description: 'A web app that enables users to resell event tickets through live bidding or instant buy options.',
    link: 'https://github.com/mygithubkg/TradeMyTicket',
    tech: [<FaReact key="react" />, <SiFirebase key="firebase" />, <SiJavascript key="js" />],
  },
  {
    title: 'Heart Disease Predictor',
    description: 'A machine learning model that predicts heart disease using real-world medical datasets with 85% accuracy.',
    link: 'https://github.com/mygithubkg/HeartDiseasePredictor',
    tech: [<FaPython key="python" />, <SiScikitlearn key="sklearn" />],
  },
  {
    title: 'EIC PEC Website',
    description: 'Developed and maintained the official EIC website with event listing, registration forms, and Firebase integration.',
    link: 'https://eic.pec.edu.in', // Use actual if hosted, or GitHub link
    tech: [<FaHtml5 key="html" />, <FaCss3Alt key="css" />, <SiFirebase key="firebase" />],
  },
];
function Projects() {
  return (
    <section id="projects" className="min-h-screen flex flex-col justify-center py-16 bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-cyan-400 mb-14">✨ Projects</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              className="bg-[#1e293b] p-6 rounded-2xl shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center justify-center text-cyan-400 text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex gap-3 text-xl mb-4 text-cyan-300">
                {project.tech.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-cyan-500 hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-400 text-white px-4 py-2 rounded-md font-medium transition"
              >
                View Project
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
