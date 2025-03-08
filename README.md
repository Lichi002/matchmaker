# Matchmaker - 婚恋交友平台

这是一个使用Next.js和Prisma构建的现代婚恋交友平台。

## 功能特点

- 用户注册和登录
- 个人资料管理
- 照片上传和管理（使用七牛云存储）
- 智能匹配推荐系统
- 响应式设计

## 技术栈

- Next.js 14.1.0
- Prisma (ORM)
- MySQL
- Tailwind CSS
- TypeScript
- 七牛云对象存储

## 开始使用

1. 克隆项目
```bash
git clone [你的仓库URL]
cd matchmaker
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制`.env.example`文件为`.env.local`并填写必要的环境变量：
```
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"
JWT_SECRET="你的JWT密钥"
NEXT_PUBLIC_QINIU_DOMAIN="你的七牛云域名"
QINIU_ACCESS_KEY="你的七牛云AccessKey"
QINIU_SECRET_KEY="你的七牛云SecretKey"
QINIU_BUCKET="你的七牛云存储空间名"
```

4. 运行数据库迁移
```bash
npx prisma migrate dev
```

5. 启动开发服务器
```bash
npm run dev
```

## 项目结构

```
matchmaker/
├── src/
│   ├── app/          # Next.js 应用主目录
│   ├── components/   # React组件
│   └── prisma/       # Prisma配置和模型
├── public/           # 静态资源
└── next.config.js    # Next.js配置
```

## API文档

### 认证相关
- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册

### 用户相关
- GET `/api/user/profile` - 获取个人资料
- PUT `/api/user/profile` - 更新个人资料
- GET `/api/user/profile/[id]` - 获取其他用户资料

### 照片管理
- GET `/api/user/photos` - 获取照片列表
- POST `/api/user/photos` - 上传新照片
- DELETE `/api/user/photos?id=xxx` - 删除照片
- POST `/api/user/photos/[id]/main` - 设置主照片

### 推荐系统
- GET `/api/recommendations` - 获取推荐用户列表

## 部署

项目可以部署到Vercel或其他支持Next.js的平台。确保设置所有必要的环境变量。

## 贡献

欢迎提交Issue和Pull Request。

## 许可证

MIT 