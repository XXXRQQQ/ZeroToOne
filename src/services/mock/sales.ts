// 销售数据 Mock
export function mockSalesData() {
  const categories = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  const data = categories.map((month, i) => ({
    month,
    value: Math.floor(Math.random() * 5000) + 3000,
    target: 5000,
    rate: Math.floor(Math.random() * 30) + 70,
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
