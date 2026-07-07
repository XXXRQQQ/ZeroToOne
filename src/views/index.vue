<template>
  <div class="dashboard-container" :style="containerStyle">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-lines"></div>
    </div>

    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <div class="header-left">
        <div class="logo-icon">Z</div>
        <div class="title-group">
          <h1 class="dashboard-title">从零到一数据大屏</h1>
          <p class="dashboard-subtitle">ZeroToOne Data Dashboard</p>
        </div>
      </div>
      <div class="header-center">
        <div class="datetime-display">
          <span class="date-text">{{ dateStr }}</span>
          <span class="time-text">{{ timeStr }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="refresh-indicator">
          <span class="refresh-dot" :class="{ active: !dataStore.loading }"></span>
          <span class="refresh-text">{{ dataStore.loading ? '加载中...' : '实时数据' }}</span>
          <span class="refresh-time" v-if="lastRefreshTime">更新于 {{ formatTime(lastRefreshTime, 'HH:mm:ss') }}</span>
        </div>
        <button class="fullscreen-btn" @click="appStore.toggleFullscreen" :title="appStore.isFullscreen ? '退出全屏' : '全屏'">
          {{ appStore.isFullscreen ? '⛶' : '⛶' }}
        </button>
      </div>
    </header>

    <!-- 主体内容区 -->
    <main class="dashboard-main">
      <!-- 左侧面板 -->
      <aside class="panel panel-left">
        <div class="panel-section">
          <div class="section-title">
            <span class="title-decor"></span>
            <span>月度销售趋势</span>
          </div>
          <div class="chart-box">
            <LineChart :data="dataStore.salesData" :loading="dataStore.loading" />
          </div>
        </div>
        <div class="panel-section">
          <div class="section-title">
            <span class="title-decor decor-cyan"></span>
            <span>地区销售分布</span>
          </div>
          <div class="chart-box">
            <BarChart :data="dataStore.mapData" :loading="dataStore.loading" />
          </div>
        </div>
      </aside>

      <!-- 中间面板 -->
      <section class="panel panel-center">
        <!-- 指标卡片行 -->
        <div class="metrics-row">
          <DataCard
            title="今日销售额"
            :value="dataStore.todaySales"
            unit="元"
            icon="💰"
            :rate="12.5"
          />
          <DataCard
            title="订单量"
            :value="dataStore.orders"
            unit="单"
            icon="📦"
            :rate="8.3"
          />
          <DataCard
            title="访客数(UV)"
            :value="dataStore.totalUv"
            unit="人"
            icon="👥"
            :rate="-3.2"
          />
          <DataCard
            title="转化率"
            :value="dataStore.conversionRate"
            unit="%"
            icon="📈"
            :rate="5.1"
          />
        </div>
        <!-- 实时数据仪表盘 -->
        <div class="panel-section center-chart">
          <div class="section-title">
            <span class="title-decor decor-cyan"></span>
            <span>实时数据仪表盘</span>
            <span class="live-badge">
              <span class="live-dot"></span>
              LIVE
            </span>
          </div>
          <div class="chart-box map-box">
            <LiveMetrics :trendData="dataStore.trendData" :loading="dataStore.loading" />
          </div>
        </div>
      </section>

      <!-- 右侧面板 -->
      <aside class="panel panel-right">
        <div class="panel-section">
          <div class="section-title">
            <span class="title-decor decor-orange"></span>
            <span>实时告警监控</span>
            <span class="alert-badge" v-if="dataStore.alertsUnread > 0">{{ dataStore.alertsUnread }}条未处理</span>
          </div>
          <div class="chart-box rank-box">
            <AlertFlow :data="dataStore.alertsData" :loading="dataStore.loading" />
          </div>
        </div>
        <div class="panel-section">
          <div class="section-title">
            <span class="title-decor decor-gold"></span>
            <span>销售排行榜</span>
          </div>
          <div class="chart-box rank-box">
            <RankList :data="dataStore.rankData" :loading="dataStore.loading" />
          </div>
        </div>
      </aside>
    </main>

    <!-- 底部滚动信息条 -->
    <footer class="dashboard-footer">
      <div class="marquee-wrap">
        <div class="marquee-content">
          <span v-for="(msg, i) in marqueeMessages" :key="i" class="marquee-item">
            {{ msg }}
            <span class="marquee-sep">|</span>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useDataStore } from '@/stores/useDataStore'
import { useScreenScale } from '@/composables/useScreenScale'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { formatTime } from '@/utils/format'
import { logger } from '@/utils/logger'

// 组件
import DataCard from '@/components/dashboard/DataCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import MapChart from '@/components/map/MapChart.vue'
import RankList from '@/components/dashboard/RankList.vue'
import AlertFlow from '@/components/dashboard/AlertFlow.vue'
import LiveMetrics from '@/components/dashboard/LiveMetrics.vue'

// Stores
const appStore = useAppStore()
const dataStore = useDataStore()

// 大屏自适应缩放
const { scale } = useScreenScale({ width: 1920, height: 1080 })
const containerStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'left top',
  width: '1920px',
  height: '1080px',
}))

// 自动刷新
const { lastRefreshTime } = useAutoRefresh(() => {
  dataStore.fetchDashboardData()
}, { interval: 30000, immediate: false })

// 日期时间
const dateStr = ref('')
const timeStr = ref('')
let clockTimer: ReturnType<typeof setInterval> | null = null

function updateClock() {
  const now = new Date()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  dateStr.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`
  timeStr.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}

// 底部滚动信息
const marqueeMessages = [
  '系统运行正常',
  '今日新增用户 1,286 人',
  '服务器负载 23.5%',
  '数据刷新间隔 30s',
  'API 响应时间 45ms',
  '数据库连接正常',
]

// 初始化
dataStore.fetchDashboardData()
updateClock()
clockTimer = setInterval(updateClock, 1000)

onMounted(() => {
  logger.info('从零到一数据大屏页面加载完成')
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<style scoped lang="scss">
.dashboard-container {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background: #0a0e27;
  position: relative;
  overflow: hidden;

  // 背景装饰
  .bg-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.06;
  }

  .bg-circle-1 {
    width: 600px;
    height: 600px;
    background: #1890ff;
    top: -200px;
    right: -100px;
  }

  .bg-circle-2 {
    width: 500px;
    height: 500px;
    background: #a855f7;
    bottom: -150px;
    left: -100px;
  }

  .bg-lines {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(24,144,255,0.03) 1px, transparent 1px),
      linear-gradient(0deg, rgba(24,144,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
}

// ===== 顶部标题栏 =====
.dashboard-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: relative;
  z-index: 10;
  background: linear-gradient(180deg, rgba(10,14,39,0.95) 0%, rgba(10,14,39,0.7) 80%, transparent 100%);
  border-bottom: 1px solid rgba(24,144,255,0.15);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #1890ff, #13c2c2);
  border-radius: 10px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.title-group {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #1890ff, #13c2c2, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  letter-spacing: 1px;
}

.header-center {
  .datetime-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .date-text {
    font-size: 14px;
    color: rgba(255,255,255,0.55);
    letter-spacing: 1px;
  }

  .time-text {
    font-size: 28px;
    font-weight: 700;
    font-family: 'DIN', 'Consolas', monospace;
    color: #13c2c2;
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(19,194,194,0.3);
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.refresh-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: background 0.3s;

  &.active {
    background: #52c41a;
    box-shadow: 0 0 8px rgba(82,196,26,0.5);
    animation: pulse-dot 2s infinite;
  }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.refresh-text {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}

.refresh-time {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
}

.fullscreen-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(24,144,255,0.1);
    border-color: rgba(24,144,255,0.3);
    color: #fff;
  }
}

// ===== 主体区域 =====
.dashboard-main {
  flex: 1;
  display: flex;
  padding: 12px 16px;
  gap: 14px;
  position: relative;
  z-index: 5;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-left,
.panel-right {
  width: 440px;
  flex-shrink: 0;
}

.panel-center {
  flex: 1;
  min-width: 0;
}

.panel-section {
  flex: 1;
  background: rgba(10,15,40,0.75);
  border: 1px solid rgba(24,144,255,0.15);
  border-radius: 6px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  min-height: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(24,144,255,0.4), transparent);
    opacity: 0.6;
  }

  &:hover {
    border-color: rgba(24,144,255,0.3);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.title-decor {
  display: inline-block;
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, #1890ff, transparent);
  border-radius: 2px;
  flex-shrink: 0;

  &.decor-cyan {
    background: linear-gradient(180deg, #13c2c2, transparent);
  }

  &.decor-purple {
    background: linear-gradient(180deg, #a855f7, transparent);
  }

  &.decor-gold {
    background: linear-gradient(180deg, #f59e0b, transparent);
  }

  &.decor-orange {
    background: linear-gradient(180deg, #f97316, transparent);
  }
}

.alert-badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 500;
  color: #f59e0b;
  padding: 2px 8px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 10px;
  animation: badge-pulse 2s infinite;
}

.live-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  color: #10b981;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 4px;

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: live-blink 1s infinite;
  }

  @keyframes live-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
}

@keyframes badge-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.chart-box {
  flex: 1;
  min-height: 0;
  position: relative;
}

.map-box {
  flex: 1;
  min-height: 0;
}

.rank-box {
  overflow: hidden;
}

.center-chart {
  flex: 2;
  min-height: 0;
}

// ===== 指标卡片行 =====
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

// ===== 底部信息条 =====
.dashboard-footer {
  height: 32px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  background: rgba(10,15,40,0.7);
  border-top: 1px solid rgba(24,144,255,0.1);
  overflow: hidden;
}

.marquee-wrap {
  width: 100%;
  overflow: hidden;
}

.marquee-content {
  display: flex;
  gap: 40px;
  white-space: nowrap;
  animation: marquee-scroll 30s linear infinite;
  padding: 0 20px;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-item {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 20px;
}

.marquee-sep {
  color: rgba(255,255,255,0.1);
}
</style>
