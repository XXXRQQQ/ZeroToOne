// 地区分布数据 Mock（用于柱状图）
export function mockMapData() {
  const provinces = [
    { name: '广东', value: 12560 },
    { name: '江苏', value: 11080 },
    { name: '浙江', value: 9840 },
    { name: '山东', value: 8920 },
    { name: '北京', value: 8560 },
    { name: '上海', value: 8230 },
    { name: '四川', value: 6750 },
    { name: '河南', value: 6120 },
    { name: '湖北', value: 5780 },
    { name: '福建', value: 5340 },
    { name: '湖南', value: 4890 },
    { name: '安徽', value: 4520 },
  ]

  return {
    code: 200,
    data: provinces,
    message: 'success',
    timestamp: Date.now(),
  }
}
