// 用户信息（精简版）
export interface User {
  id: string
  nickname: string
  avatar: string
  bio?: string
  followerCount?: number
  followingCount?: number
  ideaCount?: number
}

// 想法（帖子）
export interface Idea {
  id: string
  title: string
  content: string
  author: User
  tags: string[]
  likeCount: number
  commentCount: number
  viewCount: number
  createdAt: string
  updatedAt: string
  isLiked: boolean
}

// 评论（精简版）
export interface Comment {
  id: string | number
  content: string
  authorId: string | number
  authorNickname: string
  authorAvatar: string
  parentId?: string | number
  replies: Comment[]
  likeCount: number
  createdAt: string
}

// 分页响应
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// API 响应格式
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}
