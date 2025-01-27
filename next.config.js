/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    workerThreads: false,
    cpus: 1,
    serverComponentsExternalPackages: ['next-auth']
  },
  // Remove the webpack config that we added before as it's not needed anymore
};

module.exports = nextConfig;