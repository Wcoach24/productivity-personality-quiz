/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/productivity-personality-quiz' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/productivity-personality-quiz/' : '',
}
module.exports = nextConfig
