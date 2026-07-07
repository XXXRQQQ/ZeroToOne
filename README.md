<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4-4FC08D?style=for-the-badge&logo=vuedotjs" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Pinia-2.1-ffd859?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ECharts-5.5-AA344D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<h1 align="center">🌐 从零到一数据大屏</h1>
<h3 align="center"><em>ZeroToOne — Build Your Data Dashboard from Scratch</em></h3>

<p align="center">
  <b>从 0 到 1，手把手教你制作属于自己的数据可视化大屏。</b>
</p>

<br />

---

## 📖 项目简介

**从零到一数据大屏（ZeroToOne）** 是一个面向数据可视化初学者的开源项目。基于 **Vue3 + Vite + Pinia + ECharts** 技术栈，采用模块化架构设计，带你从零开始搭建一个功能完善、视觉效果出色的数据大屏。

> 无论你是前端开发者、数据分析师，还是对数据可视化感兴趣的爱好者，这里都为你准备了一条清晰的进阶路径。

---

## 🏗️ 技术架构

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | Vue 3 (Composition API) | 响应式 UI 框架 |
| 构建工具 | Vite 5 | 极速 HMR 开发体验 |
| 语言 | TypeScript | 类型安全 |
| 状态管理 | Pinia | 模块化 Store 管理 |
| 路由 | Vue Router 4 | 多页面大屏切换 |
| 图表库 | ECharts 5 | 数据可视化渲染 |
| 样式方案 | SCSS | CSS 预处理器 |
| 单元测试 | Vitest | 组件与工具函数测试 |
| E2E 测试 | Playwright | 大屏端到端测试 |
| 代码质量 | ESLint + Prettier | 代码规范与格式化 |
| Git Hooks | Husky + lint-staged | 提交前质量卡点 |

---

## 📁 项目结构

```
ZeroToOne/
├── public/                     # 公共静态资源
├── src/
│   ├── assets/                 # 静态资源
│   │   ├── images/             # 图片
│   │   ├── fonts/              # 字体
│   │   └── styles/             # 全局样式
│   │       └── global.scss     # 样式变量与重置
│   │
│   ├── components/             # 通用组件（按功能模块拆分）
│   │   ├── common/             # 基础组件
│   │   ├── charts/             # 图表组件（BarChart、LineChart...）
│   │   ├── map/                # 地图组件（ChinaMap...）
│   │   ├── dashboard/          # 大屏业务组件（DataCard、RankList...）
│   │   └── layout/             # 布局组件（FullScreen、GridLayout...）
│   │
│   ├── views/                  # 页面/大屏视图
│   │   ├── index.vue           # 主大屏
│   │   └── demo/               # 演示大屏
│   │
│   ├── stores/                 # Pinia 状态管理（按模块拆分）
│   │   ├── useAppStore.ts      # 应用全局状态
│   │   ├── useThemeStore.ts    # 主题配置
│   │   └── useDataStore.ts     # 数据状态（Mock/API 切换核心）
│   │
│   ├── services/               # 数据服务层
│   │   ├── api/                # 真实 API 接口
│   │   ├── mock/               # Mock 模拟数据
│   │   │   ├── sales.ts        # 销售数据
│   │   │   ├── map.ts          # 地图数据
│   │   │   ├── trend.ts        # 趋势数据
│   │   │   └── rank.ts         # 排行榜数据
│   │   └── adapter.ts          # 数据适配器（API ↔ Mock 一键切换）
│   │
│   ├── composables/            # 组合式函数（逻辑复用）
│   │   ├── useScreenScale.ts   # 大屏自适应缩放
│   │   ├── useDataFetch.ts     # 数据请求封装（重试/轮询）
│   │   ├── useWebSocket.ts     # WebSocket 实时数据
│   │   └── useAutoRefresh.ts   # 定时刷新
│   │
│   ├── utils/                  # 工具函数
│   │   ├── logger.ts           # 日志系统（分级输出）
│   │   ├── format.ts           # 数据格式化
│   │   └── validator.ts        # 数据校验
│   │
│   ├── router/                 # 路由配置
│   ├── types/                  # TypeScript 类型定义
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 应用入口
│
├── tests/                      # 测试目录
│   ├── unit/                   # 单元测试
│   │   ├── components/
│   │   ├── stores/
│   │   └── utils/
│   └── e2e/                    # E2E 测试
│
├── .env                        # 环境变量（开发）
├── .env.production             # 环境变量（生产）
├── .eslintrc.cjs               # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── vitest.config.ts            # Vitest 配置
├── playwright.config.ts        # Playwright 配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
└── package.json                # 项目依赖
```

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🚀 **从零搭建** | 从项目初始化到完整大屏，每一步都有详细指引 |
| 🧩 **模块化架构** | 组件、Store、Service、Composable 职责清晰分离 |
| 🔄 **Mock/API 无缝切换** | 数据适配器模式，环境变量一键切换数据源 |
| 📊 **ECharts 图表** | 柱状图、折线图、饼图、中国地图等多种图表类型 |
| 📱 **大屏自适应** | useScreenScale 组合式函数，支持多种缩放策略 |
| 📝 **日志系统** | 分级日志输出，开发/生产环境自动适配 |
| ✅ **测试覆盖** | Vitest 单元测试 + Playwright E2E 测试 |
| 🎨 **代码质量** | ESLint + Prettier + Husky 保证代码规范 |
| 🔌 **实时数据** | WebSocket 连接支持，可接入实时推送 |
| ⏱️ **定时刷新** | 内置自动刷新机制，模拟真实大屏场景 |

---

## 🎯 学习路线

```
第 1 步：项目搭建   → 初始化工程，了解 Vite + Vue3 项目结构
第 2 步：布局设计   → 搭建大屏骨架，掌握 Flex/Grid 布局
第 3 步：数据管理   → 学习 Pinia Store 模块化设计
第 4 步：图表入门   → 接入 ECharts，绘制第一张柱状图
第 5 步：组件开发   → 封装 DataCard、RankList 等可复用组件
第 6 步：数据适配   → 理解适配器模式，实现 Mock/API 切换
第 7 步：大屏自适应 → 实现不同分辨率下的完美适配
第 8 步：测试保障   → 编写单元测试和 E2E 测试
第 9 步：性能优化   → 了解大屏渲染优化与分包策略
第 10 步：打包部署  → 将大屏发布上线
```

---

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/XXXRQQQ/ZeroToOne.git

# 进入目录
cd ZeroToOne

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行单元测试
npm run test:unit

# 运行 E2E 测试
npm run test:e2e

# 构建生产版本
npm run build
```

---

## 🔧 Mock / API 切换

项目默认使用 Mock 数据，修改 `.env` 文件即可切换：

```env
# 使用 Mock 数据（默认）
VITE_USE_MOCK=true

# 使用真实 API
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://your-api-server.com
```

切换原理：`services/adapter.ts` 中的 `dataAdapter` 通过环境变量动态导入对应的数据源，上层 Store 和组件无需任何改动。

---

## 🧪 测试系统

| 层级 | 工具 | 说明 |
|------|------|------|
| 单元测试 | Vitest + @vue/test-utils | 工具函数、Store、组件逻辑 |
| E2E 测试 | Playwright | 大屏页面完整交互测试 |
| 覆盖率 | v8 provider | 自动生成覆盖率报告 |

---

## 📊 日志系统

通过 `utils/logger.ts` 实现分级日志：

```typescript
import { logger } from '@/utils/logger'

logger.debug('调试信息')   // 仅在 VITE_LOG_LEVEL=debug 时输出
logger.info('常规信息')    // 应用启动、数据加载等
logger.warn('警告信息')    // 数据异常、重连等
logger.error('错误信息')   // 接口失败、渲染异常等
```

生产环境设置 `VITE_LOG_LEVEL=warn` 可屏蔽 debug/info 日志。

---

## 🤝 贡献指南

我们非常欢迎你的参与！

- 🐛 发现 Bug？请提交 [Issue](https://github.com/XXXRQQQ/ZeroToOne/issues)
- 💡 有新想法？欢迎发起 [Pull Request](https://github.com/XXXRQQQ/ZeroToOne/pulls)
- 📚 想要完善文档？任何改进都值得被看见

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源，你可以自由使用、修改和分发。

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/XXXRQQQ">XXXRQQQ</a></sub>
  <br />
  <sub><b>从零到一数据大屏</b> — 让数据可视化不再遥不可及。</sub>
</p>
