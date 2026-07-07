<template>
  <div class="demo-container">
    <h1>演示大屏页面</h1>
    <p>此页面用于展示不同的大屏布局方案（待开发）</p>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
logger.info('演示大屏页面加载')
</script>

<style scoped lang="scss">
.demo-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  color: var(--color-text);
}
</style>
