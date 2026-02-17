# FluxMap - News Heatmap

精致的新闻热力图可视化平台，实时展示全球新闻分布和趋势。

A sophisticated news heatmap visualization platform that displays global news distribution and trends in real-time.

## 功能特性 / Features

### ✅ 必需功能 / Required Features

- **时间窗口切换** / Time Window Switching (15m/1h/6h/24h)
  - 支持四种时间范围，动态查看新闻演变
  - Supports four time ranges for dynamic news evolution tracking

- **多视图联动** / Multi-view Linkage
  - 地图 (Map) - deck.gl + MapLibre 热力图可视化
  - 趋势图 (Trend Chart) - SVG 线图展示新闻活动
  - Top 列表 (Top List) - 热门故事排行
  - 文章证据 (Article Evidence) - 详细文章信息

- **自动刷新** / Auto-refresh
  - 每 60 秒自动更新数据
  - Automatic data refresh every 60 seconds

- **Last Updated** 
  - 实时显示最后更新时间
  - Real-time display of last update timestamp

### 📄 页面 / Pages

1. **Story** - 叙事式滚动体验 (使用 react-scrollama)
2. **Explore** - 主交互可视化页面
3. **About** - 项目介绍和技术栈说明

## 技术栈 / Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 5
- **Mapping**: deck.gl 9 + MapLibre GL 4
- **State Management**: Zustand 4
- **Routing**: React Router 6
- **Scrollytelling**: react-scrollama 2
- **Styling**: Pure CSS (模块化组件样式)

## 项目结构 / Project Structure

```
FluxMap/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── TimeWindowSwitcher.tsx/css
│   │   ├── LastUpdated.tsx/css
│   │   ├── MapView.tsx/css
│   │   ├── TrendChart.tsx/css
│   │   ├── TopList.tsx/css
│   │   ├── ArticleEvidence.tsx/css
│   │   └── Layout.tsx/css
│   ├── pages/              # 页面组件
│   │   ├── Story.tsx/css
│   │   ├── Explore.tsx/css
│   │   └── About.tsx/css
│   ├── types.ts            # TypeScript 类型定义
│   ├── store.ts            # Zustand 全局状态管理
│   ├── mockData.ts         # 模拟数据生成器
│   ├── App.tsx             # 主应用组件 (路由 + 自动刷新)
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 安装和运行 / Installation & Usage

### 安装依赖 / Install Dependencies

```bash
npm install
```

### 开发模式 / Development Mode

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本 / Build for Production

```bash
npm run build
```

### 预览生产构建 / Preview Production Build

```bash
npm run preview
```

## 代码特点 / Code Features

### ✅ 可读性 / Readability
- 所有文件都有清晰的文档注释
- 组件职责单一，易于理解和维护
- TypeScript 类型定义完整

### ✅ 组件化 / Component Architecture
- 组件拆分清晰，高度可复用
- 每个组件独立的 CSS 文件
- Props 和状态管理明确

### ✅ 数据层分离 / Data Layer Separation
- `types.ts` - 类型定义
- `store.ts` - 状态管理
- `mockData.ts` - 数据生成和获取逻辑

### ✅ 引用注释 / Reference Comments
- 所有非原创参考都标注了来源
- deck.gl 官方文档链接
- Zustand 官方仓库链接
- MapLibre basemap 来源说明

## 数据说明 / Data Notes

当前使用模拟数据进行演示。在生产环境中，可以集成真实的新闻 API：

Currently using mock data for demonstration. In production, integrate real news APIs:

- NewsAPI
- Reuters API
- Associated Press API
- Google News RSS
- Twitter/X API

## 浏览器支持 / Browser Support

- Chrome/Edge (推荐 / Recommended)
- Firefox
- Safari
- 需要 WebGL 支持 / Requires WebGL support

## 许可 / License

MIT

## 作者 / Author

Built for VDES 39915 - Sheridan College

---

**Note**: This is a demonstration project showcasing interactive data visualization and modern React patterns.
