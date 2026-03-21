import { request } from '@/utils/request'
import { PaginationResponse } from '@/types'

export interface Report {
  id: number
  reportType: string
  reporterId: number
  targetType: 'idea' | 'comment'
  targetId: number
  description: string
  status: 'PENDING' | 'PROCESSED' | 'IGNORED'
  result: string
  handlerId: number
  createdAt: string
  processedAt: string
}

export interface CreateReportParams {
  reportType: string
  targetType: 'idea' | 'comment'
  targetId: number
  description?: string
}

export interface ProcessReportParams {
  status: 'PROCESSED' | 'IGNORED'
  result: string
  deleteContent?: boolean
  banUser?: boolean
}

// 提交举报
export const createReport = (params: CreateReportParams): Promise<Report> => {
  return request.post('/reports', params)
}

// 获取用户自己的举报列表
export const getMyReports = (params: {
  page: number
  pageSize: number
}): Promise<PaginationResponse<Report>> => {
  return request.get('/reports/my', { params })
}

// 管理员获取举报列表
export const getAdminReportList = (params: {
  page: number
  pageSize: number
  status?: string
  reportType?: string
}): Promise<PaginationResponse<Report>> => {
  const cleanedParams: any = { ...params }
  if (cleanedParams.status === '') cleanedParams.status = undefined
  if (cleanedParams.reportType === '') cleanedParams.reportType = undefined
  return request.get('/reports/admin', { params: cleanedParams })
}

// 管理员处理举报
export const processReport = (id: number, params: ProcessReportParams): Promise<Report> => {
  return request.post(`/reports/admin/${id}/process`, params)
}
