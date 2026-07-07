// 数据格式化工具

/**
 * 数字格式化 - 添加千分位分隔符
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

/**
 * 金额格式化
 */
export function formatCurrency(num: number, unit: string = '元'): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万${unit}`
  }
  return `${num.toLocaleString('zh-CN')}${unit}`
}

/**
 * 百分比格式化
 */
export function formatPercent(num: number, decimals: number = 1): string {
  const sign = num > 0 ? '+' : ''
  return `${sign}${num.toFixed(decimals)}%`
}

/**
 * 时间格式化
 */
export function formatTime(date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  const map: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: (d.getMonth() + 1).toString().padStart(2, '0'),
    DD: d.getDate().toString().padStart(2, '0'),
    HH: d.getHours().toString().padStart(2, '0'),
    mm: d.getMinutes().toString().padStart(2, '0'),
    ss: d.getSeconds().toString().padStart(2, '0'),
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key])
}
