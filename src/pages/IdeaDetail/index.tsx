import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Avatar, Tag, Button, Input, List, Space, Spin, message, Divider } from 'antd'
import { LikeOutlined, LikeFilled, CommentOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Idea, Comment as CommentType } from '@/types'
import { getIdeaDetail, likeIdea, unlikeIdea } from '@/services/idea'
import { getComments, createComment } from '@/services/comment'
import styles from './index.module.css'

dayjs.extend(relativeTime)

const { TextArea } = Input

const IdeaDetail: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [idea, setIdea] = useState<Idea | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)

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
      message.error('加载失败')
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
      message.error('操作失败')
    }
  }

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
      message.error('评论失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAuthorClick = () => {
    if (idea) {
      navigate(`/user/${idea.author.id}`)
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
              <div className={styles.time}>{dayjs(idea.createdAt).format('YYYY年MM月DD日 HH:mm')}</div>
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
          <Space size={32}>
            <Button
              type={idea.isLiked ? 'primary' : 'default'}
              icon={idea.isLiked ? <LikeFilled /> : <LikeOutlined />}
              onClick={handleLike}
            >
              {idea.likeCount} 点赞
            </Button>
            <span className={styles.stat}>
              <CommentOutlined /> {comments.length} 评论
            </span>
            <span className={styles.stat}>
              <EyeOutlined /> {idea.viewCount} 浏览
            </span>
          </Space>
        </div>
      </Card>

      <Card 
        title={`评论 (${comments.length})`} 
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
          />
          <div className={styles.commentActions}>
            <Button
              type="primary"
              onClick={handleSubmitComment}
              loading={submitting}
              disabled={!commentContent.trim()}
            >
              发表评论
            </Button>
          </div>
        </div>

        <Divider />

        {/* 评论列表 */}
        <List
          dataSource={comments}
          locale={{ emptyText: '暂无评论，来抢沙发吧' }}
          renderItem={(comment) => (
            <div className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div className={styles.commentAuthor} onClick={() => navigate(`/user/${comment.author.id}`)}>
                  <Avatar 
                    size="small"
                    src={comment.author.avatar} 
                    icon={<UserOutlined />}
                  />
                  <span className={styles.authorName}>{comment.author.nickname}</span>
                </div>
                <span className={styles.commentTime}>{dayjs(comment.createdAt).fromNow()}</span>
              </div>
              <div className={styles.commentContent}>
                <p>{comment.content}</p>
              </div>
              <div className={styles.commentActions}>
                <span>
                  <LikeOutlined /> {comment.likeCount}
                </span>
              </div>
            </div>
          )}
        />
      </Card>
    </div>
  )
}

export default IdeaDetail
