import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Spin, Empty, Card, Tag, message, Avatar } from 'antd'
import {
 LikeOutlined,
 LikeFilled,
 CommentOutlined,
 EyeOutlined,
 ArrowDownOutlined,
 StarOutlined,
 StarFilled,
} from '@ant-design/icons'
import { Idea } from '@/types'
import { getRecommendations, likeIdea, toggleFavorite } from '@/services/idea'
import styles from './index.module.css'
import throttle from 'lodash/throttle'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const MAX_PULL_DISTANCE = 80 // 最大下拉距离
const TRIGGER_DISTANCE = 50 // 触发刷新需要下拉这么多

const RecommendPage: React.FC = () => {
 const navigate = useNavigate()
 const containerRef = useRef<HTMLDivElement>(null)

 const [isLoggedIn, setIsLoggedIn] = useState(false)
 const [ideas, setIdeas] = useState<Idea[]>([])
 const [viewedIds, setViewedIds] = useState<Set<number>>(new Set())
 const [currentIndex, setCurrentIndex] = useState(0)
 const [loading, setLoading] = useState(true)
 const [loadingMore, setLoadingMore] = useState(false)
 // 下拉刷新状态
 const [pulling, setPulling] = useState(false)
 const [pullDistance, setPullDistance] = useState(0)

 const requestLockRef = useRef(false)
 const clientHeightRef = useRef(0)
 const touchStartYRef = useRef(0)
 const isPullingRef = useRef(false)

 // 登录状态
 useEffect(() => {
 setIsLoggedIn(!!localStorage.getItem('token'))
 }, [])

 // 加载推荐
 const loadRecommendations = useCallback(async (append: boolean) => {
 if (requestLockRef.current) return
 requestLockRef.current = true

 try {
 append ? setLoadingMore(true) : setLoading(true)
 // 传递已看过的ID给后端排除
 const exclude = Array.from(viewedIds).join(',')
 const res = await getRecommendations(exclude)

 if (Array.isArray(res) && res.length > 0) {
 // 记录已看ID
 res.forEach(idea => viewedIds.add(Number(idea.id)))
 setViewedIds(new Set(viewedIds))
 setIdeas(prev => append ? [...prev, ...res] : res)
 if (!append) {
 setCurrentIndex(0)
 // 滚动回顶部
 setTimeout(() => {
 containerRef.current?.scrollTo(0, 0)
 }, 100)
 }
 }
 } catch (err: any) {
 if (err?.code !== 'ERR_CANCELED') message.error('加载失败')
 } finally {
 setLoading(false)
 setLoadingMore(false)
 requestLockRef.current = false
 setPulling(false)
 setPullDistance(0)
 }
 }, [])

 // 初始加载
 useEffect(() => {
 loadRecommendations(false)
 }, [loadRecommendations])

 // 获取一屏高度
 useEffect(() => {
 const updateHeight = () => {
 if (containerRef.current) {
 clientHeightRef.current = containerRef.current.clientHeight
 }
 }
 updateHeight()
 window.addEventListener('resize', updateHeight)
 return () => window.removeEventListener('resize', updateHeight)
 }, [])

 // 点赞
 const handleLike = async (idea: Idea) => {
 if (!isLoggedIn) {
 message.info('请先登录')
 navigate('/login')
 return
 }
 if (idea.isLiked) return

 setIdeas(prev => prev.map(item =>
 item.id === idea.id
 ? { ...item, isLiked: true, likeCount: item.likeCount + 1 }
 : item
 ))

 try {
 await likeIdea(idea.id)
 } catch (err) {
 message.error('点赞失败')
 }
 }

 // 切换收藏
 const handleFavorite = async (idea: Idea) => {
 if (!isLoggedIn) {
 message.info('请先登录')
 navigate('/login')
 return
 }

 const oldIsFavorite = idea.isFavorite || false
 const oldCount = idea.favoriteCount || 0
 setIdeas(prev => prev.map(item =>
 item.id === idea.id
 ? { 
 ...item, 
 isFavorite: !oldIsFavorite,
 favoriteCount: oldIsFavorite ? oldCount - 1 : oldCount + 1
 }
 : item
 ))

 try {
 const res = await toggleFavorite(idea.id)
 message.success(res)
 } catch (err) {
 // 回滚
 setIdeas(prev => prev.map(item =>
 item.id === idea.id
 ? { 
 ...item, 
 isFavorite: oldIsFavorite,
 favoriteCount: oldCount
 }
 : item
 ))
 message.error(oldIsFavorite ? '取消收藏失败' : '收藏失败')
 }
 }

 // 评论跳转
 const handleComment = (id: string) => {
 navigate(`/ideas/${id}#comments`)
 }

 // ========== 触摸手势处理：下拉刷新 ==========
 const handleTouchStart = useCallback((e: React.TouchEvent) => {
 if (!containerRef.current) {
   isPullingRef.current = false
   return
 }
 // 只有在顶部才允许下拉（考虑container有10px padding，scrollTop <= 10就算顶部）
 if (containerRef.current.scrollTop <= 10) {
 touchStartYRef.current = e.touches[0].clientY
 isPullingRef.current = true
 setPulling(true)
 } else {
 isPullingRef.current = false
 }
 }, [])

 const handleTouchMove = useCallback((e: React.TouchEvent) => {
 if (!isPullingRef.current || !containerRef.current) return

 const currentY = e.touches[0].clientY
 let distance = currentY - touchStartYRef.current
 // **只允许下拉（distance > 0），上拉直接禁止**
 if (distance <= 0) {
   distance = 0
   setPullDistance(0)
   if (pulling) setPulling(false)
   isPullingRef.current = false
   return
 }
 // 限制最大距离
 distance = Math.min(distance, MAX_PULL_DISTANCE)
 setPullDistance(distance)
 }, [pulling])

 const handleTouchEnd = useCallback(() => {
 if (!isPullingRef.current) return

 // 达到触发距离，开始刷新
 if (pullDistance >= TRIGGER_DISTANCE && !loading && !requestLockRef.current) {
  // 下拉刷新重置已读列表
  setViewedIds(new Set())
  setIdeas([])
  loadRecommendations(false)
 } else {
 // 没达到，弹回去
 setPulling(false)
 setPullDistance(0)
 }

 isPullingRef.current = false
 }, [pullDistance, loading, loadRecommendations])

 // 滚动逻辑：计算当前 index + 触发加载更多
 const handleScroll = useCallback(
 throttle(() => {
 const el = containerRef.current
 if (!el) return
 const h = clientHeightRef.current
 if (!h || ideas.length === 0) return

 // 计算当前可视的是第几个
 const idx = Math.floor(el.scrollTop / h)
 const safeIndex = Math.max(0, Math.min(idx, ideas.length - 1))

 // 更新当前 index
 if (safeIndex !== currentIndex) {
 setCurrentIndex(safeIndex)
 }

 // 剩余 ≤ 5 条 → 加载更多
 const remaining = ideas.length - safeIndex - 1 // safeIndex 已经显示了，所以减 1
 if (remaining <= 5 && !loadingMore && !requestLockRef.current) {
 loadRecommendations(true)
 }
 }, 100),
 [ideas.length, loadingMore, loadRecommendations]
 )

 return (
 <div
 className={styles.container}
 ref={containerRef}
 onScroll={handleScroll}
 onTouchStart={handleTouchStart}
 onTouchMove={handleTouchMove}
 onTouchEnd={handleTouchEnd}
 >
 {/* 下拉刷新提示：固定在顶部，跟着拖拽移动 */}
 {pulling && !loading && (
 <div
 className={styles.pullTip}
 style={{ top: Math.min(pullDistance, MAX_PULL_DISTANCE) + 10 }}
 >
 {pullDistance < TRIGGER_DISTANCE ? (
 <span>下拉刷新...</span>
 ) : (
 <span>松开刷新</span>
 )}
 </div>
 )}

 <Spin spinning={loading}>

 {/* 空状态 */}
 {!loading && ideas.length === 0 && (
 <div className={styles.emptyContainer}>
 <Empty description="暂无推荐" />
 <Button type="primary" onClick={() => loadRecommendations(false)}>
 刷新
 </Button>
 </div>
 )}

 {/* 所有想法都渲染，每个占一屏（CSS 控制 scroll-snap） */}
 {ideas.map((idea, index) => (
 <div
 key={idea.id}
 className={styles.cardWrapper}
 style={{
 height: clientHeightRef.current || '100vh',
 // 下拉刷新的时候，整个内容往下移
 transform: pulling ? `translateY(${pullDistance}px)` : 'none',
 }}
 >
 <Card className={styles.ideaCard} bordered={false}>
 {/* 作者信息：头像+昵称+时间，点击整个区域跳转到个人主页 */}
 <div className={styles.author} onClick={() => idea.author?.id && navigate(`/user/${idea.author.id}` as any)} style={{ cursor: 'pointer' }}>
 <Avatar size={48} src={idea.author?.avatar} />
 <div className={styles.authorInfo}>
 <div className={styles.authorNickname}>{idea.author?.nickname || '匿名用户'}</div>
 <div className={styles.createdAt}>{idea.createdAt ? dayjs(idea.createdAt).format('YYYY-MM-DD HH:mm') : ''}</div>
 </div>
 </div>

 <h1 className={styles.title}>{idea.title}</h1>
 <div className={styles.tags}>
 {idea.tags?.map(tag => (
 <Tag key={tag}>{tag}</Tag>
 ))}
 </div>
 <div className={styles.content}>
 {idea.content.split('\n').map((p, i) => (
 p.trim() ? <p key={i}>{p}</p> : <div key={i} className={styles.blank}></div>
 ))}
 </div>

 <div className={styles.sidebar}>
 <div
 className={styles.item}
 onClick={() => handleLike(idea)}
 >
 {idea.isLiked ? <LikeFilled /> : <LikeOutlined />}
 <span>{idea.likeCount}</span>
 </div>
 <div
 className={styles.item}
 onClick={() => handleFavorite(idea)}
 >
 {(idea.isFavorite || false) ? <StarFilled /> : <StarOutlined />}
 <span>{idea.favoriteCount || 0}</span>
 </div>
 <div
 className={styles.item}
 onClick={() => handleComment(idea.id)}
 >
 <CommentOutlined />
 <span>{idea.commentCount}</span>
 </div>
 <div className={styles.item}>
 <EyeOutlined />
 <span>{idea.viewCount}</span>
 </div>
 </div>
 </Card>
 </div>
 ))}

 {/* 加载更多提示（放在所有内容最后） */}
 {loadingMore && (
 <div className={styles.loadingMore}>
 <Spin size="small" /> 加载更多…
 </div>
 )}


 </Spin>
 </div>
 )
}

export default RecommendPage
