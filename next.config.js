/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['sssl8b0ty.hn-bkt.clouddn.com'],
  },
  i18n: {
    locales: ['zh'],
    defaultLocale: 'zh',
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'bcrypt'];
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['bcrypt']
  },
  env: {
    QINIU_ACCESS_KEY: process.env.QINIU_ACCESS_KEY,
    QINIU_SECRET_KEY: process.env.QINIU_SECRET_KEY,
    QINIU_BUCKET: process.env.QINIU_BUCKET,
  },
}

module.exports = nextConfig 