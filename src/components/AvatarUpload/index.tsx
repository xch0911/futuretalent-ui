import React, { useState } from 'react'
import { Upload, message, Modal } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import AvatarCropper from '@/components/AvatarCropper'
import styles from './index.module.css'

interface AvatarUploadProps {
  userId: string
  currentAvatar?: string
  onUploadSuccess?: (avatarUrl: string) => void
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  userId, 
  currentAvatar,
  onUploadSuccess 
}) => {
  const [loading, setLoading] = useState(false)
  const [cropOpen, setCropOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // 选择图片后显示裁剪对话框
  const beforeUpload = (file: File): false => {
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isImage) {
      message.error('只能上传图片文件！')
    }
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！')
    }

    if (isImage && isLt5M) {
      // 读取图片文件
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setCropOpen(true)
      }
      reader.readAsDataURL(file)
    }

    return false // 阻止自动上传
  }

  // 裁剪完成后上传
  const handleCropComplete = async (croppedBlob: Blob) => {
    setLoading(true)
    try {
      // 使用 FormData 提交（支持图片上传）
      const formData = new FormData()
      formData.append('file', croppedBlob, 'avatar.jpg')

      // 上传到服务器
      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()

      if (result.code === 0) {
        message.success('头像上传成功')
        const avatarUrl = result.data.avatar
        onUploadSuccess?.(avatarUrl)
        setCropOpen(false)
        setSelectedImage(null)
      } else {
        message.error(result.message || '上传失败，请重试')
      }
    } catch (error) {
      console.error('上传失败', error)
      message.error('上传失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 取消裁剪
  const handleCropCancel = () => {
    setCropOpen(false)
    setSelectedImage(null)
  }

  const uploadButton = (
    <div className={styles.uploadBtn}>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )

  return (
    <>
      <Upload
        name="file"
        accept="image/*"
        listType="picture-card"
        className={styles.avatarUploader}
        showUploadList={false}
        beforeUpload={beforeUpload}
        action={`/api/users/${userId}/avatar`}
        headers={{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }}
      >
        {currentAvatar ? (
          <div className={styles.avatarWrapper}>
            <img src={currentAvatar} alt="avatar" className={styles.avatar} />
            <div className={styles.overlay}>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className={styles.overlayText}>更换</div>
            </div>
          </div>
        ) : (
          uploadButton
        )}
      </Upload>

      {/* 裁剪对话框 */}
      {selectedImage && (
        <AvatarCropper
          image={selectedImage}
          visible={cropOpen}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  )
}

export default AvatarUpload
