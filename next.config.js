/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PUBLIC_URL: '/',
  },
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'nextjs-dashboard-congpc.vercel.app',
      },
    ]
  },
};

module.exports = nextConfig;
