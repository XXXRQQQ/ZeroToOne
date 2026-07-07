// 月度销售数据 Mock
export function mockSalesData() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  const baseValue = 3200
  const data = months.map((month, i) => ({
    month,
    value: Math.floor(baseValue + Math.sin(i * 0.5) * 1500 + Math.random() * 800),
    target: 5000,
    rate: Math.floor(Math.random() * 20) + 80,
  }))

  return {
    code: 200,
    data: {
      total: data.reduce((sum, item) => sum + item.value, 0),
      unit: '万元',
      list: data,
    },
    message: 'success',
    timestamp: Date.now(),
  }
}
