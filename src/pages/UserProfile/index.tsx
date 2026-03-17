import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Card, Avatar, Button, Tag, Spin, Empty, Pagination, Divider, Statistic } from 'antd'
import { UserOutlined, UserAddOutlined, BulbOutlined } from '@ant-design/icons'
import { User, Idea } from '@/types'
import { getUserInfo, getUserIdeas, followUser, unfollowUser } from '@/services/user'
import IdeaCard from '@/components/IdeaCard'
import styles from './index.module.css'

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  })
  const [followLoading, setFollowLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false) // TODO: 从接口获取

  useEffect(() => {
    if (userId) {
      loadUserInfo()
      loadUserIdeas()
    }
  }, [userId])

  const loadUserInfo = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const info = await getUserInfo(userId)
      setUserInfo(info)
    } catch (error) {
      console.error('加载用户信息失败', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserIdeas = async (page: number = 1) => {
    if (!userId) return
    try {
      setLoading(true)
      const res = await getUserIdeas(userId, {
        page,
        pageSize: pagination.pageSize,
      })
      setIdeas(res.list)
      setPagination({
        ...pagination,
        page,
        total: res.total,
      })
    } catch (error) {
      console.error('加载用户想法失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!userId) return
    try {
      setFollowLoading(true)
      if (isFollowing) {
        await unfollowUser(userId)
        setIsFollowing(false)
        if (userInfo) {
          setUserInfo({
            ...userInfo,
            followerCount: userInfo.followerCount - 1,
          })
        }
      } else {
        await followUser(userId)
        setIsFollowing(true)
        if (userInfo) {
          setUserInfo({
            ...userInfo,
            followerCount: userInfo.followerCount + 1,
          })
        }
      }
    } catch (error) {
      console.error('操作失败', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadUserIdeas(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLike = async () => {
    // TODO: 实现点赞逻辑
  }

  if (loading && !userInfo) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!userInfo) {
    return <Empty description="用户不存在" />
  }

  return (
    <div className={styles.profile}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className={styles.sidebar}>
            <div className={styles.avatarSection}>
              <Avatar size={120} src={userInfo.avatar} icon={<UserOutlined />} />
              <h1 className={styles.name}>{userInfo.nickname}</h1>
              <p className={styles.bio}>{userInfo.bio || '这个人很懒，什么都没写~'}</p>
              {userInfo.tags.length > 0 && (
                <div className={styles.tags}>
                  {userInfo.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
              <Button
                type={isFollowing ? 'default' : 'primary'}
                loading={followLoading}
                onClick={handleFollow}
                className={styles.followBtn}
                block
              >
                {isFollowing ? '已关注' : '关注'}
              </Button>
            </div>

            <Divider />

            <div className={styles.stats}>
              <Row gutter={[8, 16]}>
                <Col span={8}>
                  <Statistic title="想法" value={userInfo.ideaCount} prefix={<BulbOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="关注者" value={userInfo.followerCount} prefix={<UserAddOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="关注了" value={userInfo.followingCount} />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card 
            title={`${userInfo.nickname} 的想法`}
            className={styles.content}
          >
            <Spin spinning={loading}>
              {ideas.length > 0 ? (
                <>
                  {ideas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
                  ))}
                  <div className={styles.pagination}>
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  </div>
                </>
              ) : !loading ? (
                <Empty description="这个人还没有发布任何想法" />
              ) : null}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfile
