"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Clock, Terminal, RotateCcw, AlertTriangle } from 'lucide-react';
import { getTimeline, saveTimeline } from '@/lib/utils/dataManager';
import {
  getDefaultTimeline,
  saveDefaultTimeline,
  resetSectionToDefault
} from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';
import { auditLog } from '@/lib/utils/security';

// ── Mode badge colours ────────────────────────────────────────────────────────
const LIVE_TAB     = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
const DEFAULT_TAB  = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
const INACTIVE_TAB = 'text-gray-500 hover:text-white border-transparent';

// ── Empty entry template ──────────────────────────────────────────────────────
const emptyEntry = () => ({
  _localId: Date.now(),
  year: '',
  title: '',
  place: '',
  desc: '',
  icon: 'Terminal'
});

// ── Inline field editor ───────────────────────────────────────────────────────
const Field = ({ label, value, onChange, multiline = false }: any) => (
  <div className="group">
    <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase tracking-widest group-focus-within:text-cyan-400">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={2}
        className="w-full bg-black/40 border border-white/10 p-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none resize-none placeholder-gray-700 transition-colors"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-black/40 border border-white/10 p-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none placeholder-gray-700 transition-colors"
      />
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const TimelineManager = () => {
  const [mode, setMode]         = useState('live');  // 'live' | 'defaults'
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

  // Load entries whenever mode changes
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = mode === 'live' ? await getTimeline() : await getDefaultTimeline();
      // Ensure each entry has a stable local ID for React keying
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
      // Strip internal _localId before saving
      const clean = entries.map(({ _localId, ...e }) => e);
      const result = mode === 'live'
        ? await saveTimeline(clean)
        : await saveDefaultTimeline(clean);
      showStatus(result?.success !== false ? `${mode.toUpperCase()}_TIMELINE_SAVED` : (result?.message || 'Error'), result?.success === false);
      auditLog(`TIMELINE_SAVED_${mode.toUpperCase()}`, { count: clean.length });
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

  const handleStartEdit = (entry: any) => {
    setEditingId(entry._localId);
    setEditForm({ ...entry });
  };

  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleCommitEdit = () => {
    setEntries(prev => prev.map(e => e._localId === editingId ? { ...editForm } : e));
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (localId: any) => {
    setEntries(prev => prev.filter(e => e._localId !== localId));
    if (editingId === localId) { setEditingId(null); setEditForm({}); }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSectionToDefault('timeline');
      showStatus(result.success ? 'LIVE_TIMELINE_RESET_TO_DEFAULTS' : result.message, !result.success);
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
            <Clock size={14} /> <span>/ TIMELINE_DB</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Timeline <span className="text-gray-600">Entries</span></h1>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-2 flex-wrap">
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
            <Plus size={14} /> ADD_ENTRY
          </button>
        </div>
      </div>

      {/* Status bar */}
      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${status.isError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defaults mode banner */}
      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect the live site until you "Reset to Default".
        </div>
      )}

      {/* Entry list */}
      {loading ? (
        <div className="text-gray-600 text-sm font-mono">LOADING_TIMELINE...</div>
      ) : (
        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {entries.map((entry, idx) => (
              <motion.div key={entry._localId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`border p-5 transition-colors ${editingId === entry._localId ? 'border-cyan-500/50 bg-[#0e1318]' : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'}`}>
                
                {editingId === entry._localId ? (
                  // Edit form
                  <div>
                    <div className="text-[10px] text-cyan-500 font-mono mb-4">EDITING ENTRY_{String(idx + 1).padStart(2, '0')}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Field label="Year / Range" value={editForm.year || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, year: e.target.value }))} />
                      <Field label="Title / Role" value={editForm.title || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, title: e.target.value }))} />
                      <Field label="Place / Organisation" value={editForm.place || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, place: e.target.value }))} />
                      <Field label="Icon (Lucide name)" value={editForm.icon || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, icon: e.target.value }))} />
                    </div>
                    <Field label="Description" value={editForm.desc || ''} onChange={(e: any) => setEditForm((p: any) => ({ ...p, desc: e.target.value }))} multiline />
                    <div className="flex gap-2 mt-4">
                      <button onClick={handleCommitEdit} className="flex items-center gap-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors">
                        <Save size={12} /> APPLY
                      </button>
                      <button onClick={handleCancelEdit} className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white text-xs font-mono transition-colors">
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  // Read view
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] text-gray-600 font-mono shrink-0">{entry.year || '—'}</span>
                        <span className="text-sm font-bold text-white truncate">{entry.title || '(untitled)'}</span>
                      </div>
                      <div className="text-[10px] text-cyan-600 font-mono mb-1">{entry.place || ''}</div>
                      <p className="text-xs text-gray-500 line-clamp-2">{entry.desc || ''}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleStartEdit(entry)} className="text-gray-500 hover:text-cyan-400 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(entry._localId)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/10">
              <Terminal size={32} className="mx-auto text-gray-700 mb-2" />
              <p className="text-gray-600 text-sm">No entries. Click ADD_ENTRY to begin.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
        <button onClick={handleSaveAll} disabled={isSaving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold hover:bg-cyan-400 transition-colors disabled:opacity-40">
          <Save size={14} />
          {isSaving ? 'SAVING...' : `SAVE_${mode.toUpperCase()}_TIMELINE`}
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
        sectionName="Timeline"
        isLoading={isResetting}
      />
    </div>
  );
};

export default TimelineManager;
