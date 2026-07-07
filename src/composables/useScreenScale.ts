// 大屏自适应缩放组合式函数
import { ref, onMounted, onUnmounted } from 'vue'

interface ScaleOptions {
  /** 设计稿宽度 */
  width?: number
  /** 设计稿高度 */
  height?: number
  /** 缩放模式: 'scale' | 'fitWidth' | 'fitHeight' | 'full' */
  mode?: 'scale' | 'fitWidth' | 'fitHeight' | 'full'
}

export function useScreenScale(options: ScaleOptions = {}) {
  const {
    width = 1920,
    height = 1080,
    mode = 'scale',
  } = options

  const scale = ref<number>(1)
  const screenWidth = ref<number>(0)
  const screenHeight = ref<number>(0)

  let resizeObserver: ResizeObserver | null = null

  function calcScale(): void {
    const clientWidth = document.documentElement.clientWidth
    const clientHeight = document.documentElement.clientHeight

    screenWidth.value = clientWidth
    screenHeight.value = clientHeight

    const scaleX = clientWidth / width
    const scaleY = clientHeight / height

    switch (mode) {
      case 'fitWidth':
        scale.value = scaleX
        break
      case 'fitHeight':
        scale.value = scaleY
        break
      case 'full':
        scale.value = Math.max(scaleX, scaleY)
        break
      case 'scale':
      default:
        scale.value = Math.min(scaleX, scaleY)
        break
    }
  }

  onMounted(() => {
    calcScale()
    resizeObserver = new ResizeObserver(calcScale)
    resizeObserver.observe(document.documentElement)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  return {
    scale,
    screenWidth,
    screenHeight,
  }
}
