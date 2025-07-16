# 🚀 Karrtik Gupta - Portfolio Website

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.12.1-0055FF?style=for-the-badge&logo=framer)

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Website-00C853?style=for-the-badge&logo=vercel)]((https://portfolio-tau-kohl-30.vercel.app/))


*A modern, responsive portfolio website showcasing full-stack development skills and AI expertise*

</div>

---

## ✨ Overview

This portfolio represents a sophisticated web application built with cutting-edge technologies, designed to showcase professional capabilities in full-stack development, AI integration, and modern web design. The project demonstrates expertise in React ecosystem, responsive design, and user experience optimization.

### 🎯 Key Highlights

- **Modern React Architecture** with latest React 19 features
- **Responsive Design** optimized for all devices
- **Interactive Animations** powered by Framer Motion
- **Professional Contact System** with EmailJS integration
- **SEO Optimized** for better visibility
- **Performance Focused** with Vite build system

---

## 🌟 Features

### 🎨 Design Excellence
| Feature | Description |
|---------|-------------|
| **Responsive Layout** | Mobile-first design with breakpoint optimization |
| **Dark Theme** | Elegant dark theme with custom accent colors |
| **Smooth Animations** | 60fps animations with Framer Motion |
| **Interactive Elements** | Hover effects, parallax scrolling, dynamic backgrounds |
| **Loading States** | Professional loading transitions |

### 📱 Multi-Page Architecture
| Page | Purpose | Features |
|------|---------|----------|
| **Home** | Landing page | Hero section, tech stack showcase, call-to-action |
| **About** | Personal introduction | Background, skills, experience timeline |
| **Services** | Professional offerings | Service cards, pricing, expertise areas |
| **Projects** | Portfolio showcase | Project gallery, detailed descriptions, live demos |
| **Contact** | Communication hub | Contact form, social links, EmailJS integration |

### 🛠️ Technical Excellence
- **React Router DOM** - Client-side routing for seamless navigation
- **EmailJS Integration** - Functional contact form with email automation
- **Particle Effects** - Interactive background animations
- **Error Boundaries** - Graceful error handling and recovery
- **Code Splitting** - Optimized loading performance
- **TypeScript Ready** - Type-safe development environment

---

## 🚀 Technology Stack

### Frontend Framework
<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![React Router](https://img.shields.io/badge/React_Router-7.6.0-CA4245?style=flat-square&logo=react-router)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.12.1-0055FF?style=flat-square&logo=framer)

</div>

### Build Tools & Development
<div align="center">

![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)
![ESLint](https://img.shields.io/badge/ESLint-9.25.0-4B32C3?style=flat-square&logo=eslint)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat-square&logo=typescript)

</div>

### Styling & UI
<div align="center">

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.7-38B2AC?style=flat-square&logo=tailwind-css)
![PostCSS](https://img.shields.io/badge/PostCSS-8.5.3-DD3A0A?style=flat-square&logo=postcss)
![React Icons](https://img.shields.io/badge/React_Icons-5.5.0-61DAFB?style=flat-square&logo=react)

</div>

### External Services
<div align="center">

![EmailJS](https://img.shields.io/badge/EmailJS-3.2.0-FF6B6B?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat-square&logo=vercel)

</div>

---

## 📦 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/my-portfolio.git
cd my-portfolio

# 2. Install dependencies
npm install

# 4. Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 🏗️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |
| `npm run tw:init` | Initialize Tailwind CSS |

---

## 📁 Project Structure

```
my-portfolio/
├── 📁 public/                    # Static assets
│   ├── 🖼️ karrtik.png           # Profile image
│   ├── 🖼️ backgroundimage.jpg   # Background images
│   └── 📄 Other assets
├── 📁 src/
│   ├── 📁 Components/            # Reusable UI components
│   │   ├── 📁 ui/               # Base UI components
│   │   │   ├── 🎨 Button.jsx
│   │   │   ├── 🎨 Card.jsx
│   │   │   └── 🎨 Section.jsx
│   │   ├── 📄 About.jsx         # About section
│   │   ├── 📄 Contact.jsx       # Contact form
│   │   ├── 📄 Footer.jsx        # Footer component
│   │   ├── 📄 header.jsx        # Navigation header
│   │   ├── 📄 Home.jsx          # Hero section
│   │   ├── 📄 Layout.jsx        # Page layout wrapper
│   │   ├── 📄 LoadingPage.jsx   # Loading screen
│   │   ├── 📄 Projects.jsx      # Projects section
│   │   └── 📄 Services.jsx      # Services section
│   ├── 📁 Pages/                # Page components
│   │   ├── 📄 AboutPage.jsx
│   │   ├── 📄 ContactPage.jsx
│   │   ├── 📄 HomePage.jsx
│   │   ├── 📄 ProjectsPage.jsx
│   │   └── 📄 ServicesPage.jsx
│   ├── 📄 App.jsx               # Main app component
│   ├── 📄 main.jsx              # App entry point
│   ├── 📄 index.css             # Global styles
│   └── 📄 particles-config.js   # Particle effects config
├── 📄 package.json              # Dependencies and scripts
├── 📄 tailwind.config.js        # Tailwind configuration
├── 📄 vite.config.js            # Vite configuration
└── 📄 README.md                 # This file
```

---

## 🎨 Customization Guide

### Theme Customization
The color scheme is defined in `tailwind.config.js`:



## 🔧 Advanced Configuration

### EmailJS Setup
1. **Create Account**: Sign up at [EmailJS](https://www.emailjs.com/)
2. **Add Service**: Configure Gmail, Outlook, or custom SMTP
3. **Create Template**: Design email template with variables
4. **Get Credentials**: Copy Service ID, Template ID, and Public Key
5. **Environment Variables**: Add to `.env` file

### Deployment Configuration

#### Vercel Deployment
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Auto Detection**: Vercel detects React/Vite setup
3. **Environment Variables**: Add in Vercel dashboard
4. **Automatic Deploy**: Deploys on every git push

#### Custom Domain
1. **Domain Setup**: Configure in Vercel dashboard
2. **SSL Certificate**: Automatic HTTPS setup
3. **DNS Configuration**: Update nameservers

---

## 📱 Responsive Design

| Device | Breakpoint | Features |
|--------|------------|----------|
| **Mobile** | < 640px | Touch-optimized, simplified navigation |
| **Tablet** | 640px - 1024px | Adaptive layouts, enhanced interactions |
| **Desktop** | > 1024px | Full feature set, advanced animations |

---

## ⚡ Performance Optimization

### Build Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed images and fonts
- **Caching Strategy**: Efficient browser caching

### Runtime Performance
- **Lazy Loading**: Components load on demand
- **Virtual Scrolling**: For large lists
- **Debounced Events**: Optimized user interactions
- **Memory Management**: Proper cleanup and garbage collection

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| **Environment Variables** | Sensitive data in `.env` files |
| **Input Validation** | Form validation with error handling |
| **XSS Protection** | React's built-in XSS protection |
| **HTTPS Enforcement** | SSL certificates on deployment |
| **Content Security Policy** | CSP headers for security |

---

## 📊 Analytics & Monitoring

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse Scores**: Performance auditing
- **Error Tracking**: Error boundary implementation

---

## 📄 License & Usage

<div align="center">

**This project is private and proprietary.**

[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

**No contributions, forks, or modifications are permitted without explicit written consent.**

</div>

---

## 🤝 Contact & Support

<div align="center">

**Karrtik Gupta** - Full-stack Developer & AI Enthusiast

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/karrtik-gupta/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/mygithubkg)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:karrtikgupta9@gmail.com)

*Crafting modern web experiences with cutting-edge technology*

</div>

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

*Built with ❤️ and modern web technologies*

</div>
