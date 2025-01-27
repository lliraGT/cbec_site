/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['next-auth']
  },
  images: {
    domains: ['cdn.sanity.io']
  }
};

module.exports = nextConfig;