/**
 * 诊断脚本 - 在浏览器控制台运行
 * 
 * 使用方法：
 * 1. 打开个人主页
 * 2. 点击编辑头像
 * 3. 选择图片打开裁剪对话框
 * 4. 在控制台运行此脚本
 */

console.log('🔍 开始诊断头像裁剪组件...\n')

// 1. 检查 cropper-wrapper 元素
const wrapper = document.querySelector('.cropperWrapper')
console.log('1️⃣ cropperWrapper 元素:', wrapper ? '✅ 存在' : '❌ 不存在')

if (wrapper) {
  const styles = window.getComputedStyle(wrapper)
  console.log('   - touch-action:', styles.touchAction)
  console.log('   - user-select:', styles.userSelect)
  console.log('   - overflow:', styles.overflow)
}

// 2. 检查 react-easy-crop 容器
const cropContainer = document.querySelector('.reactEasyCrop_Container')
console.log('\n2️⃣ reactEasyCrop_Container:', cropContainer ? '✅ 存在' : '❌ 不存在')

if (cropContainer) {
  const styles = window.getComputedStyle(cropContainer)
  console.log('   - touch-action:', styles.touchAction)
  console.log('   - cursor:', styles.cursor)
  console.log('   - overflow:', styles.overflow)
}

// 3. 检查图片元素
const cropImage = document.querySelector('.reactEasyCrop_Image')
console.log('\n3️⃣ reactEasyCrop_Image:', cropImage ? '✅ 存在' : '❌ 不存在')

if (cropImage) {
  const styles = window.getComputedStyle(cropImage)
  console.log('   - pointer-events:', styles.pointerEvents)
  console.log('   - touch-action:', styles.touchAction)
  console.log('   - user-select:', styles.userSelect)
}

// 4. 检查全局样式是否注入
const globalStyle = document.getElementById('cropper-touch-styles')
console.log('\n4️⃣ 全局样式注入:', globalStyle ? '✅ 已注入' : '❌ 未注入')

if (globalStyle) {
  console.log('   - 样式内容长度:', globalStyle.textContent?.length || 0, '字符')
}

// 5. 添加触摸事件监听
console.log('\n5️⃣ 添加触摸事件监听...')

if (wrapper) {
  wrapper.addEventListener('touchstart', (e) => {
    console.log('👆 wrapper touchstart', {
      touches: e.touches.length,
      prevented: e.defaultPrevented
    })
  }, { passive: false })

  wrapper.addEventListener('touchmove', (e) => {
    console.log('👆 wrapper touchmove', {
      touches: e.touches.length,
      prevented: e.defaultPrevented
    })
  }, { passive: false })
}

if (cropContainer) {
  cropContainer.addEventListener('touchstart', (e) => {
    console.log('👆 container touchstart', {
      touches: e.touches.length,
      prevented: e.defaultPrevented
    })
  }, { passive: false })

  cropContainer.addEventListener('touchmove', (e) => {
    console.log('👆 container touchmove', {
      touches: e.touches.length,
      prevented: e.defaultPrevented
    })
  }, { passive: false })
}

console.log('\n✅ 诊断完成！')
console.log('\n💡 现在请尝试：')
console.log('   1. 单指拖动图片')
console.log('   2. 双指捏合缩放')
console.log('   3. 查看控制台输出的触摸事件')
console.log('\n📋 如果触摸事件没有触发，请检查：')
console.log('   - 是否使用真实设备或 Chrome 触摸模拟')
console.log('   - CSS 样式是否正确应用')
console.log('   - 是否有其他元素遮挡')
