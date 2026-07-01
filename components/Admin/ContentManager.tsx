"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Mail, Terminal, Plus, Trash2, CheckCircle, Cpu, RotateCcw } from 'lucide-react';
import {
  getAboutContent, saveAboutContent,
  getServicesContent, saveServicesContent,
  getContactContent, saveContactContent,
} from '@/lib/utils/dataManager';
import {
  getDefaultAboutContent, saveDefaultAboutContent,
  getDefaultServices, saveDefaultServices,
  getDefaultContactContent, saveDefaultContactContent,
  resetSectionToDefault,
} from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';

// ── Constants ─────────────────────────────────────────────────────────────────
const LIVE_TAB     = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
const DEFAULT_TAB  = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
const INACTIVE_TAB = 'text-gray-500 hover:text-white border-transparent';

// ── Shared input component ────────────────────────────────────────────────────
const TechInput = ({ label, value, onChange, placeholder, type = 'text', rows }: any) => (
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

const SaveButton = ({ label }: any) => (
  <button type="submit"
    className="flex items-center gap-2 bg-white text-black px-6 py-3 font-bold text-xs tracking-widest hover:bg-cyan-400 transition-colors">
    <Save size={16} /> {label}
  </button>
);

// ── Mode Toggle ───────────────────────────────────────────────────────────────
const ModeToggle = ({ mode, setMode }: any) => (
  <div className="flex gap-1 bg-white/5 border border-white/10 p-1 mb-6">
    {[['live', '⬤ LIVE_DATA', LIVE_TAB], ['defaults', '◎ DEFAULTS', DEFAULT_TAB]].map(([val, label, active]) => (
      <button key={val} onClick={() => setMode(val)}
        className={`px-4 py-1.5 text-xs font-mono transition-all border ${mode === val ? active : INACTIVE_TAB}`}>
        {label}
      </button>
    ))}
  </div>
);

// ── ContentManager ────────────────────────────────────────────────────────────
const ContentManager = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [mode, setMode] = useState('live');
  const [statusLog, setStatusLog] = useState<string | null>(null);

  // Live state
  const [aboutContent, setAboutContent]     = useState({ title: '', subtitle: '', description: '', skills: '' });
  const [servicesContent, setServicesContent] = useState<any[]>([]);
  const [contactContent, setContactContent] = useState({ email: '', phone: '', location: '', availability: '' });

  // Defaults state (loaded when mode switches to 'defaults')
  const [defaultAbout, setDefaultAbout]       = useState({ title: '', subtitle: '', description: '', skills: '' });
  const [defaultServices, setDefaultServices] = useState<any[]>([]);
  const [defaultContact, setDefaultContact]   = useState({ email: '', phone: '', location: '', availability: '' });

  // Reset modal
  const [resetModal, setResetModal] = useState({ open: false, section: '' });
  const [isResetting, setIsResetting] = useState(false);

  const showStatus = (msg: string) => {
    setStatusLog(msg);
    setTimeout(() => setStatusLog(null), 3500);
  };

  // ── Loaders ──────────────────────────────────────────────────────────────────
  const loadLive = useCallback(async () => {
    try {
      const [about, services, contact] = await Promise.all([
        getAboutContent(),
        getServicesContent(),
        getContactContent(),
      ]);
      setAboutContent(about   || { title: '', subtitle: '', description: '', skills: '' });
      setServicesContent(Array.isArray(services) ? services : []);
      setContactContent(contact || { email: '', phone: '', location: '', availability: '' });
    } catch (err) { console.error('Error loading live content:', err); }
  }, []);

  const loadDefaults = useCallback(async () => {
    try {
      const [about, services, contact] = await Promise.all([
        getDefaultAboutContent(),
        getDefaultServices(),
        getDefaultContactContent(),
      ]);
      setDefaultAbout(about   || { title: '', subtitle: '', description: '', skills: '' });
      setDefaultServices(Array.isArray(services) ? services : []);
      setDefaultContact(contact || { email: '', phone: '', location: '', availability: '' });
    } catch (err) { console.error('Error loading defaults content:', err); }
  }, []);

  useEffect(() => { loadLive(); }, [loadLive]);
  useEffect(() => { if (mode === 'defaults') loadDefaults(); }, [mode, loadDefaults]);

  // ── Save helpers ──────────────────────────────────────────────────────────────
  const handleSave = async (type: string, saveFn: any, data: any) => {
    showStatus(`UPLOADING_${type.toUpperCase()}_DATA...`);
    try {
      const result = await saveFn(data);
      showStatus(result?.success !== false
        ? `${type.toUpperCase()}_${mode.toUpperCase()}_SYNC_OK`
        : `${type.toUpperCase()}_SAVED_LOCALLY_ONLY`);
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`);
    }
  };

  const onSaveAbout = (e: any) => {
    e.preventDefault();
    mode === 'live'
      ? handleSave('about', saveAboutContent, aboutContent)
      : handleSave('defaults_about', saveDefaultAboutContent, defaultAbout);
  };

  const onSaveServices = (e: any) => {
    e.preventDefault();
    mode === 'live'
      ? handleSave('services', saveServicesContent, servicesContent)
      : handleSave('defaults_services', saveDefaultServices, defaultServices);
  };

  const onSaveContact = (e: any) => {
    e.preventDefault();
    mode === 'live'
      ? handleSave('contact', saveContactContent, contactContent)
      : handleSave('defaults_contact', saveDefaultContactContent, defaultContact);
  };

  // ── Services helpers ──────────────────────────────────────────────────────────
  const target = mode === 'live' ? servicesContent : defaultServices;
  const setTarget = mode === 'live' ? setServicesContent : setDefaultServices;

  const handleAddService = () =>
    setTarget(prev => [...prev, { id: Date.now(), title: '', description: '', icon: '' }]);
  const handleRemoveService = (id: any) =>
    setTarget(prev => prev.filter(s => s.id !== id));
  const handleUpdateService = (id: any, field: string, value: any) =>
    setTarget(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  // ── Reset ─────────────────────────────────────────────────────────────────────
  const openReset = (section: string) => setResetModal({ open: true, section });
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSectionToDefault(resetModal.section);
      showStatus(result.success
        ? `LIVE_${resetModal.section.toUpperCase()}_RESET_TO_DEFAULTS`
        : result.message);
      setResetModal({ open: false, section: '' });
      if (mode === 'live') await loadLive();
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const sections = [
    { id: 'about',    label: 'BIO_DATA',  icon: FileText },
    { id: 'services', label: 'MODULES',   icon: Cpu      },
    { id: 'contact',  label: 'UPLINKS',   icon: Mail     },
  ];

  // Current data bindings based on mode
  const about   = mode === 'live' ? aboutContent   : defaultAbout;
  const setAbout = mode === 'live' ? setAboutContent : setDefaultAbout;
  const contact  = mode === 'live' ? contactContent  : defaultContact;
  const setContact = mode === 'live' ? setContactContent : setDefaultContact;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-mono">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505]" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 text-xs mb-2">
              <Terminal size={14} /> <span>ADMIN_ACCESS_GRANTED</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              SYSTEM <span className="text-gray-600">CONFIGURATION</span>
            </h1>
          </div>

          {/* Status */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              {statusLog ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-green-400 bg-green-900/10 border border-green-500/20 px-4 py-2 rounded">
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

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs text-gray-500 mb-4 pl-2">SELECT_PARTITION</div>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 border-l-2 ${isActive
                    ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400'
                    : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={16} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="lg:col-span-9">
            {/* Mode Toggle — applies to the active section */}
            <ModeToggle mode={mode} setMode={setMode} />

            {mode === 'defaults' && (
              <div className="mb-6 px-4 py-2 bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-mono rounded">
                ◎ EDITING DEFAULTS — Changes here do not affect live visitors.
              </div>
            )}

            <motion.div key={activeSection + mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-xl shadow-2xl relative overflow-hidden">

              {/* Scanline accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

              {/* ══ ABOUT ══ */}
              {activeSection === 'about' && (
                <form onSubmit={onSaveAbout}>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <FileText className="text-cyan-500" size={18} />
                      <h2 className="text-lg font-bold text-white">EDIT_BIO_DATA</h2>
                    </div>
                    <button type="button" onClick={() => openReset('about')}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px] font-mono transition-colors">
                      <RotateCcw size={11} /> RESET_TO_DEFAULT
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <TechInput label="DISPLAY_TITLE" value={about.title}
                      onChange={(e: any) => setAbout({ ...about, title: e.target.value })} placeholder="e.g. About Me" />
                    <TechInput label="SUBTITLE_ROLE" value={about.subtitle}
                      onChange={(e: any) => setAbout({ ...about, subtitle: e.target.value })} placeholder="e.g. Full Stack Developer" />
                  </div>
                  <TechInput label="CORE_DESCRIPTION" value={about.description}
                    onChange={(e: any) => setAbout({ ...about, description: e.target.value })} type="textarea" placeholder="Enter main biography..." />
                  <TechInput label="SKILL_MATRIX (CSV)" value={about.skills}
                    onChange={(e: any) => setAbout({ ...about, skills: e.target.value })} placeholder="React, Node, AI, etc." />

                  <div className="mt-8 flex justify-end">
                    <SaveButton label="COMMIT_CHANGES" />
                  </div>
                </form>
              )}

              {/* ══ SERVICES ══ */}
              {activeSection === 'services' && (
                <form onSubmit={onSaveServices}>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Cpu className="text-cyan-500" size={18} />
                      <h2 className="text-lg font-bold text-white">SYSTEM_MODULES</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openReset('services')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px] font-mono transition-colors">
                        <RotateCcw size={11} /> RESET
                      </button>
                      <button type="button" onClick={handleAddService}
                        className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors border border-cyan-500/20 rounded">
                        <Plus size={14} /> NEW_MODULE
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {target.map((service, index) => (
                      <div key={service.id}
                        className="group border border-white/10 bg-black/20 p-6 rounded relative hover:border-white/20 transition-colors">
                        <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gray-800 group-hover:bg-cyan-500 transition-colors" />
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs text-gray-600 font-mono">MODULE_0{index + 1}</span>
                          <button type="button" onClick={() => handleRemoveService(service.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <TechInput label="MODULE_NAME" value={service.title}
                            onChange={(e: any) => handleUpdateService(service.id, 'title', e.target.value)} />
                          <TechInput label="ICON_KEY" value={service.icon}
                            onChange={(e: any) => handleUpdateService(service.id, 'icon', e.target.value)} />
                        </div>
                        <TechInput label="FUNCTION_DESC" value={service.description}
                          onChange={(e: any) => handleUpdateService(service.id, 'description', e.target.value)}
                          type="textarea" rows={2} />
                      </div>
                    ))}
                  </div>

                  {target.length > 0 && (
                    <div className="mt-8 flex justify-end">
                      <SaveButton label="UPDATE_MODULES" />
                    </div>
                  )}
                </form>
              )}

              {/* ══ CONTACT ══ */}
              {activeSection === 'contact' && (
                <form onSubmit={onSaveContact}>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Mail className="text-cyan-500" size={18} />
                      <h2 className="text-lg font-bold text-white">UPLINK_CONFIG</h2>
                    </div>
                    <button type="button" onClick={() => openReset('contact')}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px] font-mono transition-colors">
                      <RotateCcw size={11} /> RESET_TO_DEFAULT
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <TechInput label="CONTACT_EMAIL" value={contact.email}
                      onChange={(e: any) => setContact({ ...contact, email: e.target.value })} />
                    <TechInput label="PHONE_NO" value={contact.phone}
                      onChange={(e: any) => setContact({ ...contact, phone: e.target.value })} />
                  </div>
                  <TechInput label="PHYSICAL_LOCATION" value={contact.location}
                    onChange={(e: any) => setContact({ ...contact, location: e.target.value })} />
                  <TechInput label="CURRENT_STATUS" value={contact.availability}
                    onChange={(e: any) => setContact({ ...contact, availability: e.target.value })} />

                  <div className="mt-8 flex justify-end">
                    <SaveButton label="SYNC_CONTACT_INFO" />
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reset Modal */}
      <ResetToDefaultModal
        isOpen={resetModal.open}
        onClose={() => setResetModal({ open: false, section: '' })}
        onConfirm={handleReset}
        sectionName={resetModal.section}
        isLoading={isResetting}
      />
    </div>
  );
};

export default ContentManager;
