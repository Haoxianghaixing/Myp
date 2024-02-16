/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://101.200.238.139:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig
