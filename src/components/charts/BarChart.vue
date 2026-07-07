<template>
  <div class="bar-chart-wrapper">
    <div class="chart-loading" v-if="loading">加载中...</div>
    <div class="chart-empty" v-else-if="!chartData.length">暂无数据</div>
    <div ref="chartRef" class="chart-container" v-show="!loading && chartData.length"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  data: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 解析数据
const chartData = computed(() => {
  const raw = props.data
  if (!raw) return []
  return Array.isArray(raw?.data?.list) ? raw.data.list : []
})

function getOption(): EChartsOption {
  const list = chartData.value as any[]
  return {
    grid: { top: 10, right: 20, bottom: 20, left: 50 },
    xAxis: {
      type: 'category',
      data: list.map((item: any) => item.month || item.time || ''),
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        type: 'bar',
        data: list.map((item: any) => item.value || item.pv || 0),
        barWidth: '50%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: 'rgba(24,144,255,0.3)' },
          ]),
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6,12,28,0.9)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
    },
  }
}

function initChart(): void {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getOption())
}

function updateChart(): void {
  if (chartInstance) {
    chartInstance.setOption(getOption())
  }
}

function handleResize(): void {
  chartInstance?.resize()
}

watch(() => chartData.value, updateChart, { deep: true })

onMounted(() => {
  if (!props.loading) initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.bar-chart-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-loading,
.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: 14px;
}
</style>
