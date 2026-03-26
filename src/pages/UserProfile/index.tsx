import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Avatar, Button, Tag, Spin, Empty, Pagination, Divider, Statistic, message, Tabs } from 'antd'
import { UserOutlined, UserAddOutlined, BulbOutlined, EditOutlined, StarOutlined } from '@ant-design/icons'
import { User, Idea } from '@/types'
import { getUserInfo, getUserIdeas, followUser, unfollowUser } from '@/services/user'
import { getMyFavorites } from '@/services/idea'
import IdeaCard from '@/components/IdeaCard'
import styles from './index.module.css'

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'ideas' | 'favorites'>('ideas')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [favorites, setFavorites] = useState<Idea[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  })
  const [favoritePagination, setFavoritePagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  })
  const [followLoading, setFollowLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false) // TODO: 从接口获取

  // 加载当前用户信息
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setCurrentUser(userData)
      } catch (e) {
        console.error('解析用户信息失败', e)
      }
    }
  }, [])

  // 判断是否是自己的主页
  const isOwnProfile = currentUser && userInfo && currentUser.id.toString() === userInfo.id.toString()

  useEffect(() => {
    if (userId) {
      loadUserData()
    }
  }, [userId])

  const loadUserData = async () => {
    if (!userId) return
    try {
      setLoading(true)
      // 先加载用户信息，再加载想法
      const info = await getUserInfo(userId)
      setUserInfo(info)
      const res = await getUserIdeas(userId, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      setIdeas(res.list)
      setPagination({
        ...pagination,
        total: res.total,
      })
    } catch (error) {
      console.error('加载用户数据失败', error)
      setUserInfo(null)
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

  const loadUserFavorites = async (page: number = 1) => {
    if (!isOwnProfile) return
    try {
      setLoading(true)
      const res = await getMyFavorites(page, favoritePagination.pageSize)
      setFavorites(res.list)
      setFavoritePagination({
        ...favoritePagination,
        page,
        total: res.total,
      })
    } catch (error) {
      console.error('加载收藏失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'ideas' | 'favorites')
    if (key === 'favorites' && isOwnProfile) {
      loadUserFavorites(1)
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

  const handleEditProfile = () => {
    navigate('/user/edit')
  }

  const handlePageChange = (page: number) => {
    if (activeTab === 'ideas') {
      loadUserIdeas(page)
    } else {
      loadUserFavorites(page)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLike = async () => {
    // TODO: 实现点赞逻辑
  }

  if (loading) {
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
    <div className={styles.container}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className={styles.sidebar}>
            <div className={styles.avatarSection}>
              <Avatar size={120} src={userInfo.avatar} icon={<UserOutlined />} />
              <h1 className={styles.name}>{userInfo.nickname}</h1>
              <p className={styles.bio}>{userInfo.bio || '这个人很懒，什么都没写~'}</p>
              {userInfo.tags && userInfo.tags.length > 0 && (
                <div className={styles.tags}>
                  {userInfo.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
              {isOwnProfile ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditProfile}
                  className={styles.followBtn}
                  block
                >
                  编辑个人信息
                </Button>
              ) : (
                <Button
                  type={isFollowing ? 'default' : 'primary'}
                  loading={followLoading}
                  onClick={handleFollow}
                  className={styles.followBtn}
                  block
                >
                  {isFollowing ? '已关注' : '关注'}
                </Button>
              )}
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
                <Col span={8}>
                  <Statistic title="收藏" value={userInfo.favoriteCount || 0} prefix={<StarOutlined />} />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className={styles.content}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                { key: 'ideas', label: `${userInfo.nickname} 的想法` },
                ...(isOwnProfile ? [{ key: 'favorites', label: '我的收藏', icon: <StarOutlined /> }] : []),
              ]}
            />

            <Spin spinning={loading}>
              {activeTab === 'ideas' ? (
                ideas.length > 0 ? (
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
                ) : (
                  <Empty description="这个人还没有发布任何想法" />
                )
              ) : (
                favorites.length > 0 ? (
                  <>
                    {favorites.map(idea => (
                      <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
                    ))}
                    <div className={styles.pagination}>
                      <Pagination
                        current={favoritePagination.page}
                        total={favoritePagination.total}
                        pageSize={favoritePagination.pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                      />
                    </div>
                  </>
                ) : (
                  <Empty description="还没有收藏任何想法" />
                )
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfile
