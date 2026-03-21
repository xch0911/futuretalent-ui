import React, { useState, useCallback, useRef } from 'react'
import { Modal, Slider, message } from 'antd'
import Cropper from 'react-easy-crop'
import type { Point, Area } from 'react-easy-crop/types'
import styles from './index.module.css'

interface AvatarCropperProps {
  image: string
  visible: boolean
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

const AvatarCropper: React.FC<AvatarCropperProps> = ({
  image,
  visible,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 修复：正确更新裁剪位置
  const handleCropChange = useCallback((newCrop: Point) => {
    setCrop(newCrop)
  }, [])

  // 修复：裁剪完成时获取像素区域
  const handleCropComplete = useCallback((_: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop)
  }, [])

  // 确认裁剪
  const handleOk = async () => {
    if (!croppedAreaPixels) {
      message.error('请先裁剪图片')
      return
    }
    if (processing) return

    setProcessing(true)
    message.loading({ content: '处理中...', key: 'crop', duration: 0 })

    try {
      const blob = await getCroppedImg(image, croppedAreaPixels)
      message.success({ content: '裁剪成功', key: 'crop' })
      onCropComplete(blob)
    } catch (err) {
      console.error(err)
      message.error('裁剪失败')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Modal
      title="裁剪头像"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={600}
      okText="确认"
      cancelText="取消"
      className={styles.cropperModal}
      okButtonProps={{ loading: processing }}
      maskClosable={false}
    >
      <div className={styles.cropperContainer}>
        <div className={styles.cropperWrapper} ref={containerRef}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid
            restrictPosition
            allowRotation={false}
            objectFit="contain"
            onCropChange={handleCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className={styles.zoomControl}>
          <span>缩小</span>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={setZoom}
            style={{ flex: 1, margin: '0 12px' }}
          />
          <span>放大</span>
        </div>

        <div className={styles.tip}>
          拖动调整位置 · 滑块或双指缩放
        </div>
      </div>
    </Modal>
  )
}

// 修复：跨域 + 圆形裁剪
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 初始化失败')

  const size = 200 // 输出头像尺寸
  canvas.width = size
  canvas.height = size

  // 圆形裁剪
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.clip()

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('生成图片失败')),
      'image/jpeg',
      0.9
    )
  })
}

// 修复：跨域图片
const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // 关键修复
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export default AvatarCropper
