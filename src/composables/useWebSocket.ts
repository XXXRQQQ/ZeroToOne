// WebSocket 实时数据连接组合式函数
import { ref, onMounted, onUnmounted } from 'vue'
import { logger } from '@/utils/logger'

interface WebSocketOptions {
  /** 重连间隔(ms) */
  reconnectInterval?: number
  /** 最大重连次数 */
  maxReconnectAttempts?: number
  /** 心跳间隔(ms) */
  heartbeatInterval?: number
}

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
  const {
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
  } = options

  const message = ref<any>(null)
  const isConnected = ref<boolean>(false)
  const reconnectCount = ref<number>(0)

  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null

  function connect(): void {
    if (ws?.readyState === WebSocket.OPEN) return

    try {
      ws = new WebSocket(url)

      ws.onopen = () => {
        isConnected.value = true
        reconnectCount.value = 0
        logger.info('WebSocket 连接成功')
        startHeartbeat()
      }

      ws.onmessage = (event) => {
        try {
          message.value = JSON.parse(event.data)
        } catch {
          message.value = event.data
        }
      }

      ws.onclose = () => {
        isConnected.value = false
        stopHeartbeat()
        logger.warn('WebSocket 连接关闭')
        attemptReconnect()
      }

      ws.onerror = (event) => {
        logger.error('WebSocket 连接错误', event)
      }
    } catch (err) {
      logger.error('WebSocket 创建失败', err)
    }
  }

  function attemptReconnect(): void {
    if (reconnectCount.value >= maxReconnectAttempts) {
      logger.error(`WebSocket 重连次数已达上限 (${maxReconnectAttempts})`)
      return
    }

    reconnectCount.value++
    logger.info(`WebSocket 尝试重连 ${reconnectCount.value}/${maxReconnectAttempts}`)
    reconnectTimer = setTimeout(connect, reconnectInterval)
  }

  function startHeartbeat(): void {
    heartbeatTimer = setInterval(() => {
      ws?.send('ping')
    }, heartbeatInterval)
  }

  function stopHeartbeat(): void {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  function send(data: unknown): void {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(typeof data === 'string' ? data : JSON.stringify(data))
    }
  }

  function disconnect(): void {
    stopHeartbeat()
    if (reconnectTimer) clearTimeout(reconnectTimer)
    ws?.close()
    ws = null
    isConnected.value = false
  }

  onMounted(() => connect())
  onUnmounted(() => disconnect())

  return { message, isConnected, reconnectCount, send, disconnect, connect }
}
