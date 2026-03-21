import { request } from '@/utils/request'
import { Comment } from '@/types'

// 获取想法的评论列表
export const getComments = (ideaId: string): Promise<Comment[]> => {
  return request.get(`/ideas/${ideaId}/comments`)
}

// 创建评论
export const createComment = (ideaId: string, params: { content: string; parentId?: string | number }): Promise<Comment> => {
  return request.post(`/ideas/${ideaId}/comments`, params)
}

// 点赞评论
export const likeComment = (ideaId: string, commentId: string): Promise<void> => {
  return request.post(`/ideas/${ideaId}/comments/${commentId}/like`)
}

// 删除评论
export const deleteComment = (commentId: string): Promise<void> => {
  return request.delete(`/ideas/comments/${commentId}`)
}
