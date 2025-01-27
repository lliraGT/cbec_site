/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    workerThreads: false,
    cpus: 1,
    serverComponentsExternalPackages: ['next-auth'] // Added this line
  },
};

module.exports = nextConfig;