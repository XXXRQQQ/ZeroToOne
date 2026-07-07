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
  const salesData = ref<any>(null)
  const mapData = ref<any[]>([])
  const trendData = ref<any>(null)
  const rankData = ref<any[]>([])
  const categoryData = ref<any[]>([])

  // --- 计算属性 ---
  const isMock = computed(() => dataSource.value === 'mock')

  // 指标卡片数据
  const todaySales = computed(() => {
    const raw = trendData.value
    return raw?.data?.todaySales || 0
  })
  const orders = computed(() => {
    const raw = trendData.value
    return raw?.data?.orders || 0
  })
  const totalUv = computed(() => {
    const raw = trendData.value
    return raw?.data?.totalUv || 0
  })
  const conversionRate = computed(() => {
    const raw = trendData.value
    return raw?.data?.conversionRate || 0
  })

  // 销售总额
  const salesTotal = computed(() => {
    const raw = salesData.value
    return raw?.data?.total || 0
  })

  // --- 方法 ---
  function setDataSource(source: DataSource): void {
    dataSource.value = source
    logger.info(`数据源切换为: ${source}`)
  }

  async function fetchDashboardData(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const [sales, map, trend, rank, category] = await Promise.all([
        dataAdapter.getSalesData(),
        dataAdapter.getMapData(),
        dataAdapter.getTrendData(),
        dataAdapter.getRankData(),
        dataAdapter.getCategoryData(),
      ])

      salesData.value = sales
      mapData.value = map
      trendData.value = trend
      rankData.value = rank
      categoryData.value = category

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
    categoryData,
    isMock,
    todaySales,
    orders,
    totalUv,
    conversionRate,
    salesTotal,
    setDataSource,
    fetchDashboardData,
  }
})
