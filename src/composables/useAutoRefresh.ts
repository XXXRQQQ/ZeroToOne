// 定时刷新组合式函数
import { ref, onMounted, onUnmounted } from 'vue'
import { logger } from '@/utils/logger'

interface AutoRefreshOptions {
  /** 刷新间隔(ms) */
  interval?: number
  /** 是否立即执行 */
  immediate?: boolean
}

export function useAutoRefresh(
  callback: () => void | Promise<void>,
  options: AutoRefreshOptions = {}
) {
  const { interval = 60000, immediate = true } = options

  const isRunning = ref<boolean>(false)
  const lastRefreshTime = ref<Date | null>(null)

  let timer: ReturnType<typeof setInterval> | null = null

  async function refresh(): Promise<void> {
    try {
      await callback()
      lastRefreshTime.value = new Date()
      logger.debug('数据定时刷新完成')
    } catch (err) {
      logger.error('数据定时刷新失败', err)
    }
  }

  function start(): void {
    if (isRunning.value) return
    isRunning.value = true

    if (immediate) {
      refresh()
    }

    timer = setInterval(refresh, interval)
    logger.debug(`启动定时刷新，间隔: ${interval}ms`)
  }

  function stop(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isRunning.value = false
    logger.debug('停止定时刷新')
  }

  onMounted(() => start())
  onUnmounted(() => stop())

  return { isRunning, lastRefreshTime, refresh, start, stop }
}
