<template>
  <div class="heat-calendar-wrapper">
    <div class="chart-loading" v-if="loading">加载中...</div>
    <div class="chart-empty" v-else-if="!hasData">暂无数据</div>
    <div ref="chartRef" class="chart-container" v-show="!loading && hasData"></div>

    <!-- 图例 -->
    <div class="heat-legend" v-show="!loading && hasData">
      <span class="legend-label">少</span>
      <div class="legend-colors">
        <span class="legend-block" v-for="i in 5" :key="i" :style="{ background: legendColors[i - 1] }"></span>
      </div>
      <span class="legend-label">多</span>
    </div>
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

// 热度颜色梯度
const legendColors = ['#0e2a1e', '#144b2e', '#1a7a3e', '#30b85a', '#52d971']

const hasData = computed(() => true) // 热力图总是有数据

// 生成本月热力数据
function generateHeatData() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const daysInMonth = new Date(year, month, 0).getDate()

  // 模拟销售热度数据
  const data: [string, number][] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    // 模拟销售数据：周末略低，某些日期特别高
    const d = new Date(year, month - 1, day)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const base = isWeekend ? 3000 : 8000
    const variance = Math.random() * 12000 - 2000
    // 某些特殊日期高亮
    const isSpecial = day === 1 || day === 11 || day === 18 || day === 25
    const specialBonus = isSpecial ? 15000 + Math.random() * 10000 : 0
    const value = Math.max(500, Math.floor(base + variance + specialBonus))
    data.push([date, value])
  }

  return data
}

const heatData = ref(generateHeatData())

function getOption(): EChartsOption {
  const data = heatData.value
  const maxVal = Math.max(...data.map((d) => d[1]))
  const minVal = Math.min(...data.map((d) => d[1]))

  // 按周分组（横向：周一~周日，纵向：第几周）
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  return {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(10,15,40,0.95)',
      borderColor: 'rgba(24,144,255,0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params: any) => {
        return `<span style="color:rgba(255,255,255,0.6)">${params.value[0]}</span><br/>
                <span style="font-weight:700;font-size:14px">¥${params.value[1].toLocaleString()}</span>`
      },
    },
    visualMap: {
      show: false,
      min: minVal,
      max: maxVal,
      inRange: {
        color: ['#0a1e16', '#0e3a22', '#166b35', '#26a04a', '#3ddc6e'],
      },
    },
    calendar: {
      top: 8,
      left: 12,
      right: 12,
      bottom: 4,
      cellSize: ['auto', 16],
      range: `${year}-${month + 1}`,
      itemStyle: {
        borderWidth: 3,
        borderColor: 'rgba(10,15,40,0.8)',
        borderRadius: 2,
      },
      dayLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        nameMap: ['日', '一', '二', '三', '四', '五', '六'],
      },
      monthLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
      },
      yearLabel: { show: false },
      splitLine: {
        lineStyle: {
          color: 'rgba(24,144,255,0.08)',
        },
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: data,
        label: {
          show: true,
          color: 'rgba(255,255,255,0.55)',
          fontSize: 10,
          formatter: (params: any) => {
            const d = new Date(params.value[0])
            return d.getDate().toString()
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(16,185,129,0.5)',
            borderColor: 'rgba(16,185,129,0.6)',
            borderWidth: 1,
          },
          label: {
            color: '#fff',
            fontWeight: 'bold',
          },
        },
      },
    ],
  }
}

function initChart(): void {
  if (!chartRef.value) return
  // 确保容器有尺寸再初始化
  if (chartRef.value.offsetWidth === 0 || chartRef.value.offsetHeight === 0) {
    nextTick(initChart)
    return
  }
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

watch(() => props.data, updateChart, { deep: true })
watch(() => props.loading, (val) => {
  if (!val) nextTick(initChart)
})

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.heat-calendar-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 160px;
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

.heat-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 0 16px 4px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
}

.legend-colors {
  display: flex;
  gap: 2px;
}

.legend-block {
  width: 20px;
  height: 10px;
  border-radius: 1px;
}
</style>
