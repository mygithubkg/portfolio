"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, Share2, RotateCcw, ExternalLink } from 'lucide-react';
import { getSocials, saveSocials } from '@/lib/utils/dataManager';
import {
  getDefaultSocials,
  saveDefaultSocials,
  resetSectionToDefault
} from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';
import { auditLog } from '@/lib/utils/security';

const ICON_OPTIONS = ['FaLinkedin', 'FaGithub', 'FaInstagram', 'FaTwitter', 'FaYoutube', 'FaGlobe'];

const emptyEntry = () => ({
  _localId: Date.now(),
  icon: 'FaGlobe',
  url: '',
  label: '',
  username: ''
});

const Field = ({ label, value, onChange, type = 'text', placeholder }: any) => (
  <div className="group relative">
    <label className="block text-[10px] font-mono text-textSecondary mb-1 uppercase tracking-widest group-focus-within:text-accent">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-background border border-border p-2.5 text-text font-mono text-xs focus:border-accent focus:outline-none placeholder-textSecondary/50 transition-colors"
    />
  </div>
);

const SocialsManager = () => {
  const [mode, setMode]         = useState('live');
  const [entries, setEntries]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);
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
    <div className="w-full relative z-10 flex flex-col min-h-full p-6 md:p-10 font-mono">
      {/* Header */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
          / ROOT / SOCIALS_DB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h1 className="font-display text-5xl xl:text-6xl text-text tracking-tight">
            Social Links.
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
              className="border border-border hover:border-accent hover:text-accent px-4 py-2 font-mono text-xs transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              + Add Link
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${
              status.isError
                ? 'bg-error/10 border-error/30 text-error'
                : 'bg-accent/10 border-accent/30 text-accent'
            }`}
          >
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect live visitors.
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="text-textSecondary text-xs font-mono py-12">LOADING_SOCIALS...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry._localId}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={`group bg-surface border border-border flex flex-col hover:border-accent transition-colors p-5 ${
                  editingId === entry._localId ? 'border-accent' : ''
                }`}
              >
                {editingId === entry._localId ? (
                  <div className="flex flex-col gap-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
                      EDITING_ENTRY
                    </div>
                    <div className="space-y-3">
                      <div className="group relative">
                        <label className="block text-[10px] font-mono text-textSecondary mb-1 uppercase tracking-widest group-focus-within:text-accent">
                          Icon
                        </label>
                        <select
                          value={editForm.icon}
                          onChange={e => setEditForm((p: any) => ({ ...p, icon: e.target.value }))}
                          className="w-full bg-background border border-border p-2.5 text-text font-mono text-xs focus:border-accent focus:outline-none transition-colors"
                        >
                          {ICON_OPTIONS.map(ic => (
                            <option key={ic} value={ic} className="bg-background text-text">
                              {ic}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Field
                        label="Platform Label"
                        value={editForm.label || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, label: e.target.value }))}
                        placeholder="e.g. GitHub"
                      />
                      <Field
                        label="URL"
                        value={editForm.url || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, url: e.target.value }))}
                        placeholder="https://..."
                      />
                      <Field
                        label="Username / Handle"
                        value={editForm.username || ''}
                        onChange={(e: any) => setEditForm((p: any) => ({ ...p, username: e.target.value }))}
                        placeholder="e.g. @username"
                      />
                    </div>
                    <div className="flex gap-2 mt-2 pt-3 border-t border-border">
                      <button
                        onClick={handleCommitEdit}
                        className="flex items-center gap-1 px-4 py-2 bg-accent text-background text-xs font-mono font-bold hover:opacity-90 transition-opacity"
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
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-[10px] text-textSecondary font-mono shrink-0">
                          {entry.icon?.replace('Fa', '').slice(0, 3).toUpperCase()}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="text-textSecondary hover:text-accent transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-1"
                            title="Edit"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry._localId)}
                            className="text-textSecondary hover:text-error transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-1"
                            title="Delete"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="font-sans font-bold text-base text-text group-hover:text-accent transition-colors">
                          {entry.label || '(no label)'}
                        </div>
                        <div className="text-xs text-textSecondary font-mono mt-1">
                          {entry.username || '—'}
                        </div>
                      </div>
                    </div>

                    {entry.url && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-textSecondary hover:text-accent font-mono flex items-center gap-1.5 transition-colors truncate"
                        >
                          <ExternalLink size={11} className="shrink-0" />
                          <span className="truncate">{entry.url}</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && (
            <div className="col-span-full border border-dashed border-border p-12 text-center">
              <Share2 size={32} className="mx-auto text-textSecondary mb-3 opacity-50" />
              <p className="text-textSecondary text-xs font-mono uppercase tracking-widest">
                NO_SOCIAL_LINKS // CLICK_ADD_LINK
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-border mt-auto">
        <button
          onClick={handleSaveAll}
          disabled={isSaving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background text-xs font-mono font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Save size={14} />
          {isSaving ? 'SAVING...' : `SAVE_${mode.toUpperCase()}_SOCIALS`}
        </button>

        <div className="ml-auto">
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-2 px-4 py-3 border border-border text-textSecondary hover:border-accent hover:text-accent text-xs font-mono transition-colors"
          >
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

