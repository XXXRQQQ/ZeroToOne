<template>
  <div class="data-card">
    <div class="card-icon" v-if="icon">{{ icon }}</div>
    <div class="card-info">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">
        <span class="value-num" ref="numRef">{{ displayValue }}</span>
        <span class="value-unit" v-if="unit">{{ unit }}</span>
      </div>
      <div class="card-footer">
        <span class="card-rate" :class="rate >= 0 ? 'up' : 'down'" v-if="rate !== undefined">
          {{ rate >= 0 ? '↑' : '↓' }} {{ Math.abs(rate) }}%
        </span>
        <span class="card-desc" v-if="desc">{{ desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { formatNumber } from '@/utils/format'

interface Props {
  title: string
  value: number
  unit?: string
  rate?: number
  desc?: string
  icon?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  loading: false,
})

const numRef = ref<HTMLElement | null>(null)
const displayValue = ref('0')

// 数字滚动动画
function animateNumber(from: number, to: number, duration: number = 800) {
  const start = performance.now()
  function step(timestamp: number) {
    const progress = Math.min((timestamp - start) / duration, 1)
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    const current = Math.floor(from + (to - from) * eased)
    displayValue.value = formatNumber(current)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

let prevValue = 0

watch(
  () => props.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      animateNumber(oldVal || 0, newVal)
      prevValue = newVal
    }
  }
)

onMounted(() => {
  if (props.value > 0) {
    animateNumber(0, props.value, 1000)
    prevValue = props.value
  }
})
</script>

<style scoped lang="scss">
.data-card {
  background: linear-gradient(135deg, rgba(10, 18, 48, 0.9) 0%, rgba(15, 30, 70, 0.6) 100%);
  border: 1px solid rgba(24, 144, 255, 0.25);
  border-radius: 6px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.6), transparent);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 20%, rgba(24, 144, 255, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(24, 144, 255, 0.5);
    box-shadow: 0 0 20px rgba(24, 144, 255, 0.15);
    transform: translateY(-2px);
  }
}

.card-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.card-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.value-num {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'DIN', 'Arial', 'Helvetica Neue', monospace;
  letter-spacing: 1px;
  line-height: 1.1;
}

.value-unit {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-rate {
  font-size: 12px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;

  &.up {
    color: #52c41a;
    background: rgba(82, 196, 26, 0.1);
  }

  &.down {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.1);
  }
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
