/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add these configurations
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Add this to ensure API routes aren't statically generated
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
      }
    }
    return config
  }
};

export default nextConfig;