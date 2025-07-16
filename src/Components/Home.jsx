import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Section, Card } from './ui';
import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiFirebase, SiPostgresql, SiMongodb, SiTypescript, SiNextdotjs, SiVercel } from 'react-icons/si';
import { TbBrandVscode, TbBrandFigma } from 'react-icons/tb';

const techStack = [
  { icon: <FaReact />, name: 'React', color: '#61dafb', category: 'Frontend' },
  { icon: <SiJavascript />, name: 'JavaScript', color: '#f7df1e', category: 'Language' },
  { icon: <SiTypescript />, name: 'TypeScript', color: '#3178c6', category: 'Language' },
  { icon: <FaNodeJs />, name: 'Node.js', color: '#8cc84b', category: 'Backend' },
  { icon: <SiTailwindcss />, name: 'Tailwind', color: '#38bdf8', category: 'Styling' },
  { icon: <FaPython />, name: 'Python', color: '#3776ab', category: 'Language' },
  { icon: <SiFirebase />, name: 'Firebase', color: '#ffca28', category: 'Backend' },
  { icon: <SiPostgresql />, name: 'PostgreSQL', color: '#336791', category: 'Database' },
  { icon: <SiMongodb />, name: 'MongoDB', color: '#00ed64', category: 'Database' },
  { icon: <SiNextdotjs />, name: 'Next.js', color: '#000000', category: 'Framework' },
  { icon: <SiVercel />, name: 'Vercel', color: '#000000', category: 'Deployment' },
  { icon: <TbBrandFigma />, name: 'Figma', color: '#f24e1e', category: 'Design' },
];

const socialLinks = [
  { icon: <FaGithub />, href: 'https://github.com/mygithubkg', label: 'GitHub' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/karrtik-gupta/', label: 'LinkedIn' },
];

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center justify-center relative" container={false} fullHeight>
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-background via-surface/20 to-background"
          style={{ y }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 sm:w-32 sm:h-32 bg-accent/10 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 sm:w-48 sm:h-48 bg-accentLight/10 rounded-full blur-xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-accent/5 rounded-full blur-lg"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Content */}
          <motion.div
            className="flex-1 text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm sm:text-lg font-medium mb-4 sm:mb-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              👋 Hello, I'm Karrtik
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-white mb-4 sm:mb-7 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Turning Ideas into{' '}
              <span className="bg-gradient-to-r from-accent via-accentLight to-accent bg-clip-text text-blue-300">
                Interactive Reality
              </span>
            </motion.h1>
            
            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-textSecondary mb-6 sm:mb-10 max-w-4xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Full-stack developer and AI enthusiast crafting modern web experiences. 
              I build scalable applications that solve real-world problems with cutting-edge technology.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-6 sm:mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/projects">
                <Button variant="gradient" size="lg" className="group w-full sm:w-auto">
                  View My Work
                  <motion.span
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Let's Connect
                </Button>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex justify-center lg:justify-start gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-4 bg-surface/50 backdrop-blur-sm border border-border rounded-xl hover:bg-surface/80 hover:border-accent/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <span className="text-xl sm:text-2xl text-accent">{social.icon}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-accentLight rounded-full blur-2xl opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="relative"
                animate={{ 
                  rotateY: [0, 5, 0],
                  rotateX: [0, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <motion.img
                  src="/karrtik.png"
                  alt="Karrtik Gupta"
                  className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-full shadow-2xl ring-4 ring-accent/20 ring-offset-4 ring-offset-background"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transform: `perspective(1000px) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.01}deg)`
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* About Section */}
      <Section className="py-16 sm:py-24 lg:py-32 relative" container={false}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <motion.div
                className="text-accent font-semibold mb-4 sm:mb-6 text-lg sm:text-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                About Me
              </motion.div>
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Building the Future,{' '}
                <span className="text-accent">One Line at a Time</span>
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-textSecondary mb-8 sm:mb-10 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                I'm a passionate full-stack developer currently pursuing B.Tech in ECE with a minor in AI at PEC Chandigarh. 
                My journey in tech started with curiosity and has evolved into a love for creating impactful solutions.
                Whether it's crafting responsive UIs, building scalable backends, or training AI models, 
                I approach every project with enthusiasm and attention to detail.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/about">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Learn More About Me
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className="bg-surface/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 text-center hover:bg-surface/80 transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3" style={{ color: tech.color }}>
                      {tech.icon}
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base">{tech.name}</div>
                    <div className="text-textSecondary text-xs sm:text-sm mt-1 sm:mt-2">{tech.category}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 sm:py-20 relative" container={false}>
        <motion.div
          className="max-w-4xl mx-auto text-center px-4 sm:px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ready to Build Something{' '}
            <span className="text-accent">Amazing?</span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-textSecondary mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Let's collaborate on your next project and bring your ideas to life.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/projects">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                View My Work
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get In Touch
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}