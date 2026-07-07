// ECharts 图表相关类型声明

import type { EChartsOption } from 'echarts'

// 图表组件通用 Props
export interface BaseChartProps {
  option: EChartsOption
  width?: string
  height?: string
  loading?: boolean
  theme?: string
}

// 图表组件通用 Emits
export interface BaseChartEmits {
  (e: 'chartReady', instance: any): void
  (e: 'chartError', error: Error): void
}
