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
  const formData = new FormData()
  formData.append('file', file)
  return request.post<string>('/feedback/upload', formData)
}

// 提交反馈（图片已经上传好，只传 URL 数组）
export const createFeedback = (data: CreateFeedbackRequest) => {
  return request.post('/feedback', data)
}
