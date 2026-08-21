"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import emailjs from 'emailjs-com';
import { useData } from '@/context/DataContext';
import { contactSchema } from '@/lib/utils/validation';
import { sanitizeInput } from '@/lib/utils/security';

type FieldErrors = { name?: string; email?: string; message?: string };
const RESET_DELAY_MS = 5000;

// --- DESKTOP VIEW ---
function DesktopView({ form, status, errorMessage, fieldErrors, handleChange, handleSubmit, socials }: any) {
  return (
    <div className="hidden lg:grid grid-cols-12 max-w-[1400px] mx-auto min-h-[80vh] items-start pt-24 px-12 pb-32">
      {/* Left Column: The Identity Hook */}
      <div className="col-span-5 flex flex-col h-full">
        <div className="flex flex-col gap-6 flex-1">
          <div className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {'>_'} STATUS: SYSTEM ONLINE / ACCEPTING TRANSMISSIONS.
          </div>
          <h1 className="font-display text-7xl xl:text-8xl tracking-tight leading-[1.1] text-text text-balance">
            Initiate Contact.
          </h1>
        </div>

        <div className="mt-auto pt-24 flex flex-col gap-4">
          <span className="font-mono text-[10px] text-textSecondary uppercase tracking-widest">Global Links</span>
          <div className="flex flex-col gap-3">
            {socials.map((social: any) => (
              <a 
                key={social.label} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-sm text-text hover:text-accent flex items-center gap-1 group w-fit transition-colors"
              >
                <span className="group-hover:underline underline-offset-4 decoration-accent">{social.label}</span>
                <ArrowRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:-rotate-45 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: The Requisition Form */}
      <div className="col-start-7 col-span-6 flex flex-col pt-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          
          {/* Error Banner */}
          <AnimatePresence>
            {status === 'ERROR' && errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="font-mono text-xs text-error flex items-center gap-2 bg-error/10 p-4 rounded-sm border border-error/20"
              >
                <AlertTriangle size={14} /> {errorMessage}
              </motion.div>
            )}
            {status === 'SUCCESS' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="font-mono text-xs text-success flex items-center gap-2 bg-success/10 p-4 rounded-sm border border-success/20"
              >
                PAYLOAD TRANSMITTED SUCCESSFULLY.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2 relative">
            <label className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Full Name</label>
            <input 
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={status === 'SENDING'}
              className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 font-sans text-xl text-text focus:ring-0 focus:border-accent transition-colors placeholder-transparent focus:outline-none"
            />
            {fieldErrors.name && <span className="absolute -bottom-6 right-0 font-mono text-[10px] text-error uppercase">{fieldErrors.name}</span>}
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Email Address</label>
            <input 
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={status === 'SENDING'}
              className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 font-sans text-xl text-text focus:ring-0 focus:border-accent transition-colors placeholder-transparent focus:outline-none"
            />
            {fieldErrors.email && <span className="absolute -bottom-6 right-0 font-mono text-[10px] text-error uppercase">{fieldErrors.email}</span>}
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-mono text-[10px] uppercase tracking-widest text-textSecondary">Message Content</label>
            <textarea 
              name="message"
              value={form.message}
              onChange={handleChange}
              disabled={status === 'SENDING'}
              rows={4}
              className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 font-sans text-xl text-text focus:ring-0 focus:border-accent transition-colors placeholder-transparent focus:outline-none resize-none"
            />
            {fieldErrors.message && <span className="absolute -bottom-6 right-0 font-mono text-[10px] text-error uppercase">{fieldErrors.message}</span>}
          </div>

          <div className="flex justify-end pt-8">
             <button 
               type="submit" 
               disabled={status === 'SENDING'}
               className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-text hover:text-accent transition-colors disabled:opacity-50"
             >
               {status === 'SENDING' ? (
                 <span className="animate-pulse">Transmitting...</span>
               ) : (
                 <>
                   Transmit Payload <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- MOBILE VIEW ---
function MobileView({ form, status, errorMessage, fieldErrors, handleChange, handleSubmit, socials }: any) {
  return (
    <div className="block lg:hidden w-full min-h-screen px-6 pt-24 pb-32 flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-16">
         <div className="font-mono text-[10px] uppercase tracking-widest text-accent flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            SYSTEM ONLINE
         </div>
         <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-tight text-text">
           Initiate<br/>Contact.
         </h1>
      </div>

      {/* The Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1 w-full max-w-lg mx-auto">
         <AnimatePresence>
           {status === 'ERROR' && errorMessage && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }} 
               animate={{ opacity: 1, height: 'auto' }} 
               exit={{ opacity: 0, height: 0 }}
               className="font-mono text-[10px] text-error uppercase text-center"
             >
               {errorMessage}
             </motion.div>
           )}
           {status === 'SUCCESS' && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }} 
               animate={{ opacity: 1, height: 'auto' }} 
               exit={{ opacity: 0, height: 0 }}
               className="font-mono text-[10px] text-success uppercase text-center"
             >
               PAYLOAD TRANSMITTED SUCCESSFULLY.
             </motion.div>
           )}
         </AnimatePresence>

         <div className="flex flex-col relative">
            <label className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-2">Name</label>
            <input 
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={status === 'SENDING'}
              className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 font-sans text-lg text-text focus:ring-0 focus:border-accent transition-colors focus:outline-none"
            />
            {fieldErrors.name && <span className="absolute -bottom-5 right-0 font-mono text-[10px] text-error uppercase">{fieldErrors.name}</span>}
         </div>

         <div className="flex flex-col relative mt-4">
            <label className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-2">Email</label>
            <input 
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={status === 'SENDING'}
              className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 font-sans text-lg text-text focus:ring-0 focus:border-accent transition-colors focus:outline-none"
            />
            {fieldErrors.email && <span className="absolute -bottom-5 right-0 font-mono text-[10px] text-error uppercase">{fieldErrors.email}</span>}
         </div>

         <div className="flex flex-col relative mt-4">
            <label className="font-mono text-[10px] uppercase tracking-widest text-textSecondary mb-2">Message</label>
            <textarea 
              name="message"
              value={form.message}
              onChange={handleChange}
              disabled={status === 'SENDING'}
              rows={3}
              className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 font-sans text-lg text-text focus:ring-0 focus:border-accent transition-colors focus:outline-none resize-none"
            />
            {fieldErrors.message && <span className="absolute -bottom-5 right-0 font-mono text-[10px] text-error uppercase">{fieldErrors.message}</span>}
         </div>

         <div className="mt-8">
           <button 
             type="submit" 
             disabled={status === 'SENDING'}
             className="w-full bg-text text-background py-4 rounded-xl font-sans font-bold text-lg disabled:opacity-70 transition-opacity"
           >
             {status === 'SENDING' ? (
               <span className="animate-pulse">Transmitting...</span>
             ) : (
               'Transmit Payload'
             )}
           </button>
         </div>
      </form>

      {/* Socials Footer */}
      <div className="mt-24 pt-8 border-t border-border w-full flex overflow-x-auto snap-x hide-scrollbar gap-8 max-w-lg mx-auto">
         {socials.map((social: any) => (
           <a 
             key={social.label} 
             href={social.url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="snap-start shrink-0 font-mono text-xs text-textSecondary hover:text-text flex items-center gap-1 transition-colors uppercase tracking-widest"
           >
             {social.label} <ArrowRight size={10} className="-rotate-45" />
           </a>
         ))}
      </div>
    </div>
  )
}

// --- MAIN WRAPPER (LOGIC RETAINED) ---
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { data } = useData();
  const socials = data?.socials || [];

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearFieldError(name as keyof FieldErrors);
    if (status === 'ERROR') {
      setStatus('IDLE');
      setErrorMessage(null);
    }
  };

  const scheduleReset = () => setTimeout(() => setStatus('IDLE'), RESET_DELAY_MS);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await contactSchema.validate(form, { abortEarly: false });
      setFieldErrors({});
    } catch (validationError: any) {
      const nextErrors: FieldErrors = {};
      (validationError.inner || [validationError]).forEach((err: any) => {
        const path = err.path as keyof FieldErrors;
        if (path && !nextErrors[path]) nextErrors[path] = err.message;
      });
      setFieldErrors(nextErrors);
      setStatus('ERROR');
      setErrorMessage('VALIDATION_FAILED: Check highlighted fields.');
      scheduleReset();
      return;
    }

    const safeName = sanitizeInput(form.name);
    const safeEmail = sanitizeInput(form.email);
    const safeMessage = sanitizeInput(form.message);
    setStatus('SENDING');

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

    if (!serviceID || !templateID || !publicKey) {
      setStatus('ERROR');
      setErrorMessage('CONFIG_ERROR: transmission channel unavailable.');
      scheduleReset();
      return;
    }

    try {
      await emailjs.send(serviceID, templateID, {
        from_name: safeName,
        from_email: safeEmail,
        message: safeMessage,
        reply_to: safeEmail,
      }, publicKey);
      setStatus('SUCCESS');
      setForm({ name: '', email: '', message: '' });
      scheduleReset();
    } catch (error) {
      setStatus('ERROR');
      setErrorMessage('TRANSMISSION_FAILED: please try again.');
      scheduleReset();
    }
  };

  const props = {
    form,
    status,
    errorMessage,
    fieldErrors,
    handleChange,
    handleSubmit,
    socials
  };

  return (
    <section className="w-full min-h-screen bg-background text-text selection:bg-accent/20 selection:text-accent relative">
      <DesktopView {...props} />
      <MobileView {...props} />
    </section>
  );
}
