// 全局类型声明

// 路由元信息
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    keepAlive?: boolean
  }
}

// 全局 Window 扩展
declare global {
  interface Window {
    __APP_VERSION__: string
  }
}

export {}
