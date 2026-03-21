import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, Avatar, Row, Col, Spin, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import AvatarUpload from '@/components/AvatarUpload'
import { User } from '@/types'
import { updateUserProfile } from '@/services/user'
import styles from './index.module.css'

const { TextArea } = Input;

const UserEdit: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')

  // 加载当前用户信息
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setCurrentUser(userData)
        setNickname(userData.nickname || '')
        setBio(userData.bio || '')
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
        tags: [],
      })

      // 更新本地存储
      const updatedUser = {
        ...currentUser,
        nickname: nickname.trim(),
        bio: bio.trim(),
        tags: [],
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
      <Row gutter={[24, 24]}>
        {/* 左侧：头像 + 表单 */}
        <Col xs={24} md={14}>
          <Card className={styles.card}>
            <div className={styles.avatarCol}>
              <div className={styles.avatarWrapper}>
                {currentUser && (
                  <AvatarUpload
                    userId={String(currentUser.id)}
                    currentAvatar={currentUser.avatar}
                    onUploadSuccess={(avatarUrl) => {
                      // 更新本地用户信息
                      if (currentUser) {
                        const updatedUser = {
                          ...currentUser,
                          avatar: avatarUrl,
                        }
                        setCurrentUser(updatedUser)
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                        message.success('头像更新成功')
                      }
                    }}
                  />
                )}
              </div>
            </div>

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

            <div className={styles.actions}>
              <Button type="primary" loading={submitting} onClick={handleSubmit}>
                保存修改
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧：上方审核规则，下方成长体系 → 两个卡片总高度和左侧对齐 */}
        <Col xs={24} md={10}>
          <Card title="📝 昵称 &amp; 简介审核" className={styles.card}>
            <div className={styles.guideSection}>
              <ul>
                <li>禁止使用违法违规、色情暴力内容</li>
                <li>禁止包含广告推广、导流联系方式</li>
                <li>禁止侮辱诽谤他人、侵犯他人权益</li>
                <li>AI+人工双重审核，违规内容会被要求修改</li>
              </ul>
            </div>
          </Card>

          <Card title="🌱 个人成长评价体系" className={[styles.card, styles.growthCard]}>
            <div className={styles.guideSection}>
              <ul>
                <li>优质内容获得点赞收藏，增加成长值</li>
                <li>发布优质想法，获得曝光提升成长等级</li>
                <li>违规内容被举报核实，扣除成长值</li>
                <li>等级越高，发布内容获得的曝光越多</li>
                <li>成长等级会陆续开放更多功能特权</li>
              </ul>
              <p className={styles.tip}>成长体系正在逐步完善，敬请期待...</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserEdit
