// 排行榜数据 Mock
export function mockRankData() {
  const items = [
    { name: '产品 A', value: 9843, rate: 12.5 },
    { name: '产品 B', value: 8765, rate: -3.2 },
    { name: '产品 C', value: 7654, rate: 8.7 },
    { name: '产品 D', value: 6543, rate: 15.3 },
    { name: '产品 E', value: 5432, rate: -1.5 },
    { name: '产品 F', value: 4321, rate: 5.8 },
    { name: '产品 G', value: 3210, rate: 22.1 },
    { name: '产品 H', value: 2198, rate: -7.4 },
    { name: '产品 I', value: 1876, rate: 3.6 },
    { name: '产品 J', value: 1234, rate: 18.9 },
  ]

  return {
    code: 200,
    data: items,
    message: 'success',
    timestamp: Date.now(),
  }
}
