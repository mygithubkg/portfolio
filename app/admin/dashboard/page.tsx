"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Terminal,
  Database,
  Cpu,
  LogOut,
  Menu,
  X,
  Download,
  Upload,
  Activity,
  ChevronRight,
  User,
  BookOpen,
  Clock,
  Code2,
  Share2,
  Layers,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import ProjectsManager  from '@/components/Admin/ProjectsManager';
import ContentManager   from '@/components/Admin/ContentManager';
import BlogManager      from '@/components/Admin/BlogManager';
import TimelineManager  from '@/components/Admin/TimelineManager';
import TechStackManager from '@/components/Admin/TechStackManager';
import SocialsManager   from '@/components/Admin/SocialsManager';
import { exportAllData, importAllData } from '@/lib/utils/dataManager';
import { syncHardcodedToDefaults } from '@/lib/utils/defaultsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab]     = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile]       = useState(false);
  const [seedStatus, setSeedStatus]   = useState<string | null>(null);
  const [exportIncludeDefaults, setExportIncludeDefaults] = useState(false);
  const { logout, firebaseUser } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // ── EXPORT ────────────────────────────────────────────────────────────────────
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

  // ── IMPORT ────────────────────────────────────────────────────────────────────
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

  // ── SEED DEFAULTS ─────────────────────────────────────────────────────────────
  // Pushes hardcoded JS values → defaults_* Firestore collections.
  // Does NOT touch any live data. Run once for first-time setup.
  const handleSeedDefaults = async () => {
    if (!confirm(
      'SEED_DEFAULTS: This will push all hardcoded JS defaults into the Firestore defaults/ tree.\n\n' +
      'This is safe to run — it does NOT affect live site data.\n\nContinue?'
    )) return;

    setSeedStatus('SEEDING...');
    try {
      const result = await syncHardcodedToDefaults();
      setSeedStatus(result.success ? 'SEED_COMPLETE ✓' : `SEED_FAILED: ${result.message}`);
      setTimeout(() => setSeedStatus(null), 5000);
    } catch (error: any) {
      setSeedStatus('ERROR: ' + error.message);
      setTimeout(() => setSeedStatus(null), 5000);
      console.error('Seed error:', error);
    }
  };

  // ── NAV ───────────────────────────────────────────────────────────────────────
  const menuItems = [
    { id: 'projects',  label: 'PROJECTS',   icon: Database },
    { id: 'blogs',     label: 'BLOGS',      icon: BookOpen },
    { id: 'content',   label: 'CONTENT',    icon: Cpu      },
    { id: 'timeline',  label: 'TIMELINE',   icon: Clock    },
    { id: 'techStack', label: 'TECH_STACK', icon: Code2    },
    { id: 'socials',   label: 'SOCIALS',    icon: Share2   },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-mono overflow-hidden">

      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col shadow-2xl"
          >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/10 rounded border border-cyan-500/30 flex items-center justify-center">
                  <Terminal size={16} className="text-cyan-400" />
                </div>
                <span className="font-bold tracking-wider text-sm">ADMIN_CORE</span>
              </div>
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-gray-500">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <div className="text-[10px] text-gray-600 mb-2 pl-2 font-bold tracking-widest">MODULES</div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); if (isMobile) setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <Activity size={14} className="ml-auto animate-pulse" />}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 bg-black/20 space-y-2 shrink-0">
              <div className="text-[10px] text-gray-600 mb-2 pl-2 font-bold tracking-widest">DATA_OPS</div>

              {/* SEED_DEFAULTS — pushes JS hardcoded → defaults/ tree */}
              <button
                onClick={handleSeedDefaults}
                title="Push hardcoded JS defaults → Firestore defaults/ tree (first-time setup)"
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded border border-amber-500/20 transition-colors"
              >
                <Layers size={14} />
                {seedStatus || 'SEED_DEFAULTS'}
              </button>

              {/* EXPORT — with optional defaults inclusion */}
              <div className="flex items-center gap-2 px-3 py-2 rounded border border-white/5 hover:bg-white/5 transition-colors group">
                <button onClick={handleExport}
                  className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-white flex-1 text-left">
                  <Download size={14} /> EXPORT_JSON
                </button>
                <label className="flex items-center gap-1 cursor-pointer shrink-0" title="Include defaults/ in export">
                  <input type="checkbox" checked={exportIncludeDefaults}
                    onChange={e => setExportIncludeDefaults(e.target.checked)}
                    className="w-3 h-3 accent-amber-400" />
                  <span className="text-[9px] text-gray-600">+DEF</span>
                </label>
              </div>

              <label className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded border border-white/5 transition-colors cursor-pointer">
                <Upload size={14} /> IMPORT_PATCH
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>

              <div className="h-px bg-white/10 my-2" />

              {/* User info */}
              {firebaseUser && (
                <div className="px-3 py-2 text-[9px] text-gray-600 font-mono truncate border border-white/5 rounded">
                  <span className="text-green-500/60">● </span>{firebaseUser.email}
                </div>
              )}

              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors">
                <LogOut size={14} /> TERMINATE
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">

        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-gray-500">SYSTEM</span>
              <ChevronRight size={12} className="text-gray-700" />
              <span className="text-cyan-500 uppercase">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-400 tracking-wider">FIREBASE_AUTH</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <User size={14} className="text-gray-300" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'projects'  && <ProjectsManager />}
                {activeTab === 'blogs'     && <BlogManager />}
                {activeTab === 'content'   && <ContentManager />}
                {activeTab === 'timeline'  && <TimelineManager />}
                {activeTab === 'techStack' && <TechStackManager />}
                {activeTab === 'socials'   && <SocialsManager />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
