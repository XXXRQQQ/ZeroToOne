// 主题配置状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 主题色板配置
export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  warning: string
  danger: string
  info: string
  bg: string
  bgPanel: string
  text: string
  textSecondary: string
  border: string
}

const defaultDarkTheme: ThemeColors = {
  primary: '#1890ff',
  secondary: '#13c2c2',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#ff4d4f',
  info: '#722ed1',
  bg: '#0a0e1a',
  bgPanel: 'rgba(6, 12, 28, 0.8)',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  border: 'rgba(24, 144, 255, 0.2)',
}

export const useThemeStore = defineStore('theme', () => {
  // --- 状态 ---
  const colors = ref<ThemeColors>({ ...defaultDarkTheme })

  // --- 方法 ---
  function setTheme(theme: Partial<ThemeColors>): void {
    Object.assign(colors.value, theme)
    // 将主题色注入 CSS 变量
    const root = document.documentElement
    Object.entries(colors.value).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
  }

  function resetTheme(): void {
    colors.value = { ...defaultDarkTheme }
    setTheme(colors.value)
  }

  return { colors, setTheme, resetTheme }
})
