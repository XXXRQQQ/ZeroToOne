<template>
  <div class="pie-chart-wrapper">
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

const pieColors = ['#1890ff', '#13c2c2', '#a855f7', '#f59e0b', '#10b981', '#6366f1']

function getOption(): EChartsOption {
  const list = chartData.value as any[]
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,15,40,0.95)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: '{b}: {c}%',
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 8,
      formatter: (name: string) => {
        const item = list.find((i: any) => i.name === name)
        return `${name}  ${item ? item.value + '%' : ''}`
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['38%', '55%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(10,15,40,0.8)',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#fff',
          },
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(24,144,255,0.5)',
          },
          scaleSize: 8,
        },
        data: list.map((item: any, index: number) => ({
          ...item,
          itemStyle: { color: pieColors[index % pieColors.length] },
        })),
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
.pie-chart-wrapper {
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
