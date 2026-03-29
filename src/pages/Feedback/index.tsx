import React, { useState, useRef, useEffect } from 'react'
import { Card, Form, Input, Button, message, Rate, Select, Upload, Row, Col } from 'antd'
import { SendOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { createFeedback, uploadFeedbackImage } from '@/services/feedback'
import styles from './index.module.css'

const { TextArea } = Input

// 图片压缩
const compressImage = (file: File, maxSize: number = 800): Promise<Blob> => {
 return new Promise((resolve, reject) => {
 const reader = new FileReader()
 reader.onload = (e) => {
 const img = new Image()
 img.onload = () => {
 let width = img.width
 let height = img.height

 if (width > height && width > maxSize) {
 height = (height * maxSize) / width
 width = maxSize
 } else if (height > width && height > maxSize) {
 width = (width * maxSize) / height
 height = maxSize
 }

 const canvas = document.createElement('canvas')
 canvas.width = width
 canvas.height = height
 const ctx = canvas.getContext('2d')
 if (!ctx) {
 reject(new Error('无法创建 canvas 上下文'))
 return
 }
 ctx.drawImage(img, 0, 0, width, height)
 canvas.toBlob((blob) => {
 if (blob) resolve(blob)
 else reject(new Error('压缩失败'))
 }, file.type || 'image/jpeg', 0.8)
 }
 img.onerror = () => reject(new Error('图片加载失败'))
 img.src = e.target?.result as string
 }
 reader.onerror = () => reject(new Error('读取文件失败'))
 reader.readAsDataURL(file)
 })
}

const Feedback: React.FC = () => {
 const [loading, setLoading] = useState(false)
 const [pendingSubmit, setPendingSubmit] = useState(false)
 const pendingSubmitRef = useRef(pendingSubmit)
 const [form] = Form.useForm()
 const [fileList, setFileList] = useState<UploadFile[]>([])

 // 同步最新状态
 useEffect(() => {
 pendingSubmitRef.current = pendingSubmit
 }, [pendingSubmit])

 // ✅ 最终提交逻辑
 const checkAndSubmit = async (values: any) => {
 const failedFiles = fileList.filter(f => f.status === 'error')
 if (failedFiles.length > 0) {
 message.error(`${failedFiles.length} 张图片上传失败，请重试`)
 setPendingSubmit(false)
 setLoading(false)
 return
 }

 const imageUrls = fileList
 .filter(f => f.status === 'done')
 .map(f => f.url as string)
 .filter(Boolean)

 const requestData = {
 type: values.type,
 rating: values.rating,
 content: values.content,
 contact: values.contact || '',
 images: imageUrls,
 }

 try {
 const userStr = localStorage.getItem('user')
 if (userStr && !requestData.contact) {
 const user = JSON.parse(userStr)
 if (user?.email) requestData.contact = user.email
 }
 } catch {}

 try {
 await createFeedback(requestData)
 message.success('反馈提交成功！')
 form.resetFields()
 setFileList([])
 setPendingSubmit(false)
 } catch (error) {
 message.error('提交失败，请重试')
 } finally {
 setLoading(false)
 }
 }

 // ✅ 自定义上传（完全修复版）
 const customRequest = async ({ file, onSuccess, onError }: any) => {
 const newFile = file as RcFile

 // 加入上传队列
 setFileList(prev => [...prev, {
 uid: newFile.uid,
 name: newFile.name,
 status: 'uploading',
 originFileObj: newFile,
 }])

 try {
 const compressed = await compressImage(newFile)
 const processedFile = new File([compressed], newFile.name, { type: newFile.type })
 const url = await uploadFeedbackImage(processedFile)

 // 更新为成功
 setFileList(prev => prev.map(item =>
 item.uid === newFile.uid ? { ...item, status: 'done', url } : item
 ))

 message.success(`${newFile.name} 上传成功`)
 onSuccess(url)

 // ✅ 关键：这里直接用【最新的文件列表】判断，不读 ref
 const latestList = [...fileList].map(item =>
 item.uid === newFile.uid ? { ...item, status: 'done', url } : item
 )
 const stillUploading = latestList.some(item => item.status === 'uploading')

 // 如果已经点了提交，并且没有正在上传的 → 提交
 if (pendingSubmitRef.current && !stillUploading) {
 const values = form.getFieldsValue()
 checkAndSubmit(values)
 }

 } catch (err) {
 setFileList(prev => prev.map(item =>
 item.uid === newFile.uid ? { ...item, status: 'error' } : item
 ))
 message.error(`${newFile.name} 上传失败`)
 onError(err)
 }
 }

 // 上传前校验
 const beforeUpload = (file: RcFile) => {
 if (!file.type.startsWith('image/')) {
 message.error('只能上传图片')
 return false
 }
 if (file.size > 15 * 1024 * 1024) {
 message.error('不能超过 15MB')
 return false
 }
 if (fileList.length >= 5) {
 message.warning('最多 5 张')
 return false
 }
 return true
 }

 // 点击提交
 const onFinish = async (values: any) => {
 setLoading(true)
 setPendingSubmit(true)

 const stillUploading = fileList.some(f => f.status === 'uploading')
 if (!stillUploading) {
 checkAndSubmit(values)
 }
 }

 return (
 <div className={styles.feedback}>
 <div className="container">
 <Card className={styles.hero}>
 <h1 className={styles.title}>📝 意见反馈</h1>
 <p className={styles.subtitle}>你的建议帮助我们变得更好</p>
 </Card>

 <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
 <Col xs={24} md={16}>
 <Card className={styles.card}>
 <Form form={form} layout="vertical" onFinish={onFinish}>
 <Form.Item name="type" label="反馈类型" rules={[{ required: true }]}>
 <Select placeholder="请选择反馈类型">
 <Select.Option value="bug">🐛 功能 Bug</Select.Option>
 <Select.Option value="suggestion">💡 功能建议</Select.Option>
 <Select.Option value="ui">🖼️ UI 界面异常</Select.Option>
 <Select.Option value="other">💬 其他问题</Select.Option>
 </Select>
 </Form.Item>

 <Form.Item name="rating" label="评分体验">
 <Rate allowHalf />
 </Form.Item>

 <Form.Item name="content" label="详细描述" rules={[{ required: true }]}>
 <TextArea rows={6} placeholder="请详细描述..." />
 </Form.Item>

 <Form.Item name="contact" label="联系方式">
 <Input placeholder="邮箱/手机" />
 </Form.Item>

 <Form.Item label="图片附件">
 <Upload
 listType="picture-card"
 fileList={fileList}
 beforeUpload={beforeUpload}
 customRequest={customRequest}
 >
 {fileList.length < 5 && (
 <div>
 <PlusOutlined />
 <div style={{ marginTop: 8 }}>上传图片</div>
 </div>
 )}
 </Upload>
 </Form.Item>

 <Form.Item>
 <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
 {pendingSubmit && fileList.some(f => f.status === 'uploading')
 ? '等待上传完成...'
 : '提交反馈'}
 </Button>
 </Form.Item>
 </Form>
 </Card>
 </Col>

 <Col xs={24} md={8}>
 <Card title="反馈最佳实践" className={styles.card}>
 <div className={styles.guideSection}>
 <h4>🐛 报告 Bug</h4>
 <ul>
 <li>清楚描述问题</li>
 <li>附上截图</li>
 <li>留下联系方式</li>
 </ul>
 </div>
 <div className={styles.guideSection}>
 <h4>💡 功能建议</h4>
 <ul>
 <li>说明需求场景</li>
 </ul>
 </div>
 <div className={styles.guideSection}>
 <h4>🖼️ UI 界面异常</h4>
 <ul>
 <li>说明哪个页面</li>
 <li>描述异常现象</li>
 <li>附上截图帮助定位</li>
 </ul>
 </div>
 <div className={styles.guideSection}>
 <h4>📧 联系方式</h4>
 <p>如果你期待回复，请填写正确的邮箱，我们会认真阅读每一条反馈。</p>
 </div>
 </Card>
 </Col>
 </Row>
 </div>
 </div>
 )
}

export default Feedback
