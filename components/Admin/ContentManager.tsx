"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Mail, Plus, Trash2, CheckCircle, Cpu, RotateCcw } from 'lucide-react';
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
const LIVE_TAB     = 'border-accent text-accent';
const DEFAULT_TAB  = 'border-accent text-accent';
const INACTIVE_TAB = 'border-transparent text-textSecondary hover:text-text';

// ── Shared input component ────────────────────────────────────────────────────
const TechInput = ({ label, value, onChange, placeholder, type = 'text', rows }: any) => (
  <div className="group relative mb-6">
    <label className="block text-xs font-mono text-textSecondary mb-2 group-focus-within:text-accent transition-colors uppercase tracking-widest">
      // {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows || 4}
        placeholder={placeholder}
        className="w-full bg-background border border-border p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors resize-none placeholder:text-textSecondary/40"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-background border border-border p-3 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors placeholder:text-textSecondary/40"
      />
    )}
  </div>
);

const SaveButton = ({ label }: any) => (
  <button
    type="submit"
    className="flex items-center gap-2 border border-border hover:border-accent hover:text-accent bg-surface text-text px-6 py-3 font-mono text-xs transition-colors uppercase tracking-widest"
  >
    <Save size={14} /> {label}
  </button>
);

// ── Mode Toggle ───────────────────────────────────────────────────────────────
const ModeToggle = ({ mode, setMode }: any) => (
  <div className="flex gap-2">
    {[
      ['live', '[ LIVE_DATA ]'],
      ['defaults', '[ DEFAULTS ]'],
    ].map(([val, label]) => (
      <button
        key={val}
        onClick={() => setMode(val)}
        className={`px-4 py-2 font-mono text-xs transition-colors border ${
          mode === val ? 'border-accent text-accent' : 'border-transparent text-textSecondary hover:text-text'
        }`}
      >
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
  const [aboutContent, setAboutContent]       = useState({ title: '', subtitle: '', description: '', skills: '' });
  const [servicesContent, setServicesContent] = useState<any[]>([]);
  const [contactContent, setContactContent]   = useState({ email: '', phone: '', location: '', availability: '' });

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
    <div className="w-full relative z-10 flex flex-col min-h-full p-6 md:p-10 font-mono text-text bg-background">

      {/* --- HEADER --- */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
          / ROOT / CONTENT_DB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-display text-5xl text-text tracking-tight">
              Core Content.
            </h1>
            <p className="text-textSecondary text-xs font-mono mt-2">
              Primary profile parameters, biography, uplink endpoints, and system modules.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <ModeToggle mode={mode} setMode={setMode} />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <AnimatePresence mode="wait">
        {statusLog && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border flex items-center gap-2 ${
              statusLog.startsWith('ERROR')
                ? 'bg-error/10 border-error/30 text-error'
                : 'bg-success/10 border-success/30 text-success'
            }`}
          >
            <CheckCircle size={14} />
            <span>{statusLog}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defaults Mode Warning */}
      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect live visitors until you reset or sync.
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[10px] text-textSecondary mb-4 pl-2 font-bold tracking-widest uppercase font-mono">
            SELECT_PARTITION
          </div>
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-mono transition-all duration-200 border-l-2 ${
                  isActive
                    ? 'border-accent bg-surface text-accent font-bold'
                    : 'border-transparent text-textSecondary hover:text-text hover:bg-surface/50'
                }`}
              >
                <Icon size={16} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="lg:col-span-9">
          <motion.div
            key={activeSection + mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-surface border border-border p-6 md:p-8"
          >
            {/* ══ ABOUT ══ */}
            {activeSection === 'about' && (
              <form onSubmit={onSaveAbout}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="text-accent" size={18} />
                    <h2 className="text-sm font-bold text-text font-mono tracking-wider uppercase">EDIT_BIO_DATA</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => openReset('about')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-textSecondary hover:text-accent hover:border-accent text-xs font-mono transition-colors"
                  >
                    <RotateCcw size={12} /> RESET_TO_DEFAULT
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <TechInput
                    label="DISPLAY_TITLE"
                    value={about.title}
                    onChange={(e: any) => setAbout({ ...about, title: e.target.value })}
                    placeholder="e.g. About Me"
                  />
                  <TechInput
                    label="SUBTITLE_ROLE"
                    value={about.subtitle}
                    onChange={(e: any) => setAbout({ ...about, subtitle: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
                <TechInput
                  label="CORE_DESCRIPTION"
                  value={about.description}
                  onChange={(e: any) => setAbout({ ...about, description: e.target.value })}
                  type="textarea"
                  placeholder="Enter main biography..."
                />
                <TechInput
                  label="SKILL_MATRIX (CSV)"
                  value={about.skills}
                  onChange={(e: any) => setAbout({ ...about, skills: e.target.value })}
                  placeholder="React, Node, AI, etc."
                />

                <div className="mt-8 flex justify-end">
                  <SaveButton label="COMMIT_CHANGES" />
                </div>
              </form>
            )}

            {/* ══ SERVICES ══ */}
            {activeSection === 'services' && (
              <form onSubmit={onSaveServices}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-accent" size={18} />
                    <h2 className="text-sm font-bold text-text font-mono tracking-wider uppercase">SYSTEM_MODULES</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openReset('services')}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-textSecondary hover:text-accent hover:border-accent text-xs font-mono transition-colors"
                    >
                      <RotateCcw size={12} /> RESET
                    </button>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="flex items-center gap-2 px-3 py-1.5 border border-border hover:border-accent hover:text-accent text-xs font-mono transition-colors"
                    >
                      <Plus size={14} /> NEW_MODULE
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {target.map((service, index) => (
                    <div
                      key={service.id}
                      className="group bg-surface border border-border flex flex-col hover:border-accent p-6 transition-colors relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs text-textSecondary font-mono uppercase tracking-widest">
                          MODULE_0{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service.id)}
                          className="text-textSecondary hover:text-error transition-colors p-1"
                          title="Remove Module"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <TechInput
                          label="MODULE_NAME"
                          value={service.title}
                          onChange={(e: any) => handleUpdateService(service.id, 'title', e.target.value)}
                        />
                        <TechInput
                          label="ICON_KEY"
                          value={service.icon}
                          onChange={(e: any) => handleUpdateService(service.id, 'icon', e.target.value)}
                        />
                      </div>
                      <TechInput
                        label="FUNCTION_DESC"
                        value={service.description}
                        onChange={(e: any) => handleUpdateService(service.id, 'description', e.target.value)}
                        type="textarea"
                        rows={2}
                      />
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
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Mail className="text-accent" size={18} />
                    <h2 className="text-sm font-bold text-text font-mono tracking-wider uppercase">UPLINK_CONFIG</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => openReset('contact')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-textSecondary hover:text-accent hover:border-accent text-xs font-mono transition-colors"
                  >
                    <RotateCcw size={12} /> RESET_TO_DEFAULT
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <TechInput
                    label="CONTACT_EMAIL"
                    value={contact.email}
                    onChange={(e: any) => setContact({ ...contact, email: e.target.value })}
                  />
                  <TechInput
                    label="PHONE_NO"
                    value={contact.phone}
                    onChange={(e: any) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>
                <TechInput
                  label="PHYSICAL_LOCATION"
                  value={contact.location}
                  onChange={(e: any) => setContact({ ...contact, location: e.target.value })}
                />
                <TechInput
                  label="CURRENT_STATUS"
                  value={contact.availability}
                  onChange={(e: any) => setContact({ ...contact, availability: e.target.value })}
                />

                <div className="mt-8 flex justify-end">
                  <SaveButton label="SYNC_CONTACT_INFO" />
                </div>
              </form>
            )}
          </motion.div>
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

