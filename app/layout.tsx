import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientLoadingWrapper from '@/components/ClientLoadingWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.karrtikgupta.me"),
  title: {
    template: '%s | Karrtik Gupta',
    default: 'Karrtik Gupta ',
  },
  description: 'Karrtik Gupta is a Full-Stack & AI Engineer specializing in Next.js, Node.js, Applied NLP, and GenAI. Explore his portfolio of scalable web apps and intelligent agents.',
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Karrtik Gupta | Full-Stack & AI Engineer",
    description: "Karrtik Gupta is a Full-Stack & AI Engineer specializing in Next.js, Node.js, Applied NLP, and GenAI. Explore his portfolio of scalable web apps and intelligent agents.",
    url: "https://www.karrtikgupta.me",
    siteName: "Karrtik Gupta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Karrtik Gupta Portfolio",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karrtik Gupta | Full-Stack & AI Engineer",
    description: "Karrtik Gupta is a Full-Stack & AI Engineer specializing in Next.js, Node.js, Applied NLP, and GenAI. Explore his portfolio of scalable web apps and intelligent agents.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Karrtik Gupta",
              "url": "https://karrtikgupta.com",
              "sameAs": [
                "https://github.com/mygithubkg",
                "https://www.linkedin.com/in/karrtik-gupta/"
              ],
              "jobTitle": "Full Stack Developer"
            })
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} bg-background text-foreground antialiased`}>
        <Providers>
          <ClientLoadingWrapper>
            <Header />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
          </ClientLoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}
