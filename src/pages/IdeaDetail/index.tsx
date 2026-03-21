import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Card, Avatar, Tag, Button, Input, Space, Spin, message, Divider, Modal, Row, Col } from 'antd'
import { LikeOutlined, LikeFilled, CommentOutlined, EyeOutlined, UserOutlined, DeleteOutlined, FlagOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Idea, Comment as CommentType, User } from '@/types'
import { getIdeaDetail, likeIdea, unlikeIdea, deleteIdea } from '@/services/idea'
import { getComments, createComment, deleteComment } from '@/services/comment'
import { createReport } from '@/services/report'
import Comment from '@/components/Comment'
import styles from './index.module.css'

dayjs.extend(relativeTime)

const { TextArea } = Input

const IdeaDetail: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [idea, setIdea] = useState<Idea | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [reportDescription, setReportDescription] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

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

  useEffect(() => {
    if (ideaId) {
      loadIdeaDetail()
      loadComments()
    }
  }, [ideaId])

  const loadIdeaDetail = async () => {
    if (!ideaId) return
    try {
      setLoading(true)
      const data = await getIdeaDetail(ideaId)
      setIdea(data)
    } catch (error) {
      console.error('加载想法详情失败', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    if (!ideaId) return
    try {
      setCommentsLoading(true)
      const data = await getComments(ideaId)
      setComments(data)
    } catch (error) {
      console.error('加载评论失败', error)
    } finally {
      setCommentsLoading(false)
    }
  }

  // 递归计算评论总数（包含所有层级回复）
  const countAllComments = (comments: CommentType[]): number => {
    let count = 0
    for (const comment of comments) {
      count += 1 // 主评论
      if (comment.replies && comment.replies.length > 0) {
        count += countAllComments(comment.replies) // 递归计算子回复
      }
    }
    return count
  }

  const handleLike = async () => {
    if (!idea) return
    try {
      if (idea.isLiked) {
        await unlikeIdea(idea.id)
        setIdea({
          ...idea,
          isLiked: false,
          likeCount: idea.likeCount - 1,
        })
      } else {
        await likeIdea(idea.id)
        setIdea({
          ...idea,
          isLiked: true,
          likeCount: idea.likeCount + 1,
        })
      }
    } catch (error) {
      console.error('点赞操作失败', error)
    }
  }

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条想法吗？删除后无法恢复',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteIdea(idea!.id)
          message.success('删除成功')
          navigate('/')
        } catch (error) {
          console.error('删除失败', error)
          message.error('删除失败，请重试')
        }
      },
    })
  }

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await deleteComment(commentId.toString())
      message.success('评论已删除')
      // 重新加载评论列表
      loadComments()
    } catch (error) {
      console.error('删除失败', error)
      message.error('删除失败，请重试')
    }
  }

  // 检查是否是当前用户，使用 useMemo 自动更新
  const isCurrentUser = useMemo(() => {
    return currentUser && idea 
      ? currentUser.id.toString() === idea.author.id.toString()
      : false
  }, [currentUser, idea])

  const handleSubmitComment = async () => {
    if (!idea || !commentContent.trim()) return
    try {
      setSubmitting(true)
      await createComment(idea.id, { content: commentContent.trim() })
      message.success('评论成功')
      setCommentContent('')
      loadComments()
    } catch (error) {
      console.error('评论失败', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string | number, content: string) => {
    if (!idea) return
    try {
      setSubmitting(true)
      console.log('[回复] parentId:', parentId, 'content:', content)
      await createComment(idea.id, { content, parentId })
      message.success('回复成功')
      setReplyingTo(null)
      loadComments()
    } catch (error) {
      console.error('回复失败', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAuthorClick = () => {
    if (idea) {
      navigate(`/user/${idea.author.id}`)
    }
  }

  const handleReply = (comment: CommentType) => {
    if (!currentUser) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    setReplyingTo(comment)
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  const handleReport = () => {
    if (!currentUser) {
      message.warning('请先登录')
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setReportModalVisible(true)
  }

  const handleSubmitReport = async () => {
    if (!idea) return
    if (!reportDescription.trim()) {
      message.warning('请填写举报原因')
      return
    }
    try {
      setReportSubmitting(true)
      await createReport({
        reportType: 'other',
        targetType: 'idea',
        targetId: idea.id,
        description: reportDescription.trim(),
      })
      message.success('举报提交成功，我们会尽快处理')
      setReportModalVisible(false)
      setReportDescription('')
    } catch (error) {
      console.error('举报提交失败', error)
      message.error('举报提交失败，请重试')
    } finally {
      setReportSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!idea) {
    return <div className={styles.empty}>想法不存在</div>
  }

  return (
    <div className={styles.container}>
      <Card className={styles.ideaCard}>
        <div className={styles.header}>
          <div className={styles.author} onClick={handleAuthorClick}>
            <Avatar size={48} src={idea.author.avatar} icon={<UserOutlined />} />
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>{idea.author.nickname}</div>
              <div className={styles.time}>{dayjs(idea.createdAt).format('YYYY 年 MM 月 DD 日 HH:mm')}</div>
            </div>
          </div>
        </div>

        <h1 className={styles.title}>{idea.title}</h1>

        {idea.tags.length > 0 && (
          <div className={styles.tags}>
            {idea.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <Divider />

        <div className={styles.content}>
          {idea.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <Divider />

        <div className={styles.footer}>
          <Row gutter={[8, 12]} align="middle">
            <Col xs={24} sm={12} md={16} lg={18}>
              <Space size={16} wrap align="center">
                <Button
                  type={idea.isLiked ? 'primary' : 'default'}
                  icon={idea.isLiked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={handleLike}
                  size="small"
                >
                  {idea.likeCount} 点赞
                </Button>
                <span className={styles.stat}>
                  <CommentOutlined /> {countAllComments(comments)} 评论
                </span>
                <span className={styles.stat}>
                  <EyeOutlined /> {idea.viewCount} 浏览
                </span>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} style={{ textAlign: 'right' }}>
              <Space size={8} align="middle">
                {/* 自己的内容不显示举报按钮 */}
                {!isCurrentUser && (
                  <Button
                    danger
                    type="text"
                    size="small"
                    icon={<FlagOutlined />}
                    onClick={handleReport}
                  >
                    举报
                  </Button>
                )}
                {isCurrentUser && (
                  <Button
                    danger
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                  >
                    删除
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      <Card
        title={`评论 (${countAllComments(comments)})`}
        className={styles.commentsCard}
        loading={commentsLoading}
      >
        {/* 发表评论 */}
        <div className={styles.commentInput}>
          <TextArea
            rows={4}
            placeholder="写下你的评论..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={!currentUser}
          />
          {!currentUser && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              登录后发表评论
            </div>
          )}
          <div className={styles.commentActions}>
            <Button
              type="primary"
              onClick={handleSubmitComment}
              loading={submitting}
              disabled={!commentContent.trim() || !currentUser}
            >
              发表评论
            </Button>
          </div>
        </div>

        <Divider />

        {/* 评论列表 */}
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDeleteComment}
              replyingTo={replyingTo}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
              navigate={navigate}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#999' }}>
            暂无评论，来抢沙发吧
          </div>
        )}
      </Card>

      {/* 举报弹窗 */}
      <Modal
        title="举报违规内容"
        open={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false)
          setReportDescription('')
        }}
        onOk={handleSubmitReport}
        confirmLoading={reportSubmitting}
        okText="提交举报"
        cancelText="取消"
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#666', fontSize: 14 }}>
            你正在举报 <strong>{idea.title}</strong>
          </p>
        </div>
        <TextArea
          rows={4}
          placeholder="请详细描述违规原因，帮助我们更快处理..."
          value={reportDescription}
          onChange={(e) => setReportDescription(e.target.value)}
        />
        <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
          我们会在 24 小时内审核并处理你的举报
        </div>
      </Modal>
    </div>
  )
}

export default IdeaDetail
