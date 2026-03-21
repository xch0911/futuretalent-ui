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
