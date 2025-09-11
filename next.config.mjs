/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Content-Range",
            value: "bytes : 0-9/*",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: (() => {
              const isDev = process.env.NODE_ENV !== 'production';
              const base = `
                default-src 'self';
                script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.accounts.dev *.clerk.dev *.stripe.com;
                style-src 'self' 'unsafe-inline' *.googleapis.com;
                img-src 'self' data: *.clerk.accounts.dev *.clerk.dev *.stripe.com;
                font-src 'self' *.googleapis.com *.gstatic.com;
                connect-src 'self' *.clerk.accounts.dev *.clerk.dev *.stripe.com api.stripe.com http://localhost:3000 http://127.0.0.1:3000 http://192.168.1.0/16 http://192.168.1.109:3000;
                frame-src 'self' *.stripe.com;
                media-src 'self';
                object-src 'none';
                base-uri 'self';
                form-action 'self';
              `;
              const prodDirective = 'upgrade-insecure-requests;';
              return (base + (isDev ? '' : prodDirective)).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            })(),
          }
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
  },
  // Additional security configurations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
