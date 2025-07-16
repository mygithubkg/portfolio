import React from 'react';
import { motion } from 'framer-motion';
import { Card, Section } from './ui';

const timeline = [
  {
    year: '2023–2025',
    title: 'B.Tech, ECE ',
    place: 'PEC Chandigarh',
    desc: 'Pursuing B.Tech in Electronics & Communication Engineering with a minor in Artificial Intelligence.'
  },
  {
    year: '2023–Present',
    title: 'Full Stack Developer',
    place: 'Freelance & Open Source',
    desc: 'Building scalable web apps, contributing to open source, and exploring new tech.'
  },
  {
    year: '2024-Present',
    title: 'AI/ML Projects',
    place: 'Personal & Academic',
    desc: 'Developed ML models for real-world problems, including heart disease prediction.'
  },
];

const techStack = [
  'React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'Firebase', 'MySQL', 'MongoDB', 'Git', 'GitHub', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'Azure AI',
];

export default function About() {
  return (
    <Section maxWidth="4xl" className="py-16 sm:py-24 lg:py-32">
      <div className="relative z-10 w-full text-center flex flex-col items-center gap-8 sm:gap-12">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>
        
        {/* Timeline */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 mb-6 sm:mb-8">
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="w-full lg:w-80"
            >
              <Card className="p-4 sm:p-6 w-full text-left relative">
                <div className="absolute -top-4 sm:-top-6 left-4 sm:left-6 bg-accent text-white px-3 sm:px-4 py-1 rounded-full text-xs font-bold shadow-sm">
                  {item.year}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-accent mb-1">{item.title}</h3>
                <div className="text-xs sm:text-sm text-textSecondary mb-2">{item.place}</div>
                <div className="text-textSecondary text-xs sm:text-sm">{item.desc}</div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Avatar */}
        <motion.img
          src="/karrtik.png"
          alt="Avatar"
          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full shadow-xl ring-2 ring-accent ring-offset-2 ring-offset-background mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        />
        
        <motion.p
          className="text-base sm:text-lg md:text-xl text-textSecondary mb-8 sm:mb-10 leading-relaxed px-2 sm:px-4 md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Hi! I'm <span className="font-semibold text-white">Karrtik</span>, a full-stack web developer and AI enthusiast currently pursuing B.Tech in ECE with a minor in AI at PEC Chandigarh. I specialize in building scalable web applications and smart AI solutions using modern technologies. Whether it's crafting responsive UIs or training predictive models, I love turning ideas into real-world tech experiences. Let's build something impactful together!
        </motion.p>
        
        {/* Tech Stack */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4"
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
              className="bg-surface text-text px-3 sm:px-4 py-2 text-xs sm:text-sm lg:text-base rounded-full font-semibold shadow-sm border border-border hover:bg-accent hover:text-white transition cursor-pointer"
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
