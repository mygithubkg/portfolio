import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaEnvelope, FaGithub, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Card, Section, Button } from './ui';
import emailjs from 'emailjs-com';

export default function Contact() {
  const socials = [
    { 
      Icon: FaLinkedin, 
      url: 'https://www.linkedin.com/in/karrtik-gupta/', 
      label: 'LinkedIn', 
      color: 'hover:text-[#0077b5]',
      description: 'Connect professionally'
    },
    { 
      Icon: FaGithub, 
      url: 'https://github.com/mygithubkg', 
      label: 'GitHub', 
      color: 'hover:text-[#333]',
      description: 'View my code'
    },
    { 
      Icon: FaEnvelope, 
      url: 'mailto:karrtikgupta9@gmail.com', 
      label: 'Email', 
      color: 'hover:text-accent',
      description: 'Send email'
    },
    { 
      Icon: FaInstagram, 
      url: 'https://www.instagram.com/karrtik_gupta/', 
      label: 'Instagram', 
      color: 'hover:text-[#e4405f]',
      description: 'See my life'
    },
  ];

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
    setLoading(true);
  
    // Check if env variables are present
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
    if (!serviceID || !templateID || !publicKey) {
      alert('Email service configuration is missing. Please check environment variables.');
      setLoading(false);
      return;
    }
  
    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      subject: form.subject,
      message: form.message + " My mail is" + form.email + " and my name is" + form.name + " and my subject is" + form.subject,
    };
  
    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
  
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };
  

  return (
    <Section className="py-16 sm:py-24 lg:py-32 relative" container={false}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/10 to-background" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-accentLight/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-accent font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Get In Touch
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Let's Build Something{' '}
            <span className="bg-gradient-to-r from-accent to-accentLight bg-clip-text text-blue-300">
              Amazing Together
            </span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-textSecondary max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            I'm always open to discussing new opportunities, interesting projects, 
            or just having a chat about technology and innovation.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Send me a message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-surface/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-textSecondary transition-all duration-200 ${
                        errors.name ? 'border-error' : 'border-border'
                      }`}
                      required
                    />
                    {errors.name && (
                      <motion.p
                        className="text-error text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-surface/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-textSecondary transition-all duration-200 ${
                        errors.email ? 'border-error' : 'border-border'
                      }`}
                      required
                    />
                    {errors.email && (
                      <motion.p
                        className="text-error text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-surface/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-textSecondary transition-all duration-200 ${
                      errors.subject ? 'border-error' : 'border-border'
                    }`}
                    required
                  />
                  {errors.subject && (
                    <motion.p
                      className="text-error text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-surface/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-textSecondary transition-all duration-200 resize-none ${
                      errors.message ? 'border-error' : 'border-border'
                    }`}
                    required
                  />
                  {errors.message && (
                    <motion.p
                      className="text-error text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    loading
                      ? 'bg-surface/50 text-textSecondary cursor-not-allowed'
                      : 'bg-accent text-white hover:bg-accent/90 hover:shadow-glow'
                  }`}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-textSecondary border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
              
              {/* Success Message */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-green-400 text-sm sm:text-base">
                      ✅ Message sent successfully! I'll get back to you soon.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {/* Contact Info */}
              <Card className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Let's connect</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-accent text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <a 
                        href="mailto:karrtikgupta9@gmail.com" 
                        className="text-accent hover:text-accentLight transition-colors text-sm sm:text-base"
                      >
                        karrtikgupta9@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FaLinkedin className="text-accent text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">LinkedIn</p>
                      <a 
                        href="https://www.linkedin.com/in/karrtik-gupta/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accentLight transition-colors text-sm sm:text-base"
                      >
                        karrtik-gupta
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FaGithub className="text-accent text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">GitHub</p>
                      <a 
                        href="https://github.com/mygithubkg" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accentLight transition-colors text-sm sm:text-base"
                      >
                        mygithubkg
                      </a>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Follow me</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socials.map((social, index) => (
                    <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center justify-center text-center gap-2 p-4 bg-surface/50 backdrop-blur-sm border border-border rounded-xl hover:bg-surface/80 hover:border-accent/30 transition-all duration-300 ${social.color} w-full min-h-[120px]`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <social.Icon className="text-2xl sm:text-3xl" />
                    <div className="text-center space-y-1">
                      <p className="text-white font-medium text-sm sm:text-base">{social.label}</p>
                      <p className="text-textSecondary text-xs sm:text-sm whitespace-normal">{social.description}</p>
                    </div>
                  </motion.a>
                  
                  
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}


