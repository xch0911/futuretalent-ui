# 未来人才网 - 前端 UI

基于 React + TypeScript + Vite + Ant Design 构建。

## 项目架构

```
ui/
├── public/             # 静态资源
├── src/
│   ├── components/     # 公共组件
│   │   ├── Layout/     # 整体布局（Header + Footer）
│   │   ├── Header/     # 导航栏
│   │   ├── Footer/     # 页脚
│   │   └── IdeaCard/   # 想法卡片（复用组件）
│   ├── pages/          # 页面
│   │   ├── Home/       # 🏠 首页 - 英雄区+统计+热门想法+热门标签
│   │   ├── Ideas/      # 💡 想法广场 - 搜索+筛选+分页+列表
│   │   ├── UserProfile/# 👤 用户主页 - 用户信息+统计+个人想法列表
│   │   └── NotFound/   # 404
│   ├── services/       # API 服务层
│   │   ├── idea.ts     # 想法相关接口
│   │   └── user.ts     # 用户相关接口
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   │   └── request.ts  # axios 请求封装
│   ├── App.tsx         # 根组件 - 路由配置
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── .env.example        # 环境变量示例
├── index.html          # HTML 模板
├── package.json        # 依赖配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 核心页面结构

### 1. 首页 (`/`)
- **英雄区**：展示平台 slogan 和价值主张
- **统计卡片**：用户数、想法数、连接数
- **热门想法**：展示热度最高的 5 条想法
- **侧边栏**：热门标签云 + 平台介绍

### 2. 想法广场 (`/ideas`)
- **搜索框**：支持关键词搜索
- **排序**：最新发布 / 热门优先
- **标签筛选**：点击热门标签快速筛选
- **分页列表**：无限滚动风格的分页展示
- **结果统计**：展示搜索结果数量

### 3. 用户主页 (`/user/:userId`)
- **用户信息卡**：头像、昵称、简介、标签
- **关注按钮**：关注/取消关注操作
- **统计数据**：想法数、粉丝数、关注数
- **想法列表**：该用户发布的所有想法

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Router 6** - 路由
- **Ant Design 5** - 组件库
- **Axios** - HTTP 客户端
- **Day.js** - 时间处理

## 启动开发

```bash
cd ui
npm install
npm run dev
```

访问 http://localhost:3000

## 构建生产

```bash
npm run build
```

## API 约定

所有 API 响应格式统一为：
```typescript
{
  code: number    // 0 成功，非0 失败
  data: T         // 响应数据
  message: string // 错误信息
}
```

分页响应格式：
```typescript
{
  list: T[]
  total: number
  page: number
  pageSize: number
}
```
