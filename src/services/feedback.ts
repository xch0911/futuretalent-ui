import { request } from '@/utils/request'

export interface CreateFeedbackRequest {
  type: string
  title: string
  content: string
  contact?: string
  images?: string[]
}

export const createFeedback = (data: CreateFeedbackRequest) => {
  // 反馈不需要图片上传，只传 JSON 就可以，图片我们只是预览，后端已经支持纯 JSON 保存 URL
  return request.post('/feedback', data)
}
