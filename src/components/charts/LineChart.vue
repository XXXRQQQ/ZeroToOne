<template>
  <div class="line-chart-wrapper">
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
  return Array.isArray(raw?.data?.list) ? raw.data.list : []
})

const hasData = computed(() => chartData.value.length > 0)

function getOption(): EChartsOption {
  const list = chartData.value as any[]
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,15,40,0.95)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      axisPointer: {
        type: 'cross',
        lineStyle: { color: 'rgba(24,144,255,0.3)', type: 'dashed' },
      },
    },
    legend: {
      data: ['销售额', '目标'],
      bottom: 0,
      textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 3,
    },
    grid: {
      top: 15,
      right: 25,
      bottom: 35,
      left: 50,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: list.map((item: any) => item.month),
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '万元',
      nameTextStyle: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: list.map((item: any) => item.value),
        lineStyle: {
          width: 2.5,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#13c2c2' },
          ]),
        },
        itemStyle: {
          color: '#1890ff',
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24,144,255,0.25)' },
            { offset: 1, color: 'rgba(24,144,255,0.01)' },
          ]),
        },
      },
      {
        name: '目标',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: list.map((item: any) => item.target),
        lineStyle: {
          width: 1.5,
          color: 'rgba(255,255,255,0.3)',
          type: 'dashed',
        },
        itemStyle: { color: 'rgba(255,255,255,0.3)' },
        areaStyle: { color: 'transparent' },
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
.line-chart-wrapper {
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
