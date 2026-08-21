"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Code2, RotateCcw, X } from 'lucide-react';
import { getTechStack, saveTechStack } from '@/lib/utils/dataManager';
import {
  getDefaultTechStack,
  saveDefaultTechStack,
  resetSectionToDefault
} from '@/lib/utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';
import { auditLog } from '@/lib/utils/security';

const TechStackManager = () => {
  const [mode, setMode]       = useState('live');
  const [items, setItems]     = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [status, setStatus]   = useState<any>(null);
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const showStatus = (msg: string, isError = false) => {
    setStatus({ msg, isError });
    setTimeout(() => setStatus(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = mode === 'live' ? await getTechStack() : await getDefaultTechStack();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems(prev => [...prev, trimmed]);
    setNewItem('');
  };

  const handleAddKey = (e: any) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (item: string) => setItems(prev => prev.filter(i => i !== item));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = mode === 'live'
        ? await saveTechStack(items)
        : await saveDefaultTechStack(items);
      showStatus(result?.success !== false ? `${mode.toUpperCase()}_TECH_STACK_SAVED` : (result?.message || 'Error'), result?.success === false);
      auditLog(`TECH_STACK_SAVED_${mode.toUpperCase()}`, { count: items.length });
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetSectionToDefault('techStack');
      showStatus(result.success ? 'LIVE_TECH_STACK_RESET_TO_DEFAULTS' : result.message, !result.success);
      setShowReset(false);
      if (result.success && mode === 'live') await load();
    } catch (err: any) {
      showStatus(`ERROR: ${err.message}`, true);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full relative z-10 flex flex-col min-h-full p-6 md:p-10 font-mono text-text bg-background">
      {/* Header */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-4">
          / ROOT / TECH_DB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-display text-5xl xl:text-6xl text-text tracking-tight">
              Tech Stack.
            </h1>
            <p className="text-textSecondary text-xs font-mono mt-2">
              Technical stack database and competency ledger. Displayed across the interface.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-4 flex-wrap">
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
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 px-4 py-2 text-xs font-mono border ${
              status.isError
                ? 'bg-error/10 border-error/30 text-error'
                : 'bg-success/10 border-success/30 text-success'
            }`}
          >
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defaults Mode Warning */}
      {mode === 'defaults' && (
        <div className="mb-6 px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
          ◎ EDITING DEFAULTS — Changes here do not affect the live site until you "Reset to Default".
        </div>
      )}

      {/* Add New Item */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={handleAddKey}
            placeholder="e.g. TypeScript, Next.js, Rust (press Enter or Comma)"
            className="w-full bg-background border border-border focus:border-accent p-3 text-text font-mono text-xs focus:outline-none placeholder:text-textSecondary/50 transition-colors"
          />
        </div>
        <button
          onClick={handleAdd}
          className="border border-border hover:border-accent hover:text-accent px-6 py-3 font-mono text-xs transition-colors flex items-center justify-center gap-2 text-text"
        >
          <Plus size={14} /> + Add Technology
        </button>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="text-textSecondary text-sm font-mono py-8">LOADING_STACK...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="group relative bg-surface border border-border flex flex-col justify-between hover:border-accent transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-[9px] text-textSecondary uppercase tracking-widest">
                    TECH_{String(index + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-textSecondary hover:text-error transition-colors opacity-60 group-hover:opacity-100"
                    title="Delete technology"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="font-mono font-bold text-sm text-text group-hover:text-accent transition-colors truncate">
                  {item}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="col-span-full border border-dashed border-border p-12 text-center">
              <Code2 size={32} className="mx-auto text-textSecondary mb-3 opacity-40" />
              <p className="text-textSecondary text-xs font-mono uppercase tracking-widest">
                NO_ENTRIES_FOUND // INITIALIZE_FIRST_RECORD
              </p>
            </div>
          )}
        </div>
      )}

      <p className="font-mono text-[10px] text-textSecondary uppercase tracking-widest mb-8">
        {items.length} TECHNOLOGIES_LOADED
      </p>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border mt-auto">
        <button
          onClick={handleSave}
          disabled={isSaving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-mono font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Save size={14} />
          {isSaving ? 'SAVING...' : `SAVE_${mode.toUpperCase()}_STACK`}
        </button>

        <div className="ml-auto">
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-2 px-4 py-3 border border-border hover:border-accent text-textSecondary hover:text-accent text-xs font-mono transition-colors"
          >
            <RotateCcw size={14} /> RESET_LIVE_TO_DEFAULTS
          </button>
        </div>
      </div>

      <ResetToDefaultModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        sectionName="Tech Stack"
        isLoading={isResetting}
      />
    </div>
  );
};

export default TechStackManager;
