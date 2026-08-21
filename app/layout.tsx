import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import ClientLoadingWrapper from '@/components/ClientLoadingWrapper';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Fraunces, DM_Sans, JetBrains_Mono } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-general-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://karrtikgupta.com"),
  title: {
    template: '%s | Karrtik Gupta',
    default: 'Karrtik Gupta',
  },
  description:
    'Karrtik Gupta (also searched as Kartik Gupta) is a Full-Stack & AI Engineer specializing in Next.js, Node.js, Applied NLP, and GenAI. Explore his portfolio of scalable web apps and intelligent agents.',
  keywords: [
    'Karrtik Gupta',
    'Kartik Gupta',
    'Karthik Gupta',
    'Karrtik Gupta AI Engineer',
    'Karrtik Gupta PEC',
    'Full Stack Developer',
    'Next.js Developer',
    'AI Engineer',
    'Freelance Developer India',
  ],
  authors: [{ name: 'Karrtik Gupta', url: 'https://karrtikgupta.com' }],
  creator: 'Karrtik Gupta',
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://karrtikgupta.com',
    title: 'Karrtik Gupta | Full-Stack & AI Engineer',
    description:
      'Karrtik Gupta is a Full-Stack & AI Engineer specializing in Next.js, Node.js, and GenAI. View his projects and read his journal.',
    siteName: 'Karrtik Gupta Portfolio',
    images: [
      {
        url: 'https://res.cloudinary.com/f8njovya/image/upload/v1783444604/logo_ejmhtr.png',
        width: 800,
        height: 600,
        alt: 'Karrtik Gupta Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karrtik Gupta | Full-Stack & AI Engineer',
    description: 'Karrtik Gupta is a Full-Stack & AI Engineer building intelligent systems.',
    images: ['https://res.cloudinary.com/f8njovya/image/upload/v1783444604/logo_ejmhtr.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "https://res.cloudinary.com/f8njovya/image/upload/v1783444604/logo_ejmhtr.png",
    shortcut: "https://res.cloudinary.com/f8njovya/image/upload/v1783444604/logo_ejmhtr.png",
    apple: "https://res.cloudinary.com/f8njovya/image/upload/v1783444604/logo_ejmhtr.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Karrtik Gupta",
              "url": "https://karrtikgupta.com",
              "image": "https://res.cloudinary.com/f8njovya/image/upload/v1783444605/karrtik_oxxcds.png",
              "jobTitle": "Full Stack & AI Engineer",
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Punjab Engineering College"
              },
              "sameAs": [
                "https://github.com/mygithubkg",
                "https://www.linkedin.com/in/karrtik-gupta/"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased text-text bg-background min-h-screen flex flex-col">
        <Providers>
          <ClientLoadingWrapper>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ClientLoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}
