<template>
  <div class="alert-flow-wrapper">
    <!-- 顶部摘要 -->
    <div class="alert-summary">
      <div class="summary-item summary-total">
        <span class="summary-label">告警总数</span>
        <span class="summary-value">{{ total }}</span>
      </div>
      <div class="summary-item summary-unread">
        <span class="summary-label">未处理</span>
        <span class="summary-value unread">{{ unread }}</span>
        <span class="summary-dot" v-if="unread > 0"></span>
      </div>
    </div>

    <!-- 告警滚动列表 -->
    <div class="alert-list" ref="listRef" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
      <div class="alert-list-inner" ref="innerRef">
        <div
          v-for="item in alerts"
          :key="item.id"
          class="alert-item"
          :class="`alert-${item.level}`"
          @click="handleAlertClick(item)"
        >
          <span class="alert-icon">{{ getLevelIcon(item.level) }}</span>
          <div class="alert-body">
            <div class="alert-header">
              <span class="alert-tag" :class="`tag-${item.level}`">{{ getLevelLabel(item.level) }}</span>
              <span class="alert-system">{{ item.system }}</span>
              <span class="alert-count" v-if="item.count > 1">×{{ item.count }}</span>
            </div>
            <div class="alert-title">{{ item.title }}</div>
            <div class="alert-time">{{ formatTime(item.time) }}</div>
          </div>
        </div>
      </div>
      <!-- 无缝循环：复制一份 -->
      <div class="alert-list-inner" aria-hidden="true">
        <div
          v-for="item in alerts"
          :key="`dup-${item.id}`"
          class="alert-item"
          :class="`alert-${item.level}`"
        >
          <span class="alert-icon">{{ getLevelIcon(item.level) }}</span>
          <div class="alert-body">
            <div class="alert-header">
              <span class="alert-tag" :class="`tag-${item.level}`">{{ getLevelLabel(item.level) }}</span>
              <span class="alert-system">{{ item.system }}</span>
              <span class="alert-count" v-if="item.count > 1">×{{ item.count }}</span>
            </div>
            <div class="alert-title">{{ item.title }}</div>
            <div class="alert-time">{{ formatTime(item.time) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 点击告警详情弹窗 -->
    <Teleport to="body">
      <div class="alert-detail-overlay" v-if="selectedAlert" @click="selectedAlert = null">
        <div class="alert-detail-panel" @click.stop>
          <div class="detail-header">
            <span class="alert-icon large">{{ getLevelIcon(selectedAlert.level) }}</span>
            <div>
              <div class="detail-title">{{ selectedAlert.title }}</div>
              <div class="detail-system">{{ selectedAlert.system }}</div>
            </div>
            <button class="detail-close" @click="selectedAlert = null">✕</button>
          </div>
          <div class="detail-body">
            <div class="detail-row">
              <span class="detail-label">告警级别</span>
              <span class="detail-value" :class="`tag-${selectedAlert.level}`">{{ getLevelLabel(selectedAlert.level) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">发生时间</span>
              <span class="detail-value">{{ formatTime(selectedAlert.time) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">触发次数</span>
              <span class="detail-value">{{ selectedAlert.count }} 次</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">描述</span>
              <span class="detail-value detail-desc">{{ selectedAlert.description }}</span>
            </div>
          </div>
          <div class="detail-footer">
            <button class="btn btn-acknowledge" @click="handleAcknowledge">确认处理</button>
            <button class="btn btn-ignore" @click="selectedAlert = null">忽略</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { formatTime } from '@/utils/format'

interface AlertItem {
  id: string
  title: string
  level: 'warning' | 'error' | 'info' | 'success'
  system: string
  time: string
  count: number
  description: string
}

interface Props {
  data: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const alerts = computed<AlertItem[]>(() => {
  const raw = props.data
  if (!raw) return []
  return Array.isArray(raw?.data?.list) ? raw.data.list : []
})

const total = computed(() => {
  const raw = props.data
  return raw?.data?.total || 0
})

const unread = computed(() => {
  const raw = props.data
  return raw?.data?.unread || 0
})

function getLevelIcon(level: string): string {
  const icons: Record<string, string> = {
    error: '🔴',
    warning: '🟡',
    info: '🔵',
    success: '🟢',
  }
  return icons[level] || '⚪'
}

function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    error: '严重',
    warning: '警告',
    info: '提示',
    success: '正常',
  }
  return labels[level] || level
}

// 滚动控制
const listRef = ref<HTMLElement | null>(null)
let scrollAnimationId: number | null = null
let isPaused = false

function pauseScroll() {
  isPaused = true
}

function resumeScroll() {
  isPaused = false
}

function autoScroll() {
  const el = listRef.value
  if (!el) return

  if (!isPaused) {
    el.scrollTop += 0.5
    // 无缝循环：滚动到一半时重置
    if (el.scrollTop >= el.scrollHeight / 2) {
      el.scrollTop = 0
    }
  }
  scrollAnimationId = requestAnimationFrame(autoScroll)
}

onMounted(() => {
  scrollAnimationId = requestAnimationFrame(autoScroll)
})

onUnmounted(() => {
  if (scrollAnimationId) cancelAnimationFrame(scrollAnimationId)
})

// 告警详情弹窗
const selectedAlert = ref<AlertItem | null>(null)

function handleAlertClick(item: AlertItem) {
  selectedAlert.value = item
}

function handleAcknowledge() {
  selectedAlert.value = null
}
</script>

<style scoped lang="scss">
.alert-flow-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

// ===== 摘要区 =====
.alert-summary {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.summary-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(24, 144, 255, 0.06);
  border: 1px solid rgba(24, 144, 255, 0.12);
  border-radius: 4px;
}

.summary-total {
  border-color: rgba(24, 144, 255, 0.2);
}

.summary-unread {
  border-color: rgba(245, 158, 11, 0.2);
  background: rgba(245, 158, 11, 0.06);
}

.summary-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  font-family: 'DIN', 'Consolas', monospace;

  &.unread {
    color: #f59e0b;
  }
}

.summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  animation: pulse-dot 1.5s infinite;
  margin-left: auto;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.3); }
}

// ===== 滚动列表 =====
.alert-list {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
  mask-image: linear-gradient(180deg, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
}

.alert-list-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(10, 15, 40, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(24, 144, 255, 0.08);
    border-color: rgba(24, 144, 255, 0.25);
    transform: translateX(2px);
  }

  &.alert-error {
    border-left: 2px solid #ef4444;
  }
  &.alert-warning {
    border-left: 2px solid #f59e0b;
  }
  &.alert-info {
    border-left: 2px solid #1890ff;
  }
  &.alert-success {
    border-left: 2px solid #10b981;
  }
}

.alert-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-body {
  flex: 1;
  min-width: 0;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.alert-tag {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 2px;
  font-weight: 600;

  &.tag-error {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
  &.tag-warning {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  &.tag-info {
    background: rgba(24, 144, 255, 0.15);
    color: #1890ff;
  }
  &.tag-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
}

.alert-system {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
}

.alert-count {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  margin-left: auto;
}

.alert-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  margin-top: 1px;
}

// ===== 详情弹窗 =====
.alert-detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.alert-detail-panel {
  width: 440px;
  background: rgba(15, 20, 50, 0.98);
  border: 1px solid rgba(24, 144, 255, 0.25);
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .alert-icon.large {
    font-size: 28px;
  }
}

.detail-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.detail-system {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

.detail-close {
  margin-left: auto;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.detail-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.detail-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
  width: 60px;
}

.detail-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);

  &.detail-desc {
    line-height: 1.6;
  }
}

.detail-footer {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  justify-content: flex-end;
}

.btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.btn-acknowledge {
    background: rgba(24, 144, 255, 0.2);
    color: #1890ff;
    border: 1px solid rgba(24, 144, 255, 0.3);

    &:hover {
      background: rgba(24, 144, 255, 0.3);
    }
  }

  &.btn-ignore {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
}
</style>
