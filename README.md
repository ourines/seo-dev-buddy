# SEO Dev Buddy

一个框架无关的 SEO 诊断插件，专为开发阶段设计，遵循 Google Search 最佳实践。

## 特性

- 🔍 **实时 SEO 分析** - 在开发过程中实时检测 SEO 问题
- 🎯 **Google 最佳实践** - 基于 Google Search 官方指南
- 🚀 **框架无关** - 支持 React、Vue、Angular 和原生 JavaScript
- 📱 **响应式界面** - 美观的浮动面板，不影响开发体验
- ⚡ **零配置** - 开箱即用，自动检测开发环境
- 🎨 **可定制** - 支持自定义配置和主题

## 安装

```bash
npm install @ourines/seo-dev-buddy
# 或
yarn add @ourines/seo-dev-buddy
# 或
pnpm add @ourines/seo-dev-buddy
```

## 快速开始

### React 应用

```tsx
import { useSeoDevBuddy } from '@ourines/seo-dev-buddy';
import '@ourines/seo-dev-buddy/styles';

function App() {
  // 在开发环境自动启用
  useSeoDevBuddy();
  
  return <div>Your App</div>;
}
```

### Vue 3 应用

```ts
import { createApp } from 'vue';
import { createSeoDevBuddyPlugin } from '@ourines/seo-dev-buddy';
import '@ourines/seo-dev-buddy/styles';

const app = createApp(App);
app.use(createSeoDevBuddyPlugin());
```

### Angular 应用

```ts
import { Injectable } from '@angular/core';
import { createAngularSeoDevBuddyService } from '@ourines/seo-dev-buddy';
import '@ourines/seo-dev-buddy/styles';

@Injectable({ providedIn: 'root' })
export class SeoDevBuddyService extends createAngularSeoDevBuddyService() {}
```

### 原生 JavaScript

```html
<!-- 通过 script 标签 -->
<script src="https://unpkg.com/@ourines/seo-dev-buddy" data-auto-init></script>
<link rel="stylesheet" href="https://unpkg.com/@ourines/seo-dev-buddy/styles">

<!-- 或者手动初始化 -->
<script>
import { SeoDevBuddyVanilla } from '@ourines/seo-dev-buddy';
import '@ourines/seo-dev-buddy/styles';

// 手动初始化
const cleanup = SeoDevBuddyVanilla.init();

// 清理
// cleanup();
</script>
```

## API 参考

### 配置选项

```ts
interface SEODevBuddyConfig {
  // 是否在生产环境启用（默认：false）
  enableInProduction?: boolean;
  
  // 自定义主题
  theme?: 'light' | 'dark' | 'auto';
  
  // 检查间隔（毫秒，默认：1000）
  checkInterval?: number;
  
  // 自定义规则
  customRules?: SEORule[];
  
  // 忽略的检查项
  ignoredChecks?: string[];
}
```

### React Hook

```tsx
import { useSeoDevBuddy } from '@ourines/seo-dev-buddy';

function MyComponent() {
  useSeoDevBuddy({
    theme: 'dark',
    checkInterval: 2000,
    ignoredChecks: ['meta-description']
  });
}
```

### 手动控制

```ts
import { 
  initSeoDevBuddy, 
  destroySeoDevBuddy, 
  isSeoDevBuddyActive 
} from '@ourines/seo-dev-buddy';

// 初始化
const cleanup = initSeoDevBuddy({
  theme: 'auto',
  enableInProduction: false
});

// 检查状态
if (isSeoDevBuddyActive()) {
  console.log('SEO Dev Buddy is running');
}

// 销毁实例
destroySeoDevBuddy();
// 或使用返回的清理函数
cleanup();
```

## 检查项目

SEO Dev Buddy 会自动检查以下 SEO 要素：

### 基础 Meta 标签

- ✅ Title 标签存在且长度合适 (30-60 字符)
- ✅ Meta Description 存在且长度合适 (120-160 字符)
- ✅ Meta Viewport 设置正确
- ✅ Canonical URL 设置

### Open Graph

- ✅ og:title, og:description, og:image
- ✅ og:url, og:type, og:site_name
- ✅ 图片尺寸和格式检查

### Twitter Cards

- ✅ twitter:card, twitter:title, twitter:description
- ✅ twitter:image 设置和尺寸检查

### 结构化数据

- ✅ JSON-LD 格式检查
- ✅ Schema.org 标记验证

### 技术 SEO

- ✅ 页面加载性能
- ✅ 图片 alt 属性
- ✅ 标题层级结构 (H1-H6)
- ✅ 内部链接结构

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 类型检查
pnpm type-check
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。

---

## 未来增强计划

- **优化状态检查**:
  - 为 OG/Twitter 描述添加长度检查（少于 100 字符时警告）
  - 检查 Canonical URL 是否为绝对路径
  - 警告图片 URL 中的双斜杠（`//`）问题

- **改进代码结构**:
  - 重构 `getItemStatusLevel` 为更小、更专注的函数
  - 创建辅助函数避免重复的 `seoData` 检索逻辑

- **功能增强**:
  - 基础关键词分析（需要用户输入目标关键词）
  - 显示基础性能指标（如 LCP）使用 `window.performance`
  - 尝试基础 JSON-LD 验证或链接到外部验证器
  - 添加警告阈值配置选项（如字数统计）
