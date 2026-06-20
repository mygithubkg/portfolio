# 🚀 Karrtik Gupta — Personal Portfolio

A modern, full-stack personal portfolio built with **React + Vite**, **Firebase Firestore**, **Framer Motion**, and **Tailwind CSS**. Features a live admin dashboard to manage all site content without touching code.

**Live site:** [karrtikgupta.vercel.app](https://karrtikgupta.vercel.app)

---

## 📁 Complete Folder Structure

```
my-portfolio/
│
├── .env                        # Secret environment variables (never commit)
├── .env.example                # Template for .env variables
├── .gitignore                  # Git ignore rules
├── firestore.rules             # Firebase Firestore security rules
├── index.html                  # Vite HTML entry point
├── initFirebase.js             # One-time script to seed Firebase with default data
├── package.json                # Dependencies and npm scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS theme configuration
├── vercel.json                 # Vercel deployment configuration
├── vite.config.js              # Vite bundler configuration
│
├── public/                     # Static assets served as-is
│   ├── backgroundimage.jpg     # Background image for site
│   ├── eic.png                 # Project thumbnail: E-Summit platform
│   ├── heart.png               # Project thumbnail: Heart Disease Predictor
│   ├── karrtik.png             # Profile photo
│   ├── portfolio.png           # Project thumbnail: Portfolio itself
│   ├── simon.png               # Project thumbnail: Simon Game
│   ├── solver.png              # Project thumbnail: AI Summary Pro
│   ├── trade.png               # Project thumbnail: TradeMyTicket
│   ├── vehicle.png             # Project thumbnail: Vehicle Tracker
│   └── voice.png               # Project thumbnail: Voice Commerce
│
└── src/                        # All React source code
    ├── App.jsx                 # Root app: routing, providers setup
    ├── App.css                 # App-level CSS resets
    ├── main.jsx                # Vite entry point, mounts App to DOM
    ├── index.css               # Global CSS styles and Tailwind base
    ├── particles-config.js     # tsParticles configuration object
    │
    ├── config/
    │   └── firebase.js         # Firebase app initialization
    │
    ├── context/
    │   ├── AdminAuthContext.jsx # Admin login/logout session state
    │   └── DataContext.jsx      # Global data fetcher (Firebase → React state)
    │
    ├── hooks/
    │   └── useData.js           # Per-section custom hooks for fetching data
    │
    ├── utils/
    │   ├── aboutData.js         # Default timeline & tech stack data (hardcoded fallback)
    │   ├── blogData.js          # Firebase CRUD for blogs
    │   ├── contactData.js       # Default contact info & social links
    │   ├── dataManager.js       # Central Firebase read/write for all sections
    │   ├── projectData.js       # Default projects array (hardcoded fallback)
    │   ├── security.js          # Auth checks, rate limiting, XSS sanitization, CSRF
    │   └── validation.js        # Yup schemas for validating form data
    │
    ├── Components/
    │   ├── About.jsx            # About section (timeline, tech stack)
    │   ├── Blog.jsx             # Blog listing component
    │   ├── Contact.jsx          # Contact form + social links
    │   ├── ErrorBoundary.jsx    # React error boundary wrapper
    │   ├── Footer.jsx           # Site footer
    │   ├── Home.jsx             # Hero/home section
    │   ├── Layout.jsx           # Shared page layout wrapper
    │   ├── LoadingPage.jsx      # Animated loading screen on first visit
    │   ├── Projects.jsx         # Projects grid/list component
    │   ├── ProtectedRoute.jsx   # Redirects unauthenticated admin users
    │   ├── ScrollToTop.jsx      # Scrolls to top on route change
    │   ├── Services.jsx         # Services/skills cards
    │   ├── header.jsx           # Navigation header with links
    │   │
    │   ├── Admin/
    │   │   ├── BlogManager.jsx      # Admin: create/edit/delete blog posts
    │   │   ├── ContentManager.jsx   # Admin: edit About, Services, Contact
    │   │   └── ProjectsManager.jsx  # Admin: create/edit/delete projects
    │   │
    │   └── ui/
    │       ├── Button.jsx       # Reusable Button component
    │       ├── Card.jsx         # Reusable Card component
    │       ├── Section.jsx      # Reusable Section wrapper
    │       └── index.js         # Barrel export for ui components
    │
    └── Pages/
        ├── AboutPage.jsx        # Page wrapper for /about
        ├── AdminDashboard.jsx   # Admin dashboard shell (sidebar + tabs)
        ├── AdminLogin.jsx       # Admin login form page
        ├── BlogDetailPage.jsx   # Full blog post page at /blog/:id
        ├── BlogPage.jsx         # Page wrapper for /blog
        ├── ContactPage.jsx      # Page wrapper for /contact
        ├── HomePage.jsx         # Page wrapper for /
        ├── LandingPage.jsx      # Alternative landing page layout
        ├── ProjectsPage.jsx     # Page wrapper for /projects
        └── ServicesPage.jsx     # Page wrapper for /services
```

---

## 🔑 Key Files & Their Main Functions

### `src/App.jsx`
- **`App()`** — Root component. Manages the initial loading state, wraps routes in `AdminAuthProvider` and `DataProvider`, and sets up React Router with all page routes including protected admin routes.

### `src/config/firebase.js`
- Reads Firebase credentials from `.env` variables and calls `initializeApp()` + `getFirestore()`.
- Exports `db` (Firestore instance) used by every data utility.

---

### `src/context/DataContext.jsx`
- **`DataProvider`** — Wraps the entire app. On mount, calls `fetchAllData()` (all 6 data types in parallel via `Promise.all`). Stores result in a shared `data` state object.
- **`useData()`** — Hook consumed by page components to read `{ data, loading, error }` without prop-drilling.

### `src/context/AdminAuthContext.jsx`
- **`AdminAuthProvider`** — Wraps admin routes. Checks `sessionStorage` on mount to restore login state.
- **`login(username, password)`** — Validates credentials against `.env` values. On success, generates a random token, sets 8-hour expiry in `sessionStorage`, and creates a CSRF token.
- **`logout()`** — Clears all auth data from `sessionStorage`.
- Auto-logout: A `setInterval` checks token expiry every 60 seconds. Locks account after 5 failed attempts for 15 minutes.
- **`useAdminAuth()`** — Hook that exposes `{ isAuthenticated, login, logout, isLocked }`.

---

### `src/hooks/useData.js`
Each hook fetches one data type from Firebase with loading/error state:

| Hook | Data fetched |
|---|---|
| `useAboutData()` | About section content |
| `useTimelineData()` | Career/education timeline |
| `useTechStackData()` | Tech stack list |
| `useContactData()` | Email, phone, location |
| `useSocialsData()` | Social media links |
| `useServicesData()` | Services / skill cards |
| `useProjectsData()` | Projects list (+ `refreshProjects()` + listens for `projectsUpdated` event) |

---

### `src/utils/dataManager.js`
The central Firebase CRUD layer. All reads fall back to `localStorage`, then to hardcoded defaults if Firebase is unavailable.

**Helper functions (internal):**
- `getFromLocalStorage(key, default)` — Safely reads from `localStorage`.
- `saveToLocalStorage(key, value)` — Safely writes to `localStorage`.
- `fetchFromFirebase(collection, docId, fallback)` — Fetches a single document; falls back to localStorage/default.
- `saveToFirebase(collection, docId, data)` — Writes to Firestore using `setDoc` with merge.

**About section:**
- `getAboutContent()` — Reads `/about/content` from Firestore.
- `saveAboutContent(content)` — Requires auth. Sanitizes and writes to `/about/content`.
- `getTimeline()` — Reads `/timeline/data`.
- `saveTimeline(data)` — Writes to `/timeline/data`.
- `getTechStack()` — Reads `/techStack/data`.
- `saveTechStack(data)` — Writes to `/techStack/data`.

**Contact section:**
- `getContactContent()` — Reads `/contact/content`.
- `saveContactContent(content)` — Requires auth. Writes to `/contact/content`.
- `getSocials()` — Reads `/contact/socials`.
- `saveSocials(data)` — Writes to `/contact/socials`.

**Services section:**
- `getServicesContent()` — Reads `/services/list`.
- `saveServicesContent(services)` — Requires auth. Writes to `/services/list`.

**Projects section:**
- `getProjects()` — Reads all documents in the `/projects` collection.
- `addProject(data)` — Requires auth + rate limiting. Creates a new document in `/projects`.
- `updateProject(id, data)` — Requires auth + rate limiting. Updates an existing project document.
- `deleteProject(id)` — Requires auth + rate limiting. Deletes a project document.

**Bulk operations:**
- `exportAllData()` — Fetches all data from all sections and returns as one object.
- `importAllData(data)` — Saves all sections from an imported JSON object.
- `syncDefaultDataToFirebase()` — Seeds Firebase with all hardcoded defaults (run once from admin dashboard).
- `fetchAllData()` — Parallel fetch of all 6 data types (used by `DataContext`).

---

### `src/utils/blogData.js`
Firebase CRUD specifically for the `/blogs` collection:
- `getBlogs()` — Fetches all blogs ordered by `publishDate` descending.
- `getBlogById(id)` — Fetches a single blog by document ID.
- `addBlog(data)` — Creates a new blog at `BLOG_${timestamp}` with `createdAt`, `updatedAt`, and `views: 0`.
- `updateBlog(id, data)` — Updates an existing blog, sets `updatedAt`.
- `deleteBlog(id)` — Deletes a blog document.
- `incrementBlogViews(id)` — Increments the `views` counter by 1 when a post is opened.

---

### `src/utils/security.js`
- `sanitizeInput(str)` — Strips all HTML tags via DOMPurify (XSS protection).
- `sanitizeUrl(url)` — Validates protocol (http/https only) and sanitizes URLs.
- `sanitizeObject(obj)` — Recursively sanitizes all string fields in an object.
- `handleSecureError(error, context)` — Returns generic user-safe error messages; logs full details only in dev mode.
- `generateCSRFToken()` — Creates a 32-byte cryptographically random hex token.
- `getCSRFToken()` / `setCSRFToken(token)` / `validateCSRFToken(token)` — Manages CSRF token in `sessionStorage`.
- `checkRateLimit(key, max, windowMs)` — In-memory rate limiter per action key.
- `isAuthenticated()` — Checks `sessionStorage` for a valid, unexpired admin token.
- `getAuthToken()` — Returns token if authenticated, else `null`.
- `clearAuth()` — Removes all auth-related keys from `sessionStorage`.
- `isNotEmpty(v)` / `isValidUrl(url)` / `isValidYear(year)` — Validation helpers.
- `sanitizeMarkdown(content)` — Allows a safe set of HTML tags for rendered markdown.
- `auditLog(action, metadata)` — Logs admin actions to console in dev; ready for a monitoring service in production.

---

### `src/utils/validation.js`
Yup schema definitions for server-side–style validation on the frontend:
- `projectSchema` — Validates title, description, details, link, github, image, category, tech array, featured, year.
- `blogSchema` — Validates title, excerpt, content, image, category, tags, readTime, date.
- `contactSchema` — Validates name, email, message (for contact form submissions).
- `aboutSchema` — Validates title, subtitle, bio, skills array.
- `validateData(data, schema)` — Runs full schema validation; returns `{ isValid, errors, data }`.
- `validateField(fieldName, value, schema)` — Validates a single field; returns `{ isValid, error }`.
- `getFieldSchema(schema, fieldName)` — Extracts the sub-schema for a single field.

---

### `src/Pages/AdminDashboard.jsx`
- **`handleLogout()`** — Calls context logout and navigates to `/`.
- **`handleExport()`** — Fetches all data and downloads as a `.json` backup file.
- **`handleImport(e)`** — Reads an uploaded JSON file and calls `importAllData()` to patch Firebase.
- **`handleSyncDefaults()`** — Calls `syncDefaultDataToFirebase()` to seed Firebase from hardcoded defaults.

### `src/Components/Admin/ContentManager.jsx`
- **`loadContent()`** — Fetches about, services, and contact data from Firebase on mount.
- **`handleSave(type, saveFn, data)`** — Generic save wrapper with status log feedback.
- **`onSaveAbout()`** / **`onSaveServices()`** / **`onSaveContact()`** — Form submit handlers.
- **`handleAddService()`** / **`handleRemoveService(id)`** / **`handleUpdateService(id, field, value)`** — Service list CRUD in local state before saving.

### `src/Components/Admin/ProjectsManager.jsx`
Manages the projects collection with a form to add/edit/delete projects, including image URL, tech tags, live/GitHub links, status, category, and year.

### `src/Components/Admin/BlogManager.jsx`
Manages the blog posts collection with a Markdown editor, tag support, category, read time, and publish date fields.

---

## ⚙️ How the Site Works (Data Flow)

```
Browser Visit
     │
     ▼
App.jsx mounts
     │
     ▼
DataProvider (DataContext.jsx)
     │── Promise.all → fetches all 6 data types from Firebase simultaneously
     │
     ▼
Firebase Firestore
  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
  │ /about   │ /contact │ /services│ /projects│ /blogs   │ /timeline│
  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
     │
     │  If Firebase fails or is uninitialized:
     │  → falls back to localStorage cache
     │  → falls back to hardcoded default data in utils/
     │
     ▼
React state { data, loading, error }
     │
     ▼
Page Components consume via useData() hook
(Home, About, Projects, Services, Contact, Blog)
```

### Admin Write Flow

```
Admin logs in at /admin/login
     │
     ▼
AdminAuthContext validates credentials vs .env
     │ Sets sessionStorage token (8hr expiry) + CSRF token
     │
     ▼
/admin/dashboard becomes accessible (ProtectedRoute passes)
     │
     ▼
Admin edits content in ProjectsManager / BlogManager / ContentManager
     │
     ▼
isAuthenticated() + checkRateLimit() + sanitizeObject() run as guards
     │
     ▼
Firestore updated via setDoc / updateDoc / deleteDoc
     │
     ▼
localStorage cache also updated (for offline fallback)
     │
     ▼
Visitor's browser reads updated data on next page load
```

---

## 🗄️ Firebase Database Structure

The Firestore database uses these **collections** and **documents**:

```
Firestore Root
├── about/
│   └── content          { title, subtitle, description, skills }
│
├── contact/
│   ├── content          { email, phone, location, availability }
│   └── socials          [ { icon, url, label, username }, ... ]
│
├── services/
│   └── list             [ { id, title, description, icon }, ... ]
│
├── projects/            (each project is its own document)
│   ├── PROJ_01          { title, category, year, status, image, description, tech[], links, details }
│   ├── PROJ_02          { ... }
│   └── ...
│
├── blogs/               (each blog is its own document)
│   ├── BLOG_xxxxx       { title, author, publishDate, category, hashtags[], excerpt, content, readTime, views, createdAt, updatedAt }
│   └── ...
│
├── timeline/
│   └── data             [ { year, title, place, desc, icon }, ... ]
│
└── techStack/
    └── data             [ "React", "Node.js", "Next.js", ... ]
```

### Firestore Security Rules (`firestore.rules`)

All collections are **publicly readable** but **write-disabled from the client**. This means:
- ✅ Any visitor can read portfolio data.
- ❌ No one can write directly from the browser (even the admin panel currently writes in dev mode only).
- ⚠️ For production admin writes, a backend API with Firebase Admin SDK is recommended.

---

## 📦 Default Content (What Is Pre-Loaded)

All default content lives in `src/utils/` and is seeded into Firebase via the **SYNC_TO_FIREBASE** button in the admin dashboard.

### `src/utils/aboutData.js` — Timeline & Tech Stack

**Timeline (4 entries):**
| Year | Role | Place |
|---|---|---|
| 2025 | Campus Ambassador | Innovation Mission, Punjab (IMP) |
| 2023–Present | Executive Board | Entrepreneurship Cell, PEC |
| May–July 2025 | AI Intern | Edunet Foundation (Microsoft) |
| 2023–2027 | B.Tech Electronics & Comm. | PEC Chandigarh |

**Tech Stack:**
`React`, `Node.js`, `Next.js`, `TypeScript`, `Azure AI`, `Python`, `Gemini API`, `Scikit-learn`, `Firebase`, `PostgreSQL`, `Tailwind`, `Git`

---

### `src/utils/contactData.js` — Contact & Socials

**Contact details:**
- Email: `karrtikgupta9@gmail.com`
- Location: `Chandigarh, India`

**Social links:**
- LinkedIn: [karrtik-gupta](https://www.linkedin.com/in/karrtik-gupta/)
- GitHub: [mygithubkg](https://github.com/mygithubkg)
- Instagram: [@karrtik_gupta](https://www.instagram.com/karrtik_gupta/)

---

### `src/utils/projectData.js` — 8 Default Projects

| ID | Title | Category | Year | Status |
|---|---|---|---|---|
| PROJ_01 | E-Summit '25 Official Platform | Web Development | 2025 | DEPLOYED |
| PROJ_02 | AI Summary Pro | GenAI | 2025 | ONLINE |
| PROJ_03 | Personal Portfolio | Web Development | 2025 | LIVE |
| PROJ_04 | TradeMyTicket | Web Development | 2024 | PROTOTYPE |
| PROJ_05 | Vehicle & Pedestrian Tracker | Computer Vision | 2025 | RESEARCH |
| PROJ_06 | Voice-Enabled Commerce | Web Development | 2024 | PROTOTYPE |
| PROJ_07 | Heart Disease Predictor | Machine Learning | 2025 | ANALYSIS |
| PROJ_08 | Simon Game | Game Development | 2023 | LEGACY |

---

### `src/utils/dataManager.js` — Default Services (3 cards)

| Title | Description | Icon |
|---|---|---|
| Web Development | Building modern, responsive web applications | `Code` |
| AI Solutions | Developing intelligent systems and ML models | `Brain` |
| Cloud Integration | Deploying scalable cloud-based solutions | `Cloud` |

---

### Blogs
Default blogs are **empty** (`defaultBlogs = []`). All blog posts must be created through the admin dashboard. Previous placeholder blog data (React+Firebase, Framer Motion, Node.js API articles) is commented out in `blogData.js`.

---

## ✏️ How to Edit Everything

### Method 1: Admin Dashboard (Recommended — No Code Required)

1. Navigate to `/admin/login`
2. Enter the username and password from your `.env` file (`VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD`)
3. You'll reach `/admin/dashboard` with three tabs:

| Tab | What you can edit |
|---|---|
| **PROJECTS** | Add, edit, delete projects (title, description, tech, links, image, status, year) |
| **BLOGS** | Write, edit, delete blog posts in Markdown (with title, category, tags, excerpt) |
| **CONTENT** | Edit About bio, Services cards, Contact info |

**Sidebar actions:**
- **SYNC_TO_FIREBASE** — Seeds all hardcoded defaults from `utils/` to Firestore (run once on first setup)
- **EXPORT_JSON** — Downloads a full JSON backup of all your data
- **IMPORT_PATCH** — Upload a previously exported JSON to restore all data

---

### Method 2: Edit Hardcoded Default Data Files (Code)

Edit these files to change the fallback/seed data. After editing, use **SYNC_TO_FIREBASE** in the admin dashboard to push changes to Firestore.

| What to change | File to edit |
|---|---|
| Career timeline entries | `src/utils/aboutData.js` → `timeline` array |
| Tech stack list | `src/utils/aboutData.js` → `techStack` array |
| Contact email / location | `src/utils/contactData.js` → `contactDetails` array |
| Social media links | `src/utils/contactData.js` → `socials` array |
| Projects list | `src/utils/projectData.js` → `projects` array |
| Default services | `src/utils/dataManager.js` → `defaultServices` array |
| Default about text | `src/utils/dataManager.js` → `getAboutContent()` default object |

---

### Method 3: Direct Firebase Console

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project → **Firestore Database**
3. Browse and edit any document directly in the collection/document tree shown above.

> ⚠️ **Note:** The current `firestore.rules` disables all client-side writes. To enable admin dashboard writes in production, you must either set up Firebase Authentication or implement a backend API.

---

## 🛠️ Environment Variables (`.env`)

Copy `.env.example` to `.env` and fill in your values:

```env
# Admin credentials (used for admin dashboard login)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=YourSecurePasswordHere

# Firebase project credentials
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# EmailJS credentials (for the contact form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> ⚠️ Never commit `.env` to Git. It is already listed in `.gitignore`.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# → Fill in your Firebase + EmailJS credentials

# 3. Start dev server
npm run dev

# 4. (First time only) Seed Firebase with default data
# → Go to /admin/login, log in, then click SYNC_TO_FIREBASE

# 5. Build for production
npm run build
```

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| Firebase Firestore | NoSQL cloud database |
| Framer Motion | Animations & transitions |
| React Router 7 | Client-side routing |
| DOMPurify | XSS sanitization |
| Yup | Schema validation |
| EmailJS | Contact form email delivery |
| tsParticles | Particle background effects |
| Lucide React | Icon library |
| React Icons | Additional icon sets |
| react-markdown | Markdown rendering for blog posts |
