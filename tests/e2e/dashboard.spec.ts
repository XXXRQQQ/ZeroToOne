// E2E 测试 - 大屏页面基础功能
import { test, expect } from '@playwright/test'

test.describe('从零到一数据大屏 E2E', () => {
  test('应该成功加载首页', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('从零到一数据大屏')
  })

  test('首页应该显示标题', async ({ page }) => {
    await page.goto('/')
    const title = page.locator('.dashboard-title')
    await expect(title).toBeVisible()
    await expect(title).toHaveText('从零到一数据大屏')
  })

  test('首页应该显示数据源标识', async ({ page }) => {
    await page.goto('/')
    const badge = page.locator('.data-source-badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('数据源: Mock')
  })
})
