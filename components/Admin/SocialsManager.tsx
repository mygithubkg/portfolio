"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Share2, RotateCcw, ExternalLink } from 'lucide-react';
import { getSocials, saveSocials } from '@/lib/utils/dataManager';
import {
  getDefaultSocials,
  saveDefaultSocials,
  resetSectionToDefault
} from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';
import { auditLog } from '@/lib/utils/security';

const LIVE_TAB     = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
const DEFAULT_TAB  = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
const INACTIVE_TAB = 'text-gray-500 hover:text-white border-transparent';

const ICON_OPTIONS = ['FaLinkedin', 'FaGithub', 'FaInstagram', 'FaTwitter', 'FaYoutube', 'FaGlobe'];

const emptyEntry = () => ({
  _localId: Date.now(),
  icon: 'FaGlobe',
  url: '',
  label: '',
  username: ''
});

const Field = ({ label, value, onChange, type = 'text' }: any) => (
  <div>
    <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase tracking-widest">{label}</label>
    <input type={type} value={value} onChange={onChange}
      className="w-full bg-black/40 border border-white/10 p-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none placeholder-gray-700 transition-colors" />
  </div>
);

const SocialsManager = () => {
  const [mode, setMode]         = useState('live');
  const [entries, setEntries]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState<any>({});
  const [status, setStatus]     = useState<any>(null);
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const showStatus = (msg: string, isError = false) => {
    setStatus({ msg, isError });
    setTimeout(() => setStatus(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = mode === 'live' ? await getSocials() : await getDefaultSocials();
      setEntries((Array.isArray(data) ? data : []).map((e: any, i: number) => ({ ...e, _localId: e._localId ?? i })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => { load(); }, [load]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const clean = entries.map(({ _localId, ...e }) => e);
      const result = mode === 'live'
        ? await saveSocials(clean)
        : await saveDefaultSocials(clean);
      showStatus(result?.success !== false ? `${mode.toUpperCase()}_SOCIALS_SAVED` : (result?.message || 'Error'), result?.success === false);
      auditLog(`SOCIALS_SAVED_${mode.toUpperCase()}`, { count: clean.length });
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    const e = emptyEntry();
    setEntries(prev => [...prev, e]);
    setEditingId(e._localId as any);
    setEditForm(e);
  };

  const handleStartEdit = (entry: any) => { setEditingId(entry._localId); setEditForm({ ...entry }); };
  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };
  const handleCommitEdit = () => {
    setEntries(prev => prev.map(e => e._localId === editingId ? { ...editForm } : e));
    setEditingId(null);
    setEditForm({});
  };
  const handleDelete = (id: any) => {
    setEntries(prev => prev.filter(e => e._localId !== id));
    if (editingId === id) { setEditingId(null); setEditForm({}); }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSectionToDefault('socials');
      showStatus(result.success ? 'LIVE_SOCIALS_RESET_TO_DEFAULTS' : result.message, !result.success);
      setShowReset(false);
      if (result.success && mode === 'live') await load();
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`, true);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-mono">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 text-xs mb-1">
            <Share2 size={14} /> <span>/ SOCIALS_DB</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Social <span className="text-gray-600">Links</span></h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/5 border border-white/10 p-1">
            {[['live', 'LIVE_DATA', LIVE_TAB], ['defaults', 'DEFAULTS', DEFAULT_TAB]].map(([val, label, active]) => (
              <button key={val} onClick={() => setMode(val)}
                className={`px-4 py-2 text-xs font-mono transition-all border ${mode === val ? active : INACTIVE_TAB}`}>
                {val === 'live' ? '⬤' : '◎'} {label}
              </button>
            ))}
          </div>
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-all">
            <Plus size={14} /> ADD_LINK
          </button>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${status.isError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect the live site.
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="text-gray-600 text-sm">LOADING_SOCIALS...</div>
      ) : (
        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div key={entry._localId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`border p-5 transition-colors ${editingId === entry._localId ? 'border-cyan-500/50 bg-[#0e1318]' : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'}`}>

                {editingId === entry._localId ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase tracking-widest">Icon</label>
                        <select value={editForm.icon} onChange={e => setEditForm((p: any) => ({ ...p, icon: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 p-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none">
                          {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                      <Field label="Platform Label" value={editForm.label || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, label: e.target.value }))} />
                      <Field label="URL" value={editForm.url || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, url: e.target.value }))} />
                      <Field label="Username / Handle" value={editForm.username || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, username: e.target.value }))} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleCommitEdit} className="flex items-center gap-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold">
                        <Save size={12} /> APPLY
                      </button>
                      <button onClick={handleCancelEdit} className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white text-xs font-mono">CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-mono rounded shrink-0">
                        {entry.icon?.replace('Fa', '').slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{entry.label || '(no label)'}</div>
                        <div className="text-xs text-gray-500 font-mono">{entry.username || ''}</div>
                        {entry.url && (
                          <a href={entry.url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-cyan-600 hover:text-cyan-400 flex items-center gap-1 mt-0.5">
                            <ExternalLink size={9} /> {entry.url.slice(0, 40)}{entry.url.length > 40 ? '…' : ''}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleStartEdit(entry)} className="text-gray-500 hover:text-cyan-400 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(entry._localId)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/10">
              <Share2 size={28} className="mx-auto text-gray-700 mb-2" />
              <p className="text-gray-600 text-sm">No social links. Click ADD_LINK.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
        <button onClick={handleSaveAll} disabled={isSaving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold hover:bg-cyan-400 transition-colors disabled:opacity-40">
          <Save size={14} />
          {isSaving ? 'SAVING...' : `SAVE_${mode.toUpperCase()}_SOCIALS`}
        </button>
        <div className="ml-auto">
          <button onClick={() => setShowReset(true)}
            className="flex items-center gap-2 px-4 py-3 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs font-mono transition-colors">
            <RotateCcw size={14} /> RESET_LIVE_TO_DEFAULTS
          </button>
        </div>
      </div>

      <ResetToDefaultModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        sectionName="Socials"
        isLoading={isResetting}
      />
    </div>
  );
};

export default SocialsManager;
