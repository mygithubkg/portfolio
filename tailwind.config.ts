import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--bg-raised)",
        text: "var(--text)",
        textSecondary: "var(--text-muted)",
        accent: "var(--accent)",
        accentLight: "var(--accent-secondary)",
        accentDark: "var(--accent-tertiary)",
        border: "var(--border)",
        success: "var(--success)",
        error: "var(--error)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-general-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      spacing: {
        section: "8rem",
        block: "6rem",
        group: "3rem",
        item: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
