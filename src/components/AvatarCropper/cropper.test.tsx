/**
 * AvatarCropper 组件测试用例
 * 
 * 测试步骤：
 * 1. 访问 http://localhost:3000/cropper-test.html
 * 2. 选择一张图片
 * 3. 测试单指拖动
 * 4. 测试双指缩放
 * 5. 测试滑块缩放
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AvatarCropper from './index'

// Mock message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('AvatarCropper', () => {
  const mockImage = 'data:image/jpeg;base64,test'
  const mockOnCropComplete = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该渲染裁剪组件', () => {
    render(
      <AvatarCropper
        image={mockImage}
        visible={true}
        onCropComplete={mockOnCropComplete}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('裁剪头像')).toBeInTheDocument()
    expect(screen.getByText('确认')).toBeInTheDocument()
    expect(screen.getByText('取消')).toBeInTheDocument()
  })

  it('应该显示操作提示', () => {
    render(
      <AvatarCropper
        image={mockImage}
        visible={true}
        onCropComplete={mockOnCropComplete}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/单指拖动/i)).toBeInTheDocument()
  })

  it('点击取消应该调用 onCancel', () => {
    render(
      <AvatarCropper
        image={mockImage}
        visible={true}
        onCropComplete={mockOnCropComplete}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText('取消'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('应该支持缩放滑块', () => {
    render(
      <AvatarCropper
        image={mockImage}
        visible={true}
        onCropComplete={mockOnCropComplete}
        onCancel={mockOnCancel}
      />
    )

    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('1')

    fireEvent.change(slider, { target: { value: '2' } })
    expect(slider).toHaveValue('2')
  })
})

/**
 * 手动测试清单
 * 
 * □ 1. 在桌面端测试
 *   □ 鼠标拖动裁剪框
 *   □ 鼠标滚轮缩放
 *   □ 滑块缩放
 *   □ 确认按钮
 *   □ 取消按钮
 * 
 * □ 2. 在移动端测试（真实设备）
 *   □ 单指拖动图片
 *   □ 双指捏合缩放
 *   □ 滑块缩放
 *   □ 确认按钮
 *   □ 取消按钮
 * 
 * □ 3. 性能测试
 *   □ 大图（>5MB）加载速度
 *   □ 裁剪处理时间
 *   □ 上传速度
 * 
 * □ 4. 边界测试
 *   □ 最小图片（100x100）
 *   □ 超大图片（4000x4000）
 *   □ 非正方形图片
 *   □ 不同格式（JPG, PNG, WebP）
 */

/**
 * 触摸事件测试代码（需要在真实设备上运行）
 */
export const touchTestCode = `
// 在浏览器控制台运行此代码测试触摸事件
const wrapper = document.querySelector('.cropper-wrapper')

wrapper.addEventListener('touchstart', (e) => {
  console.log('👆 touchstart', {
    touches: e.touches.length,
    x: e.touches[0]?.clientX,
    y: e.touches[0]?.clientY
  })
})

wrapper.addEventListener('touchmove', (e) => {
  console.log('👆 touchmove', {
    touches: e.touches.length,
    x: e.touches[0]?.clientX,
    y: e.touches[0]?.clientY
  })
})

wrapper.addEventListener('touchend', (e) => {
  console.log('👆 touchend')
})

console.log('✅ 触摸事件监听器已添加')
console.log('💡 现在可以在裁剪区域测试触摸事件')
`
