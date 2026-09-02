import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const getSecurityHeaders = () => [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limit referrer information leaked to third parties
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable powerful browser features not needed by a portfolio
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Force HTTPS for 1 year (only meaningful once deployed to HTTPS)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      isProd 
        ? "script-src 'self' https://cdn.emailjs.com https://vercel.live https://*.vercel-scripts.com https://*.clarity.ms https://apis.google.com"
        : "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.emailjs.com https://vercel.live https://*.vercel-scripts.com https://*.clarity.ms https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://*.clarity.ms https://c.bing.com https://res.cloudinary.com",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.emailjs.com wss://*.firebaseio.com https://www.clarity.ms https://*.clarity.ms wss://ws-us3.pusher.com https://sockjs-us3.pusher.com https://api.cloudinary.com",
      "frame-src https://vercel.live https://*.firebaseapp.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // M-1: Attach security headers to all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: getSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
