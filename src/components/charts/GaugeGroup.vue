<template>
  <div class="gauge-group-wrapper">
    <div class="gauges-grid">
      <div v-for="item in gauges" :key="item.key" class="gauge-item" :class="`gauge-${item.key}`">
        <!-- 环形进度条 -->
        <svg class="gauge-ring" viewBox="0 0 120 120">
          <circle
            class="ring-bg"
            cx="60" cy="60" r="50"
            fill="none"
            stroke-width="10"
          />
          <circle
            class="ring-progress"
            cx="60" cy="60" r="50"
            fill="none"
            :stroke-width="10"
            :stroke-dasharray="`${item.percent * 3.14159 * 2} 314.159`}"
            :style="{ stroke: item.color }"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <!-- 中心数值 -->
        <div class="gauge-center">
          <span class="gauge-value">{{ animatedValues[item.key] ?? 0 }}</span>
          <span class="gauge-unit">{{ item.unit }}</span>
        </div>
        <!-- 标题 -->
        <div class="gauge-title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Props {
  data?: any
  loading?: boolean
}

defineProps<Props>()

interface GaugeItem {
  key: string
  title: string
  value: number
  max: number
  unit: string
  color: string
}

const gauges: GaugeItem[] = [
  { key: 'target', title: '目标完成率', value: 78.5, max: 100, unit: '%', color: '#1890ff' },
  { key: 'stock', title: '库存健康度', value: 92.3, max: 100, unit: '%', color: '#a855f7' },
  { key: 'satisfaction', title: '客户满意度', value: 88.7, max: 100, unit: '%', color: '#10b981' },
  { key: 'return', title: '退货率控制', value: 3.2, max: 10, unit: '%', color: '#f59e0b' },
]

// 计算百分比（反向：退货率越低越好）
const gaugesWithPercent = gauges.map((g) => ({
  ...g,
  percent: g.key === 'return'
    ? Math.min(1, (g.max - g.value) / g.max) // 退货率低=好，显示剩余空间
    : Math.min(1, g.value / g.max),
}))

const animatedValues = reactive<Record<string, number>>({
  target: 0,
  stock: 0,
  satisfaction: 0,
  return: 0,
})

function animateValue(key: string, target: number, decimals: number): void {
  const start = animatedValues[key] || 0
  const diff = target - start
  if (Math.abs(diff) < 0.01) { animatedValues[key] = target; return }
  const duration = 1500
  const startTime = performance.now()

  function step(now: number): void {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    animatedValues[key] = +(start + diff * ease).toFixed(decimals)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  // 延迟启动动画，让用户看到数字跳动效果
  setTimeout(() => {
    for (const g of gaugesWithPercent) {
      animateValue(g.key, g.value, g.unit === '%' ? 1 : 0)
    }
  }, 300)
})
</script>

<style scoped lang="scss">
.gauge-group-wrapper {
  width: 100%;
  height: 100%;
  padding: 4px;
  box-sizing: border-box;
}

.gauges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  height: 100%;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  background: radial-gradient(circle at 50% 40%, var(--glow, rgba(24,144,255,0.08)) 0%, transparent 70%);
  border-radius: 8px;

  .gauge-ring {
    width: 70px;
    height: 70px;
    flex-shrink: 0;

    .ring-bg {
      stroke: rgba(255, 255, 255, 0.06);
    }

    .ring-progress {
      filter: drop-shadow(0 0 4px currentColor);
      transition: stroke-dasharray 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  .gauge-center {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .gauge-value {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      font-family: 'DIN', 'Consolas', monospace;
      line-height: 1;
    }

    .gauge-unit {
      font-size: 9px;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .gauge-title {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
}

.gauge-target { --glow: rgba(24, 144, 255, 0.15); }
.gauge-stock { --glow: rgba(168, 85, 247, 0.15); }
.gauge-satisfaction { --glow: rgba(16, 185, 129, 0.15); }
.gauge-return { --glow: rgba(245, 158, 11, 0.15); }

.gauge-item:hover .ring-progress {
  filter: drop-shadow(0 0 8px currentColor);
}
</style>
