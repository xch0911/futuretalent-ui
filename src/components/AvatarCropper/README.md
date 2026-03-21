# 头像裁剪组件触摸问题修复指南

## 问题描述
单指拖动图片功能在移动设备上不好用，只能缩放不能拖动。

## 已知解决方案

### 方案 1: 正确配置 touch-action CSS
```css
.cropper-wrapper {
  touch-action: none;  /* 关键：禁止浏览器默认触摸行为 */
}
```

### 方案 2: 使用 Pointer Events
react-easy-crop v4.0+ 支持 pointer events，可以更好地处理触摸和鼠标。

### 方案 3: 禁用图片默认拖动
```css
img {
  pointer-events: none;
  user-drag: none;
  -webkit-user-drag: none;
}
```

### 方案 4: 确保容器 overflow 正确
```css
.cropper-wrapper {
  overflow: hidden;  /* 或 visible，根据需求 */
}
```

## 测试步骤

### 1. 访问测试页面
```
http://localhost:3000/cropper-test.html
```

### 2. 测试原生触摸事件
- 选择图片
- 单指拖动，查看状态显示
- 双指捏合，查看距离变化

### 3. 测试 React 组件
- 在个人主页上传头像
- 测试拖动和缩放

## 常见问题

### Q: 单指不能拖动
**A:** 检查以下几点：
1. `touch-action: none` 是否设置
2. 是否有其他 CSS 阻止了触摸事件
3. 浏览器是否支持 touch events

### Q: 双指缩放不工作
**A:** 确保：
1. `restrictPosition={false}` 已设置
2. 没有 CSS 阻止 pinch 手势

### Q: 图片被浏览器默认行为干扰
**A:** 添加：
```css
img {
  pointer-events: none;
  -webkit-user-drag: none;
}
```

## 参考链接
- react-easy-crop GitHub: https://github.com/ValentinH/react-easy-crop
- MDN Touch Events: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
- CSS touch-action: https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
