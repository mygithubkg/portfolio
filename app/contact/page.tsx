"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaInstagram, FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Wifi, Clock, Copy, Check, ChevronDown, AlertTriangle } from 'lucide-react';
import emailjs from 'emailjs-com';
import { useData } from '@/context/DataContext';
import { contactSchema } from '@/lib/utils/validation';
import { sanitizeInput } from '@/lib/utils/security';

// Icon mapping for string identifiers
const iconMap: any = {
  FaLinkedin: <FaLinkedin />,
  FaGithub: <FaGithub />,
  FaEnvelope: <FaEnvelope />,
  FaInstagram: <FaInstagram />,
  FaMapMarkerAlt: <FaMapMarkerAlt />
};

type FieldErrors = { name?: string; email?: string; message?: string };

const RESET_DELAY_MS = 5000;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const { data, loading } = useData();
  const contactData = data?.contact || {};
  const socials = data?.socials || [];

  const contactDetails = contactData ? [
    {
      icon: iconMap.FaEnvelope || <FaEnvelope />,
      label: 'EMAIL',
      value: contactData.email || 'your@email.com',
      href: `mailto:${contactData.email || 'your@email.com'}`
    },
    {
      icon: iconMap.FaMapMarkerAlt || <FaMapMarkerAlt />,
      label: 'LOCATION',
      value: contactData.location || 'Your Location',
      href: '#'
    }
  ] : [];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Actually IST — explicit timeZone, not the visitor's local clock relabeled.
  const istFormatter = useMemo(
    () => new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    }),
    []
  );

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

  const scheduleReset = () => {
    setTimeout(() => setStatus('IDLE'), RESET_DELAY_MS);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation now surfaces through the page's own status system —
    // inline, per-field, mono-voice — instead of a native alert().
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
      setErrorMessage('VALIDATION_FAILED: check the highlighted fields below.');
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
      console.error('EmailJS Env Variables Missing');
      setStatus('ERROR');
      setErrorMessage('CONFIG_ERROR: transmission channel unavailable. Try emailing directly.');
      scheduleReset();
      return;
    }

    try {
      await emailjs.send(serviceID, templateID, {
        from_name: safeName,
        from_email: safeEmail,
        // Removed the appended "This message is from {email}" debug string —
        // it duplicated what reply_to already provides and wasn't intentional copy.
        message: safeMessage,
        reply_to: safeEmail,
      }, publicKey);

      setStatus('SUCCESS');
      setForm({ name: '', email: '', message: '' });
      scheduleReset();

    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('ERROR');
      setErrorMessage('TRANSMISSION_FAILED: please try again or email directly.');
      scheduleReset();
    }
  };

  const fields = [
    { name: 'name', label: 'FULL_NAME', type: 'text', as: 'input' as const },
    { name: 'email', label: 'EMAIL_ADDRESS', type: 'email', as: 'input' as const },
    { name: 'message', label: 'MESSAGE_CONTENT', type: 'text', as: 'textarea' as const },
  ];

  const packetSummary = `{ status: "${status}", sender: "${form.name || 'pending...'}" }`;

  return (
    <section className="min-h-screen py-24 bg-[#050505] relative overflow-hidden flex flex-col justify-center">

      {/* Background Ambience — both orbs cyan now; purple is reserved
          exclusively for the JSON payload preview (see problem 5). */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[80%] mx-auto px-6 relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-cyan-500 font-mono text-xs mb-4"
            >
              <Wifi size={14} className="animate-pulse" />
              <span>UPLINK_ESTABLISHED</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter"
            >
              CONTACT <span className="text-gray-700">ME.</span>
            </motion.h2>
          </div>

          {/* Time badge now formatted explicitly in Asia/Kolkata — actually IST
              regardless of the visitor's own timezone. */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden md:flex flex-col items-end text-right font-mono text-xs text-gray-500"
          >
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt /> Chandigarh, India
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} /> {mounted ? istFormatter.format(time) : '--:--'} IST
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* --- LEFT COLUMN: THE FORM & DIRECT CONTACTS --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            {/* Mobile/tablet condensed packet summary — the signature element
                shown to every visitor, not just desktop (problem 4). */}
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(o => !o)}
              aria-expanded={mobilePreviewOpen}
              aria-controls="mobile-packet-preview"
              className="lg:hidden w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] bg-[#0a0a0a] border border-white/10 text-left"
            >
              <span className="font-mono text-[11px] text-gray-400 truncate">
                <span className="text-cyan-500">packet</span> {packetSummary}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-3 bg-cyan-500 ml-1 align-middle"
                />
              </span>
              <ChevronDown size={14} className={`text-gray-500 flex-shrink-0 transition-transform ${mobilePreviewOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobilePreviewOpen && (
                <motion.div
                  id="mobile-packet-preview"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden -mt-8"
                >
                  <JsonPreviewBody status={status} form={form} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page-level error summary — replaces alert() for both
                validation and config/transmission failures. */}
            <AnimatePresence>
              {status === 'ERROR' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="alert"
                  className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-red-500/5 border border-red-500/20 text-red-400 font-mono text-xs"
                >
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1. The Interactive Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {fields.map(({ name, label, type, as }) => {
                const fieldId = `contact-${name}`;
                const errorId = `contact-${name}-error`;
                const value = (form as any)[name];
                const hasError = !!(fieldErrors as any)[name];
                const isActive = activeField === name || value;

                const sharedProps = {
                  id: fieldId,
                  name,
                  value,
                  onChange: handleChange,
                  onFocus: () => setActiveField(name),
                  onBlur: () => setActiveField(null),
                  required: true,
                  'aria-required': 'true' as const,
                  'aria-invalid': hasError,
                  'aria-describedby': hasError ? errorId : undefined,
                  className: `w-full bg-transparent border-b py-4 text-xl text-white focus:outline-none transition-colors ${hasError ? 'border-red-500/50 focus:border-red-400' : 'border-white/20 focus:border-cyan-500'
                    }`,
                };

                return (
                  <div className="relative group" key={name}>
                    <label
                      htmlFor={fieldId}
                      className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono text-xs ${isActive ? '-top-6 text-cyan-500' : 'top-4 text-gray-500'
                        } ${hasError ? 'text-red-400' : ''}`}
                    >
                      {label} *<span className="sr-only"> (required)</span>
                    </label>
                    {as === 'textarea' ? (
                      <textarea rows={4} {...sharedProps} className={`${sharedProps.className} resize-none`} />
                    ) : (
                      <input type={type} {...sharedProps} />
                    )}
                    {hasError && (
                      <p id={errorId} role="alert" className="mt-2 font-mono text-[11px] text-red-400">
                        {(fieldErrors as any)[name]}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={status === 'SENDING' || status === 'SUCCESS'}
                className={`group relative px-8 py-4 bg-white text-black font-bold text-sm tracking-widest overflow-hidden transition-all w-full md:w-auto rounded-[8px]
                  ${status === 'SUCCESS' ? 'bg-green-500 text-white' : ''}
                  ${status === 'ERROR' ? 'bg-red-500 text-white' : 'hover:bg-cyan-400'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === 'IDLE' && <>SEND MESSAGE <FaPaperPlane /></>}
                  {status === 'SENDING' && <>TRANSMITTING... <Wifi className="animate-pulse" /></>}
                  {status === 'SUCCESS' && <>TRANSMISSION COMPLETE <Check /></>}
                  {status === 'ERROR' && <>ERROR: RETRY</>}
                </span>
              </button>
            </form>

            {/* 2. Direct Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {contactDetails.map((detail, idx) => (
                <a
                  key={idx}
                  href={detail.href}
                  className="group flex flex-col gap-2"
                >
                  <div className="text-gray-500 text-[10px] font-mono tracking-widest flex items-center gap-2 group-hover:text-cyan-500 transition-colors">
                    {detail.icon} {detail.label}
                  </div>
                  <div className="text-white font-medium text-sm break-words">
                    {detail.value}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN: THE VISUALIZER & SOCIALS --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-8"
          >
            {/* 1. Live JSON Preview (desktop) — purple glow is the one
                deliberate, scoped use of the secondary accent. */}
            <div className="hidden lg:block relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[12px] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative rounded-[12px] overflow-hidden">
                <JsonPreviewBody status={status} form={form} />
              </div>
            </div>

            {/* 2. Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {loading ? (
                <div className="text-center text-gray-500 text-xs">Loading...</div>
              ) : (
                socials.map((social: any, i: number) => {
                  const IconComponent = typeof social.icon === 'string' ? iconMap[social.icon] : social.icon;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-4 border border-white/5 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all group rounded-[8px]"
                    >
                      <span className="text-gray-400 group-hover:text-cyan-400 text-xl transition-colors">
                        {IconComponent || social.icon}
                      </span>
                      <div>
                        <div className="text-white text-sm font-bold">{social.label}</div>
                        <div className="text-gray-600 text-[10px] font-mono group-hover:text-cyan-500/70">{social.username}</div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* Shared window chrome + packet body — used by both the desktop panel
   and the mobile expanded view, so they can never drift out of sync. */
function JsonPreviewBody({ status, form }: { status: string; form: { name: string; email: string; message: string } }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-[12px] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
        <div className="font-mono text-xs text-gray-500">payload_preview.json</div>
        <Copy className="text-gray-600 w-3 h-3" />
      </div>

      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
        <div className="text-gray-600 mb-2">// Constructing Data Packet...</div>
        <div>
          <span className="text-purple-400">const</span> <span className="text-yellow-200">packet</span> <span className="text-white">=</span> <span className="text-blue-300">{'{'}</span>
        </div>
        <div className="pl-6">
          <span className="text-cyan-400">"status"</span>: <span className={status === 'SUCCESS' ? 'text-green-400' : status === 'ERROR' ? 'text-red-400' : 'text-yellow-400'}>"{status}"</span>,
        </div>
        <div className="pl-6">
          <span className="text-cyan-400">"sender"</span>: <span className="text-green-300">"{form.name || 'Anonymous'}"</span>,
        </div>
        <div className="pl-6">
          <span className="text-cyan-400">"email"</span>: <span className="text-green-300">"{form.email || 'pending...'}"</span>,
        </div>
        <div className="pl-6">
          <span className="text-cyan-400">"message"</span>: <span className="text-green-300 break-all">"{form.message || '...'}"</span>
        </div>
        <div><span className="text-blue-300">{'}'}</span>;</div>

        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-cyan-500 inline-block mt-2"
        />
      </div>
    </div>
  );
}