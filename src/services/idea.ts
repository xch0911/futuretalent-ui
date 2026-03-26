import { request } from '@/utils/request'
import { Idea, PaginationResponse } from '@/types'

// 获取想法列表
export const getIdeaList = (params: {
  page: number
  pageSize: number
  keyword?: string
  tag?: string
  userId?: string
  sort?: 'latest' | 'hot'
}): Promise<PaginationResponse<Idea>> => {
  // 空字符串改成 undefined，这样 axios 不会拼接到 URL 中，后端才能得到 null
  const cleanedParams: any = { ...params }
  if (cleanedParams.keyword === '') cleanedParams.keyword = undefined
  if (cleanedParams.tag === '') cleanedParams.tag = undefined
  if (cleanedParams.userId === '') cleanedParams.userId = undefined
  return request.get('/ideas', { params: cleanedParams })
}

// 获取想法详情
export const getIdeaDetail = (id: string): Promise<Idea> => {
  return request.get(`/ideas/${id}`)
}

// 点赞想法
export const likeIdea = (id: string): Promise<void> => {
  return request.post(`/ideas/${id}/like`)
}

// 取消点赞
export const unlikeIdea = (id: string): Promise<void> => {
  return request.delete(`/ideas/${id}/like`)
}

// 创建想法
export interface CreateIdeaParams {
  title: string
  content: string
  tags: string[]
}

export const createIdea = (params: CreateIdeaParams): Promise<Idea> => {
  return request.post('/ideas', params)
}

// 更新想法
export const updateIdea = (id: string, params: Partial<CreateIdeaParams>): Promise<Idea> => {
  return request.put(`/ideas/${id}`, params)
}

// 删除想法
export const deleteIdea = (id: string): Promise<void> => {
  return request.delete(`/ideas/${id}`)
}

// 获取个性化推荐（每次返回 10 条）
export const getRecommendations = (exclude?: string): Promise<Idea[]> => {
  return request.get('/ideas/recommend', { params: { exclude } })
}

// ========== 收藏功能 ==========
// 获取用户收藏列表
export const getMyFavorites = (page: number, pageSize: number = 10): Promise<PaginationResponse<Idea>> => {
  return request.get('/favorites', { params: { page, pageSize } })
}

// 切换收藏状态（收藏/取消收藏）
export const toggleFavorite = (ideaId: string): Promise<string> => {
  return request.post(`/favorites/toggle/${ideaId}`)
}

// 检查是否已收藏
export const checkFavorite = (ideaId: string): Promise<boolean> => {
  return request.get(`/favorites/check/${ideaId}`)
}

// 获取收藏总数
export const getFavoriteCount = (): Promise<number> => {
  return request.get('/favorites/count')
}

// 收藏想法
export const favoriteIdea = (id: string): Promise<void> => {
  return request.post(`/favorites/toggle/${id}`)
}

// 取消收藏
export const unfavoriteIdea = (id: string): Promise<void> => {
  return request.post(`/favorites/toggle/${id}`)
}
