# 缘分匹配 - 相亲网站

这是一个基于Next.js开发的现代化相亲网站。

## 项目结构

```
matchmaker/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── register/         # 注册页面
│   │   ├── login/            # 登录页面
│   │   └── profile/          # 个人资料页面
│   ├── components/            # 可复用组件
│   │   ├── ui/               # UI组件
│   │   └── forms/            # 表单组件
│   ├── lib/                   # 工具函数
│   └── types/                 # TypeScript类型定义
├── public/                    # 静态资源
└── prisma/                    # 数据库Schema
```

## 主要功能

1. 用户认证
   - 手机号注册/登录
   - 微信登录（计划中）

2. 个人资料
   - 基本信息
   - 择偶要求
   - 照片管理

3. 匹配系统
   - 智能推荐
   - 条件筛选

4. 隐私保护
   - 信息脱敏
   - 照片水印

## 技术栈

- Next.js 14
- TypeScript
- TailwindCSS
- Prisma
- MongoDB

## 开发环境设置

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

## 贡献指南

欢迎提交Pull Request和Issue。

## 许可证

MIT 