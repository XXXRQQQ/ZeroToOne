// 格式化工具单元测试
import { describe, it, expect } from 'vitest'
import { formatNumber, formatCurrency, formatPercent, formatTime } from '@/utils/format'

describe('formatNumber', () => {
  it('应该正确格式化数字', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatCurrency', () => {
  it('应该正确格式化金额', () => {
    expect(formatCurrency(123456)).toBe('12.35万元')
    expect(formatCurrency(999)).toBe('999元')
  })
})

describe('formatPercent', () => {
  it('应该正确格式化百分比', () => {
    expect(formatPercent(12.5)).toBe('+12.5%')
    expect(formatPercent(-3.2)).toBe('-3.2%')
  })
})

describe('formatTime', () => {
  it('应该正确格式化时间', () => {
    const date = new Date('2026-07-07 14:30:00')
    expect(formatTime(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2026-07-07 14:30:00')
  })
})
