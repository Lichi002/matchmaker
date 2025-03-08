/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['alifile.sojump.cn'], // 允许加载问卷星的图片
  },
  // 国际化配置
  i18n: {
    locales: ['zh'],
    defaultLocale: 'zh',
  },
  // 添加服务器配置
  server: {
    // 允许从任何IP访问
    host: '0.0.0.0',
    // 默认端口
    port: 3000,
  },
  // 添加输出配置
  output: 'standalone',
}

module.exports = nextConfig 