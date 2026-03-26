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
      navigate(`/ideas/${idea.id}`)
    } catch (error) {
      console.error('发布失败', error)
      // 不显示错误消息，request.ts 拦截器已经显示了具体错误
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]}>
        {/* 左侧：发布表单 */}
        <Col xs={24} lg={16}>
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
        </Col>

        {/* 右侧：内容指南 */}
        <Col xs={24} lg={8}>
          <Card title="📝 内容发布指南" className={styles.card}>
            <div className={styles.guideSection}>
              <h4>✅ 鼓励发布</h4>
              <ul>
                <li>💡 你的创新想法、创业点子</li>
                <li>🛠 开源项目、工具分享</li>
                <li>🎨 设计作品、创意展示</li>
                <li>❓ 技术疑问、行业讨论</li>
                <li>📚 学习笔记、经验总结</li>
                <li>🤝 寻找合作伙伴、组队招募</li>
              </ul>
            </div>

            <div className={styles.guideSection}>
              <h4>❌ 禁止发布</h4>
              <ul>
                <li>📛 违法违规、色情暴力内容</li>
                <li>📛 广告推广、 spam 刷屏</li>
                <li>📛 侵权盗用他人内容</li>
                <li>📛 人身攻击、辱骂诽谤</li>
                <li>📛 政治敏感、迷信诈骗</li>
              </ul>
              <p className={styles.warning}>
                违规内容会被 AI 审核自动拦截，严重违规会封禁账号。
              </p>
            </div>

            <div className={styles.guideSection}>
              <h4>💡 发布小技巧</h4>
              <ul>
                <li>标题简洁清晰，让人一眼知道你的想法</li>
                <li>内容详细具体，方便他人理解</li>
                <li>添加准确标签，更容易被找到</li>
                <li>配上截图，问题描述更清晰</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default IdeaCreate
