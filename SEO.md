# SEO Documentation — Karrtik Gupta Portfolio

> **Live URL:** https://www.karrtikgupta.me  
> **Framework:** Next.js 16 (App Router) with TypeScript  
> **Last Updated:** July 2026

---

## Site Layout / Page Structure

```
/                   → Home          (app/page.tsx)
/about              → About         (app/about/page.tsx)
/projects           → Projects      (app/projects/page.tsx)
/blog               → Blog Index    (app/blog/page.tsx)
/blog/[id]          → Blog Post     (app/blog/[id]/page.tsx)
/services           → Services      (app/services/page.tsx)
/contact            → Contact       (app/contact/page.tsx)
/admin/login        → Admin Login   (app/admin/login/...)
/admin/dashboard    → Admin Panel   (app/admin/dashboard/...)
```

Each route has its own `layout.tsx` that exports a `metadata` object with a unique `title`, `description`, and `canonical` URL.

---

## SEO Strategies Implemented

### 1. Global Metadata (app/layout.tsx)

The root layout sets site-wide defaults that all child pages inherit and can override.

| Field | Value |
|---|---|
| `metadataBase` | `https://www.karrtikgupta.me` |
| `title.default` | `Karrtik Gupta` |
| `title.template` | `%s \| Karrtik Gupta` |
| `description` | Full-Stack & AI Engineer specializing in Next.js, Node.js, Applied NLP, GenAI |
| `canonical` | `/` |
| `robots` | `index: true, follow: true` |

---

### 2. Per-Page Metadata

Every page defines its own `title`, `description`, and `canonical` inside a `layout.tsx`:

| Page | Title | Canonical |
|---|---|---|
| `/about` | About \| AI & Full-Stack Engineer | `/about` |
| `/projects` | Projects \| Scalable Systems & AI Agents | `/projects` |
| `/blog` | Dev Journal & Technical Blog | `/blog` |
| `/services` | Technical Expertise & Services | `/services` |
| `/contact` | Contact \| Initialize Collaboration | `/contact` |

The `title.template` in the root layout means each page title automatically becomes e.g. `Projects | Scalable Systems & AI Agents | Karrtik Gupta`.

---

### 3. Open Graph (Social Sharing)

Configured in `app/layout.tsx` for rich previews on LinkedIn, WhatsApp, Slack, etc.

```ts
openGraph: {
  title:       "Karrtik Gupta | Full-Stack & AI Engineer",
  description: "...",
  url:         "https://www.karrtikgupta.me",
  siteName:    "Karrtik Gupta",
  type:        "website",
  locale:      "en_US",
  images: [{ url: "/og-image.png", width: 1200, height: 630 }],
}
```

> **Gap:** `/og-image.png` is referenced but verify this file exists in `/public/`. If missing, social previews will show no image.

---

### 4. Twitter Card

```ts
twitter: {
  card:        "summary_large_image",
  title:       "Karrtik Gupta | Full-Stack & AI Engineer",
  description: "...",
  images:      ["/og-image.png"],
}
```

Enables large image previews when the URL is shared on Twitter/X.

---

### 5. JSON-LD Structured Data (Schema.org)

Injected directly in `<head>` via `app/layout.tsx` as a `<script type="application/ld+json">`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Karrtik Gupta",
  "url": "https://karrtikgupta.com",
  "jobTitle": "Full Stack Developer",
  "sameAs": [
    "https://github.com/mygithubkg",
    "https://www.linkedin.com/in/karrtik-gupta/"
  ]
}
```

This helps Google display rich results and a Knowledge Panel for searches of your name.

> **Gap:** The `url` in JSON-LD (`karrtikgupta.com`) differs from `metadataBase` (`www.karrtikgupta.me`). Unify these to the same canonical domain.

---

### 6. Canonical URLs

Every page sets a `canonical` via `alternates.canonical` to prevent duplicate content penalties:

```ts
// Example: app/about/layout.tsx
alternates: { canonical: "/about" }
```

Next.js combines this with `metadataBase` to output:
`<link rel="canonical" href="https://www.karrtikgupta.me/about" />`

---

### 7. XML Sitemap (app/sitemap.ts)

Auto-generated at `/sitemap.xml` by Next.js at build time.

| URL | Change Frequency | Priority |
|---|---|---|
| `/` | monthly | 1.0 |
| `/projects` | weekly | 0.9 |
| `/blog` | weekly | 0.9 |
| `/about` | monthly | 0.8 |
| `/services` | monthly | 0.8 |
| `/contact` | yearly | 0.5 |

> **Gap:** `baseUrl` in `sitemap.ts` is `karrtikgupta.com` but `metadataBase` uses `www.karrtikgupta.me` — these should match. Also, dynamic blog post routes (`/blog/[id]`) are not included in the sitemap.

---

### 8. robots.txt (app/robots.ts)

Auto-generated at `/robots.txt` by Next.js.

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Sitemap: https://karrtikgupta.com/sitemap.xml
```

Admin routes are correctly blocked from indexing.

---

### 9. Favicon & Icons

```ts
icons: {
  icon:     "/logo.png",
  shortcut: "/logo.png",
  apple:    "/logo.png",
}
```

Serves `logo.png` as the browser tab icon, bookmark icon, and iOS home screen icon.

---

### 10. Web App Manifest (public/site.webmanifest)

```json
{
  "name": "Karrtik Gupta Portfolio",
  "short_name": "Karrtik Gupta",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#000000"
}
```

Enables "Add to Home Screen" on mobile and signals PWA intent to browsers.
Improves engagement signals which indirectly help SEO.

> **Gap:** The manifest still references `favicon.ico` which was deleted — update the icons array to use `logo.png`.

---

### 11. Google Font — Inter

```ts
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
```

Loaded via `next/font/google` which:
- Self-hosts the font (no external request to Google at runtime)
- Eliminates render-blocking font requests
- Improves Core Web Vitals (LCP, CLS)

---

### 12. Analytics — Microsoft Clarity

`react-microsoft-clarity` is installed and integrated. Clarity tracks:
- Session recordings
- Heatmaps
- User behavior signals

These improve UX decisions which indirectly improve SEO via engagement metrics (bounce rate, time on page).

---

### 13. Server-Side Rendering (SSR via Next.js App Router)

All pages are server-rendered by default. This means:
- Google can crawl full page content without JavaScript execution
- No blank-page issues common in pure React SPAs
- Fast TTFB improving Core Web Vitals scores

---

## Known Gaps / Improvements Needed

| # | Issue | Impact |
|---|---|---|
| 1 | `og-image.png` may be missing from `/public/` | Social previews broken |
| 2 | `baseUrl` in `sitemap.ts` = `karrtikgupta.com` vs `metadataBase` = `www.karrtikgupta.me` | Canonical confusion for crawlers |
| 3 | `url` in JSON-LD = `karrtikgupta.com` vs `metadataBase` = `www.karrtikgupta.me` | Structured data mismatch |
| 4 | Dynamic blog post routes (`/blog/[id]`) not in sitemap | Blog posts not crawled efficiently |
| 5 | `site.webmanifest` icons still reference deleted `favicon.ico` | Manifest icon broken |
| 6 | Home page `title.default` has trailing space: `'Karrtik Gupta '` | Weak/unprofessional title tag |
| 7 | No per-page Open Graph images | All pages share the same OG image |
| 8 | `robots.txt` sitemap URL uses wrong domain (`karrtikgupta.com`) | Crawler directed to wrong sitemap domain |
