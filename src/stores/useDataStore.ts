// 数据状态管理（Mock / API 切换核心）
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DataSource } from '@/services/adapter'
import { dataAdapter } from '@/services/adapter'
import { logger } from '@/utils/logger'

export const useDataStore = defineStore('data', () => {
  // --- 状态 ---
  const dataSource = ref<DataSource>('mock')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 大屏各区域数据
  const salesData = ref<any[]>([])
  const mapData = ref<any[]>([])
  const trendData = ref<any[]>([])
  const rankData = ref<any[]>([])

  // --- 计算属性 ---
  const isMock = computed(() => dataSource.value === 'mock')

  // --- 方法 ---
  function setDataSource(source: DataSource): void {
    dataSource.value = source
    logger.info(`数据源切换为: ${source}`)
  }

  async function fetchDashboardData(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const [sales, map, trend, rank] = await Promise.all([
        dataAdapter.getSalesData(),
        dataAdapter.getMapData(),
        dataAdapter.getTrendData(),
        dataAdapter.getRankData(),
      ])

      salesData.value = sales
      mapData.value = map
      trendData.value = trend
      rankData.value = rank

      logger.info('大屏数据加载完成')
    } catch (err) {
      const message = err instanceof Error ? err.message : '数据加载失败'
      error.value = message
      logger.error(`数据加载失败: ${message}`)
    } finally {
      loading.value = false
    }
  }

  return {
    dataSource,
    loading,
    error,
    salesData,
    mapData,
    trendData,
    rankData,
    isMock,
    setDataSource,
    fetchDashboardData,
  }
})
