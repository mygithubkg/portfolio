"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, Terminal, RotateCcw } from 'lucide-react';
import { getTimeline, saveTimeline } from '@/lib/utils/dataManager';
import {
  getDefaultTimeline,
  saveDefaultTimeline,
  resetSectionToDefault
} from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';
import { auditLog } from '@/lib/utils/security';

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
    <label className="block text-[10px] font-mono text-textSecondary mb-1 uppercase tracking-widest group-focus-within:text-accent">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={2}
        className="w-full bg-background border border-border p-2 text-text font-mono text-xs focus:border-accent focus:outline-none resize-none placeholder-textSecondary/40 transition-colors"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-background border border-border p-2 text-text font-mono text-xs focus:border-accent focus:outline-none placeholder-textSecondary/40 transition-colors"
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
    <div className="w-full relative z-10 flex flex-col min-h-full p-6 md:p-10 font-mono text-text">

      {/* --- HEADER --- */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
          / ROOT / TIMELINE_DB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h1 className="font-display text-5xl xl:text-6xl text-text tracking-tight">
            Timeline Nodes.
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button 
                onClick={() => setMode('live')}
                className={`px-4 py-2 font-mono text-xs transition-colors border ${mode === 'live' ? 'border-accent text-accent' : 'border-transparent text-textSecondary hover:text-text'}`}
              >
                [ LIVE_DATA ]
              </button>
              <button 
                onClick={() => setMode('defaults')}
                className={`px-4 py-2 font-mono text-xs transition-colors border ${mode === 'defaults' ? 'border-accent text-accent' : 'border-transparent text-textSecondary hover:text-text'}`}
              >
                [ DEFAULTS ]
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="border border-border hover:border-accent hover:text-accent px-4 py-2 font-mono text-xs transition-colors flex items-center gap-2 text-text"
            >
              <Plus size={14} />
              + Initialize New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${status.isError ? 'bg-error/10 border-error/30 text-error' : 'bg-success/10 border-success/30 text-success'}`}>
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defaults mode banner */}
      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect the live site until you "Reset to Default".
        </div>
      )}

      {/* Entry list / grid */}
      {loading ? (
        <div className="text-textSecondary text-sm font-mono">LOADING_TIMELINE...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {entries.map((entry, idx) => (
              <motion.div
                key={entry._localId}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`group relative bg-surface border flex flex-col hover:border-accent transition-colors overflow-hidden ${
                  editingId === entry._localId ? 'border-accent p-5' : 'border-border p-5'
                }`}
              >
                {editingId === entry._localId ? (
                  // Edit form
                  <div className="flex flex-col h-full">
                    <div className="text-[10px] text-accent font-mono mb-4 uppercase tracking-widest">
                      EDITING ENTRY_{String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <Field
                        label="Year / Range"
                        value={editForm.year || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, year: e.target.value }))}
                      />
                      <Field
                        label="Title / Role"
                        value={editForm.title || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, title: e.target.value }))}
                      />
                      <Field
                        label="Place / Organisation"
                        value={editForm.place || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, place: e.target.value }))}
                      />
                      <Field
                        label="Icon (Lucide name)"
                        value={editForm.icon || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, icon: e.target.value }))}
                      />
                      <Field
                        label="Description"
                        value={editForm.desc || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, desc: e.target.value }))}
                        multiline
                      />
                    </div>
                    <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                      <button
                        onClick={handleCommitEdit}
                        className="flex items-center gap-1 px-4 py-2 bg-accent text-background text-xs font-bold font-mono transition-opacity hover:opacity-90"
                      >
                        <Save size={12} /> APPLY
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-border text-textSecondary hover:text-text text-xs font-mono transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  // Read view
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="font-mono text-[10px] text-textSecondary uppercase tracking-widest">
                        {entry.year || '—'}
                      </span>
                      <div className="flex gap-3 shrink-0">
                        <button
                          onClick={() => handleStartEdit(entry)}
                          className="text-textSecondary hover:text-accent transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center gap-1"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._localId)}
                          className="text-textSecondary hover:text-error transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                    <h3 className="font-sans font-bold text-base text-text mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                      {entry.title || '(untitled)'}
                    </h3>
                    <div className="text-[11px] text-textSecondary font-mono mb-3 uppercase tracking-wider">
                      {entry.place || ''}
                    </div>
                    <p className="text-xs text-textSecondary/80 line-clamp-3 mb-4 font-mono leading-relaxed">
                      {entry.desc || ''}
                    </p>
                    {entry.icon && (
                      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-[10px] font-mono text-textSecondary">
                        <span>ICON: {entry.icon}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && (
            <div className="col-span-full border border-dashed border-border p-20 text-center">
              <Terminal size={40} className="mx-auto text-textSecondary/40 mb-4" />
              <p className="text-textSecondary text-sm font-mono">DATABASE_EMPTY // WAITING_FOR_INPUT</p>
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-border mt-auto">
        <button
          onClick={handleSaveAll}
          disabled={isSaving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background text-xs font-bold font-mono hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Save size={14} />
          {isSaving ? 'SAVING...' : `SAVE_${mode.toUpperCase()}_TIMELINE`}
        </button>

        <div className="ml-auto">
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-2 px-4 py-3 border border-border text-text hover:border-accent hover:text-accent text-xs font-mono transition-colors"
          >
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
