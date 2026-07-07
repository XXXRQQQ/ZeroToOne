// 数据请求组合式函数 - 封装加载/错误/重试逻辑
import { ref, type Ref } from 'vue'
import { logger } from '@/utils/logger'

interface UseDataFetchOptions {
  /** 自动请求 */
  immediate?: boolean
  /** 重试次数 */
  retryCount?: number
  /** 轮询间隔(ms)，0 表示不轮询 */
  pollingInterval?: number
}

interface UseDataFetchReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  execute: () => Promise<void>
  reset: () => void
}

export function useDataFetch<T>(
  fetcher: () => Promise<T>,
  options: UseDataFetchOptions = {}
): UseDataFetchReturn<T> {
  const { immediate = true, retryCount = 3, pollingInterval = 0 } = options

  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  let pollingTimer: ReturnType<typeof setInterval> | null = null

  async function execute(): Promise<void> {
    loading.value = true
    error.value = null

    let lastError: Error | null = null

    for (let i = 0; i <= retryCount; i++) {
      try {
        const result = await fetcher()
        data.value = result
        loading.value = false
        return
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        logger.warn(`请求失败，重试 ${i + 1}/${retryCount}: ${lastError.message}`)
      }
    }

    error.value = lastError?.message || '未知错误'
    loading.value = false
    logger.error(`请求最终失败: ${error.value}`)
  }

  function startPolling(): void {
    if (pollingInterval > 0) {
      pollingTimer = setInterval(execute, pollingInterval)
    }
  }

  function stopPolling(): void {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  function reset(): void {
    stopPolling()
    data.value = null
    loading.value = false
    error.value = null
  }

  if (immediate) {
    execute()
    startPolling()
  }

  return { data, loading, error, execute, reset }
}
