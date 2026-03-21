# 页面间距和宽度统一标准

**制定时间**: 2026-03-20 19:00  
**目的**: 统一所有页面的顶部间距和内容宽度

---

## 📐 统一标准

### 1. 顶部间距（与导航栏距离）

**标准**: `padding-top: 24px`

适用于所有页面（除了首页和列表页由 Layout 处理）：
- ✅ About
- ✅ FAQ
- ✅ Feedback
- ✅ IdeaCreate
- ✅ IdeaDetail
- ✅ Ideas
- ✅ Login
- ✅ Privacy
- ✅ Register
- ✅ Terms
- ✅ UserProfile

### 2. 内容宽度

**标准**: `max-width: 1200px`（与首页 container 一致）

特殊情况：
- **表单页面**（Login/Register/Feedback）: `max-width: 400-800px`（居中）
- **详情页面**（IdeaDetail）: `max-width: 900px`（阅读友好）
- **内容页面**（FAQ/Terms/Privacy/About）: `max-width: 1200px`

---

## 📊 当前状态检查

| 页面 | 顶部间距 | 内容宽度 | 状态 |
|------|---------|---------|------|
| **Home** | Layout 处理 | 1200px | ✅ |
| **Ideas** | 16px | 需检查 | ⚠️ |
| **IdeaDetail** | 12px | 900px | ⚠️ |
| **IdeaCreate** | 24px | 800px | ✅ |
| **Login** | 无 | 400px | ❌ |
| **Register** | 无 | 420px | ❌ |
| **About** | 无 | 需检查 | ❌ |
| **FAQ** | 无 | 1200px | ⚠️ |
| **Feedback** | 无 | 800px | ⚠️ |
| **Terms** | 无 | 1200px | ⚠️ |
| **Privacy** | 无 | 1200px | ⚠️ |
| **UserProfile** | 16px | 需检查 | ⚠️ |

---

## 🔧 修复计划

### 优先级 1：添加顶部间距

需要添加 `padding-top: 24px` 的页面：
1. About
2. FAQ
3. Feedback
4. Login
5. Register
6. Terms
7. Privacy

### 优先级 2：统一内容宽度

需要调整宽度的页面：
1. Ideas - 检查并统一
2. UserProfile - 检查并统一

---

**待执行修复...**
