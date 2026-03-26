import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Avatar, Tag, Space } from 'antd'
import { LikeOutlined, LikeFilled, CommentOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons'
import { Idea } from '@/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import styles from './index.module.css'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

interface IdeaCardProps {
  idea: Idea
  onLike?: (ideaId: string) => void
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onLike }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/ideas/${idea.id}`)
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (idea.author?.id) {
      navigate(`/user/${idea.author.id}`)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLike?.(idea.id)
  }

  return (
    <Card 
      className={`${styles.card} hover-card`}
      onClick={handleClick}
      hoverable
    >
      <div className={styles.header}>
        <div className={styles.author} onClick={handleAuthorClick}>
          <Avatar size="small" src={idea.author?.avatar} />
          <span className={styles.authorName}>{idea.author?.nickname || '匿名用户'}</span>
        </div>
        <span className={styles.time}>{dayjs(idea.createdAt).fromNow()}</span>
      </div>

      <h3 className={styles.title}>{idea.title}</h3>
      <p className={`${styles.content} text-ellipsis-3`}>{idea.content}</p>

      {idea.tags.length > 0 && (
        <div className={styles.tags}>
          {idea.tags.map(tag => (
            <Tag key={tag} className={styles.tag}>{tag}</Tag>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Space size={24}>
          <span 
            className={`${styles.stat} ${idea.isLiked ? styles.liked : ''}`}
            onClick={handleLikeClick}
          >
            {idea.isLiked ? <LikeFilled /> : <LikeOutlined />}
            <span className={styles.count}>{idea.likeCount}</span>
          </span>
          <span className={styles.stat}>
            <CommentOutlined />
            <span className={styles.count}>{idea.commentCount}</span>
          </span>
          <span className={styles.stat}>
            <EyeOutlined />
            <span className={styles.count}>{idea.viewCount}</span>
          </span>
          <span className={styles.stat}>
            <StarOutlined />
            <span className={styles.count}>{idea.favoriteCount || 0}</span>
          </span>
        </Space>
      </div>
    </Card>
  )
}

export default IdeaCard
