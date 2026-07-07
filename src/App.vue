<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/useAppStore'
import { logger } from '@/utils/logger'

const appStore = useAppStore()

// 初始化应用
appStore.initApp()

logger.debug('App 组件挂载完成')
</script>
