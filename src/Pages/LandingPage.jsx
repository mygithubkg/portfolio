import React from 'react';
import Layout from '../Components/Layout';
import { Link } from 'react-router-dom';
import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss } from 'react-icons/si';
import { Button, Card } from '../Components/ui';

export default function LandingPage() {
  return (
    <Layout>
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-24 bg-background text-text">
        {/* Hero Preview */}
        <section id="hero" className="flex flex-col items-center text-center py-16 min-h-screen bg-background text-text">
          <img src="/karrtik.png" alt="Profile" className="w-32 h-32 rounded-full shadow-xl mb-4" />
          <h1 className="text-4xl font-extrabold mb-2 text-accent">Karrtik Gupta</h1>
          <h2 className="text-xl font-semibold mb-2 text-textSecondary">Aspiring Software Developer | Full-Stack Engineer</h2>
          <p className="text-textSecondary mb-6 max-w-xl">Turning Ideas into Interactive Reality. I build modern, beautiful, and performant web experiences.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/projects">
              <Button variant="primary" size="md">View My Projects</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="md">Contact Me</Button>
            </Link>
          </div>
        </section>
        {/* About Preview */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-accent">About Me</h2>
          <p className="text-textSecondary mb-4">Hi! I'm Karrtik, a full-stack web developer and AI enthusiast currently pursuing B.Tech in ECE with a minor in AI at PEC Chandigarh. I love building scalable web apps and smart AI solutions using modern technologies.</p>
          <Link to="/about">
            <Button variant="ghost" size="sm">Read More</Button>
          </Link>
        </Card>
        {/* Skills Preview */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-accent">Skills</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <span className="flex items-center gap-2 bg-accent text-white px-3 py-1 rounded-full font-semibold"><FaReact /> React</span>
            <span className="flex items-center gap-2 bg-accent text-white px-3 py-1 rounded-full font-semibold"><SiJavascript /> JavaScript</span>
            <span className="flex items-center gap-2 bg-accent text-white px-3 py-1 rounded-full font-semibold"><FaNodeJs /> Node.js</span>
            <span className="flex items-center gap-2 bg-accent text-white px-3 py-1 rounded-full font-semibold"><SiTailwindcss /> Tailwind</span>
            <span className="flex items-center gap-2 bg-accent text-white px-3 py-1 rounded-full font-semibold"><FaPython /> Python</span>
          </div>
          <Link to="/services">
            <Button variant="ghost" size="sm">See All Skills</Button>
          </Link>
        </Card>
        {/* Projects Preview */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-accent">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-surface rounded-xl shadow p-4 text-left">
              <h3 className="font-bold text-lg text-accent mb-1">EIC PEC Website</h3>
              <p className="text-textSecondary text-sm mb-2">Official website for EIC PEC with event listings, real-time updates, and Firebase integration.</p>
              <div className="flex gap-2 text-accent text-lg"><FaHtml5 /><FaCss3Alt /><FaReact /></div>
            </div>
            <div className="bg-surface rounded-xl shadow p-4 text-left">
              <h3 className="font-bold text-lg text-accent mb-1">Personal Portfolio Website</h3>
              <p className="text-textSecondary text-sm mb-2">Modern, responsive portfolio using React and Tailwind CSS. Smooth animations and dark mode.</p>
              <div className="flex gap-2 text-accent text-lg"><FaReact /><SiTailwindcss /><SiJavascript /></div>
            </div>
          </div>
          <Link to="/projects">
            <Button variant="ghost" size="sm">See All Projects</Button>
          </Link>
        </Card>
        {/* Contact Preview */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-accent">Contact</h2>
          <div className="flex flex-col items-center gap-2 mb-4">
            <a href="mailto:karrtikgupta9@gmail.com" className="text-accent font-semibold flex items-center gap-2">Email</a>
            <a href="https://www.linkedin.com/in/karrtik-gupta/" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold flex items-center gap-2">LinkedIn</a>
            <a href="https://github.com/mygithubkg" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold flex items-center gap-2">GitHub</a>
          </div>
          <Link to="/contact">
            <Button variant="ghost" size="sm">Contact Me</Button>
          </Link>
        </Card>
      </main>
    </Layout>
  );
} 