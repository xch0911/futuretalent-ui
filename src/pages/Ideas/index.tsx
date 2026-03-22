import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, Card, Input, Select, Pagination, Space, Empty, Spin, Radio, Tag } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Idea, User, PaginationResponse } from '@/types'
import { getIdeaList } from '@/services/idea'
import { searchUsers } from '@/services/user'
import { getHotTags } from '@/services/user'
import IdeaCard from '@/components/IdeaCard'
import UserCard from '@/components/UserCard'
import styles from './index.module.css'

const { Search } = Input
const { Option } = Select

type SearchType = 'idea' | 'user'

const Ideas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [searchType, setSearchType] = useState<SearchType>((searchParams.get('type') as SearchType) || 'idea')
  const [ideaData, setIdeaData] = useState<PaginationResponse<Idea>>({
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
  })
  const [userData, setUserData] = useState<PaginationResponse<User>>({
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
  })
  const [hotTags, setHotTags] = useState<string[]>([])
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [tag, setTag] = useState(searchParams.get('tag') || '')
  const [sort, setSort] = useState<'latest' | 'hot'>('latest')

  useEffect(() => {
    loadTags()
    loadData()
  }, [])

  useEffect(() => {
    // URL 参数变化时重新加载
    const q = searchParams.get('q') || ''
    const t = searchParams.get('tag') || ''
    const type = (searchParams.get('type') as SearchType) || 'idea'
    setKeyword(q)
    setTag(t)
    setSearchType(type)
    loadData(1, q, t, sort, type)
  }, [searchParams])

  const loadTags = async () => {
    try {
      const tags = await getHotTags()
      setHotTags(tags)
    } catch (error) {
      console.error('加载标签失败', error)
      // 不显示错误提示，热门标签不是必需的
    }
  }

  const loadData = async (
    page: number = 1,
    newKeyword?: string,
    newTag?: string,
    newSort?: 'latest' | 'hot',
    newType?: SearchType
  ) => {
    const currentKeyword = newKeyword ?? keyword
    const currentTag = newTag ?? tag
    const currentSort = newSort ?? sort
    const currentType = newType ?? searchType

    try {
      setLoading(true)
      if (currentType === 'idea') {
        const res = await getIdeaList({
          page,
          pageSize: 10,
          keyword: currentKeyword,
          tag: currentTag,
          sort: currentSort,
        })
        setIdeaData(res)
      } else {
        const res = await searchUsers(currentKeyword, page, 10)
        setUserData(res)
      }
    } catch (error) {
      console.error('加载数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const params: Record<string, string> = {}
    if (value.trim()) {
      params.q = value.trim()
    }
    if (tag && searchType === 'idea') {
      params.tag = tag
    }
    if (searchType !== 'idea') {
      params.type = searchType
    }
    setSearchParams(params)
  }

  const handleTypeChange = (type: SearchType) => {
    setSearchType(type)
    const params: Record<string, string> = {}
    if (keyword.trim()) {
      params.q = keyword.trim()
    }
    if (type !== 'idea') {
      params.type = type
    }
    setSearchParams(params)
  }

  const handleTagClick = (newTag: string) => {
    const params: Record<string, string> = {}
    if (keyword) {
      params.q = keyword
    }
    if (newTag !== tag) {
      params.tag = newTag
      setSearchParams(params)
    } else {
      // 清空标签筛选
      setSearchParams(params)
    }
  }

  const handleSortChange = (value: 'latest' | 'hot') => {
    setSort(value)
    loadData(1, keyword, tag, value, searchType)
  }

  const handlePageChange = (page: number) => {
    loadData(page, keyword, tag, sort, searchType)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLike = async () => {
    // TODO: 实现点赞逻辑
    // 可以乐观更新
  }

  const total = searchType === 'idea' ? ideaData.total : userData.total

  return (
    <div className={styles.ideas}>
      <div className={styles.container}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className={styles.filterCard}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* 搜索类型切换 */}
              <div className={styles.typeSwitch}>
                <span className={styles.label}>搜索：</span>
                <Radio.Group value={searchType} onChange={(e) => handleTypeChange(e.target.value as SearchType)} buttonStyle="solid">
                  <Radio.Button value="idea">想法</Radio.Button>
                  <Radio.Button value="user">用户</Radio.Button>
                </Radio.Group>
              </div>

              <Search
                placeholder={searchType === 'idea' ? "搜索想法关键词..." : "搜索用户昵称..."}
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                defaultValue={keyword}
              />

              {searchType === 'idea' && (
                <div className={styles.filterBar}>
                  <div className={styles.sort}>
                    <span className={styles.label}>排序：</span>
                    <Select value={sort} onChange={handleSortChange} style={{ width: 120 }} size="small">
                      <Option value="latest">最新发布</Option>
                      <Option value="hot">热门优先</Option>
                    </Select>
                  </div>
                  {(keyword || tag) && (
                    <div className={styles.stats}>
                      共找到 {total} 条结果
                    </div>
                  )}
                </div>
              )}

              {searchType === 'user' && (keyword || keyword) && (
                <div className={styles.filterBar}>
                  <div className={styles.stats}>
                    共找到 {total} 个用户
                  </div>
                </div>
              )}
            </Space>
          </Card>

          <Spin spinning={loading}>
            {/* 搜索想法 */}
            {searchType === 'idea' && ideaData.list.length > 0 ? (
              <>
                {ideaData.list.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
                ))}
                <div className={styles.pagination}>
                  <Pagination
                    current={ideaData.page}
                    total={ideaData.total}
                    pageSize={ideaData.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 条`}
                  />
                </div>
              </>
            ) : searchType === 'idea' && !loading ? (
              <Empty description="暂无找到相关想法" style={{ margin: '48px 0' }} />
            ) : null}

            {/* 搜索用户 */}
            {searchType === 'user' && userData.list.length > 0 ? (
              <>
                {userData.list.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
                <div className={styles.pagination}>
                  <Pagination
                    current={userData.page}
                    total={userData.total}
                    pageSize={userData.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 个用户`}
                  />
                </div>
              </>
            ) : searchType === 'user' && !loading ? (
              <Empty description="暂无找到相关用户" style={{ margin: '48px 0' }} />
            ) : null}
          </Spin>
        </Col>

        <Col xs={24} lg={8}>
          {searchType === 'idea' && (
            <>
              <Card title="🏷️ 热门标签" className={styles.sideCard}>
                <div className={styles.tagCloud}>
                  {hotTags.map(t => (
                    <span
                      key={t}
                      className={`${styles.tagItem} ${t === tag ? styles.active : ''}`}
                      onClick={() => handleTagClick(t)}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>

              <Card title="💡 搜索提示" className={styles.sideCard}>
                <ul className={styles.tips}>
                  <li>• 在搜索框输入关键词搜索想法标题和内容</li>
                  <li>• 点击标签可以快速筛选对应主题的想法</li>
                  <li>• 支持按最新发布和热门优先排序</li>
                  <li>• 切换"用户"可以搜索用户昵称</li>
                  <li>• 点击想法卡片可以查看详情和评论</li>
                  <li>• 点击用户卡片可以进入用户主页</li>
                </ul>
              </Card>
            </>
          )}

          {searchType === 'user' && (
            <Card title="💡 搜索提示" className={styles.sideCard}>
              <ul className={styles.tips}>
                <li>• 输入关键词搜索用户昵称</li>
                <li>• 支持模糊搜索，输入部分昵称即可匹配</li>
                <li>• 点击用户卡片进入用户个人主页</li>
                <li>• 可以关注感兴趣的用户，获取最新动态</li>
              </ul>
            </Card>
          )}
        </Col>
      </Row>
      </div>
    </div>
  )
}

export default Ideas
