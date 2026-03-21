import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, Avatar, Row, Col, Spin, message, Tag, Space } from 'antd'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import { User } from '@/types'
import { updateUserProfile } from '@/services/user'
import styles from './index.module.css'

const { TextArea } = Input

const UserEdit: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  // 加载当前用户信息
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setCurrentUser(userData)
        setNickname(userData.nickname || '')
        setBio(userData.bio || '')
        setTags(userData.tags || [])
      } catch (e) {
        console.error('解析用户信息失败', e)
        message.error('请先登录')
        navigate('/login')
      }
    } else {
      message.error('请先登录')
      navigate('/login')
    }
  }, [navigate])

  const handleAddTag = () => {
    if (!newTag.trim()) return
    if (tags.length >= 5) {
      message.warning('最多只能添加 5 个标签')
      return
    }
    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
    }
    setNewTag('')
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = async () => {
    if (!currentUser) return
    if (!nickname.trim()) {
      message.warning('请填写昵称')
      return
    }

    try {
      setSubmitting(true)
      await updateUserProfile(String(currentUser.id), {
        nickname: nickname.trim(),
        bio: bio.trim(),
        tags,
      })

      // 更新本地存储
      const updatedUser = {
        ...currentUser,
        nickname: nickname.trim(),
        bio: bio.trim(),
        tags,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      message.success('更新成功')

      // 返回个人主页
      navigate(`/user/${currentUser.id}`)
    } catch (error) {
      console.error('更新失败', error)
      message.error('更新失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card title="编辑个人信息" className={styles.card}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} className={styles.avatarCol}>
            <div className={styles.avatarWrapper}>
              <Avatar size={180} src={currentUser?.avatar} icon={<UserOutlined />} />
              <Button
                type="primary"
                size="small"
                icon={<CameraOutlined />}
                className={styles.changeAvatarBtn}
                onClick={() => message.info('更换头像功能开发中...')}
              >
                更换头像
              </Button>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div className={styles.formItem}>
              <label className={styles.label}>昵称</label>
              <Input
                placeholder="请输入昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label}>个人简介</label>
              <TextArea
                placeholder="介绍一下自己吧..."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label}>兴趣标签（最多 5 个）</label>
              <Space wrap style={{ marginBottom: 8 }}>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
              <Input.Group compact>
                <Input
                  placeholder="输入标签后回车添加"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onPressEnter={handleAddTag}
                  style={{ width: 200 }}
                />
                <Button onClick={handleAddTag}>添加</Button>
              </Input.Group>
            </div>

            <div className={styles.actions}>
              <Button onClick={() => navigate(-1)}>取消</Button>
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSubmit}
                style={{ marginLeft: 8 }}
              >
                保存修改
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default UserEdit
