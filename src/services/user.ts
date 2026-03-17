import { request } from '@/utils/request'
import { User, Idea, PaginationResponse } from '@/types'

// 获取用户信息
export const getUserInfo = (userId: string): Promise<User> => {
  return request.get(`/users/${userId}`)
}

// 获取用户发布的想法
export const getUserIdeas = (
  userId: string,
  params: { page: number; pageSize: number }
): Promise<PaginationResponse<Idea>> => {
  return request.get(`/users/${userId}/ideas`, { params })
}

// 关注用户
export const followUser = (userId: string): Promise<void> => {
  return request.post(`/users/${userId}/follow`)
}

// 取消关注
export const unfollowUser = (userId: string): Promise<void> => {
  return request.delete(`/users/${userId}/follow`)
}

// 获取热门标签
export const getHotTags = (): Promise<string[]> => {
  return request.get('/tags/hot')
}
