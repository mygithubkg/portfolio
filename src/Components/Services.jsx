import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaDatabase } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiFirebase, SiPostgresql, SiScikitlearn } from 'react-icons/si';
import { Card, Section, Button } from './ui';

const skills = [
  { name: 'React', icon: <FaReact />, level: 100, color: '#61dafb', description: 'Building modern, interactive user interfaces' },
  { name: 'Node.js', icon: <FaNodeJs />, level: 100, color: '#8cc84b', description: 'Scalable server-side applications' },
  { name: 'JavaScript', icon: <SiJavascript />, level: 100, color: '#f7df1e', description: 'Full-stack development expertise' },
  { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 100, color: '#38bdf8', description: 'Rapid, responsive UI development' },
  { name: 'Python', icon: <FaPython />, level: 100, color: '#3776ab', description: 'Data science and automation' },
  { name: 'HTML5', icon: <FaHtml5 />, level: 100, color: '#e34c26', description: 'Semantic web development' },
  { name: 'CSS3', icon: <FaCss3Alt />, level: 100, color: '#264de4', description: 'Advanced styling and animations' },
  { name: 'Firebase', icon: <SiFirebase />, level: 100, color: '#ffca28', description: 'Backend-as-a-Service solutions' },
  { name: 'PostgreSQL', icon: <SiPostgresql />, level: 100, color: '#336791', description: 'Relational database management' },
  { name: 'Scikit-learn', icon: <SiScikitlearn />, level: 100, color: '#f7931e', description: 'Machine learning applications' },
  { name: 'Databases', icon: <FaDatabase />, level: 100 , color: '#a0aec0', description: 'Data modeling and optimization' },
];

export default function Skills() {
  return (
    <Section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden" container={false}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/10 to-background" />
      <motion.div
        className="absolute top-1/3 left-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-accentLight/5 rounded-full blur-3xl"
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
            Technical Expertise
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Skills That{' '}
            <span className="bg-gradient-to-r from-accent to-accentLight bg-clip-text text-blue-300">
              Drive Innovation
            </span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-textSecondary max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            A comprehensive toolkit of modern technologies and frameworks that enable me to 
            build robust, scalable, and user-friendly applications.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 h-full hover:bg-surface/80 transition-all duration-300">
                <div className="flex items-start gap-4 sm:gap-6">
                  <motion.div
                    className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0"
                    style={{ color: skill.color }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {skill.icon}
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-accent transition-colors">
                        {skill.name}
                      </h3>
                      {/* <span className="text-accent font-semibold text-lg">
                        {skill.level}%
                      </span> */}
                    </div>
                    
                    <p className="text-textSecondary text-xs sm:text-sm mb-3 sm:mb-4">
                      {skill.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="w-full h-2 sm:h-3 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          className="h-2 sm:h-3 rounded-full relative"
                          style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-accent/10 to-accentLight/10 border border-accent/20 rounded-card p-6 sm:p-8 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Ready to Collaborate?
            </h3>
            <p className="text-textSecondary mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              I'm always excited to work on new projects and explore cutting-edge technologies. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary" size="md" className="w-full sm:w-auto">
                Start a Project
              </Button>
              <Button href="/projects" variant="secondary" size="md" className="w-full sm:w-auto">
                View My Work
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
