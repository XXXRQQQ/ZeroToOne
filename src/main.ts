import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { logger } from './utils/logger'

// 全局样式
import './assets/styles/global.scss'

const app = createApp(App)

// 状态管理
const pinia = createPinia()
app.use(pinia)

// 路由
app.use(router)

app.mount('#app')

logger.info('从零到一数据大屏启动成功 🚀')
