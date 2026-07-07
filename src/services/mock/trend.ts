// 实时指标数据 Mock
export function mockTrendData() {
  const totalPv = Math.floor(Math.random() * 50000) + 180000
  const totalUv = Math.floor(totalPv * (0.5 + Math.random() * 0.2))
  const todaySales = Math.floor(Math.random() * 300000) + 800000
  const orders = Math.floor(Math.random() * 2000) + 5000
  const conversionRate = +(Math.random() * 3 + 2.5).toFixed(2)
  const onlineUsers = Math.floor(Math.random() * 3000) + 8000

  return {
    code: 200,
    data: {
      totalPv,
      totalUv,
      todaySales,
      orders,
      conversionRate,
      onlineUsers,
    },
    message: 'success',
    timestamp: Date.now(),
  }
}
