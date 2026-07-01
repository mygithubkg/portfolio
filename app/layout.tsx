import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientLoadingWrapper from '@/components/ClientLoadingWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Karrtik Gupta',
    default: 'Karrtik Gupta | Portfolio',
  },
  description: 'Full Stack Developer portfolio showcasing projects, skills, and experience.',
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
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
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
