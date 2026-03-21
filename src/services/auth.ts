import { request } from '@/utils/request'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  nickname: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    nickname: string
    avatar: string
    email: string
  }
}

// 登录
export const login = (params: LoginParams): Promise<AuthResponse> => {
  return request.post('/auth/login', params)
}

// 注册
export const register = (params: RegisterParams): Promise<AuthResponse> => {
  return request.post('/auth/register', params)
}

// 退出登录
export const logout = (): Promise<void> => {
  return request.post('/auth/logout')
}

// 获取当前用户信息
export const getCurrentUser = (): Promise<AuthResponse['user']> => {
  return request.get('/auth/me')
}
