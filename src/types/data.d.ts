// 数据类型定义

// 通用 API 响应
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
  timestamp: number
}

// 销售数据
export interface SalesItem {
  month: string
  value: number
  target: number
  rate: number
}

export interface SalesData {
  total: number
  unit: string
  list: SalesItem[]
}

// 地图数据
export interface MapItem {
  name: string
  value: number
}

// 趋势数据
export interface TrendItem {
  time: string
  pv: number
  uv: number
}

export interface TrendData {
  totalPv: number
  totalUv: number
  list: TrendItem[]
}

// 排行榜数据
export interface RankItem {
  name: string
  value: number
  rate: number
}

// 图表配置
export interface ChartConfig {
  width?: number | string
  height?: number | string
  theme?: string
  autoResize?: boolean
}
