import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Code2, RotateCcw, X } from 'lucide-react';
import { getTechStack, saveTechStack } from '../../utils/dataManager';
import {
  getDefaultTechStack,
  saveDefaultTechStack,
  resetSectionToDefault
} from '../../utils/defaultsManager';
import ResetToDefaultModal from './ResetToDefaultModal';
import { auditLog } from '../../utils/security';

const LIVE_TAB     = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
const DEFAULT_TAB  = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
const INACTIVE_TAB = 'text-gray-500 hover:text-white border-transparent';

const TechStackManager = () => {
  const [mode, setMode]       = useState('live');
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [status, setStatus]   = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const showStatus = (msg, isError = false) => {
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

  const handleAddKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAdd(); }
  };

  const handleRemove = (item) => setItems(prev => prev.filter(i => i !== item));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = mode === 'live'
        ? await saveTechStack(items)
        : await saveDefaultTechStack(items);
      showStatus(result.success ? `${mode.toUpperCase()}_TECH_STACK_SAVED` : result.message, !result.success);
      auditLog(`TECH_STACK_SAVED_${mode.toUpperCase()}`, { count: items.length });
    } catch (err) {
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
    } catch (err) {
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
            <Code2 size={14} /> <span>/ TECH_STACK_DB</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Tech Stack <span className="text-gray-600">Skills</span></h1>
          <p className="text-gray-600 text-xs mt-1">Each chip is one technology. Shown on the About page.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 bg-white/5 border border-white/10 p-1">
          {[['live', 'LIVE_DATA', LIVE_TAB], ['defaults', 'DEFAULTS', DEFAULT_TAB]].map(([val, label, active]) => (
            <button key={val} onClick={() => setMode(val)}
              className={`px-4 py-2 text-xs font-mono transition-all border ${mode === val ? active : INACTIVE_TAB}`}>
              {val === 'live' ? '⬤' : '◎'} {label}
            </button>
          ))}
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
          ◎ EDITING DEFAULTS — Changes here do not affect the live site until you "Reset to Default".
        </div>
      )}

      {/* Add new item */}
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={handleAddKey}
          placeholder="e.g. TypeScript (press Enter)"
          className="flex-1 bg-black/40 border border-white/10 focus:border-cyan-500 p-3 text-white font-mono text-sm focus:outline-none placeholder-gray-700 transition-colors"
        />
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-colors">
          <Plus size={14} /> ADD
        </button>
      </div>

      {/* Chips */}
      {loading ? (
        <div className="text-gray-600 text-sm">LOADING_STACK...</div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-8 min-h-[80px] p-4 bg-white/[0.02] border border-white/5">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div key={item} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/15 hover:border-cyan-500/40 text-sm text-white font-mono transition-colors">
                <span>{item}</span>
                <button onClick={() => handleRemove(item)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-1 opacity-0 group-hover:opacity-100">
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && <p className="text-gray-700 text-sm">No technologies. Add one above.</p>}
        </div>
      )}

      <p className="text-gray-700 text-xs mb-8 font-mono">{items.length} TECHNOLOGIES_LOADED</p>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
        <button onClick={handleSave} disabled={isSaving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold hover:bg-cyan-400 transition-colors disabled:opacity-40">
          <Save size={14} />
          {isSaving ? 'SAVING...' : `SAVE_${mode.toUpperCase()}_STACK`}
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
        sectionName="Tech Stack"
        isLoading={isResetting}
      />
    </div>
  );
};

export default TechStackManager;
