// 日志系统单元测试
import { describe, it, expect, vi } from 'vitest'
import { logger } from '@/utils/logger'

describe('logger', () => {
  it('应该导出 debug/info/warn/error 四个方法', () => {
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
  })

  it('调用方法不应该抛出异常', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    expect(() => logger.info('test message')).not.toThrow()
    spy.mockRestore()
  })
})
