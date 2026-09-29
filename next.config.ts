import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ['terminal.local'],
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: '/(.*)', headers: [
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'X-Frame-Options',value:'DENY'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
      {key:'Content-Security-Policy',value:`default-src 'self'; script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV==='development'?"'unsafe-eval'":''} https://challenges.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com https://*.google-analytics.com https://www.googletagmanager.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`},
    ]}];
  },
};
export default config;
