/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  output: 'export',
  
  images: {
    unoptimized: true,
  },

  experimental: {

    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig