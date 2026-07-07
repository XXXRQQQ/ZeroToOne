// 产品分类占比 + 排行榜数据 Mock

// 产品分类占比（环形图）
export function mockCategoryData() {
  return {
    code: 200,
    data: [
      { name: '智能手机', value: 35.2 },
      { name: '笔记本电脑', value: 22.8 },
      { name: '智能穿戴', value: 15.6 },
      { name: '平板电脑', value: 12.4 },
      { name: '配件周边', value: 8.5 },
      { name: '其他', value: 5.5 },
    ],
    message: 'success',
    timestamp: Date.now(),
  }
}

// 排行榜数据
export function mockRankData() {
  const items = [
    { name: 'iPhone 16 Pro Max', value: 12560, rate: 18.5 },
    { name: 'MacBook Pro 16"', value: 10980, rate: 12.3 },
    { name: 'Apple Watch Ultra 2', value: 8765, rate: -3.2 },
    { name: 'iPad Air M2', value: 7654, rate: 8.7 },
    { name: 'AirPods Pro 3', value: 6543, rate: 15.3 },
    { name: 'Samsung Galaxy S25', value: 5432, rate: -1.5 },
    { name: '华为 MateBook X Pro', value: 4321, rate: 5.8 },
    { name: 'Xiaomi 15 Ultra', value: 3210, rate: 22.1 },
    { name: 'Surface Pro 11', value: 2198, rate: -7.4 },
    { name: 'OPPO Find X8 Pro', value: 1876, rate: 3.6 },
  ]

  return {
    code: 200,
    data: items,
    message: 'success',
    timestamp: Date.now(),
  }
}
