// 趋势数据 Mock
export function mockTrendData() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

  const data = hours.map((hour) => ({
    time: hour,
    pv: Math.floor(Math.random() * 3000) + 1000,
    uv: Math.floor(Math.random() * 1500) + 500,
  }))

  return {
    code: 200,
    data: {
      totalPv: data.reduce((sum, item) => sum + item.pv, 0),
      totalUv: data.reduce((sum, item) => sum + item.uv, 0),
      list: data,
    },
    message: 'success',
    timestamp: Date.now(),
  }
}
