/**
 * @type {import('next').NextConfig}
 */
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
  webpack: (config, { dev }) => {
    // Suppress the warning about serializing big strings in development
    if (dev) {
      config.infrastructureLogging = {
        ...config.infrastructureLogging,
        level: 'error',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
