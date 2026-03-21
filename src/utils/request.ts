import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 防止重复 toast
let lastErrorTime = 0
let lastErrorMessage = ''

const showError = (msg: string) => {
  const now = Date.now()
  // 3 秒内相同错误不重复显示
  if (now - lastErrorTime < 3000 && msg === lastErrorMessage) {
    return
  }
  lastErrorTime = now
  lastErrorMessage = msg
  message.error(msg)
}

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,  // 增加到 30 秒
  withCredentials: true,
})

// 请求拦截器 - 添加 token 认证和调试日志
instance.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[API Response]', response.config.url, response.data)
    // 确保 response.data 是对象
    if (!response.data || typeof response.data !== 'object') {
      return response.data
    }
    const { code, message: msg, data } = response.data
    if (code === 0) {
      return data
    } else {
      showError(msg || '请求失败')
      return Promise.reject(new Error(msg))
    }
  },
  (error) => {
    // 忽略请求中止错误（页面快速切换导致）
    if (error.code === 'ERR_CANCELED' || error.message === 'Request aborted') {
      console.log('[API Canceled]', error.config?.url)
      return Promise.reject(error)
    }
    
    console.error('[API Error]', error.config?.url, error.message)
    if (error.response) {
      const { status } = error.response
      console.error('[API Error Response]', status, error.response.data)
      switch (status) {
        case 401:
          showError('请先登录')
          // 清除 token 并跳转到登录页
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          break
        case 403:
          showError('没有权限访问')
          break
        case 404:
          showError('请求的资源不存在')
          break
        case 500:
          showError('服务器错误')
          break
        default:
          showError('网络错误')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应 - 可能是网络问题或 CORS 问题
      console.error('[API No Response]', error.config?.url, error.request)
      showError('网络连接失败，请检查网络后重试')
    } else {
      showError(error.message)
    }
    return Promise.reject(error)
  }
)

export default instance

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config)
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config)
  },
}
