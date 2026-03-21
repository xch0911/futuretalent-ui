import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Card, Statistic, Tag, Space } from 'antd'
import { UserOutlined, BulbOutlined, TeamOutlined } from '@ant-design/icons'
import { Idea, User } from '@/types'
import { getHotTags, getStats, Stats } from '@/services/user'
import { getIdeaList } from '@/services/idea'
import IdeaCard from '@/components/IdeaCard'
import styles from './index.module.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [hotIdeas, setHotIdeas] = useState<Idea[]>([])
  const [hotTags, setHotTags] = useState<string[]>([])
  const [stats, setStats] = useState<Stats>({
    userCount: 0,
    ideaCount: 0,
    connectionCount: 0,
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setCurrentUser(userData)
        setIsLoggedIn(true)
      } catch (e) {
        console.error('解析用户信息失败', e)
      }
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // 加载热门想法
      const ideaRes = await getIdeaList({
        page: 1,
        pageSize: 5,
        sort: 'hot',
      })
      setHotIdeas(ideaRes.list)

      // 加载热门标签
      const tags = await getHotTags()
      setHotTags(tags.slice(0, 10))

      // 加载真实统计数据
      const realStats = await getStats()
      setStats(realStats)
    } catch (error: unknown) {
      // 忽略请求中止错误（通常是页面快速切换导致）
      if (!(error instanceof Error)) return
      if ((error as any).code !== 'ERR_CANCELED' && error.message !== 'Request aborted') {
        console.error('加载首页数据失败', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTagClick = (tag: string) => {
    navigate(`/ideas?tag=${encodeURIComponent(tag)}`)
  }

  const handleLike = async () => {
    // TODO: 实现点赞逻辑
  }

  return (
    <div className={styles.home}>
      {/* 英雄区 */}
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              连接想法，<br />
              <span className={styles.highlight}>成就未来</span>
            </h1>
            <p className={styles.subtitle}>
              未来人才网是一个让年轻人分享想法、展示才华、连接机会的平台。
              在这里，每个想法都值得被看见。
            </p>
            <Space size={16}>
              <Button type="primary" size="large" onClick={() => navigate('/ideas')}>
                浏览想法
              </Button>
              {!isLoggedIn ? (
                <Button size="large" onClick={() => navigate('/register')}>
                  加入我们
                </Button>
              ) : (
                <Button
                  size="large"
                  onClick={() => navigate('/idea/create')}
                >
                  发布想法
                </Button>
              )}
            </Space>
          </div>
        </section>
      </div>

      {/* 统计数据 */}
      <section className={styles.stats}>
        <div className="container">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="注册用户"
                  value={stats.userCount}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="分享想法"
                  value={stats.ideaCount}
                  prefix={<BulbOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="用户连接"
                  value={stats.connectionCount}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 热门想法 + 热门标签 */}
      <div className="container">
        <Row gutter={[24, 24]} className={styles.content}>
          <Col xs={24} lg={16}>
            <Card
              title="🔥 热门想法"
              extra={<Button type="link" onClick={() => navigate('/ideas')}>查看更多</Button>}
              loading={loading}
            >
              {hotIdeas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="🏷️ 热门标签">
              <div className={styles.tagCloud}>
                {hotTags.map(tag => (
                  <Tag
                    key={tag}
                    className={styles.tagItem}
                    onClick={() => handleTagClick(tag)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>

            <Card title="💡 平台定位" className={styles.about}>
              <p>• 帮助年轻人展示个人想法和项目</p>
              <p>• 连接人才与机会，促进交流合作</p>
              <p>• 发现未来之星，孵化创新项目</p>
              <p>• 打造开放包容的青年人才社区</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home
