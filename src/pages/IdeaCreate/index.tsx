import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Tag, Button, message, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import { createIdea } from '@/services/idea'

const { TextArea } = Input

interface CreateIdeaForm {
  title: string
  content: string
}

const IdeaCreate: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [form] = Form.useForm()

  const handleAddTag = () => {
    if (!inputValue.trim()) return
    if (tags.length >= 5) {
      message.warning('最多添加 5 个标签')
      return
    }
    if (!tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()])
    }
    setInputValue('')
    setInputVisible(false)
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    handleAddTag()
  }

  const onFinish = async (values: CreateIdeaForm) => {
    if (tags.length === 0) {
      message.warning('至少添加一个标签')
      return
    }
    try {
      setLoading(true)
      const idea = await createIdea({
        title: values.title,
        content: values.content,
        tags,
      })
      message.success('发布成功')
      navigate(`/idea/${idea.id}`)
    } catch (error) {
      console.error('发布失败', error)
      // 不显示错误消息，request.ts 拦截器已经显示了具体错误
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card title="发布新想法" className={styles.card}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input
              placeholder="用一句话概括你的想法..."
              maxLength={100}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea
              placeholder="详细描述你的想法、项目、疑问...欢迎分享任何有价值的内容"
              rows={12}
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Form.Item label="标签">
            <div className={styles.tagContainer}>
              {tags.map(tag => (
                <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
              {inputVisible ? (
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputConfirm()
                    }
                  }}
                  className={styles.tagInput}
                  autoFocus
                  placeholder="输入后回车"
                />
              ) : (
                <Tag 
                  className={styles.addTag} 
                  onClick={() => setInputVisible(true)}
                >
                  <PlusOutlined /> 添加标签
                </Tag>
              )}
            </div>
            <div className={styles.tip}>最多添加 5 个标签，方便他人发现你的想法</div>
          </Form.Item>

          <Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Button 
                  onClick={() => navigate(-1)} 
                  block
                >
                  取消
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  block
                >
                  发布想法
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default IdeaCreate
