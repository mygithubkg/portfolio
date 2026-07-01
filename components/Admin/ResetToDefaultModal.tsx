"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, RotateCcw } from 'lucide-react';

/**
 * ResetToDefaultModal
 *
 * Shared confirmation modal used across all admin manager components.
 * Requires the user to type "RESET" before the confirm button activates.
 *
 * Props:
 *   isOpen      {boolean}  — Whether the modal is visible
 *   onClose     {fn}       — Called when user cancels or closes
 *   onConfirm   {fn}       — Called when user confirms the reset (async-safe)
 *   sectionName {string}   — Human-readable section name for the warning message
 *   isLoading   {boolean}  — Shows a spinner on the confirm button
 */
const ResetToDefaultModal = ({ isOpen, onClose, onConfirm, sectionName = 'this section', isLoading = false }: any) => {
  const [confirmText, setConfirmText] = useState('');

  // Clear text whenever modal opens/closes
  useEffect(() => {
    if (!isOpen) setConfirmText('');
  }, [isOpen]);

  const canConfirm = confirmText === 'RESET' && !isLoading;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-amber-500/40 shadow-2xl overflow-hidden z-10"
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h2 className="text-sm font-bold text-white font-mono tracking-widest">RESET_TO_DEFAULT</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Warning message */}
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 mb-6 rounded">
                <p className="text-amber-300 text-sm leading-relaxed">
                  This will <span className="font-bold text-amber-200">overwrite all live "{sectionName}" data</span> with
                  the current Defaults version.
                </p>
                <p className="text-amber-500/80 text-xs mt-2 font-mono">
                  ⚠ This action cannot be undone. Visitors will immediately see the default content.
                </p>
              </div>

              {/* Confirmation input */}
              <div className="mb-6">
                <label className="block text-xs font-mono text-gray-400 mb-2">
                  Type <span className="text-amber-400 font-bold">RESET</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                  placeholder="RESET"
                  autoFocus
                  className="w-full bg-black/60 border border-white/10 focus:border-amber-500 p-3 text-white font-mono text-sm focus:outline-none transition-colors placeholder-gray-700"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold font-mono transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-900/40 disabled:text-amber-800 text-black text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      RESETTING...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={14} />
                      CONFIRM_RESET
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResetToDefaultModal;
