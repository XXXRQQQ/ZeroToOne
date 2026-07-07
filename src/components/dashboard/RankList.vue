<template>
  <div class="rank-list">
    <div class="rank-loading" v-if="loading">加载中...</div>
    <div class="rank-empty" v-else-if="!list.length">暂无数据</div>
    <div
      v-for="(item, index) in list"
      :key="item.name"
      class="rank-item"
    >
      <span class="rank-index" :class="getRankClass(index)">
        {{ index + 1 }}
      </span>
      <span class="rank-name">{{ item.name }}</span>
      <span class="rank-value">{{ formatNumber(item.value) }}</span>
      <span
        class="rank-rate"
        :class="item.rate >= 0 ? 'rate-up' : 'rate-down'"
      >
        {{ formatPercent(item.rate) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RankItem } from '@/types/data'
import { formatNumber, formatPercent } from '@/utils/format'

interface Props {
  data: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

import { computed } from 'vue'

// 兼容 dataAdapter 返回的数据结构
const list = computed(() => {
  const raw = props.data
  if (!raw) return []
  return Array.isArray(raw) ? raw : raw?.data || []
})

function getRankClass(index: number): string {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return ''
}
</script>

<style scoped lang="scss">
.rank-list {
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(24, 144, 255, 0.1);
  }
}

.rank-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 12px;

  &.rank-gold { background: rgba(250, 173, 20, 0.3); color: #faad14; }
  &.rank-silver { background: rgba(192, 192, 192, 0.3); color: #c0c0c0; }
  &.rank-bronze { background: rgba(205, 127, 50, 0.3); color: #cd7f32; }
}

.rank-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
}

.rank-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  margin-right: 12px;
  font-family: 'DIN', 'Arial', monospace;
}

.rank-rate {
  font-size: 12px;

  &.rate-up { color: var(--color-success); }
  &.rate-down { color: var(--color-danger); }
}

.rank-loading,
.rank-empty {
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
  font-size: 14px;
}
</style>
