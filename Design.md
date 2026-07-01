# Website Design Documentation

This document outlines the design system, layout structure, theme, color palette, typography, and interactive elements used across the portfolio website.

## 1. Overall Theme & Aesthetic
- **Minimalist & Modern:** The site features a dark, modern aesthetic tailored for a developer portfolio. It utilizes a deep dark background coupled with vibrant neon accents to create a "cyberpunk" or "sci-fi" vibe.
- **Glassmorphism:** A core design pattern used throughout the site. Elements like cards, modals, and navigation bars use translucent backgrounds with backdrop blurring to create depth.
- **Dynamic & Alive:** The design incorporates micro-animations, particle backgrounds, and fluid scrolling to make the interface feel highly interactive and premium.

## 2. Layout Structure
- **Responsive Mobile-First Architecture:** The layout relies on relative sizing (`rem`), scaling fluidly based on viewport widths using Tailwind CSS breakpoints (from mobile up to 1536px large screens).
- **Component-Driven:** The UI is constructed from reusable functional components (e.g., `Section`, `Card`, `Button`, `Header`, `Footer`), ensuring visual consistency.
- **Routing & Navigation:** Seamless client-side routing via React Router provides instant transitions between pages (Home, About, Services, Projects, Blog, Contact).
- **Admin Dashboard Layout:** A dedicated, protected section of the app that features content management interfaces (ProjectsManager, BlogManager, etc.) while maintaining the core design language.

## 3. Color Palette
The color scheme is defined extensively in `tailwind.config.js` and `index.css`:

### Backgrounds & Surfaces
- **Main Background:** `#0d1117` (Deep space dark)
- **Surface / Card Background:** `#161b22`
- **Lighter Surface:** `#1f2937`
- **Borders:** Subtle `#22262c` transitioning to `#374151` on hover.

### Accents & Neon
- **Primary Accent (Blue):** `#3b82f6` with lighter (`#60a5fa`) and darker (`#2563eb`) variants.
- **Neon Cyan:** `#00f0ff`
- **Deep Learning Purple:** `#7000ff`

### Text Colors
- **Primary Text:** `#e5e7eb` (Off-white for readability)
- **Secondary / Muted:** `#94a3b8` and `#6b7280`

### Gradients
- **Gradient Text:** Used for titles and highlights (`linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)`).
- **Primary Gradient:** `#3b82f6` to `#1d4ed8` used for buttons and key active states.

## 4. Typography
- **Primary Font:** `Inter` (sans-serif) - Used for general text, providing a highly legible, modern, and clean look.
- **Heading Fonts:** `Inter` and `Inter Tight` - Used for heavily structured, bold headings with tight letter-spacing (`-0.02em` to `-0.03em`) for a premium feel.
- **Serif Accents:** `Playfair Display` - Used selectively (e.g., in the Footer) to provide an elegant typographical contrast.
- **Responsive Scaling:** The base HTML font size is manipulated via media queries (starting at `10px` for mobile, scaling up to `18px` for desktop) to ensure all `rem`-based typography scales proportionally.

## 5. UI Elements & Components
- **Glass Cards (`.glass-card`):**
  - Background: `rgba(22, 27, 34, 0.85)` with `backdrop-filter: blur(12px)`.
  - Box Shadow: `0 4px 32px 0 rgba(31, 38, 135, 0.12)`.
  - Hover states smoothly elevate the card, brighten the border with an accent color, and deepen the shadow.
- **Buttons:**
  - Designed without heavy solid backgrounds by default, utilizing accent borders and text colors.
  - On hover: They gain an outer glow (`box-shadow: 0 0 0 2px #3b82f6`), elevate (`transform: translateY(-1px)`), and transition smoothly.
- **Scrollbar:** Custom-styled dark scrollbar (`#161b22`) with an interactive accent thumb that shifts to `#2563eb` on hover.
- **Accessibility & Focus:** All interactive elements feature a clear focus ring (`outline: 2px solid #3b82f6`) and custom text-selection backgrounds.

## 6. Animations & Framer Motion
Motion is a critical part of the user experience, utilizing both CSS Keyframes and Framer Motion.

### Framer Motion Integration
Framer Motion is heavily utilized across core UI components to orchestrate complex sequence animations:
- **`Section.jsx` & `Card.jsx`:** Elements fade in, slide up, or scale in dynamically as they scroll into the viewport.
- **Page Transitions:** Page components use Framer Motion for smooth mounting/unmounting transitions.
- **Micro-interactions:** Buttons and cards use `whileHover` and `whileTap` properties to provide immediate tactile feedback.

### CSS Keyframes & Tailwind Animations
- **Floating Elements:** Custom `float` keyframes create gentle vertical translations (`float-normal`, `float-slow`, `float-fast`) for background elements or graphics.
- **Glow Effects:** Pulsating text shadows and box shadows (`animate-glow`) for neon accents.
- **Loading States:** A custom `shimmer` animation (`linear-gradient` moving background) is used for skeleton loaders.

### Particle Background
- The site employs `tsparticles` fixed to the background (`z-index: -1`) to create an interactive, floating particle canvas that responds to user cursors without obstructing content.

### Accessibility in Motion
- The design respects user system preferences by utilizing `@media (prefers-reduced-motion: reduce)` to strip out or dramatically speed up animations for users who require reduced motion.
