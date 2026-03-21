# 双重 Container 嵌套问题修复

**修复时间**: 2026-03-20 19:20  
**问题**: Footer 链接页面（Privacy/Terms/FAQ/About）存在双重 container 嵌套

---

## 🐛 问题描述

### 根本原因
**Layout 组件**已经在 Content 区域包了一层 `.container`：

```tsx
// Layout.tsx
<Content className={styles.content}>
  <div className="container">  {/* ← 第 1 层 container */}
    {children}
  </div>
</Content>
```

但 **Privacy/Terms/FAQ/About 页面**内部又包了一层：

```tsx
// Privacy.tsx (修复前)
<div className={styles.privacy}>
  <div className="container">  {/* ← 第 2 层 container（多余） */}
    <Card className={styles.hero}>...</Card>
    <Card className={styles.content}>...</Card>
  </div>
</div>
```

### 导致的问题
1. **双重 padding**: 左右各 40px（应该是 20px）
2. **内容过窄**: 实际宽度比预期窄
3. **结构冗余**: HTML 嵌套层级过多

---

## ✅ 修复方案

**移除页面内部的 `.container` 包裹**，由 Layout 统一控制。

---

### 1. Privacy 页面

**文件**: `src/pages/Privacy/index.tsx`

**修复前**:
```tsx
<div className={styles.privacy}>
  <div className="container">  {/* ❌ 多余 */}
    <Card className={styles.hero}>...</Card>
    <Card className={styles.content}>...</Card>
  </div>
</div>
```

**修复后**:
```tsx
<div className={styles.privacy}>
  <Card className={styles.hero}>...</Card>
  <Card className={styles.content}>...</Card>
</div>
```

---

### 2. Terms 页面

**文件**: `src/pages/Terms/index.tsx`

**修复**: 同 Privacy 页面

---

### 3. FAQ 页面

**文件**: `src/pages/FAQ/index.tsx`

**修复**: 同 Privacy 页面

---

### 4. About 页面

**文件**: `src/pages/About/index.tsx`

**修复**: 同 Privacy 页面

---

## 📊 修复效果

### 修复前
```
Layout:
  <div className="container">  ← 第 1 层
    <Privacy>
      <div className="container">  ← 第 2 层（多余）
        内容
```

**实际 padding**: 左右各 40px ❌

### 修复后
```
Layout:
  <div className="container">  ← 唯一一层
    <Privacy>
      内容
```

**实际 padding**: 左右各 20px ✅

---

## 📁 修改文件

| 文件 | 修改内容 | 状态 |
|------|---------|------|
| `pages/Privacy/index.tsx` | 移除内部 `.container` | ✅ |
| `pages/Terms/index.tsx` | 移除内部 `.container` | ✅ |
| `pages/FAQ/index.tsx` | 移除内部 `.container` | ✅ |
| `pages/About/index.tsx` | 移除内部 `.container` | ✅ |

---

## 🎯 正确的页面结构

### ✅ 标准模板
```tsx
import React from 'react'
import { Card } from 'antd'
import styles from './index.module.css'

const MyPage: React.FC = () => {
  return (
    <div className={styles.mypage}>
      {/* 不需要 .container，由 Layout 提供 */}
      <Card className={styles.hero}>
        <h1>标题</h1>
      </Card>
      
      <Card className={styles.content}>
        {/* 内容区域，width: 100% */}
      </Card>
    </div>
  )
}
```

### ❌ 错误示例
```tsx
<div className={styles.mypage}>
  <div className="container">  {/* ❌ 不要加 */}
    ...
  </div>
</div>
```

---

## 🧪 验证方法

### 1. 访问页面
- http://localhost:3000/privacy （隐私政策）
- http://localhost:3000/terms （用户协议）
- http://localhost:3000/faq （常见问题）
- http://localhost:3000/about （关于我们）

### 2. 检查项
- [ ] 内容宽度与首页一致
- [ ] 左右留白正常（20px）
- [ ] 浏览器开发者工具检查：只有 1 层 `.container`
- [ ] 文字不拥挤

### 3. 对比验证
打开首页和这些页面，内容宽度应该完全一致。

---

## ✅ 验收标准

- [x] Privacy 页面移除内部 container
- [x] Terms 页面移除内部 container
- [x] FAQ 页面移除内部 container
- [x] About 页面移除内部 container
- [ ] 前端服务已重启
- [ ] 浏览器缓存已清除
- [ ] 与首页宽度一致

---

**修复完成！** 🎉
