"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaDatabase } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiFirebase, SiPostgresql, SiScikitlearn } from 'react-icons/si';

// Tier is a qualitative self-assessment, not a fabricated percentage.
// "core"        -> daily driver, shipped multiple production projects with it
// "comfortable" -> proficient, used it in real projects, not my primary tool
// "exploring"   -> actively learning / used in smaller or academic projects
type Tier = 'core' | 'comfortable' | 'exploring';

interface Skill {
  name: string;
  icon: React.ReactNode;
  description: string;
  tier: Tier;
}

interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', icon: <FaReact />, tier: 'core', description: 'Building modern, interactive user interfaces' },
      { name: 'JavaScript', icon: <SiJavascript />, tier: 'core', description: 'Full-stack development expertise' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss />, tier: 'core', description: 'Rapid, responsive UI development' },
      { name: 'HTML5', icon: <FaHtml5 />, tier: 'core', description: 'Semantic web development' },
      { name: 'CSS3', icon: <FaCss3Alt />, tier: 'core', description: 'Advanced styling and animations' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Data',
    skills: [
      { name: 'Node.js', icon: <FaNodeJs />, tier: 'core', description: 'Scalable server-side applications' },
      { name: 'Firebase', icon: <SiFirebase />, tier: 'comfortable', description: 'Backend-as-a-Service solutions' },
      { name: 'PostgreSQL', icon: <SiPostgresql />, tier: 'comfortable', description: 'Relational database management' },
      { name: 'Databases', icon: <FaDatabase />, tier: 'comfortable', description: 'Data modeling and optimization' },
    ],
  },
  {
    id: 'ml',
    label: 'ML & Tooling',
    skills: [
      { name: 'Python', icon: <FaPython />, tier: 'comfortable', description: 'Data science and automation' },
      { name: 'Scikit-learn', icon: <SiScikitlearn />, tier: 'exploring', description: 'Machine learning applications' },
    ],
  },
];

const tierLabel: Record<Tier, string> = {
  core: 'CORE',
  comfortable: 'COMFORTABLE',
  exploring: 'EXPLORING',
};

const tierClass: Record<Tier, string> = {
  core: 'border-cyan-400/40 text-cyan-400',
  comfortable: 'border-white/20 text-white/60',
  exploring: 'border-white/10 text-white/40 border-dashed',
};

function TierTag({ tier }: { tier: Tier }) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded-sm ${tierClass[tier]}`}
    >
      {tierLabel[tier]}
    </span>
  );
}

function SkillCard({ skill, idx }: { skill: Skill; idx: number }) {
  return (
    <motion.div
      className="group border border-white/10 hover:border-cyan-400/30 bg-white/[0.02] p-5 sm:p-6 transition-colors duration-300"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl sm:text-3xl flex-shrink-0 text-white/50 group-hover:text-cyan-400 transition-colors duration-300">
          {skill.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white truncate">
              {skill.name}
            </h3>
            <TierTag tier={skill.tier} />
          </div>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
            {skill.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative bg-[#030303]">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400 mb-4">
            /ROOT/SKILLS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Skills that drive <span className="text-cyan-400">innovation</span>
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl">
            A toolkit grouped by how I actually use it — not a mastery bar.
            Core tools I reach for daily, comfortable tools I've shipped with,
            and areas I'm actively growing into.
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="space-y-12 sm:space-y-16 mb-16 sm:mb-20">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-4 sm:mb-5">
                {category.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {category.skills.map((skill, idx) => (
                  <SkillCard key={skill.name} skill={skill} idx={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="border border-white/10 p-6 sm:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400 mb-4">
            /ROOT/CONTACT
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Ready to collaborate?
          </h3>
          <p className="text-white/50 mb-6 max-w-2xl text-sm sm:text-base leading-relaxed">
            I'm always excited to work on new projects and explore cutting-edge
            technologies. Let's discuss how we can bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/contact"
              className="w-full sm:w-auto text-center font-mono text-sm tracking-wide uppercase bg-cyan-400 text-black px-6 py-3 rounded-sm hover:bg-cyan-300 transition-colors"
            >
              Start a Project
            </a>
            <a
              href="/projects"
              className="w-full sm:w-auto text-center font-mono text-sm tracking-wide uppercase border border-white/20 text-white px-6 py-3 rounded-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-colors"
            >
              View My Work
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}