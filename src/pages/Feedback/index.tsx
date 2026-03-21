import React, { useState } from 'react'
import { Card, Form, Input, Button, message, Rate, Select, Row, Col, Upload, Image } from 'antd'
import { MessageOutlined, SendOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { createFeedback } from '@/services/feedback'
import styles from './index.module.css'

const { TextArea } = Input

const Feedback: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  // 处理上传变化（立即显示原图预览）
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 限制最多 5 张，只取前 5 张
    const limitedList = newFileList.slice(0, 5)
    setFileList(limitedList)
  }

  // 图片上传前处理（只限制数量）
  const beforeUpload = (file: RcFile): boolean => {
    // 检查是否超过 5 张
    if (fileList.length >= 5) {
      message.warning('最多只能上传 5 张图片')
      return false
    }
    // 返回 false 阻止自动上传，让 fileList 自己管理
    return false
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      // 获取图片 URL 列表
      const imageUrls = fileList
        .filter(file => file.status === 'done')
        .map(file => file.url || file.response?.url)
        .filter(url => !!url)

      // 获取当前登录用户的邮箱
      const userStr = localStorage.getItem('user')
      let userEmail = values.contact
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          // 如果用户没填邮箱，使用登录用户的邮箱
          if (!userEmail && user.email) {
            userEmail = user.email
          }
        } catch (e) {
          console.error('解析用户信息失败', e)
        }
      }

      await createFeedback({
        type: values.type,
        title: values.title,
        content: values.content,
        contact: userEmail,
        images: imageUrls,
      })

      message.success('反馈提交成功，我们会尽快处理！')
      form.resetFields()
      setFileList([])
    } catch (error) {
      console.error('提交反馈失败', error)
      message.error('提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.feedback}>
      <div className="container">
        <Card title="📝 意见反馈" className={styles.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="type"
              label="反馈类型"
              rules={[{ required: true, message: '请选择反馈类型' }]}
            >
              <Select placeholder="请选择反馈类型">
                <Select.Option value="bug">🐛 功能bug</Select.Option>
                <Select.Option value="suggestion">💡 功能建议</Select.Option>
                <Select.Option value="content">🔞 违规内容举报</Select.Option>
                <Select.Option value="other">💬 其他问题</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请填写标题' }]}
            >
              <Input placeholder="请简单描述问题..." />
            </Form.Item>

            <Form.Item
              name="content"
              label="详细描述"
              rules={[{ required: true, message: '请描述你的问题，帮助我们更好改进' }]}
            >
              <TextArea
                rows={6}
                placeholder="请详细描述你遇到的问题或者建议..."
              />
            </Form.Item>

            <Form.Item
              name="contact"
              label="联系方式"
              rules={[{ required: false }]}
            >
              <Input placeholder="你的邮箱/联系方式，方便我们联系你..." />
            </Form.Item>

            <Form.Item label="图片附件">
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                提交反馈
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default Feedback
