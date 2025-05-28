import React from 'react';
import { motion } from 'framer-motion';

function Contact() {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center bg-[url('/your-pattern.png')] bg-cover bg-center bg-no-repeat text-white px-4"
    >
      <motion.div
        className="max-w-xl w-full bg-[#0D47A1]/90 backdrop-blur-md rounded-2xl shadow-2xl p-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">📬 Contact Me</h2>
        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full bg-[#102027] border border-cyan-500 rounded-lg px-4 py-3 placeholder:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full bg-[#102027] border border-cyan-500 rounded-lg px-4 py-3 placeholder:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full bg-[#102027] border border-cyan-500 rounded-lg px-4 py-3 placeholder:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          ></textarea>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Send Message
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-cyan-100 mb-4">Or connect with me:</p>
          <div className="flex justify-center gap-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#263238] text-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#263238] text-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition"
            >
              GitHub
            </a>
            <a
              href="mailto:your@email.com"
              className="bg-[#263238] text-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition"
            >
              Email
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
