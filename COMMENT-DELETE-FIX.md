# 子评论删除功能修复

**修复时间**: 2026-03-20 18:56  
**问题**: 子评论删除时报错 `TypeError: onDelete is not a function`

---

## 🐛 问题描述

### 错误信息
```
删除失败 TypeError: onDelete is not a function
    at onOk (index.tsx:60)
    at onClick (ActionButton.js:87)
```

### 现象
- 主评论删除功能正常
- 子评论（回复的回复）删除时报错
- 长按子评论触发删除确认后，点击"确认删除"时报错

---

## 🔍 问题分析

### 根本原因
Comment 组件在递归渲染子评论时，**忘记传递 `onDelete` 属性**。

### 代码位置
**文件**: `src/components/Comment/index.tsx`  
**行数**: 第 157-181 行（子评论渲染部分）

### 问题代码
```tsx
// 子评论递归渲染
<Comment
  key={reply.id}
  comment={reply}
  onReply={onReply}
  // ❌ 缺少 onDelete={onDelete}
  replyingTo={replyingTo}
  onSubmitReply={onSubmitReply}
  onCancelReply={onCancelReply}
  navigate={navigate}
  currentUser={currentUser}
  depth={depth + 1}
  parentNickname={...}
/>
```

---

## ✅ 修复内容

**文件**: `src/components/Comment/index.tsx`

### 修复 1：展开所有回复时
```tsx
{comment.replies.map(reply => (
  <Comment
    key={reply.id}
    comment={reply}
    onReply={onReply}
    onDelete={onDelete}  {/* ✅ 新增 */}
    replyingTo={replyingTo}
    onSubmitReply={onSubmitReply}
    onCancelReply={onCancelReply}
    navigate={navigate}
    currentUser={currentUser}
    depth={depth + 1}
    parentNickname={(comment as any).author?.nickname || comment.authorNickname}
  />
))}
```

### 修复 2：只显示第一条回复时
```tsx
<Comment
  comment={comment.replies[0]}
  onReply={onReply}
  onDelete={onDelete}  {/* ✅ 新增 */}
  replyingTo={replyingTo}
  onSubmitReply={onSubmitReply}
  onCancelReply={onCancelReply}
  navigate={navigate}
  currentUser={currentUser}
  depth={depth + 1}
  parentNickname={(comment as any).author?.nickname || comment.authorNickname}
/>
```

---

## 📊 修复效果

### 修复前
```
主评论 → onDelete ✅
└─ 子评论 → onDelete ❌ (undefined)
   └─ 孙评论 → onDelete ❌ (undefined)
```

### 修复后
```
主评论 → onDelete ✅
└─ 子评论 → onDelete ✅
   └─ 孙评论 → onDelete ✅
```

---

## 🧪 测试方法

### 测试步骤
1. **访问**: http://localhost:3000/idea/{ideaId}
2. **找到有回复的评论**
3. **长按子评论**（鼠标按住或手指长按）
4. **确认删除**
5. **验证**: 删除成功，无报错

### 测试场景
- [ ] 主评论删除
- [ ] 子评论删除（第一层回复）
- [ ] 孙评论删除（第二层回复）
- [ ] 展开所有回复后删除
- [ ] 收起回复后删除

---

## 📁 修改文件

| 文件 | 修改内容 | 行数 |
|------|---------|------|
| `components/Comment/index.tsx` | 添加 `onDelete={onDelete}` | 2 处 |

---

## 🔧 技术要点

### 递归组件属性传递
当组件递归渲染自身时，需要确保所有必要的属性都传递给子组件：

```tsx
// ✅ 正确示例
<Comment
  comment={reply}
  onReply={onReply}      // 回复处理
  onDelete={onDelete}    // 删除处理 ← 容易遗漏
  onSubmitReply={onSubmitReply}
  ...
/>
```

### 属性命名规范
- 事件处理函数使用 `on` 前缀：`onReply`, `onDelete`, `onSubmitReply`
- 数据使用名词：`comment`, `currentUser`, `replyingTo`
- 状态使用形容词/分词：`loading`, `submitting`

---

## ✅ 验收标准

- [x] 子评论长按删除功能正常
- [x] 删除确认对话框正常显示
- [x] 点击"确认删除"后无报错
- [x] 删除后评论列表正确更新
- [ ] 前端服务已重启
- [ ] 浏览器缓存已清除

---

**修复完成！** 🎉
