import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaLaptopCode, FaCompass, FaBrain, FaCloud, FaUsers } from 'react-icons/fa';

const interests = [
  {
    title: 'AI & Machine Learning',
    desc: 'Built and deployed machine learning models using Scikit-learn and OpenCV. Gained hands-on experience in supervised learning, image processing, and data preprocessing. Participated in the Microsoft x AICTE program, delivering impactful solutions for real-world datasets.',
    Icon: FaRobot,
    color: 'indigo'
  },
  {
    title: 'Full-Stack Development',
    desc: 'Engineered responsive and robust full-stack applications using React, Node.js, Firebase, and MySQL. Led the development of TradeMyTicket—a secure platform enabling peer-to-peer ticket reselling with real-time data updates and user authentication.',
    Icon: FaLaptopCode,
    color: 'green'
  },
  {
    title: 'Tech Leadership',
    desc: 'Directed flagship events such as E-Summit’25 and Startup Fair’24 at PEC, empowering the student community with opportunities in entrepreneurship, innovation, and networking. Mentored peers and led multi-disciplinary teams through successful execution.',
    Icon: FaCompass,
    color: 'yellow'
  },
  {
    title: 'Problem Solving & DSA',
    desc: 'Proficient in algorithms and data structures with a focus on writing clean and efficient code in C++ and Python. Actively practice on platforms like LeetCode and Codeforces, with a keen interest in optimizing time and space complexities.',
    Icon: FaBrain,
    color: 'pink'
  },
  {
    title: 'Cloud & DevOps',
    desc: 'Gained practical exposure to cloud services such as Firebase and Microsoft Azure. Deployed scalable web apps with CI/CD pipelines, real-time databases, and cloud functions. Explored DevOps tools to automate deployment and improve system reliability.',
    Icon: FaCloud,
    color: 'cyan'
  },
  {
    title: 'Community & Learning',
    desc: 'Actively engaged with PEC’s EIC, fostering a collaborative and inclusive environment. Contributed to workshops, hackathons, and mentorship programs, promoting a culture of peer learning and continuous growth within the tech ecosystem.',
    Icon: FaUsers,
    color: 'teal'
  }
];

export default function Services() {
  return (
    <section id="interests" className="py-24 bg-[#0a192f] text-white font-inter">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl font-bold text-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          My Interests
        </motion.h2>
        <motion.p
          className="text-center text-gray-400 mb-16 max-w-3xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Blending technology, leadership, and community to deliver impactful solutions and cultivate continuous learning.
        </motion.p>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {interests.map(({ title, desc, Icon, color }, i) => (
            <motion.div
              key={i}
              className={`bg-[#112240] min-h-[320px] flex flex-col justify-between rounded-2xl p-6 shadow-xl border-l-4 border-${color}-400 hover:shadow-2xl transition-shadow duration-300`}
              whileHover={{ rotate: [0, -1, 1, 0], scale: 1.03 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div>
                <div className="flex items-center mb-4">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${color}-500 bg-opacity-20 text-${color}-300 text-2xl`}>
                    <Icon />
                  </span>
                  <h3 className="ml-4 text-2xl font-semibold text-white">{title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
