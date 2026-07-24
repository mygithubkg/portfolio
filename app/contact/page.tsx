"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaInstagram, FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Wifi, Clock, Copy, Check, ChevronDown, AlertTriangle } from 'lucide-react';
import emailjs from 'emailjs-com';
import { useData } from '@/context/DataContext';
import { contactSchema } from '@/lib/utils/validation';
import { sanitizeInput } from '@/lib/utils/security';

const iconMap: any = {
  FaLinkedin: <FaLinkedin />,
  FaGithub: <FaGithub />,
  FaEnvelope: <FaEnvelope />,
  FaInstagram: <FaInstagram />,
  FaMapMarkerAlt: <FaMapMarkerAlt />,
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
      setStatus('ERROR');
      setErrorMessage('CONFIG_ERROR: transmission channel unavailable. Try emailing directly.');
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
    <section
      className="min-h-screen py-20 pb-32 md:pb-24 relative overflow-hidden flex flex-col justify-center"
      style={{ background: 'var(--bg-hero)', color: 'var(--ink)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: 'var(--accent-dim)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{ background: 'var(--accent-dim)' }} />

      <div className="w-[92%] md:w-[80%] mx-auto px-4 md:px-6 relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-10 md:mb-16 md:flex justify-between items-end pb-8"
          style={{ borderBottom: '1px solid var(--rule)' }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 font-mono text-xs mb-4"
              style={{ color: 'var(--accent)' }}
            >
              <Wifi size={14} className="animate-pulse" />
              <span>UPLINK_ESTABLISHED</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[11vw] sm:text-5xl md:text-7xl font-black tracking-tighter leading-none"
              style={{ color: 'var(--ink)' }}
            >
              CONTACT <span style={{ color: 'var(--ink-faint)' }}>ME.</span>
            </motion.h1>
          </div>

          {/* Desktop time telemetry */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden md:flex flex-col items-end text-right font-mono text-xs"
            style={{ color: 'var(--ink-faint)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt /> Chandigarh, India
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} /> {mounted ? istFormatter.format(time) : '--:--'} IST
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">

          {/* --- LEFT: FORM + DIRECT CONTACTS --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Mobile packet preview toggle */}
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(o => !o)}
              aria-expanded={mobilePreviewOpen}
              aria-controls="mobile-packet-preview"
              className="lg:hidden w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] text-left transition-all"
              style={{
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-card)',
              }}
            >
              <span className="font-mono text-[11px] truncate" style={{ color: 'var(--ink-dim)' }}>
                <span style={{ color: 'var(--accent)' }}>packet</span> {packetSummary}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-3 ml-1 align-middle"
                  style={{ background: 'var(--accent)' }}
                />
              </span>
              <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${mobilePreviewOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--ink-faint)' }} />
            </button>
            <AnimatePresence>
              {mobilePreviewOpen && (
                <motion.div
                  id="mobile-packet-preview"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden -mt-4"
                >
                  <JsonPreviewBody status={status} form={form} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Validation / error banner */}
            <AnimatePresence>
              {status === 'ERROR' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="alert"
                  className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] font-mono text-xs"
                  style={{
                    background: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                  }}
                >
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-10">
              {fields.map(({ name, label, type, as }) => {
                const fieldId = `contact-${name}`;
                const errorId = `contact-${name}-error`;
                const value = (form as any)[name];
                const hasError = !!(fieldErrors as any)[name];
                const isActive = activeField === name || value;

                return (
                  <div className="relative group" key={name}>
                    <label
                      htmlFor={fieldId}
                      className="absolute left-0 transition-all duration-300 pointer-events-none font-mono text-xs"
                      style={{
                        top: isActive ? '-1.5rem' : '1rem',
                        color: hasError ? '#f87171' : isActive ? 'var(--accent)' : 'var(--ink-faint)',
                      }}
                    >
                      {label} *<span className="sr-only"> (required)</span>
                    </label>
                    {as === 'textarea' ? (
                      <textarea
                        id={fieldId}
                        name={name}
                        rows={4}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setActiveField(name)}
                        onBlur={() => setActiveField(null)}
                        required
                        aria-required="true"
                        aria-invalid={hasError}
                        aria-describedby={hasError ? errorId : undefined}
                        className="w-full bg-transparent py-4 text-xl focus:outline-none transition-colors resize-none"
                        style={{
                          borderBottom: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : isActive ? 'var(--accent)' : 'var(--rule-strong)'}`,
                          color: 'var(--ink)',
                        }}
                      />
                    ) : (
                      <input
                        id={fieldId}
                        name={name}
                        type={type}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setActiveField(name)}
                        onBlur={() => setActiveField(null)}
                        required
                        aria-required="true"
                        aria-invalid={hasError}
                        aria-describedby={hasError ? errorId : undefined}
                        className="w-full bg-transparent py-4 text-xl focus:outline-none transition-colors"
                        style={{
                          borderBottom: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : isActive ? 'var(--accent)' : 'var(--rule-strong)'}`,
                          color: 'var(--ink)',
                        }}
                      />
                    )}
                    {hasError && (
                      <p id={errorId} role="alert" className="mt-2 font-mono text-[11px]" style={{ color: '#f87171' }}>
                        {(fieldErrors as any)[name]}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={status === 'SENDING' || status === 'SUCCESS'}
                className="group relative px-8 py-4 font-bold text-sm tracking-widest overflow-hidden transition-all w-full md:w-auto rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                style={{
                  background: status === 'SUCCESS' ? '#22c55e'
                    : status === 'ERROR' ? '#ef4444'
                      : 'var(--ink)',
                  color: 'var(--ink-invert)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === 'IDLE' && <>SEND MESSAGE <FaPaperPlane /></>}
                  {status === 'SENDING' && <>TRANSMITTING... <Wifi className="animate-pulse" /></>}
                  {status === 'SUCCESS' && <>TRANSMISSION COMPLETE <Check /></>}
                  {status === 'ERROR' && <>ERROR: RETRY</>}
                </span>
              </button>
            </form>

            {/* Direct contact links */}
            <div className="grid grid-cols-1 gap-4 pt-8" style={{ borderTop: '1px solid var(--rule)' }}>
              {contactDetails.map((detail, idx) => (
                <a
                  key={idx}
                  href={detail.href}
                  className="group flex items-center gap-4 p-4 rounded-2xl transition-all"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-card)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: 'var(--rule)', color: 'var(--accent)' }}>
                    {detail.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase mb-0.5" style={{ color: 'var(--ink-faint)' }}>
                      {detail.label}
                    </div>
                    <div className="font-medium text-sm break-words" style={{ color: 'var(--ink)' }}>
                      {detail.value}
                    </div>
                  </div>
                </a>
              ))}

              {/* Mobile time/location strip */}
              <div className="md:hidden flex gap-3">
                <div className="flex-1 flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-card)' }}>
                  <FaMapMarkerAlt style={{ color: 'var(--accent)' }} />
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-dim)' }}>Chandigarh, IN</span>
                </div>
                <div className="flex-1 flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-card)' }}>
                  <Clock size={14} style={{ color: 'var(--accent)' }} />
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-dim)' }}>
                    {mounted ? istFormatter.format(time) : '--:--'} IST
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: JSON PREVIEW + SOCIALS --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            {/* Desktop JSON preview with glow border */}
            <div className="hidden lg:block relative group">
              <div className="absolute -inset-1 rounded-[14px] blur opacity-20 group-hover:opacity-40 transition duration-1000"
                style={{ background: 'linear-gradient(135deg, var(--accent), #a855f7)' }} />
              <div className="relative rounded-[12px] overflow-hidden">
                <JsonPreviewBody status={status} form={form} />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {loading ? (
                <div className="text-center text-xs" style={{ color: 'var(--ink-faint)' }}>Loading...</div>
              ) : (
                socials.map((social: any, i: number) => {
                  const IconComponent = typeof social.icon === 'string' ? iconMap[social.icon] : social.icon;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-4 rounded-[12px] transition-all group"
                      style={{
                        border: '1px solid var(--border-card)',
                        background: 'var(--bg-raised)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-rule)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-raised)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)';
                      }}
                    >
                      <span className="text-xl transition-colors" style={{ color: 'var(--ink-dim)' }}>
                        {IconComponent || social.icon}
                      </span>
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{social.label}</div>
                        <div className="text-[10px] font-mono" style={{ color: 'var(--ink-faint)' }}>{social.username}</div>
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

/* Shared JSON preview panel — used by both desktop and mobile */
function JsonPreviewBody({ status, form }: { status: string; form: { name: string; email: string; message: string } }) {
  return (
    <div className="rounded-[12px] overflow-hidden shadow-2xl"
      style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-card)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--rule)', borderBottom: '1px solid var(--border-card)' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.4)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.4)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.4)' }} />
        </div>
        <div className="font-mono text-xs" style={{ color: 'var(--ink-faint)' }}>payload_preview.json</div>
        <Copy className="w-3 h-3" style={{ color: 'var(--ink-faint)' }} />
      </div>

      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
        <div className="mb-2" style={{ color: 'var(--ink-faint)' }}>// Constructing Data Packet...</div>
        <div>
          <span className="text-purple-400">const</span>{' '}
          <span className="text-yellow-300">packet</span>{' '}
          <span style={{ color: 'var(--ink)' }}>=</span>{' '}
          <span className="text-blue-400">{'{'}</span>
        </div>
        <div className="pl-6">
          <span style={{ color: 'var(--accent)' }}>"status"</span>:{' '}
          <span style={{ color: status === 'SUCCESS' ? '#4ade80' : status === 'ERROR' ? '#f87171' : '#facc15' }}>
            "{status}"
          </span>,
        </div>
        <div className="pl-6">
          <span style={{ color: 'var(--accent)' }}>"sender"</span>:{' '}
          <span className="text-green-400">"{form.name || 'Anonymous'}"</span>,
        </div>
        <div className="pl-6">
          <span style={{ color: 'var(--accent)' }}>"email"</span>:{' '}
          <span className="text-green-400">"{form.email || 'pending...'}"</span>,
        </div>
        <div className="pl-6">
          <span style={{ color: 'var(--accent)' }}>"message"</span>:{' '}
          <span className="text-green-400 break-all">"{form.message || '...'}"</span>
        </div>
        <div><span className="text-blue-400">{'}'}</span>;</div>
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 inline-block mt-2"
          style={{ background: 'var(--accent)' }}
        />
      </div>
    </div>
  );
}