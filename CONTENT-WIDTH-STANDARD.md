# 内容宽度统一标准

**制定时间**: 2026-03-20 18:53  
**目的**: 统一所有页面的内容宽度，确保视觉一致性

---

## 📐 宽度标准

### 容器宽度
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### 适用范围
所有页面的主要内容区域都应遵循此标准：
- ✅ 首页（Home）
- ✅ 想法列表（Ideas）
- ✅ 想法详情（IdeaDetail）
- ✅ 想法发布（IdeaCreate）
- ✅ 用户主页（UserProfile）
- ✅ 关于我们（About）
- ✅ 常见问题（FAQ）
- ✅ 反馈建议（Feedback）
- ✅ 用户协议（Terms）
- ✅ 隐私政策（Privacy）
- ✅ 登录/注册（Login/Register）

---

## 📊 页面宽度对比

### Banner（Hero 区域）
所有页面的 Banner 都应该是**全宽背景**，但内容限制在 1200px 内：

```css
.hero {
  background: linear-gradient(...);  /* 全宽背景 */
}

.hero .container {
  max-width: 1200px;  /* 内容限制 */
  margin: 0 auto;
  padding: 0 20px;
}
```

### 内容区域

#### 单列内容（Terms, Privacy, FAQ）
```css
.content {
  max-width: 1200px;  /* 与 container 一致 */
  margin: 0 auto;
  padding: 0 20px;
}
```

#### 双列布局（About）
```css
/* Row 和 Col 会自动适应 container 宽度 */
<Row gutter={[24, 24]}>
  <Col xs={24} md={12}>...</Col>
</Row>
```

#### 表单（Feedback）
```css
.formCard {
  max-width: 800px;  /* 表单可以稍窄，但要在 container 内 */
  margin: 0 auto;
}
```

---

## 🔧 已修复的页面

| 页面 | 文件 | 状态 | 修复内容 |
|------|------|------|---------|
| **Footer** | `components/Footer/index.module.css` | ✅ 完成 | 添加 `.footer .container` 样式 |
| **Terms** | `pages/Terms/index.module.css` | ✅ 完成 | `.content` 改为 1200px |
| **Privacy** | `pages/Privacy/index.module.css` | ✅ 完成 | `.content` 改为 1200px |
| **FAQ** | `pages/FAQ/index.module.css` | ✅ 完成 | `.collapseCard` 改为 1200px |
| **About** | `pages/About/index.module.css` | ✅ 完成 | `.card` 添加 width: 100% |
| **Feedback** | `pages/Feedback/index.module.css` | ✅ 完成 | `.formCard` 限制 800px |

---

## 🎯 视觉效果

### 修复前
```
首页：    [======== 1200px ========]
About:   [==== 900px ====]  ← 不一致 ❌
FAQ:     [==== 900px ====]  ← 不一致 ❌
Footer:  [==== 900px ====]  ← 不一致 ❌
```

### 修复后
```
首页：    [======== 1200px ========]
About:   [======== 1200px ========]  ✅
FAQ:     [======== 1200px ========]  ✅
Footer:  [======== 1200px ========]  ✅
```

---

## 🧪 验证清单

访问以下页面，检查内容宽度是否一致：

- [ ] http://localhost:3000 （首页）
- [ ] http://localhost:3000/about （关于我们）
- [ ] http://localhost:3000/faq （常见问题）
- [ ] http://localhost:3000/feedback （反馈建议）
- [ ] http://localhost:3000/terms （用户协议）
- [ ] http://localhost:3000/privacy （隐私政策）

**验证方法**:
1. 打开浏览器开发者工具（F12）
2. 检查 `.container` 或主要内容区域的宽度
3. 确认 `max-width: 1200px` 已应用
4. 对比各页面的内容宽度

---

## 📝 注意事项

1. **Banner 背景全宽**：Hero 区域的背景色/渐变应该是全宽的
2. **内容限制 1200px**：Banner 内的文字内容应该限制在 1200px 内
3. **响应式设计**：移动端（< 768px）使用 100% 宽度
4. **左右留白**：`padding: 0 20px` 确保内容不贴边

---

## 🔄 维护建议

创建新页面时，请遵循以下模板：

```tsx
import React from 'react'
import { Card } from 'antd'
import styles from './index.module.css'

const MyPage: React.FC = () => {
  return (
    <div className={styles.mypage}>
      <div className="container">  {/* 使用全局 container 类 */}
        <Card className={styles.hero}>
          <h1>标题</h1>
        </Card>
        
        <Card className={styles.content}>
          {/* 内容区域 */}
        </Card>
      </div>
    </div>
  )
}
```

```css
.mypage {
  padding: 24px 0 48px;
  min-height: calc(100vh - 200px);
}

.hero {
  /* Banner 样式 */
}

.content {
  max-width: 1200px;  /* 与 container 一致 */
  margin: 0 auto;
}
```

---

**宽度统一完成！** 🎉
