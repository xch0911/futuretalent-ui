import React, { useState, useRef, useEffect } from 'react'
import { Avatar, Button, Input, Modal, Popover, message } from 'antd'
import { UserOutlined, RightOutlined, FlagOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { createReport } from '@/services/report'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Comment as CommentType, User } from '@/types'
import styles from './index.module.css'

const { TextArea } = Input

dayjs.extend(relativeTime)

interface CommentProps {
  comment: CommentType
  onReply: (comment: CommentType) => void
  onDelete: (commentId: string | number) => Promise<void>
  replyingTo: CommentType | null
  onSubmitReply: (parentId: string | number, content: string) => Promise<void>
  onCancelReply: () => void
  navigate: (path: string) => void
  currentUser: User | null
  depth?: number
  parentNickname?: string
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onDelete,
  replyingTo,
  onSubmitReply,
  onCancelReply,
  navigate,
  currentUser,
  depth = 0,
  parentNickname,
}) => {
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [reportDescription, setReportDescription] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [actionVisible, setActionVisible] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const hasReplies = comment.replies && comment.replies.length > 0
  const hasMultipleReplies = comment.replies && comment.replies.length > 1
  const replyCount = comment.replies ? comment.replies.length : 0

  const isReplying = replyingTo?.id === comment.id
  const isAuthor = currentUser && comment.authorId.toString() === currentUser.id.toString()

  // 正确长按实现：定时器方案，完全手动控制，点击不会触发，只有长按超过500ms才弹出
  const handlePressStart = () => {
    timerRef.current = setTimeout(() => {
      setActionVisible(true)
    }, 500)
  }

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // 点击外部关闭弹窗 - 排除 Popover 自身内部点击
  useEffect(() => {
    if (!actionVisible) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      // 关键修复：如果点击的是 Popover 内部，不关闭
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        // 排除 antd popover 自身的容器
        !(e.target as Element)?.closest('.ant-popover')
      ) {
        setActionVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [actionVisible])

  // 组件卸载清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleReplyClick = () => {
    if (!currentUser) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    onReply(comment)
  }

  const handleDelete = () => {
    // 先关闭长按菜单
    setActionVisible(false)

    Modal.confirm({
      title: '确认删除该评论？',
      content: '删除后无法恢复，确定要删除吗？',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await onDelete(comment.id)
        } catch (err) {
          console.error('删除失败', err)
        }
      },
    })
  }

  const openReportModal = () => {
    setActionVisible(false)
    if (!currentUser) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    setReportModalVisible(true)
  }

  const handleSubmitReport = async () => {
    if (!reportDescription.trim()) {
      message.warning('请填写举报原因')
      return
    }
    try {
      setReportSubmitting(true)
      await createReport({
        reportType: 'other',
        targetType: 'comment',
        targetId: Number(comment.id),
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

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return
    try {
      setSubmitting(true)
      await onSubmitReply(comment.id, replyContent.trim())
      setReplyContent('')
      onCancelReply()
    } catch (error) {
      console.error('回复失败', error)
    } finally {
      setSubmitting(false)
    }
  }

  const authorAvatar = comment.authorAvatar
  const authorNickname = comment.authorNickname
  const authorId = comment.authorId

  const actionContent = (
    <div className={styles.commentActionsPopup}>
      {isAuthor ? (
        <Button
          danger
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          block
        >
          删除
        </Button>
      ) : (
        <Button
          danger
          type="text"
          size="small"
          icon={<FlagOutlined />}
          onClick={openReportModal}
          block
        >
          举报
        </Button>
      )}
    </div>
  )

  return (
    <div className={styles.commentItem}>
      <div className={styles.avatarWrapper} onClick={() => navigate(`/user/${authorId}`)}>
        <Avatar
          size={depth === 0 ? 30 : 24}
          src={authorAvatar}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.commentMeta}>
          <span
            className={styles.authorName}
            onClick={() => navigate(`/user/${authorId}`)}
            style={{ marginTop: depth === 0 ? 8 : 0 }}
          >
            {authorNickname}
          </span>
          {depth > 0 && parentNickname && (
            <span className={styles.replyTo}>
              <RightOutlined style={{ fontSize: 12, marginRight: 4 }} />
              {parentNickname}
            </span>
          )}
        </div>

        <div ref={popoverRef}>
          <Popover
            content={actionContent}
            open={actionVisible}
            placement="bottomLeft"
            trigger={[]}
          >
            <div
              className={styles.commentText}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onTouchMove={handlePressEnd}
            >
              {comment.content}
            </div>
          </Popover>
        </div>

        <div className={styles.commentActions}>
          <span className={styles.commentTime}>{dayjs(comment.createdAt).fromNow()}</span>
          <Button
            type="text"
            size="small"
            className={styles.replyBtn}
            onClick={handleReplyClick}
          >
            回复
          </Button>
        </div>

        {isReplying && (
          <div className={styles.replyInputWrapper}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input
                placeholder="写下你的回复..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={submitting}
                style={{ flex: 1 }}
              />
              <Button
                size="small"
                type={replyContent.trim() ? 'primary' : 'default'}
                loading={submitting}
                onClick={handleSubmitReply}
              >
                回复
              </Button>
            </div>
          </div>
        )}

        {/* 嵌套回复列表 - 只显示第一条，剩下的折叠 */}
        {hasReplies && (
          <div className={styles.replies}>
            {(showAllReplies ? comment.replies! : comment.replies!.slice(0, 1)).map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                replyingTo={replyingTo}
                onSubmitReply={onSubmitReply}
                onCancelReply={onCancelReply}
                navigate={navigate}
                currentUser={currentUser}
                depth={(depth || 0) + 1}
                parentNickname={authorNickname}
              />
            ))}
            {hasMultipleReplies && !showAllReplies && (
              <Button
                type="link"
                size="small"
                icon={<DownOutlined />}
                onClick={() => setShowAllReplies(true)}
                className={styles.expandBtn}
              >
                <span style={{ color: '#999' }}>展开全部 {replyCount - 1} 条回复</span>
              </Button>
            )}
            {hasMultipleReplies && showAllReplies && (
              <Button
                type="link"
                size="small"
                icon={<UpOutlined />}
                onClick={() => setShowAllReplies(false)}
                className={styles.collapseBtn}
              >
                <span style={{ color: '#999' }}>收起回复</span>
              </Button>
            )}
          </div>
        )}

        {/* 举报弹窗 */}
        <Modal
          title="举报评论"
          open={reportModalVisible}
          onCancel={() => setReportModalVisible(false)}
          onOk={handleSubmitReport}
          confirmLoading={reportSubmitting}
          width={400}
        >
          <div>
            <p>请描述举报原因：</p>
            <TextArea
              rows={4}
              placeholder="请详细描述违规内容，帮助我们更快处理..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Comment
