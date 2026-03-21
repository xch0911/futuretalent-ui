# 发布想法页面顶部间距修复

**修复时间**: 2026-03-20 18:54  
**问题**: 发布想法页面顶部与导航栏距离过近

---

## 🐛 问题描述

### 现象
- 发布想法页面的 Card 顶部与导航栏距离过近
- 缺少足够的垂直留白
- 视觉上显得拥挤

### 原因
`.container` 只设置了 `padding-bottom: 48px`，缺少顶部 padding

---

## ✅ 修复内容

**文件**: `src/pages/IdeaCreate/index.module.css`

**修改前**:
```css
.container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 48px;
}
```

**修改后**:
```css
.container {
  max-width: 800px;
  margin: 0 auto;
  /* 顶部与导航栏保持距离 */
  padding-top: 24px;
  padding-bottom: 48px;
}
```

---

## 📊 修复效果

### 修复前
```
导航栏
↓ (距离过小)
[发布新想法 Card]
```

### 修复后
```
导航栏
↓
  (24px 留白)
↓
[发布新想法 Card]
```

---

## 🎯 统一标准

所有页面的顶部间距应保持一致：

| 页面类型 | 顶部间距 |
|---------|---------|
| **首页** | 24px (通过 Layout) |
| **列表页** | 24px |
| **详情页** | 24px |
| **表单页** | 24px ✅ |
| **内容页** | 24px |

---

## 🧪 验证方法

1. **访问**: http://localhost:3000/idea/create
2. **检查**: 页面顶部与导航栏的距离
3. **对比**: 与其他页面（如首页、想法列表）的间距是否一致

---

## 📁 修改文件

| 文件 | 修改内容 |
|------|---------|
| `pages/IdeaCreate/index.module.css` | 添加 `padding-top: 24px` |

---

**修复完成！** 🎉
