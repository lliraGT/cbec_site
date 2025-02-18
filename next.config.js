/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-auth'],
  images: {
    domains: ['cdn.sanity.io']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.tls = false;
    }
    return config;
  }
};

module.exports = nextConfig;