<template>
  <div class="live-metrics-wrapper">
    <!-- 核心指标卡片 -->
    <div class="metrics-grid">
      <div
        v-for="item in metrics"
        :key="item.key"
        class="metric-card"
        :class="`metric-${item.key}`"
      >
        <div class="metric-icon">{{ item.icon }}</div>
        <div class="metric-info">
          <span class="metric-label">{{ item.label }}</span>
          <span class="metric-value">
            {{ displayValue(item.value) }}
            <span class="metric-unit">{{ item.unit }}</span>
          </span>
          <div class="metric-rate" :class="item.rate >= 0 ? 'up' : 'down'">
            <span class="rate-arrow">{{ item.rate >= 0 ? '↑' : '↓' }}</span>
            <span class="rate-num">{{ Math.abs(item.rate).toFixed(1) }}%</span>
            <span class="rate-text">vs 上期</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 关键指标仪表盘 -->
    <div class="gauge-section">
      <!-- 背景装饰 -->
      <div class="gauge-bg-decor">
        <div class="grid-lines"></div>
        <div class="scan-line"></div>
        <div class="glow-orb glow-orb-1"></div>
        <div class="glow-orb glow-orb-2"></div>
      </div>

      <!-- 标题栏 -->
      <div class="gauge-header">
        <div class="header-left">
          <span class="gauge-title">关键指标仪表</span>
          <span class="gauge-pulse"></span>
        </div>
        <span class="header-time">{{ currentTime }}</span>
      </div>

      <!-- 实时数据流 -->
      <div class="data-stream">
        <div class="stream-container" ref="streamRef">
          <div
            v-for="(log, i) in visibleLogs"
            :key="log.id"
            class="stream-line"
            :class="`log-${log.type}`"
            :style="{ animationDelay: `${i * 0.05}s` }"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-tag" :style="{ color: tagColor(log.type), borderColor: tagColor(log.type) }">[{{ log.tag }}]</span>
            <span class="log-msg">{{ log.msg }}</span>
          </div>
        </div>
      </div>

      <!-- 仪表盘主体 -->
      <div class="gauge-body">
        <div v-for="(g, idx) in gaugeItems" :key="g.key" class="gauge-cell" :class="`gauge-${g.key}`">
          <!-- SVG 环形图 -->
          <div class="gauge-ring-wrap">
            <svg class="gauge-svg" viewBox="0 0 120 120">
              <!-- 外圈刻度 -->
              <circle class="gauge-ticks" cx="60" cy="60" r="52" fill="none" stroke-width="6" />
              <!-- 背景轨道 -->
              <circle class="gauge-track" cx="60" cy="60" r="44" fill="none" stroke-width="10" />
              <!-- 进度弧 -->
              <circle
                class="gauge-progress"
                cx="60" cy="60" r="44"
                fill="none"
                stroke-width="10"
                stroke-linecap="round"
                :stroke="g.color"
                :stroke-dasharray="`${g.percent * 276.46} 276.46`"
                transform="rotate(-90 60 60)"
              />
              <!-- 内圈发光点 -->
              <circle class="gauge-dot" :fill="g.color"
                :cx="60 + 44 * Math.cos((g.percent * 2 - 0.5) * Math.PI)"
                :cy="60 + 44 * Math.sin((g.percent * 2 - 0.5) * Math.PI)"
                r="4" />
            </svg>
            <!-- 中心数值 -->
            <div class="gauge-center">
              <span class="gauge-value" :style="{ color: g.color }">{{ animatedValues[idx] }}{{ g.unit }}</span>
            </div>
          </div>
          <!-- 标题和进度条 -->
          <div class="gauge-label">{{ g.title }}</div>
          <div class="gauge-bar-track">
            <div class="gauge-bar-fill" :style="{ width: `${g.percent * 100}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }"></div>
          </div>
          <!-- 副信息 -->
          <div class="gauge-sub" :style="{ color: g.color }">
            {{ g.trend > 0 ? '↑' : '↓' }} {{ Math.abs(g.trend) }}% 较上期
          </div>
        </div>
      </div>

      <!-- 底部状态条 -->
      <div class="gauge-footer">
        <div class="footer-item">
          <span class="footer-dot dot-blue"></span>
          <span>系统运行正常</span>
        </div>
        <div class="footer-item">
          <span class="footer-dot dot-green"></span>
          <span>数据同步中</span>
        </div>
        <div class="footer-item footer-right">
          刷新周期: 5s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

interface MetricItem {
  key: string
  icon: string
  label: string
  value: number
  unit: string
  rate: number
}

interface Props {
  trendData?: any
  data?: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const metrics = ref<MetricItem[]>([
  { key: 'sales', icon: '💰', label: '今日销售额', value: 0, unit: '元', rate: 12.5 },
  { key: 'orders', icon: '📦', label: '订单总量', value: 0, unit: '单', rate: 8.3 },
  { key: 'uv', icon: '👥', label: '访客数', value: 0, unit: '人', rate: -3.2 },
  { key: 'conversion', icon: '📈', label: '转化率', value: 0, unit: '%', rate: 5.1 },
])

const gaugeItems = [
  { key: 'target', title: '目标完成率', value: 78.5, max: 100, unit: '%', color: '#1890ff', percent: 0.785, trend: 5.2 },
  { key: 'stock', title: '库存健康度', value: 92.3, max: 100, unit: '%', color: '#a855f7', percent: 0.923, trend: 2.1 },
  { key: 'satisfaction', title: '客户满意度', value: 88.7, max: 100, unit: '%', color: '#10b981', percent: 0.887, trend: -0.8 },
  { key: 'return', title: '退货率控制', value: 3.2, max: 10, unit: '%', color: '#f59e0b', percent: 0.68, trend: -12.5 },
]

// 仪表盘动画数值
const animatedValues = reactive(gaugeItems.map(() => '0.0'))

// 当前时间
const currentTime = ref('')
let timeTimer: ReturnType<typeof setInterval>

// ===== 实时数据流 =====
interface LogEntry {
  id: number
  time: string
  type: 'info' | 'success' | 'warn' | 'action'
  tag: string
  msg: string
}

const visibleLogs = ref<LogEntry[]>([])
let logIdCounter = 0
let streamTimer: ReturnType<typeof setInterval>
const streamRef = ref<HTMLDivElement | null>(null)

const sampleMessages = [
  { tag: 'ORDER',   msg: '新订单 #{{id}} 已创建 · ¥{{amount}}', type: 'info' as const },
  { tag: 'PAY',     msg: '支付成功 #{{id}} · 微信支付', type: 'success' as const },
  { tag: 'STOCK',   msg: '库存预警 · {{sku}} 剩余 {{n}} 件', type: 'warn' as const },
  { tag: 'USER',    msg: '用户 {{uid}} 登录 · {{city}}', type: 'action' as const },
  { tag: 'ORDER',   msg: '订单 #{{id}} 发货完成', type: 'success' as const },
  { tag: 'PAY',     msg: '退款处理 #{{id}} · ¥{{amount}}', type: 'warn' as const },
  { tag: 'TRAFFIC',  msg: '实时在线: {{n}} 人 · QPS: {{qps}}', type: 'info' as const },
  { tag: 'SYSTEM',  msg: '数据同步完成 · 耗时 {{ms}}ms', type: 'success' as const },
  { tag: 'ALERT',   msg: '{{region}} 销量异常 ↑ {{rate}}%', type: 'warn' as const },
  { tag: 'PROMO',   msg: '活动 {{name}} 曝光 +{{n}}', type: 'action' as const },
]

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

function fillTemplate(str: string): string {
  return str
    .replace('{{id}}', String(10000 + rand(1, 99999)))
    .replace('{{amount}}', (rand(10, 9999)).toLocaleString())
    .replace('{{sku}}', `SKU-${String.fromCharCode(65 + rand(0, 25))}${rand(100, 999)}`)
    .replace('{{n}}', rand(3, 999).toString())
    .replace('{{uid}}', `U${rand(10000, 99999)}`)
    .replace('{{city}}', ['北京', '上海', '广州', '深圳', '杭州', '成都'][rand(0, 6)])
    .replace('{{qps}}', String(rand(120, 890)))
    .replace('{{ms}}', String(rand(12, 156)))
    .replace('{{region}}', ['华东', '华南', '华北', '西南'][rand(0, 4)])
    .replace('{{rate}}', (Math.random() * 15 + 2).toFixed(1))
    .replace('{{name}}', ['618返场', '周末特惠', '新品首发'][rand(0, 3)])
}

function getNowTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
}

function pushLog(): void {
  const tpl = sampleMessages[rand(0, sampleMessages.length)]
  const entry: LogEntry = {
    id: ++logIdCounter,
    time: getNowTime(),
    type: tpl.type,
    tag: tpl.tag,
    msg: fillTemplate(tpl.msg),
  }
  visibleLogs.value.push(entry)
  if (visibleLogs.value.length > 8) {
    visibleLogs.value.shift()
  }
  // 自动滚动到底部
  nextTick(() => {
    if (streamRef.value) {
      streamRef.value.scrollTop = streamRef.value.scrollHeight
    }
  })
}

function tagColor(type: string): string {
  const colors: Record<string, string> = {
    info: '#1890ff',
    success: '#10b981',
    warn: '#f59e0b',
    action: '#a855f7',
  }
  return colors[type] || '#1890ff'
}

function updateTime(): void {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${h}:${m}:${s}`
}

function displayValue(val: number): string {
  if (val >= 10000) return val.toLocaleString()
  if (val >= 100) return val.toLocaleString()
  return String(Math.round(val * 10) / 10)
}

function animateNumber(metric: any, target: number): void {
  const start = metric.value as number
  const diff = target - start
  if (Math.abs(diff) < 1) { metric.value = target; return }
  const duration = 800
  const startTime = performance.now()

  function step(currentTime: number): void {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    metric.value = Math.round(start + diff * easeProgress)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

function animateGaugeValues(): void {
  gaugeItems.forEach((g, i) => {
    const start = 0
    const target = g.value
    const duration = 1500
    const delay = i * 200
    const startTime = performance.now() + delay

    function step(now: number): void {
      if (now < startTime) { requestAnimationFrame(step); return }
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      animatedValues[i] = (start + (target - start) * easeProgress).toFixed(1)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  })
}

function updateMetrics(): void {
  const rawTrend = props.trendData?.data || props.data?.trendData?.data || props.data?.data
  if (rawTrend) {
    animateNumber(metrics.value[0], rawTrend.todaySales ?? metrics.value[0].value ?? 800000)
    animateNumber(metrics.value[1], rawTrend.orders ?? metrics.value[1].value ?? 5000)
    animateNumber(metrics.value[2], rawTrend.totalUv ?? metrics.value[2].value ?? 148000)
    animateNumber(metrics.value[3], +(rawTrend.conversionRate ?? metrics.value[3].value ?? 4))
  } else {
    animateNumber(metrics.value[0], 801503)
    animateNumber(metrics.value[1], 6425)
    animateNumber(metrics.value[2], 148689)
    animateNumber(metrics.value[3], 4.12)
  }
}

onMounted(() => {
  updateMetrics()
  animateGaugeValues()
  updateTime()
  timeTimer = setInterval(updateTime, 1000)
  // 启动实时数据流
  for (let i = 0; i < 6; i++) pushLog()
  streamTimer = setInterval(pushLog, 1800)
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
  if (streamTimer) clearInterval(streamTimer)
})
</script>

<style scoped lang="scss">
.live-metrics-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

// ===== 指标卡片 =====
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex-shrink: 0;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(24,144,255,0.08) 0%, rgba(19,194,194,0.04) 100%);
  border: 1px solid rgba(24,144,255,0.15);
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(24,144,255,0.35);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(24,144,255,0.15);
  }

  &.metric-sales { background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03)); border-color: rgba(245,158,11,0.18); &:hover { border-color: rgba(245,158,11,0.4); box-shadow: 0 4px 20px rgba(245,158,11,0.15); } }
  &.metric-orders { background: linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.03)); border-color: rgba(168,85,247,0.18); &:hover { border-color: rgba(168,85,247,0.4); box-shadow: 0 4px 20px rgba(168,85,247,0.15); } }
  &.metric-uv { background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03)); border-color: rgba(16,185,129,0.18); &:hover { border-color: rgba(16,185,129,0.4); box-shadow: 0 4px 20px rgba(16,185,129,0.15); } }
  &.metric-conversion { background: linear-gradient(135deg, rgba(24,144,255,0.08), rgba(19,194,194,0.03)); border-color: rgba(24,144,255,0.18); &:hover { border-color: rgba(24,144,255,0.4); box-shadow: 0 4px 20px rgba(24,144,255,0.15); } }
}

.metric-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
.metric-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.metric-label { font-size: 10px; color: rgba(255,255,255,0.45); letter-spacing: 0.5px; }
.metric-value {
  font-size: 17px; font-weight: 700; color: #fff;
  font-family: 'DIN', 'Consolas', monospace; letter-spacing: 0.5px;
  .metric-unit { font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.4); margin-left: 2px; }
}
.metric-rate {
  display: flex; align-items: center; gap: 2px; font-size: 10px;
  .rate-arrow { font-weight: 600; }
  &.up { .rate-arrow, .rate-num { color: #10b981; } .rate-text { color: rgba(255,255,255,0.25); } }
  &.down { .rate-arrow, .rate-num { color: #ef4444; } .rate-text { color: rgba(255,255,255,0.25); } }
}

// ===== 仪表盘区域 =====
.gauge-section {
  flex: 1;
  min-height: 0;
  background: linear-gradient(160deg, rgba(8,12,35,0.95) 0%, rgba(12,20,45,0.9) 50%, rgba(8,12,35,0.95) 100%);
  border: 1px solid rgba(24,144,255,0.12);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

// 背景装饰层
.gauge-bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(24,144,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(24,144,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(24,144,255,0.25), transparent);
    animation: scan-down 4s linear infinite;
  }

  @keyframes scan-down {
    0% { top: -2px; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.15;
  }

  .glow-orb-1 {
    width: 200px; height: 200px;
    background: #1890ff;
    top: -40px; left: 10%;
    animation: orb-float-1 8s ease-in-out infinite;
  }

  .glow-orb-2 {
    width: 160px; height: 160px;
    background: #a855f7;
    bottom: -30px; right: 15%;
    animation: orb-float-2 10s ease-in-out infinite;
  }

  @keyframes orb-float-1 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 20px); }
  }

  @keyframes orb-float-2 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-20px, -15px); }
  }
}

.gauge-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gauge-title {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 1.5px;
  font-weight: 600;
}

.gauge-pulse {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px #10b981; }
  50% { opacity: 0.4; transform: scale(1.5); box-shadow: 0 0 14px #10b981; }
}

.header-time {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  font-family: 'DIN', 'Consolas', monospace;
  letter-spacing: 1px;
}

// 实时数据流
.data-stream {
  flex-shrink: 0;
  padding: 8px 14px 4px;
  position: relative;
  z-index: 1;
}

.stream-container {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(24,144,255,0.1);
  border-radius: 6px;
  padding: 6px 10px;
  max-height: 110px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(24,144,255,0.2); border-radius: 2px; }
}

.stream-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  font-size: 13px;
  line-height: 1.7;
  animation: log-fade-in 0.3s ease-out;
}

@keyframes log-fade-in {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}

.log-time {
  color: rgba(255,255,255,0.25);
  flex-shrink: 0;
  min-width: 52px;
}

.log-tag {
  flex-shrink: 0;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 0 4px;
  opacity: 0.7;
}

.log-msg {
  color: rgba(255,255,255,0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 各类型日志颜色
.stream-line.log-info .log-msg    { color: rgba(24,144,255,0.65); }
.stream-line.log-success .log-msg { color: rgba(16,185,129,0.7); }
.stream-line.log-warn .log-msg    { color: rgba(245,158,11,0.7); }
.stream-line.log-action .log-msg  { color: rgba(168,85,247,0.65); }

// 仪表盘主体
.gauge-body {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 16px 12px;
  position: relative;
  z-index: 1;
  align-items: center;
}

.gauge-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255,255,255,0.03);
  }
}

.gauge-ring-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}

.gauge-svg {
  width: 100%;
  height: 100%;

  .gauge-ticks {
    stroke: rgba(255,255,255,0.04);
    stroke-dasharray: 2 8;
  }

  .gauge-track {
    stroke: rgba(255,255,255,0.06);
  }

  .gauge-progress {
    transition: stroke-dasharray 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    filter: drop-shadow(0 0 6px currentColor);
  }

  .gauge-dot {
    filter: drop-shadow(0 0 4px currentColor);
    transition: cx 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), cy 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

.gauge-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.gauge-value {
  font-size: 22px;
  font-weight: 700;
  font-family: 'DIN', 'Consolas', monospace;
  text-shadow: 0 0 20px currentColor;
  line-height: 1;
}

.gauge-label {
  font-size: 12px;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.5px;
  font-weight: 500;
}

.gauge-bar-track {
  width: 70%;
  height: 3px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.gauge-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 0 6px currentColor;
}

.gauge-sub {
  font-size: 10px;
  opacity: 0.5;
  font-family: 'DIN', 'Consolas', monospace;
}

// 底部状态条
.gauge-footer {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: rgba(255,255,255,0.3);

  .footer-dot {
    width: 5px; height: 5px; border-radius: 50%;
    &.dot-blue { background: #1890ff; box-shadow: 0 0 5px #1890ff; }
    &.dot-green { background: #10b981; box-shadow: 0 0 5px #10b981; animation: pulse-glow 2s ease-in-out infinite; }
  }
}

.footer-right {
  margin-left: auto;
}
</style>
