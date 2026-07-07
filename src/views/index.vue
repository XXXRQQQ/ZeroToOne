<template>
  <div class="dashboard-container" :style="containerStyle">
    <header class="dashboard-header">
      <h1 class="dashboard-title">从零到一数据大屏</h1>
      <p class="dashboard-subtitle">ZeroToOne - 从0到1学习数据可视化</p>
      <div class="header-actions">
        <span class="data-source-badge" :class="{ active: isMock }">
          数据源: {{ isMock ? 'Mock' : 'API' }}
        </span>
        <span class="refresh-time" v-if="lastRefresh">
          更新: {{ formatTime(lastRefresh, 'HH:mm:ss') }}
        </span>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- 左侧面板 -->
      <aside class="dashboard-left">
        <DataCard title="销售总额" :value="salesTotal" unit="万元" :loading="loading" />
        <div class="chart-panel">
          <h3 class="panel-title">销售趋势</h3>
          <BarChart :data="salesData" :loading="loading" />
        </div>
      </aside>

      <!-- 中间面板 -->
      <section class="dashboard-center">
        <div class="chart-panel map-panel">
          <h3 class="panel-title">全国销售分布</h3>
          <MapChart :data="mapData" :loading="loading" />
        </div>
      </section>

      <!-- 右侧面板 -->
      <aside class="dashboard-right">
        <DataCard title="访问量(PV)" :value="totalPv" unit="次" :loading="loading" />
        <DataCard title="访客数(UV)" :value="totalUv" unit="人" :loading="loading" />
        <div class="chart-panel">
          <h3 class="panel-title">销售排行</h3>
          <RankList :data="rankData" :loading="loading" />
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { useScreenScale } from '@/composables/useScreenScale'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { formatTime } from '@/utils/format'
import { logger } from '@/utils/logger'

// 组件（暂用占位，后续完善具体组件）
import DataCard from '@/components/dashboard/DataCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import MapChart from '@/components/map/MapChart.vue'
import RankList from '@/components/dashboard/RankList.vue'

// 数据
const dataStore = useDataStore()
const { loading, salesData, mapData, trendData, rankData, isMock } = dataStore

// 大屏自适应
const { scale } = useScreenScale({ width: 1920, height: 1080 })
const containerStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'left top',
  width: '1920px',
  height: '1080px',
}))

// 自动刷新
const { lastRefreshTime } = useAutoRefresh(() => {
  dataStore.fetchDashboardData()
}, { interval: 30000 })

const lastRefresh = computed(() => lastRefreshTime.value)

// 计算属性 - 汇总数据
const salesTotal = computed(() => {
  const data = salesData.value as any
  return data?.data?.total || 0
})

const totalPv = computed(() => {
  const data = trendData.value as any
  return data?.data?.totalPv || 0
})

const totalUv = computed(() => {
  const data = trendData.value as any
  return data?.data?.totalUv || 0
})

// 初始化加载数据
dataStore.fetchDashboardData()
logger.info('主大屏页面加载完成')
</script>

<style scoped lang="scss">
.dashboard-container {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  overflow: hidden;
}

.dashboard-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: linear-gradient(
    180deg,
    rgba(24, 144, 255, 0.1) 0%,
    transparent 100%
  );
  border-bottom: 1px solid var(--color-border);
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(90deg, #1890ff, #13c2c2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-left: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.data-source-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);

  &.active {
    background: rgba(24, 144, 255, 0.2);
    color: var(--color-primary);
  }
}

.refresh-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dashboard-main {
  flex: 1;
  display: flex;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

.dashboard-left,
.dashboard-right {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-panel {
  flex: 1;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid var(--color-primary);
  color: var(--color-text);
}

.map-panel {
  flex: 2;
}
</style>
