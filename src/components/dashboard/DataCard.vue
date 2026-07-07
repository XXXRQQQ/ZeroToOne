<template>
  <div class="data-card">
    <div class="data-card-header">
      <span class="data-card-title">{{ title }}</span>
    </div>
    <div class="data-card-body">
      <template v-if="loading">
        <div class="data-card-loading">加载中...</div>
      </template>
      <template v-else>
        <span class="data-card-value">{{ formatNumber(value) }}</span>
        <span class="data-card-unit">{{ unit }}</span>
      </template>
    </div>
    <div class="data-card-footer">
      <span class="data-card-rate" :class="rateClass" v-if="rate !== undefined">
        {{ formatPercent(rate) }}
      </span>
      <span class="data-card-desc" v-if="desc">{{ desc }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber, formatPercent } from '@/utils/format'

interface Props {
  title: string
  value: number
  unit?: string
  rate?: number
  desc?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  loading: false,
})

const rateClass = computed(() => {
  if (props.rate === undefined) return ''
  return props.rate >= 0 ? 'rate-up' : 'rate-down'
})
</script>

<style scoped lang="scss">
.data-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.3s;

  &:hover {
    border-color: var(--color-primary);
  }
}

.data-card-header {
  margin-bottom: 12px;
}

.data-card-title {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.data-card-body {
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.data-card-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  font-family: 'DIN', 'Arial', monospace;
}

.data-card-unit {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.data-card-loading {
  font-size: 24px;
  color: var(--color-text-secondary);
}

.data-card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-card-rate {
  font-size: 12px;
  font-weight: 600;

  &.rate-up {
    color: var(--color-success);
  }

  &.rate-down {
    color: var(--color-danger);
  }
}

.data-card-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
