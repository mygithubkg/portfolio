import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, History, User, Code, Share2 } from 'lucide-react';

// --- AUTHENTIC DATA: FROM YOUR INPUT ---
const timeline = [
  {
    year: '2025',
    title: 'Campus Ambassador',
    place: 'Innovation Mission, Punjab (IMP)',
    desc: 'Selected to represent IM Punjab. Bridging the gap between the student body and the startup ecosystem through outreach and event management.',
    icon: <Share2 size={16} />
  },
  {
    year: '2023 – Present',
    title: 'Executive Board',
    place: 'Entrepreneurship Cell, PEC',
    desc: 'Co-leading a prominent student organization. Orchestrated 2 E-Summits and 2 Startup Fairs, managing footfall of 2000+ attendees.',
    icon: <User size={16} />
  },
  {
    year: 'May 2025 – July 2025',
    title: 'AI Intern',
    place: 'Edunet Foundation (Microsoft Initiative)',
    desc: 'Executed end-to-end AI workflows on Azure. specialized in data preprocessing and model training for enterprise use cases.',
    icon: <Cpu size={16} />
  },
  {
    year: '2023 – 2027',
    title: 'B.Tech Electronics & Comm.',
    place: 'PEC Chandigarh',
    desc: 'Specializing in Hardware-Software intersection. Minor in Artificial Intelligence (GPA: 10.0).',
    icon: <Terminal size={16} />
  }
];

const techStack = [
  'React', 'Node.js', 'Next.js', 'TypeScript', 
  'Azure AI', 'Python', 'Gemini API', 'Scikit-learn',
  'Firebase', 'PostgreSQL', 'Tailwind', 'Git'
];

export default function About() {
  return (
    <section className="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER: IDENTITY VERIFICATION --- */}
        <div className="mb-20 border-b border-white/10 pb-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex items-center gap-2 text-cyan-500 font-mono text-xs mb-2"
           >
             <User size={14} />
             <span>/ IDENTITY_VERIFICATION / BIO_DATA</span>
           </motion.div>
           <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
             The <span className="text-gray-600">Developer</span>
           </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* --- LEFT COL: PHOTO & BIO (4 Cols) --- */}
          <div className="lg:col-span-5 space-y-8">
            {/* Photo Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square w-full max-w-sm mx-auto lg:mx-0 bg-[#0a0a0a] border border-white/10 p-2 rounded-lg"
            >
               {/* Decorative Scanner Corners */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 z-20" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 z-20" />
               
               <div className="relative h-full w-full overflow-hidden rounded bg-gray-900 group">
                  <img 
                    src="/karrtik.png" 
                    alt="Karrtik Gupta"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:4px_4px] opacity-20 pointer-events-none" />
               </div>

               {/* ID Badge Data */}
               <div className="mt-4 flex justify-between items-end font-mono text-xs text-gray-500">
                  <div>
                    <div className="text-white font-bold">KARRTIK GUPTA</div>
                    <div>ID: DEV_001</div>
                  </div>
                  <div className="text-cyan-500">STATUS: ONLINE</div>
               </div>
            </motion.div>

            {/* Bio Text */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-gray-400 leading-relaxed space-y-4 text-sm md:text-base"
            >
              <p>
                <strong className="text-white">I don't just write code; I engineer systems.</strong> 
                My journey began at <span className="text-cyan-400">PEC Chandigarh</span>, exploring the intersection of hardware and intelligence.
              </p>
              <p>
                From organizing massive tech summits to training custom AI models, I thrive in high-stakes environments where precision matters. I believe technology is only as good as the problem it solves.
              </p>
            </motion.div>

            {/* Tech Stack Grid */}
            <div>
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Code size={16} className="text-cyan-500" />
                 TECHNICAL ARSENAL
               </h3>
               <div className="grid grid-cols-3 gap-2">
                 {techStack.map((tech, i) => (
                   <div key={i} className="bg-white/5 border border-white/5 px-3 py-2 text-xs font-mono text-gray-300 text-center hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                     {tech}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* --- RIGHT COL: TIMELINE (8 Cols) --- */}
          <div className="lg:col-span-7">
             <div className="flex items-center gap-2 mb-8 text-cyan-500 font-mono text-xs">
                <History size={14} />
                <span>/ SYSTEM_LOGS / EXPERIENCE</span>
             </div>

             <div className="relative border-l border-white/10 ml-3 space-y-12">
                {timeline.map((item, index) => (
                   <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12 group"
                   >
                      {/* Timeline Node */}
                      <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-[#050505] border border-gray-600 group-hover:border-cyan-500 group-hover:bg-cyan-500 transition-colors rotate-45" />
                      
                      {/* Content Card */}
                      <div className="flex flex-col gap-1 mb-2">
                         <span className="font-mono text-cyan-500 text-xs tracking-wider">{item.year}</span>
                         <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                           {item.title}
                         </h3>
                         <span className="text-sm text-gray-400 font-medium">{item.place}</span>
                      </div>
                      
                      <p className="text-gray-500 text-sm leading-relaxed max-w-lg border-l-2 border-white/5 pl-4 group-hover:border-cyan-500/30 transition-colors">
                         {item.desc}
                      </p>
                   </motion.div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}