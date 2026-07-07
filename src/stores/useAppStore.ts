// 应用全局状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

export const useAppStore = defineStore('app', () => {
  // --- 状态 ---
  const appName = ref<string>('从零到一数据大屏')
  const appVersion = ref<string>('1.0.0')
  const isFullscreen = ref<boolean>(false)
  const isDarkMode = ref<boolean>(true)
  const isInitialized = ref<boolean>(false)

  // --- 计算属性 ---
  const fullTitle = computed(() => `${appName.value} v${appVersion.value}`)

  // --- 方法 ---
  function initApp(): void {
    if (isInitialized.value) return
    logger.info(`初始化应用: ${fullTitle.value}`)
    isInitialized.value = true
  }

  function toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }

  function toggleDarkMode(): void {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode.value ? 'dark' : 'light'
    )
  }

  return {
    // 状态
    appName,
    appVersion,
    isFullscreen,
    isDarkMode,
    isInitialized,
    // 计算属性
    fullTitle,
    // 方法
    initApp,
    toggleFullscreen,
    toggleDarkMode,
  }
})
