import React from 'react';
import { motion } from 'framer-motion';
import { Card, Section } from './ui';

const timeline = [
  {
    year: 'March 2025 – August 2025',
    title: 'Campus Ambassador',
    place: 'Innovation Mission, Punjab (IMP)',
    desc: 'Selected to represent IM Punjab on campus. Responsible for promoting key events and workshops, enhancing my communication and networking skills by acting as a liaison between the student body and the IM outreach team.'
  },
  {
    year: '2023 – Present',
    title: 'EB, Entrepreneurship Cell',
    place: 'Punjab Engineering College, Chandigarh',
    desc: 'Co-leading a prominent student organization to foster innovation on campus. Organized and managed two E-Summits and two Startup Fairs, featuring 20+ startups and attracting over 2000+ attendees.'
  },
  {
    year: '2024–Present',
    title: 'AI & Machine Learning Developer',
    place: 'Personal & Academic',
    desc: 'Developing and training machine learning models to solve complex challenges. My work involves data preprocessing, feature engineering, and implementing algorithms for projects like predictive health diagnostics.'
  },
  {
    year: '2024–Present',
    title: 'Full Stack Developer',
    place: 'Freelance & Open Source',
    desc: 'Engineering end-to-end web applications using the Full stack (MongoDB,PostGreSQL Express, React, Node.js). Focused on creating responsive UIs and robust, scalable backends.'
  },
  {
    year: '2023–2027',
    title: 'B.Tech in Electronics & Communication',
    place: 'PEC Chandigarh',
    desc: 'Specializing in the intersection of hardware and software, with a focused minor in Artificial Intelligence to build intelligent, data-driven systems.'
  },
  {
    year: 'May 2025 – July 2025',
    title: 'AI Intern',
    place: 'Edunet Foundation (Microsoft & AICTE Initiative)',
    desc: 'Worked on Azure AI, build project , learn concepts of AI and ML.'
  }
];

const techStack = [
  'React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'Firebase', 'MySQL', 'MongoDB', 'Git', 'GitHub', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'Azure AI',
];

export default function About() {
  return (
    <Section maxWidth="4xl" className="py-1 sm:py-2 lg:py-4">
      <div className="relative z-10 w-full flex flex-col items-center gap-4 sm:gap-4">
        {/* New Heading */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-1 sm:mb-4 bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-glow"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          My Journey & Vision
        </motion.h2>

        {/* About Me Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full justify-center">
          {/* Image */}
          <motion.img
            src="/karrtik.png"
            alt="Karrtik's portrait"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #f472b6 0%, #38bdf8 100%)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
          {/* Two Paragraphs */}
          <div className="flex-1 text-left">
            <motion.p
              className="text-lg sm:text-xl md:text-2xl font-medium mb-4 bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Hi, I’m Karrtik — a passionate developer, innovator, and lifelong learner. My journey began at PEC Chandigarh, where I dove into Electronics & Communication Engineering and discovered my love for building things that matter.
            </motion.p>
            <motion.p
              className="text-base sm:text-lg leading-relaxed text-emerald-200"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              From leading student teams and organizing tech events to developing full-stack web apps and AI solutions, I thrive at the intersection of creativity and technology. I believe in using code to solve real-world problems and inspire others to build, learn, and grow.
            </motion.p>
          </div>
        </div>

        {/* Timeline Feature - Redesigned */}
        <div className="w-full max-w-3xl mx-auto mt-8">
          <div className="relative border-l-4 border-fuchsia-400/70 pl-8">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                className="mb-12 last:mb-0 relative"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.7 }}
              >
                {/* Timeline Dot */}
                <span className="absolute -left-5 top-2 w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-400 via-sky-400 to-emerald-400 border-4 border-background shadow-lg flex items-center justify-center animate-pulse">
                  <span className="w-2.5 h-2.5 bg-white rounded-full block"></span>
                </span>
                <Card className="bg-gradient-to-br from-[#1e293b] via-[#0ea5e9]/80 to-[#a21caf]/80 p-6 shadow-2xl border-2 border-fuchsia-400/30 hover:scale-[1.03] transition-transform">
                  <div className="text-xs font-bold mb-1 bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">{item.year}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.title}</h3>
                  <div className="text-sm text-sky-200 mb-2">{item.place}</div>
                  <div className="text-emerald-200 text-sm">{item.desc}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4 mt-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {techStack.map((tech, idx) => (
            <motion.span
              key={idx}
              className="bg-sky-500 text-slate-900 font-semibold px-4 py-2 rounded-full shadow-lg shadow-sky-500/40 hover:shadow-xl hover:shadow-sky-500/60 hover:-translate-y-0.5 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
