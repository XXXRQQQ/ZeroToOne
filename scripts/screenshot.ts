/**
 * 自动化截图脚本
 * 使用 Playwright 打开数据大屏并自动截图
 *
 * 使用方法：
 *   npx tsx scripts/screenshot.ts
 *
 * 生成截图保存在 screenshots/ 目录下
 */

import { chromium } from 'playwright'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const screenshotDir = resolve(__dirname, '..', 'screenshots')

// 确保截图目录存在
if (!existsSync(screenshotDir)) {
  mkdirSync(screenshotDir, { recursive: true })
}

interface ScreenshotConfig {
  name: string
  width: number
  height: number
  fullPage?: boolean
  delay?: number
  description: string
}

const screenshots: ScreenshotConfig[] = [
  {
    name: 'dashboard-full',
    width: 1920,
    height: 1080,
    description: '数据大屏全貌（1920x1080）',
  },
  {
    name: 'dashboard-1600x900',
    width: 1600,
    height: 900,
    description: '数据大屏（1600x900）',
  },
  {
    name: 'dashboard-1366x768',
    width: 1366,
    height: 768,
    description: '数据大屏（1366x768）',
  },
]

async function main() {
  console.log('🚀 启动浏览器...\n')

  const browser = await chromium.launch({
    headless: true,
  })

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  for (const config of screenshots) {
    console.log(`📸 截图: ${config.name} — ${config.description}`)

    const context = await browser.newContext({
      viewport: { width: config.width, height: config.height },
      deviceScaleFactor: 1,
    })

    const page = await context.newPage()

    try {
      // 访问大屏页面
      await page.goto(baseUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // 等待页面渲染完成（ECharts 动画等）
      if (config.delay) {
        await page.waitForTimeout(config.delay)
      } else {
        // 默认等待 3 秒让图表动画播放完毕
        await page.waitForTimeout(3000)
      }

      // 截图
      const filePath = resolve(screenshotDir, `${config.name}.png`)
      await page.screenshot({
        path: filePath,
        fullPage: config.fullPage ?? false,
      })

      console.log(`   ✅ 已保存: screenshots/${config.name}.png`)
    } catch (error) {
      console.error(`   ❌ 截图失败: ${config.name}`, error)
    } finally {
      await context.close()
    }
  }

  await browser.close()

  console.log('\n✨ 所有截图完成！')
  console.log(`📁 截图保存在: ${screenshotDir}`)
  console.log('\n💡 提示: 将这些截图放入项目文档中可增强展示效果。')
}

main().catch((error) => {
  console.error('截图脚本执行失败:', error)
  process.exit(1)
})
