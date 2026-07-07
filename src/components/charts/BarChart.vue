<template>
  <div class="bar-chart-wrapper">
    <div class="chart-loading" v-if="loading">加载中...</div>
    <div class="chart-empty" v-else-if="!hasData">暂无数据</div>
    <div ref="chartRef" class="chart-container" v-show="!loading && hasData"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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

const chartData = computed(() => {
  const raw = props.data
  if (!raw) return []
  return Array.isArray(raw?.data) ? raw.data : []
})

const hasData = computed(() => chartData.value.length > 0)

function getOption(): EChartsOption {
  const list = chartData.value as any[]
  // 按 value 降序
  const sorted = [...list].sort((a: any, b: any) => b.value - a.value)
  const names = sorted.map((item: any) => item.name).reverse()
  const values = sorted.map((item: any) => item.value).reverse()

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10,15,40,0.95)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: '{b}: {c} 万元',
    },
    grid: {
      top: 5,
      right: 30,
      bottom: 5,
      left: 70,
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: values,
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: (params: any) => {
            const colorStops = [
              { offset: 0, color: '#13c2c2' },
              { offset: 0.5, color: '#1890ff' },
              { offset: 1, color: '#a855f7' },
            ]
            return new echarts.graphic.LinearGradient(0, 0, 1, 0, colorStops)
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(24,144,255,0.5)',
          },
        },
        label: {
          show: true,
          position: 'right',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10,
          formatter: '{c}',
        },
      },
    ],
  }
}

function initChart(): void {
  if (!chartRef.value || !hasData.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getOption())
}

function updateChart(): void {
  if (chartInstance) {
    chartInstance.setOption(getOption(), true)
  } else {
    nextTick(initChart)
  }
}

function handleResize(): void {
  chartInstance?.resize()
}

watch(() => chartData.value, updateChart, { deep: true })
watch(() => props.loading, (val) => {
  if (!val) nextTick(initChart)
})

onMounted(() => {
  if (!props.loading && hasData.value) {
    nextTick(initChart)
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.bar-chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.chart-loading,
.chart-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}
</style>
