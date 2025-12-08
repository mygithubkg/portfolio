import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Briefcase, Mail, Terminal, Plus, Trash2, CheckCircle, Cpu, Database } from 'lucide-react';
import {
  getAboutContent,
  saveAboutContent,
  getServicesContent,
  saveServicesContent,
  getContactContent,
  saveContactContent,
} from '../../utils/dataManager';

// Reusable "Tech" Input Component
const TechInput = ({ label, value, onChange, placeholder, type = "text", rows }) => (
  <div className="group relative mb-6">
    <label className="block text-xs font-mono text-gray-500 mb-2 group-focus-within:text-cyan-500 transition-colors uppercase tracking-widest">
      // {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows || 4}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border-b border-white/20 p-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors resize-none placeholder-gray-700"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border-b border-white/20 p-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder-gray-700"
      />
    )}
    <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-500 group-focus-within:w-full transition-all duration-500" />
  </div>
);

const ContentManager = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [statusLog, setStatusLog] = useState(null); // For success messages
  
  // State
  const [aboutContent, setAboutContent] = useState({ title: '', subtitle: '', description: '', skills: '' });
  const [servicesContent, setServicesContent] = useState([]);
  const [contactContent, setContactContent] = useState({ email: '', phone: '', location: '', availability: '' });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    setAboutContent(getAboutContent());
    setServicesContent(getServicesContent());
    setContactContent(getContactContent());
  };

  const handleSave = (type) => {
    setStatusLog(`UPLOADING_${type.toUpperCase()}_DATA...`);
    setTimeout(() => {
      setStatusLog(`${type.toUpperCase()}_PATCH_SUCCESSFUL`);
      setTimeout(() => setStatusLog(null), 3000);
    }, 800);
  };

  const onSaveAbout = (e) => { e.preventDefault(); saveAboutContent(aboutContent); handleSave('about'); };
  const onSaveServices = (e) => { e.preventDefault(); saveServicesContent(servicesContent); handleSave('services'); };
  const onSaveContact = (e) => { e.preventDefault(); saveContactContent(contactContent); handleSave('contact'); };

  // Service Helpers
  const handleAddService = () => setServicesContent([...servicesContent, { id: Date.now(), title: '', description: '', icon: '' }]);
  const handleRemoveService = (id) => setServicesContent(servicesContent.filter((s) => s.id !== id));
  const handleUpdateService = (id, field, value) => {
    setServicesContent(servicesContent.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const sections = [
    { id: 'about', label: 'BIO_DATA', icon: FileText },
    { id: 'services', label: 'MODULES', icon: Cpu },
    { id: 'contact', label: 'UPLINKS', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-mono">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 text-xs mb-2">
              <Terminal size={14} />
              <span>ADMIN_ACCESS_GRANTED</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              SYSTEM <span className="text-gray-600">CONFIGURATION</span>
            </h1>
          </div>
          
          {/* Status Log Box */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              {statusLog ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-green-400 bg-green-900/10 border border-green-500/20 px-4 py-2 rounded"
                >
                  <CheckCircle size={14} />
                  <span className="text-xs">{statusLog}</span>
                </motion.div>
              ) : (
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  WAITING_FOR_INPUT
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs text-gray-500 mb-4 pl-2">SELECT_PARTITION</div>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 border-l-2 ${
                    isActive 
                      ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400' 
                      : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* --- MAIN EDITOR PANEL --- */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-xl shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Scanline */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

              {/* === ABOUT SECTION === */}
              {activeSection === 'about' && (
                <form onSubmit={onSaveAbout}>
                  <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
                    <FileText className="text-cyan-500" size={18} />
                    <h2 className="text-lg font-bold text-white">EDIT_BIO_DATA</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <TechInput 
                      label="DISPLAY_TITLE" 
                      value={aboutContent.title} 
                      onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })} 
                      placeholder="e.g. About Me"
                    />
                    <TechInput 
                      label="SUBTITLE_ROLE" 
                      value={aboutContent.subtitle} 
                      onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })} 
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>

                  <TechInput 
                    label="CORE_DESCRIPTION" 
                    value={aboutContent.description} 
                    onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })} 
                    type="textarea"
                    placeholder="Enter main biography..."
                  />

                  <TechInput 
                    label="SKILL_MATRIX (CSV)" 
                    value={aboutContent.skills} 
                    onChange={(e) => setAboutContent({ ...aboutContent, skills: e.target.value })} 
                    placeholder="React, Node, AI, etc."
                  />

                  <div className="mt-8 flex justify-end">
                    <SaveButton label="COMMIT_CHANGES" />
                  </div>
                </form>
              )}

              {/* === SERVICES SECTION === */}
              {activeSection === 'services' && (
                <form onSubmit={onSaveServices}>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Cpu className="text-cyan-500" size={18} />
                      <h2 className="text-lg font-bold text-white">SYSTEM_MODULES</h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors border border-cyan-500/20 rounded"
                    >
                      <Plus size={14} /> NEW_MODULE
                    </button>
                  </div>

                  <div className="space-y-6">
                    {servicesContent.map((service, index) => (
                      <div key={service.id} className="group border border-white/10 bg-black/20 p-6 rounded relative hover:border-white/20 transition-colors">
                        <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gray-800 group-hover:bg-cyan-500 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs text-gray-600 font-mono">MODULE_0{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(service.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <TechInput 
                            label="MODULE_NAME" 
                            value={service.title} 
                            onChange={(e) => handleUpdateService(service.id, 'title', e.target.value)} 
                          />
                          <TechInput 
                            label="ICON_KEY" 
                            value={service.icon} 
                            onChange={(e) => handleUpdateService(service.id, 'icon', e.target.value)} 
                          />
                        </div>
                        <TechInput 
                          label="FUNCTION_DESC" 
                          value={service.description} 
                          onChange={(e) => handleUpdateService(service.id, 'description', e.target.value)} 
                          type="textarea"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>

                  {servicesContent.length > 0 && (
                    <div className="mt-8 flex justify-end">
                      <SaveButton label="UPDATE_MODULES" />
                    </div>
                  )}
                </form>
              )}

              {/* === CONTACT SECTION === */}
              {activeSection === 'contact' && (
                <form onSubmit={onSaveContact}>
                  <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
                    <Database className="text-cyan-500" size={18} />
                    <h2 className="text-lg font-bold text-white">UPLINK_CONFIG</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <TechInput 
                      label="CONTACT_EMAIL" 
                      value={contactContent.email} 
                      onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })} 
                    />
                    <TechInput 
                      label="PHONE_NO" 
                      value={contactContent.phone} 
                      onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })} 
                    />
                  </div>
                  
                  <TechInput 
                    label="PHYSICAL_LOCATION" 
                    value={contactContent.location} 
                    onChange={(e) => setContactContent({ ...contactContent, location: e.target.value })} 
                  />
                  
                  <TechInput 
                    label="CURRENT_STATUS" 
                    value={contactContent.availability} 
                    onChange={(e) => setContactContent({ ...contactContent, availability: e.target.value })} 
                  />

                  <div className="mt-8 flex justify-end">
                    <SaveButton label="SYNC_CONTACT_INFO" />
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for uniform buttons
const SaveButton = ({ label }) => (
  <button
    type="submit"
    className="flex items-center gap-2 bg-white text-black px-6 py-3 font-bold text-xs tracking-widest hover:bg-cyan-400 transition-colors"
  >
    <Save size={16} />
    {label}
  </button>
);

export default ContentManager;