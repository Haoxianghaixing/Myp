/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hxhxmyp.oss-cn-beijing.aliyuncs.com',
        pathname: '/:path*',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.BACKEND_MODE === 'prod'
            ? 'http://101.200.238.139:8080/api/:path*'
            : 'http://localhost:8080/api/:path*', // 本地开发
      },
    ]
  },
}

export default nextConfig
