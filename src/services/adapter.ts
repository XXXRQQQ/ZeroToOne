// 数据适配器 - 统一 Mock 与 API 接口，通过环境变量切换
import type { ApiResponse } from '@/types/data'

// 数据源类型
export type DataSource = 'mock' | 'api'

// 判断当前数据源
function getDataSource(): DataSource {
  return (import.meta.env.VITE_USE_MOCK === 'true' ? 'mock' : 'api') as DataSource
}

// 通用响应包装
function wrapResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 200,
    data,
    message: 'success',
    timestamp: Date.now(),
  }
}

// ===== 数据适配器 =====
export const dataAdapter = {
  async getSalesData() {
    if (getDataSource() === 'mock') {
      const { mockSalesData } = await import('./mock/sales')
      return mockSalesData()
    }
    const { apiService } = await import('./api/index')
    return apiService.getSalesData()
  },

  async getMapData() {
    if (getDataSource() === 'mock') {
      const { mockMapData } = await import('./mock/map')
      return mockMapData()
    }
    const { apiService } = await import('./api/index')
    return apiService.getMapData()
  },

  async getTrendData() {
    if (getDataSource() === 'mock') {
      const { mockTrendData } = await import('./mock/trend')
      return mockTrendData()
    }
    const { apiService } = await import('./api/index')
    return apiService.getTrendData()
  },

  async getRankData() {
    if (getDataSource() === 'mock') {
      const { mockRankData } = await import('./mock/rank')
      return mockRankData()
    }
    const { apiService } = await import('./api/index')
    return apiService.getRankData()
  },

  async getCategoryData() {
    if (getDataSource() === 'mock') {
      const { mockCategoryData } = await import('./mock/rank')
      return mockCategoryData()
    }
    const { apiService } = await import('./api/index')
    return apiService.getCategoryData()
  },
}
