import { request } from '@/utils/request'

export interface CreateFeedbackRequest {
  type: string
  rating?: number
  content: string
  contact?: string
  images?: string[]
}

// 上传反馈图片
export const uploadFeedbackImage = (file: File) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
  const formData = new FormData()
  formData.append('file', file)
  return request.post<string>(`${apiUrl}/feedback/upload`, formData)
}

// 提交反馈（图片已经上传好，只传 URL 数组）
export const createFeedback = (data: CreateFeedbackRequest) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
  return request.post(`${apiUrl}/feedback`, data)
}
