import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, Card, Input, Select, Pagination, Space, Empty, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Idea, PaginationResponse } from '@/types'
import { getIdeaList } from '@/services/idea'
import { getHotTags } from '@/services/user'
import IdeaCard from '@/components/IdeaCard'
import styles from './index.module.css'

const { Search } = Input
const { Option } = Select

const Ideas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PaginationResponse<Idea>>({
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
    loadIdeas()
  }, [])

  useEffect(() => {
    // URL 参数变化时重新加载
    const q = searchParams.get('q') || ''
    const t = searchParams.get('tag') || ''
    setKeyword(q)
    setTag(t)
    loadIdeas(1, q, t, sort)
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

  const loadIdeas = async (page: number = 1, newKeyword?: string, newTag?: string, newSort?: 'latest' | 'hot') => {
    try {
      setLoading(true)
      const res = await getIdeaList({
        page,
        pageSize: 10,
        keyword: newKeyword ?? keyword,
        tag: newTag ?? tag,
        sort: newSort ?? sort,
      })
      setData(res)
    } catch (error) {
      console.error('加载想法列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const params: Record<string, string> = {}
    if (value.trim()) {
      params.q = value.trim()
    }
    if (tag) {
      params.tag = tag
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
    loadIdeas(1, keyword, tag, value)
  }

  const handlePageChange = (page: number) => {
    loadIdeas(page, keyword, tag, sort)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLike = async () => {
    // TODO: 实现点赞逻辑
    // 可以乐观更新
  }

  return (
    <div className={styles.ideas}>
      <div className="container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className={styles.filterCard}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Search
                placeholder="搜索想法关键词..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                defaultValue={keyword}
              />
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
                    共找到 {data.total} 条结果
                  </div>
                )}
              </div>
            </Space>
          </Card>

          <Spin spinning={loading}>
            {data.list.length > 0 ? (
              <>
                {data.list.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
                ))}
                <div className={styles.pagination}>
                  <Pagination
                    current={data.page}
                    total={data.total}
                    pageSize={data.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 条`}
                  />
                </div>
              </>
            ) : !loading ? (
              <Empty description="暂无找到相关想法" style={{ margin: '48px 0' }} />
            ) : null}
          </Spin>
        </Col>

        <Col xs={24} lg={8}>
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

          <Card title="💡 筛选提示" className={styles.sideCard}>
            <ul className={styles.tips}>
              <li>• 在搜索框输入关键词搜索想法标题和内容</li>
              <li>• 点击标签可以快速筛选对应主题的想法</li>
              <li>• 支持按最新发布和热门优先排序</li>
              <li>• 点击想法卡片可以查看详情和评论</li>
              <li>• 点击作者头像可以进入用户主页</li>
            </ul>
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  )
}

export default Ideas
