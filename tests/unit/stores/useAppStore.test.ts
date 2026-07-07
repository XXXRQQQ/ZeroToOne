// 应用 Store 单元测试
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该正确初始化应用状态', () => {
    const store = useAppStore()
    expect(store.appName).toBe('从零到一数据大屏')
    expect(store.appVersion).toBe('1.0.0')
    expect(store.isInitialized).toBe(false)
  })

  it('initApp 应该设置 isInitialized 为 true', () => {
    const store = useAppStore()
    store.initApp()
    expect(store.isInitialized).toBe(true)
  })

  it('fullTitle 应该正确拼接标题', () => {
    const store = useAppStore()
    expect(store.fullTitle).toBe('从零到一数据大屏 v1.0.0')
  })
})
