import { request } from '@/utils/request'
import { User, Idea, PaginationResponse } from '@/types'

// 获取用户信息
export const getUserInfo = (userId: string): Promise<User> => {
  return request.get(`/users/${userId}`)
}

// 更新用户信息
export interface UpdateUserParams {
  nickname?: string
  bio?: string
  avatar?: string
}

export const updateUserProfile = (
  userId: string, 
  params: UpdateUserParams
): Promise<User> => {
  return request.put(`/users/${userId}`, params)
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
  return request.get('/users/tags/hot')
}

// 获取平台统计数据
export interface Stats {
  userCount: number
  ideaCount: number
  connectionCount: number
}

export const getStats = (): Promise<Stats> => {
  return request.get('/users/stats')
}
