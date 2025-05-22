/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react', 'framer-motion'],
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/sql/:path*',
        destination: '/api/sql/:path*' // Handle SQL routes locally
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*' // Forward other API routes to Flask
      }
    ]
  }
}

module.exports = nextConfig 