// 实时告警/事件数据 Mock
export function mockAlertsData() {
  const alertTypes = ['warning', 'error', 'info', 'success'] as const
  const systems = ['订单系统', '支付网关', '物流服务', '用户中心', '库存管理', '营销平台', '数据分析', '消息推送']

  const alertTemplates = [
    { title: '订单超时未支付', level: 'warning' as const, system: '订单系统' },
    { title: '支付回调异常', level: 'error' as const, system: '支付网关' },
    { title: '库存低于安全线', level: 'warning' as const, system: '库存管理' },
    { title: '服务器 CPU 使用率过高', level: 'error' as const, system: '数据分析' },
    { title: '物流信息更新延迟', level: 'warning' as const, system: '物流服务' },
    { title: '用户注册量激增', level: 'info' as const, system: '用户中心' },
    { title: '营销活动数据同步完成', level: 'success' as const, system: '营销平台' },
    { title: '数据库连接池接近上限', level: 'error' as const, system: '数据分析' },
    { title: '消息推送到达率下降', level: 'warning' as const, system: '消息推送' },
    { title: '第三方物流接口超时', level: 'error' as const, system: '物流服务' },
    { title: '优惠券领取量达到阈值', level: 'info' as const, system: '营销平台' },
    { title: '系统自动扩容完成', level: 'success' as const, system: '数据分析' },
  ]

  const now = Date.now()
  const alerts = alertTemplates.map((template, index) => ({
    id: `alert-${index + 1}`,
    ...template,
    time: new Date(now - (index * 30000 + Math.floor(Math.random() * 60000))).toISOString(),
    count: Math.floor(Math.random() * 50) + 1,
    description: `${template.system}发生${template.title}事件，已触发告警通知`,
  }))

  // 按时间倒序
  alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return {
    code: 200,
    data: {
      total: alerts.length,
      unread: Math.floor(Math.random() * 5) + 2,
      list: alerts,
    },
    message: 'success',
    timestamp: Date.now(),
  }
}
