import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui';
import { FaReact, FaNodeJs, FaPython, FaGithub, FaLinkedin, FaArrowRight, FaBrain, FaCloud, FaLayerGroup } from 'react-icons/fa';
import { SiOpenai, SiTypescript, SiNextdotjs, SiTailwindcss, SiPostgresql, SiFirebase, SiExpress } from 'react-icons/si';

// --- AUTHENTIC DATA: TECH STACK (Filtered) ---
const techStack = [
  { icon: <SiOpenai />, name: 'Gemini API', color: '#10a37f' },
  { icon: <FaReact />, name: 'React', color: '#61dafb' },
  { icon: <FaNodeJs />, name: 'Node.js', color: '#8cc84b' },
  { icon: <SiExpress />, name: 'Express.js', color: '#000000' },
  { icon: <SiFirebase />, name: 'Firebase', color: '#ffca28' },
  { icon: <FaPython />, name: 'Python', color: '#3776ab' },
  { icon: <SiTailwindcss />, name: 'Tailwind', color: '#38bdf8' },
];

// --- SUB-COMPONENT: Tech Ticker ---
const TechTicker = () => (
  <div className="w-full overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-sm py-6">
    <div className="flex w-[200%]">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="flex gap-16 pr-16 min-w-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {techStack.map((tech, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-500 group cursor-default">
              <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300" style={{ color: tech.color }}>
                {tech.icon}
              </span>
              <span className="font-mono text-sm font-bold tracking-wider uppercase group-hover:text-white transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  </div>
);

// --- SUB-COMPONENT: Service Card ---
const ServiceCard = ({ icon: Icon, title, desc, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group p-8 bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
        <Icon size={24} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative bg-[#050505] text-white overflow-hidden">

      {/* ==================== SECTOR 1: THE HERO ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">

        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-150px) scale(1.5)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 80%)'
          }}
        />

        {/* Ambient Glows */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
          animate={{ x: mousePosition.x * -0.05, y: mousePosition.y * -0.05 }}
        />

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/5"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
                System Status: Active
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              ARCHITECTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-500 to-gray-200">
                INTELLIGENCE.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 max-w-lg leading-relaxed border-l-2 border-white/10 pl-6"
            >
              Building scalable web ecosystems and intelligent agents.
              Bridging the gap between <span className="text-white">unstructured data</span> and <span className="text-white">structured intelligence</span> using advanced NLP and Generative AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/projects">
                <Button className="bg-white text-black hover:bg-cyan-400 transition-colors px-8 py-4 font-bold rounded-none">
                  VIEW WORK
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400 px-8 py-4 rounded-none group">
                  CONTACT <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Holographic Visual (Code Logic Only - No hard stats) */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-[500px] h-[550px] bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">

              {/* Code Snippet Visual */}
              <div>
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="font-mono text-sm text-gray-400 space-y-3">
                  <p><span className="text-purple-400">const</span> <span className="text-yellow-200">Engineer</span> = <span className="text-blue-300">init</span>({'{'}</p>
                  <p className="pl-4">name: <span className="text-green-300">'Karrtik Gupta'</span>,</p>
                  <p className="pl-4">focus: [<span className="text-green-300">'NLP'</span>, <span className="text-green-300">'GenAI'</span>,<span className="text-green-300">'Cloud'</span>],</p>
                  <p className="pl-4">stack: <span className="text-blue-300">require</span>(<span className="text-green-300">'./Python'</span>,<span className="text-green-300">'./LangChain'</span>,<span className="text-green-300">'./RAG'</span>)</p>
                  <p>{'}'});</p>

                  <p className="mt-4 text-gray-600">// Initializing AI Agents...</p>
                  <p className="text-cyan-400 animate-pulse"> CONNECTION_ESTABLISHED</p>
                </div>
              </div>

              {/* Minimal Footer in Card */}
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
                    <FaCloud />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Cloud Ready</div>
                    <div className="text-gray-500 text-xs">Deployment Protocols Active</div>
                  </div>
                </div>
              </div>

              {/* Image Overlay */}
              <img
                src="/karrtik.png"
                alt="Karrtik"
                className="absolute bottom-0 right-0 w-64 h-64 object-cover opacity-40 grayscale mask-image-gradient-to-t"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTOR 2: AUTHENTIC CAPABILITIES ==================== */}
      {/* Data source: [cite: 21, 30, 87, 88, 28] */}
      <section className="py-24 relative z-10 bg-[#080808]">
        <div className="container mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold mb-4">CORE <span className="text-cyan-400">COMPETENCIES</span></h2>
              <p className="text-gray-400 max-w-md">Developing intelligent applications with a focus on problem-solving and scalability.</p>
            </div>
            <div className="hidden md:block w-32 h-1 bg-gradient-to-r from-cyan-500 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon={FaBrain}
              title="GenAI & LLM Engineering"
              desc="Developing intelligent automation tools and agentic workflows using the LLMs API, LangChain, and RAG architectures. Automating complex tasks to transform unstructured data."
              delay={0}
            />
            <ServiceCard
              icon={FaLayerGroup}
              title="Full-Stack Ecosystems"
              desc="Architecting scalable platforms using NextJS, React 18, Node.js, and Express.js. Implementing real-time synchronization, role-based workflows, and secure databases using Firebase and PostgreSQL."
              delay={0.1}
            />
            <ServiceCard
              icon={FaCloud}
              title="Applied NLP & Research"
              desc="Building end-to-end NLP pipelines to extract and classify unstructured text. Leveraging Hugging Face transformers, cross-encoders, and semantic analysis to construct structured data models."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ==================== SECTOR 3: TECH TICKER ==================== */}
      <section className="py-0">
        <TechTicker />
      </section>

      {/* ==================== SECTOR 4: CORE PHILOSOPHY (Replaces Timeline) ==================== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center md:text-left">ENGINEERING <span className="text-cyan-400">PHILOSOPHY</span></h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="border-l-2 border-cyan-500/50 pl-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">Scalability First</h3>
                <p className="text-gray-400 leading-relaxed">
                  Architecture matters. Whether developing a real-time command center syncing multiple hackathon teams or engineering NLP pipelines to process complex scientific corpora, I build robust systems designed to handle data at scale.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="border-l-2 border-white/10 pl-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">Human-AI Synergy</h3>
                <p className="text-gray-400 leading-relaxed">
                  AI shouldn't just exist; it should solve complex problems. I focus on bridging the gap between ambiguity and clarity, using advanced prompt engineering and GenAI tools to transform unstructured inputs into structured, well-defined technical solutions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="border-l-2 border-white/10 pl-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">Operational Efficiency</h3>
                <p className="text-gray-400 leading-relaxed">
                  From optimizing event logistics to improve onboarding efficiency by 30%, to fine-tuning machine learning models for peak accuracy, I believe in streamlining both organizational and technical workflows to achieve maximum output.
                </p>
              </motion.div>
            </div>

            {/* Abstract Visual Filler */}
            <div className="relative h-full min-h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl" />
              <div className="grid grid-cols-2 gap-4 opacity-50">
                <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center animate-pulse">
                  <span className="font-mono text-xs text-cyan-400">DEPLOY</span>
                </div>
                <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center mt-12">
                  <span className="font-mono text-xs text-white">OPTIMIZE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTOR 5: CURRENT FOCUS (Replaces Stats Grid) ==================== */}
      <section className="py-12 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 font-mono text-sm uppercase tracking-widest">
               // Current Focus
          </div>
          <div className="flex gap-8 text-white font-bold text-lg md:text-xl">
            <span className="hover:text-cyan-400 transition-colors cursor-default">Agentic Workflows</span>
            <span className="text-gray-700">/</span>
            <span className="hover:text-cyan-400 transition-colors cursor-default">Cloud Architecture</span>
            <span className="text-gray-700">/</span>
            <span className="hover:text-cyan-400 transition-colors cursor-default">NLP & RAG</span>
          </div>
        </div>
      </section>

    </div>
  );
}