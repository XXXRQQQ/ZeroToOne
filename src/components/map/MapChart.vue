<template>
  <div class="map-chart-wrapper">
    <div class="chart-loading" v-if="loading">地图加载中...</div>
    <div class="chart-empty" v-else-if="!mapData.length">暂无地图数据</div>
    <div ref="chartRef" class="chart-container" v-show="!loading && mapData.length"></div>
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

const mapData = computed(() => {
  const raw = props.data
  if (!raw) return []
  return Array.isArray(raw?.data) ? raw.data : []
})

function getOption(): EChartsOption {
  const list = mapData.value as any[]

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6,12,28,0.9)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: '{b}: {c}',
    },
    visualMap: {
      min: 0,
      max: 13000,
      left: 'left',
      bottom: 20,
      text: ['高', '低'],
      inRange: {
        color: ['#0a1a3a', '#0d3b66', '#1890ff', '#69c0ff'],
      },
      textStyle: { color: 'rgba(255,255,255,0.65)' },
    },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1.2,
        label: {
          show: true,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10,
        },
        itemStyle: {
          areaColor: '#0d1b3e',
          borderColor: 'rgba(24,144,255,0.3)',
          borderWidth: 1,
        },
        emphasis: {
          label: { color: '#fff', fontSize: 12 },
          itemStyle: { areaColor: '#1890ff' },
        },
        data: list.map((item: any) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ],
  }
}

function initChart(): void {
  if (!chartRef.value) return

  // 注册中国地图（需要引入 china.json，这里用散点图做降级方案）
  const hasChinaMap = echarts.getMap('china')
  if (!hasChinaMap) {
    // 降级：使用散点图替代
    initFallbackChart()
    return
  }

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getOption())
}

function initFallbackChart(): void {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const list = mapData.value as any[]
  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6,12,28,0.9)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: '{b}: {c}',
    },
    series: [
      {
        type: 'treemap',
        data: list.map((item: any) => ({
          name: item.name,
          value: item.value,
        })),
        label: {
          show: true,
          formatter: '{b}\n{c}',
          color: '#fff',
          fontSize: 10,
        },
        itemStyle: {
          borderColor: 'rgba(24,144,255,0.2)',
          borderWidth: 2,
        },
      },
    ],
  })
}

function handleResize(): void {
  chartInstance?.resize()
}

watch(() => mapData.value, () => {
  if (chartInstance) {
    chartInstance.setOption(getOption())
  }
}, { deep: true })

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
.map-chart-wrapper {
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
