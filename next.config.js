/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'meggkopiinwpefsqnqac.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

module.exports = nextConfig;
