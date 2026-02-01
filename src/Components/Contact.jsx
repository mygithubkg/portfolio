import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaInstagram, FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Wifi, Clock, Copy, Check } from 'lucide-react';
import emailjs from 'emailjs-com';
import { useData } from '../context/DataContext';

// Icon mapping for string identifiers
const iconMap = {
  FaLinkedin: <FaLinkedin />,
  FaGithub: <FaGithub />,
  FaEnvelope: <FaEnvelope />,
  FaInstagram: <FaInstagram />,
  FaMapMarkerAlt: <FaMapMarkerAlt />
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SUCCESS, ERROR
  const [activeField, setActiveField] = useState(null);
  const [time, setTime] = useState(new Date());

  // Fetch contact data from global context
  const { data, loading } = useData();
  const contactData = data.contact;
  const socials = data.socials;

  // Build contactDetails from fetched data with fallback to default icons
  const contactDetails = contactData ? [
    { 
      icon: iconMap.FaEnvelope || <FaEnvelope />, 
      label: 'EMAIL', 
      value: contactData.email || 'your@email.com', 
      href: `mailto:${contactData.email || 'your@email.com'}` 
    },
    { 
      icon: iconMap.FaMapMarkerAlt || <FaMapMarkerAlt />, 
      label: 'LOCATION', 
      value: contactData.location || 'Your Location', 
      href: '#' 
    }
  ] : [];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    if (!form.name || !form.email || !form.message) {
      alert("Please fill out all fields before transmitting.");
      return;
    }

    setStatus('SENDING');

    // 2. Configuration (Ensure these exist in your .env file)
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID; // e.g. "service_xxx"
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; // e.g. "template_xxx"
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;   // e.g. "user_xxx"

    if (!serviceID || !templateID || !publicKey) {
      console.error("EmailJS Env Variables Missing");
      alert("Configuration Error: EmailJS keys not found. Check console.");
      setStatus('ERROR');
      return;
    }

    // 3. Authentic Sending
    try {
      await emailjs.send(serviceID, templateID, {
        from_name: form.name,
        from_email: form.email,
        message: form.message + " This message is from " + form.email,
        reply_to: form.email,
      }, publicKey);

      setStatus('SUCCESS');
      setForm({ name: '', email: '', message: '' }); // Reset Form
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('IDLE'), 5000);
      
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus('ERROR');
      alert("Transmission Failed. Please try again or email directly.");
    }
  };
  

  return (
    <section className="min-h-screen py-24 bg-[#050505] relative overflow-hidden flex flex-col justify-center">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
           <div>
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="flex items-center gap-2 text-cyan-500 font-mono text-xs mb-4"
              >
                 <Wifi size={14} className="animate-pulse" />
                 <span>UPLINK_ESTABLISHED</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter"
              >
                CONTACT <span className="text-gray-700">ME.</span>
              </motion.h2>
           </div>
           
           {/* Authentic Time/Location Badge */}
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="hidden md:flex flex-col items-end text-right font-mono text-xs text-gray-500"
           >
              <div className="flex items-center gap-2 mb-1">
                 <FaMapMarkerAlt /> Chandigarh, India
              </div>
              <div className="flex items-center gap-2">
                 <Clock size={12} /> {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} IST
              </div>
           </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* --- LEFT COLUMN: THE FORM & DIRECT CONTACTS --- */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-12"
          >
            {/* 1. The Interactive Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono text-xs ${activeField === 'name' || form.name ? '-top-6 text-cyan-500' : 'top-4 text-gray-500'}`}>
                  FULL_NAME *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono text-xs ${activeField === 'email' || form.email ? '-top-6 text-cyan-500' : 'top-4 text-gray-500'}`}>
                  EMAIL_ADDRESS *
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono text-xs ${activeField === 'message' || form.message ? '-top-6 text-cyan-500' : 'top-4 text-gray-500'}`}>
                  MESSAGE_CONTENT *
                </label>
                <textarea 
                  name="message" 
                  rows="4"
                  value={form.message} 
                  onChange={handleChange}
                  onFocus={() => setActiveField('message')}
                  onBlur={() => setActiveField(null)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'SENDING' || status === 'SUCCESS'}
                className={`group relative px-8 py-4 bg-white text-black font-bold text-sm tracking-widest overflow-hidden transition-all w-full md:w-auto
                  ${status === 'SUCCESS' ? 'bg-green-500 text-white' : 'hover:bg-cyan-400'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                   {status === 'IDLE' && <>SEND MESSAGE <FaPaperPlane /></>}
                   {status === 'SENDING' && <>TRANSMITTING... <Wifi className="animate-pulse" /></>}
                   {status === 'SUCCESS' && <>TRANSMISSION COMPLETE <Check /></>}
                   {status === 'ERROR' && <>ERROR: RETRY</>}
                </span>
              </button>
            </form>

            {/* 2. Direct Contact Info (Added Content) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {contactDetails.map((detail, idx) => (
                <a 
                  key={idx} 
                  href={detail.href}
                  className="group flex flex-col gap-2"
                >
                  <div className="text-gray-500 text-[10px] font-mono tracking-widest flex items-center gap-2 group-hover:text-cyan-500 transition-colors">
                    {detail.icon} {detail.label}
                  </div>
                  <div className="text-white font-medium text-sm break-words">
                    {detail.value}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN: THE VISUALIZER & SOCIALS --- */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="flex flex-col gap-8"
          >
             {/* 1. Live JSON Preview */}
             <div className="hidden lg:block relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                   {/* Window Header */}
                   <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500/20" />
                         <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                         <div className="w-3 h-3 rounded-full bg-green-500/20" />
                      </div>
                      <div className="font-mono text-xs text-gray-500">payload_preview.json</div>
                      <Copy className="text-gray-600 w-3 h-3" />
                   </div>

                   {/* Code Content */}
                   <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                      <div className="text-gray-600 mb-2">// Constructing Data Packet...</div>
                      <div>
                         <span className="text-purple-400">const</span> <span className="text-yellow-200">packet</span> <span className="text-white">=</span> <span className="text-blue-300">{'{'}</span>
                      </div>
                      
                      <div className="pl-6">
                         <span className="text-cyan-400">"status"</span>: <span className={status === 'SUCCESS' ? "text-green-400" : "text-yellow-400"}>"{status}"</span>,
                      </div>
                      
                      <div className="pl-6">
                         <span className="text-cyan-400">"sender"</span>: <span className="text-green-300">"{form.name || 'Anonymous'}"</span>,
                      </div>

                      <div className="pl-6">
                         <span className="text-cyan-400">"email"</span>: <span className="text-green-300">"{form.email || 'pending...'}"</span>,
                      </div>

                      <div className="pl-6">
                         <span className="text-cyan-400">"message"</span>: <span className="text-green-300 break-all">"{form.message || '...'}"</span>
                      </div>

                      <div><span className="text-blue-300">{'}'}</span>;</div>
                      
                      {/* Blinking Cursor */}
                      <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-4 bg-cyan-500 inline-block mt-2" 
                      />
                   </div>
                </div>
             </div>

             {/* 2. Social Links */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {socialsLoading ? (
                 <div className="text-center text-gray-500 text-xs">Loading...</div>
               ) : (
                 socials.map((social, i) => {
                   const IconComponent = typeof social.icon === 'string' ? iconMap[social.icon] : social.icon;
                   return (
                     <a 
                       key={i} 
                       href={social.url} 
                       target="_blank" 
                       rel="noreferrer"
                       className="flex items-center gap-3 p-4 border border-white/5 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all group rounded-lg"
                     >
                       <span className="text-gray-400 group-hover:text-cyan-400 text-xl transition-colors">
                         {IconComponent || social.icon}
                       </span>
                       <div>
                         <div className="text-white text-sm font-bold">{social.label}</div>
                         <div className="text-gray-600 text-[10px] font-mono group-hover:text-cyan-500/70">{social.username}</div>
                       </div>
                     </a>
                   );
                 })
               )}
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}