"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Database,
  Cpu,
  LogOut,
  Menu,
  X,
  Download,
  Upload,
  BookOpen,
  Clock,
  Code2,
  Share2,
  Layers,
} from 'lucide-react';
import ProjectsManager  from '@/components/Admin/ProjectsManager';
import ContentManager   from '@/components/Admin/ContentManager';
import BlogManager      from '@/components/Admin/BlogManager';
import TimelineManager  from '@/components/Admin/TimelineManager';
import TechStackManager from '@/components/Admin/TechStackManager';
import SocialsManager   from '@/components/Admin/SocialsManager';
import { exportAllData, importAllData } from '@/lib/utils/dataManager';
import { syncHardcodedToDefaults } from '@/lib/utils/defaultsManager';

const menuItems = [
  { id: 'projects',  label: 'PROJECTS',   icon: Database },
  { id: 'blogs',     label: 'BLOGS',      icon: BookOpen },
  { id: 'content',   label: 'CONTENT',    icon: Cpu      },
  { id: 'timeline',  label: 'TIMELINE',   icon: Clock    },
  { id: 'techStack', label: 'TECH_STACK', icon: Code2    },
  { id: 'socials',   label: 'SOCIALS',    icon: Share2   },
];

const DesktopView = ({ 
  activeTab, setActiveTab, handleSeedDefaults, seedStatus, 
  handleExport, exportIncludeDefaults, setExportIncludeDefaults, 
  handleImport, handleLogout, firebaseUser, renderActiveManager 
}: any) => {
  return (
    <div className="hidden lg:flex h-screen w-full overflow-hidden bg-background">
      {/* The Left Sidebar (The Actual Header) */}
      <aside className="w-64 shrink-0 h-full border-r border-border bg-surface flex flex-col z-20">
        {/* Top Branding */}
        <div className="h-20 flex items-center px-8 border-b border-border shrink-0">
          <span className="font-mono font-bold tracking-widest text-sm text-text">K.G. // ADMIN_CORE</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 space-y-2 overflow-y-auto px-4">
          <div className="text-[10px] text-textSecondary mb-4 pl-4 font-bold tracking-widest uppercase font-mono">Modules</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'text-accent font-bold border-l-2 border-accent bg-background/50'
                    : 'text-textSecondary hover:text-text border-l-2 border-transparent hover:bg-background/30'
                }`}
              >
                <Icon size={16} />
                <span className="uppercase tracking-widest font-mono text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-border space-y-4 shrink-0 bg-background/30">
          <div className="text-[10px] text-textSecondary font-bold tracking-widest uppercase font-mono mb-2">Data_Ops</div>

          <button
            onClick={handleSeedDefaults}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-text hover:text-accent hover:bg-surface rounded border border-border transition-colors"
          >
            <Layers size={14} />
            {seedStatus || 'SEED_DEFAULTS'}
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded border border-border hover:bg-surface transition-colors group">
            <button onClick={handleExport} className="flex items-center gap-2 text-xs font-mono text-textSecondary group-hover:text-text flex-1 text-left">
              <Download size={14} /> EXPORT
            </button>
            <label className="flex items-center gap-1 cursor-pointer shrink-0">
              <input type="checkbox" checked={exportIncludeDefaults} onChange={e => setExportIncludeDefaults(e.target.checked)} className="w-3 h-3 accent-accent" />
              <span className="text-[9px] font-mono text-textSecondary">+DEF</span>
            </label>
          </div>

          <label className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-textSecondary hover:text-text hover:bg-surface rounded border border-border transition-colors cursor-pointer">
            <Upload size={14} /> IMPORT
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <div className="h-px w-full bg-border my-4" />

          {firebaseUser && (
            <div className="px-3 py-2 text-[10px] text-textSecondary font-mono truncate border border-border rounded bg-surface">
              <span className="text-success mr-2">●</span>{firebaseUser.email}
            </div>
          )}

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 text-xs font-mono text-error hover:bg-error/10 rounded transition-colors border border-transparent hover:border-error/20">
            <LogOut size={14} /> TERMINATE
          </button>
        </div>
      </aside>

      {/* The Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-background relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {renderActiveManager()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const MobileView = ({ 
  activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen,
  handleLogout, renderActiveManager 
}: any) => {
  return (
    <div className="block lg:hidden min-h-screen flex flex-col bg-background relative">
      {/* The Mobile Top Bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-border backdrop-blur-md bg-background/80 flex items-center justify-between px-6">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-textSecondary hover:text-text">
          <Menu size={20} />
        </button>
        <span className="font-mono font-bold tracking-widest text-xs text-text uppercase">{activeTab}</span>
        <div className="w-8" /> {/* Placeholder for balance since "+ New" will be in manager */}
      </header>

      {/* The Slide-Out Drawer (Navigation) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border flex flex-col shadow-2xl"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                <span className="font-mono font-bold tracking-widest text-sm text-text">ADMIN_CORE</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-textSecondary hover:text-text">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-2 overflow-y-auto px-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? 'text-accent font-bold border-l-2 border-accent bg-background/50'
                          : 'text-textSecondary hover:text-text border-l-2 border-transparent hover:bg-background/30'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="uppercase tracking-widest font-mono text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-border shrink-0">
                 <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} className="w-full flex items-center justify-center gap-2 px-3 py-3 text-xs font-mono text-error bg-error/10 rounded border border-error/20">
                   <LogOut size={14} /> TERMINATE SESSION
                 </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 p-6 flex flex-col gap-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveManager()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [exportIncludeDefaults, setExportIncludeDefaults] = useState(false);
  
  const { logout, firebaseUser, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData({ includeDefaults: exportIncludeDefaults });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `sys_backup_${exportIncludeDefaults ? 'full_' : ''}${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert('Export failed: ' + error.message);
    }
  };

  const handleImport = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          await importAllData(data);
          alert('SYSTEM_PATCH_SUCCESSFUL');
          window.location.reload();
        } catch (error: any) {
          alert('ERROR: CORRUPTED_FILE — ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('SEED_DEFAULTS: Push hardcoded JS defaults into Firestore defaults/ tree. Continue?')) return;
    setSeedStatus('SEEDING...');
    try {
      const result = await syncHardcodedToDefaults();
      setSeedStatus(result.success ? 'SEED_COMPLETE ✓' : `SEED_FAILED`);
      setTimeout(() => setSeedStatus(null), 5000);
    } catch (error: any) {
      setSeedStatus('ERROR');
      setTimeout(() => setSeedStatus(null), 5000);
    }
  };

  const renderActiveManager = () => {
    switch (activeTab) {
      case 'projects':  return <ProjectsManager />;
      case 'blogs':     return <BlogManager />;
      case 'content':   return <ContentManager />;
      case 'timeline':  return <TimelineManager />;
      case 'techStack': return <TechStackManager />;
      case 'socials':   return <SocialsManager />;
      default:          return <ProjectsManager />;
    }
  };

  const props = {
    activeTab, setActiveTab,
    isSidebarOpen, setIsSidebarOpen,
    seedStatus, handleSeedDefaults,
    exportIncludeDefaults, setExportIncludeDefaults,
    handleExport, handleImport,
    handleLogout, firebaseUser,
    renderActiveManager
  };

  if (!isAuthenticated) return null;

  return (
    <div className="w-full min-h-screen bg-background text-text selection:bg-accent/20 selection:text-accent">
      <DesktopView {...props} />
      <MobileView {...props} />
    </div>
  );
}
