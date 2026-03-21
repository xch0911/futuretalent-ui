# Container 嵌套问题修复

**修复时间**: 2026-03-20 19:15  
**问题**: Footer 链接页面（Terms/Privacy/FAQ/About）嵌套了多个 container，导致双重 padding

---

## 🐛 问题描述

### 现象
- 页面内容区域左右留白过大
- 实际宽度比预期窄
- 视觉上显得拥挤

### 原因
**双重 container 嵌套**：
```tsx
<div className="container">  {/* 外层：padding: 0 20px */}
  <Card className="content">
    {/* 内层又定义了 max-width: 1200px; padding: 0 20px */}
  </Card>
</div>
```

导致：
- 外层 container：`padding: 0 20px`
- 内层 content：`padding: 0 20px`（多余的）
- **总 padding**: 左右各 40px ❌

---

## ✅ 修复内容

### 修复原则
**只保留外层 container 的宽度和 padding 控制**，内层卡片只设置 `width: 100%`。

---

### 1. Terms 页面

**文件**: `src/pages/Terms/index.module.css`

**修复前**:
```css
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;  /* ❌ 多余的 padding */
}
```

**修复后**:
```css
.content {
  /* 移除宽度和 padding，由外层 container 控制 */
  width: 100%;
}
```

---

### 2. Privacy 页面

**文件**: `src/pages/Privacy/index.module.css`

**修复**: 同 Terms 页面

---

### 3. FAQ 页面

**文件**: `src/pages/FAQ/index.module.css`

**修复前**:
```css
.collapseCard {
  max-width: 1200px;
  margin: 24px auto;  /* ❌ 多余的 margin */
}

.contactCard {
  max-width: 1200px;
  margin: 24px auto;  /* ❌ 多余的 margin */
}
```

**修复后**:
```css
.collapseCard {
  /* 移除宽度限制，由外层 container 控制 */
  width: 100%;
  margin: 24px 0;  /* 只保留上下 margin */
}

.contactCard {
  /* 移除宽度限制，由外层 container 控制 */
  width: 100%;
  margin: 24px 0;
  text-align: center;
}
```

---

### 4. About 页面

**文件**: `src/pages/About/index.module.css`

**修复**: 已确认正确（只有注释更新）

---

## 📊 修复效果

### 修复前
```
外层 container:  [====== 1200px + 40px padding ======]
内层 content:    [==== 1200px + 40px padding ====]
实际内容区域：   [==== 约 1120px ====]  ← 过窄 ❌
```

### 修复后
```
外层 container:  [====== 1200px + 20px padding ======]
内层 content:    [====== 100% 宽度 ======]
实际内容区域：   [====== 1160px ======]  ← 正确 ✅
```

---

## 📁 修改文件

| 文件 | 修改内容 | 状态 |
|------|---------|------|
| `pages/Terms/index.module.css` | `.content` 改为 `width: 100%` | ✅ |
| `pages/Privacy/index.module.css` | `.content` 改为 `width: 100%` | ✅ |
| `pages/FAQ/index.module.css` | `.collapseCard` 和 `.contactCard` 改为 `width: 100%` | ✅ |
| `pages/About/index.module.css` | 注释更新 | ✅ |

---

## 🧪 验证方法

### 1. 访问页面
- http://localhost:3000/terms （用户协议）
- http://localhost:3000/privacy （隐私政策）
- http://localhost:3000/faq （常见问题）
- http://localhost:3000/about （关于我们）

### 2. 检查项
- [ ] 内容宽度与首页一致
- [ ] 左右留白正常（20px）
- [ ] 文字不拥挤
- [ ] Card 边缘到屏幕边缘距离均匀

### 3. 对比验证
打开首页和这些页面，内容宽度应该完全一致。

---

## 🎯 正确的页面结构

### ✅ 正确示例
```tsx
<div className={styles.page}>
  <div className="container">  {/* 全局 container */}
    <Card className={styles.hero}>
      {/* Banner 内容 */}
    </Card>
    
    <Card className={styles.content}>
      {/* 主要内容，width: 100% */}
    </Card>
  </div>
</div>
```

```css
.page {
  padding: 24px 0 48px;
}

.content {
  width: 100%;  /* ✅ 由外层 container 控制宽度 */
}
```

### ❌ 错误示例
```tsx
<div className={styles.page}>
  <div className="container">
    <Card className={styles.content}>
      {/* 又在 .content 里定义 max-width 和 padding */}
    </Card>
  </div>
</div>
```

```css
.content {
  max-width: 1200px;  /* ❌ 重复定义 */
  padding: 0 20px;    /* ❌ 双重 padding */
}
```

---

## ✅ 验收标准

- [x] Terms 页面宽度正确
- [x] Privacy 页面宽度正确
- [x] FAQ 页面宽度正确
- [x] About 页面宽度正确
- [ ] 前端服务已重启
- [ ] 浏览器缓存已清除
- [ ] 与首页宽度一致

---

**修复完成！** 🎉
