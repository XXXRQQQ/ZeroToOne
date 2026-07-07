// 前端日志系统 - 支持分级输出
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// 根据环境变量设置日志级别
const currentLevel: LogLevel =
  (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'debug'

const currentLevelValue = LOG_LEVEL_MAP[currentLevel]

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_MAP[level] >= currentLevelValue
}

function getTimestamp(): string {
  return new Date().toISOString()
}

function formatMessage(level: LogLevel, message: string, ...args: any[]): void {
  const prefix = `[${getTimestamp()}] [${level.toUpperCase()}] [ZeroToOne]`

  switch (level) {
    case 'debug':
      console.debug(prefix, message, ...args)
      break
    case 'info':
      console.info(prefix, message, ...args)
      break
    case 'warn':
      console.warn(prefix, message, ...args)
      break
    case 'error':
      console.error(prefix, message, ...args)
      break
  }
}

export const logger = {
  debug(message: string, ...args: any[]): void {
    if (shouldLog('debug')) {
      formatMessage('debug', message, ...args)
    }
  },

  info(message: string, ...args: any[]): void {
    if (shouldLog('info')) {
      formatMessage('info', message, ...args)
    }
  },

  warn(message: string, ...args: any[]): void {
    if (shouldLog('warn')) {
      formatMessage('warn', message, ...args)
    }
  },

  error(message: string, ...args: any[]): void {
    if (shouldLog('error')) {
      formatMessage('error', message, ...args)
    }
  },
}
