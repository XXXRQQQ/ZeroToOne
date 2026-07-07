// API 服务层 - 真实接口调用（后期切换 API 时使用）
import { logger } from '@/utils/logger'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 通用请求封装
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export const apiService = {
  async getSalesData() {
    logger.debug('API: 获取销售数据')
    return request('/dashboard/sales')
  },

  async getMapData() {
    logger.debug('API: 获取地图数据')
    return request('/dashboard/map')
  },

  async getTrendData() {
    logger.debug('API: 获取趋势数据')
    return request('/dashboard/trend')
  },

  async getRankData() {
    logger.debug('API: 获取排行榜数据')
    return request('/dashboard/rank')
  },

  async getCategoryData() {
    logger.debug('API: 获取分类数据')
    return request('/dashboard/category')
  },
}
