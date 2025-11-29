import Mock from 'mockjs'
import type { LiveStreamingRealtimeData, LiveStreamingChartData, LiveStreamingWarning } from '@/types/live-streaming'

// 生成实时数据
const generateRealtimeData = (): LiveStreamingRealtimeData => {
  return {
    onlineUsers: Mock.Random.integer(8000, 20000),
    totalViews: Mock.Random.integer(300000, 600000),
    salesAmount: Mock.Random.float(500000, 1200000, 2, 2),
    orderCount: Mock.Random.integer(2000, 5000),
    avgOrderValue: Mock.Random.float(200, 350, 1, 1),
    conversionRate: Mock.Random.float(2.5, 5.5, 1, 1),
  }
}

// 生成趋势数据
const generateTrendData = (type: string, count: number = 24): LiveStreamingChartData[] => {
  const data: LiveStreamingChartData[] = []
  const now = new Date()

  for (let i = count - 1; i >= 0; i -= 1) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:00`

    let item: LiveStreamingChartData

    switch (type) {
      case 'online':
        item = {
          time: timeStr,
          value: Mock.Random.integer(5000, 25000),
          onlineUsers: Mock.Random.integer(5000, 25000),
        }
        break
      case 'sales':
        item = {
          time: timeStr,
          value: Mock.Random.float(20000, 80000, 2, 2),
          onlineUsers: Mock.Random.integer(5000, 25000),
          salesAmount: Mock.Random.float(20000, 80000, 2, 2),
        }
        break
      default:
        item = {
          time: timeStr,
          value: Mock.Random.integer(1000, 10000),
        }
    }

    data.push(item)
  }

  return data
}

// 生成商品销量数据
const generateProductSalesData = (): LiveStreamingChartData[] => {
  const products = [
    'iPhone 15 Pro',
    '华为Mate60',
    '小米14',
    'MacBook Pro',
    'iPad Air',
    'AirPods Pro',
    '华为手表',
    '小米手环',
    '戴森吹风机',
    'SK-II神仙水',
    '兰蔻面霜',
    '雅诗兰黛精华',
    '耐克运动鞋',
    '阿迪达斯外套',
    '优衣库T恤',
  ]

  return products
    .map((name) => ({
      name,
      value: Mock.Random.integer(50, 500),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
}

// 生成用户画像数据
const generateUserProfileData = (): LiveStreamingChartData[] => {
  const profiles = [
    { name: '18-25岁女性', value: 35 },
    { name: '26-35岁女性', value: 28 },
    { name: '18-25岁男性', value: 15 },
    { name: '26-35岁男性', value: 12 },
    { name: '36-45岁女性', value: 6 },
    { name: '45岁以上', value: 4 },
  ]

  return profiles
}

// 生成主播表现数据
const generateStreamerPerformanceData = (): LiveStreamingChartData[] => {
  const streamers = ['张主播', '李主播', '王主播', '刘主播', '陈主播']

  return streamers.map((name) => ({
    name,
    salesAmount: Mock.Random.float(100000, 300000, 2, 2),
    orderCount: Mock.Random.integer(800, 2000),
    viewers: Mock.Random.integer(15000, 35000),
    conversionRate: Mock.Random.float(2.0, 6.0, 1, 1),
    avgOrderValue: Mock.Random.float(180, 320, 1, 1),
    liveDuration: Mock.Random.integer(120, 480),
  }))
}

// 生成异常预警数据
const generateWarningData = (): LiveStreamingWarning[] => {
  const warnings = [
    {
      id: 1,
      type: 'warning' as const,
      message: '转化率偏低，当前转化率低于行业平均水平',
      timestamp: Date.now() - 5 * 60 * 1000,
    },
    {
      id: 2,
      type: 'error' as const,
      message: '库存不足，热销商品库存低于安全线',
      timestamp: Date.now() - 15 * 60 * 1000,
    },
    {
      id: 3,
      type: 'info' as const,
      message: '新用户注册量激增，建议增加服务器资源',
      timestamp: Date.now() - 30 * 60 * 1000,
    },
  ]

  return warnings
}

// Mock API 接口
Mock.mock('/api/live-streaming/realtime', 'get', () => {
  return {
    code: 200,
    data: generateRealtimeData(),
    message: 'success',
  }
})

Mock.mock('/api/live-streaming/online-trend', 'get', () => {
  return {
    code: 200,
    data: generateTrendData('online'),
    message: 'success',
  }
})

Mock.mock('/api/live-streaming/sales-trend', 'get', () => {
  return {
    code: 200,
    data: generateTrendData('sales'),
    message: 'success',
  }
})

Mock.mock('/api/live-streaming/product-sales', 'get', () => {
  return {
    code: 200,
    data: generateProductSalesData(),
    message: 'success',
  }
})

Mock.mock('/api/live-streaming/user-profile', 'get', () => {
  return {
    code: 200,
    data: generateUserProfileData(),
    message: 'success',
  }
})

Mock.mock('/api/live-streaming/streamer-performance', 'get', () => {
  return {
    code: 200,
    data: generateStreamerPerformanceData(),
    message: 'success',
  }
})

Mock.mock('/api/live-streaming/warnings', 'get', () => {
  const warnings = []
  const types = ['warning', 'error', 'info']
  const messages = [
    '转化率低于预期，当前转化率仅2.1%',
    '商品库存不足，请及时补货',
    '直播间在线人数异常下降',
    '支付成功率较低，请检查支付通道',
    '用户投诉率上升，请关注服务质量',
  ]

  const warningCount = Mock.Random.integer(3, 8)
  for (let i = 0; i < warningCount; i += 1) {
    warnings.push({
      id: i + 1,
      type: Mock.Random.pick(types),
      message: Mock.Random.pick(messages),
      timestamp: Date.now() - Mock.Random.integer(0, 3600000),
    })
  }

  return {
    code: 200,
    data: warnings,
    message: 'success',
  }
})

// 实时趋势数据（用于数据下钻）
Mock.mock('/api/live-streaming/realtime-trend', 'get', () => {
  const data = []
  const now = new Date()

  for (let i = 59; i >= 0; i -= 1) {
    const time = new Date(now.getTime() - i * 60000)
    data.push({
      time: time.toLocaleTimeString(),
      value: Mock.Random.integer(8000, 15000),
      sales: Mock.Random.float(1000, 5000, 2, 2),
    })
  }

  return {
    code: 200,
    data,
    message: 'success',
  }
})

// 实时销售数据（用于数据下钻）
Mock.mock('/api/live-streaming/realtime-sales', 'get', () => {
  const data = []
  const now = new Date()

  for (let i = 59; i >= 0; i -= 1) {
    const time = new Date(now.getTime() - i * 60000)
    data.push({
      time: time.toLocaleTimeString(),
      value: Mock.Random.float(2000, 8000, 2, 2),
      orders: Mock.Random.integer(50, 200),
    })
  }

  return {
    code: 200,
    data,
    message: 'success',
  }
})

// 实时商品数据（用于数据下钻）
Mock.mock('/api/live-streaming/realtime-products', 'get', () => {
  const products = []
  const productNames = ['iPhone 15', '华为P60', '小米13', 'MacBook Pro', 'AirPods', '华为手表', '小米手环', 'iPad', '华为耳机', '小米电视']

  for (let i = 0; i < 10; i += 1) {
    products.push({
      productName: productNames[i],
      sales: Mock.Random.integer(10, 100),
      salesAmount: Mock.Random.float(1000, 20000, 2, 2),
      inventory: Mock.Random.integer(0, 500),
      status: Mock.Random.integer(0, 100) > 20 ? '有货' : '缺货',
    })
  }

  return {
    code: 200,
    data: products,
    message: 'success',
  }
})

// 历史表现数据（用于数据下钻）
Mock.mock('/api/live-streaming/historical-performance', 'get', () => {
  const data = []
  const streamers = ['张主播', '李主播', '王主播', '赵主播']

  for (let i = 0; i < 30; i += 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString(),
      streamers: streamers.map((name) => ({
        name,
        sales: Mock.Random.float(5000, 50000, 2, 2),
        orders: Mock.Random.integer(20, 200),
        viewers: Mock.Random.integer(1000, 10000),
        conversionRate: Mock.Random.float(1, 10, 2, 2),
      })),
    })
  }

  return {
    code: 200,
    data,
    message: 'success',
  }
})

// 数据下钻分析数据
Mock.mock('/api/live-streaming/drill-down', 'get', () => {
  const data = []
  const now = new Date()

  for (let i = 59; i >= 0; i -= 1) {
    const timestamp = now.getTime() - i * 60000 // 每分钟一个数据点
    data.push({
      id: i + 1,
      timestamp,
      sales: Mock.Random.float(1000, 8000, 2, 2),
      orders: Mock.Random.integer(20, 150),
      viewers: Mock.Random.integer(5000, 15000),
      conversionRate: Mock.Random.float(1.5, 4.5, 2, 2),
    })
  }

  return {
    code: 200,
    data: {
      data,
      total: data.length,
    },
    message: 'success',
  }
})

// 异常检测数据
Mock.mock('/api/live-streaming/anomaly', 'get', () => {
  const anomalies = []
  const types = ['spike', 'drop', 'trend', 'outlier']
  const severities = ['low', 'medium', 'high']
  const descriptions = [
    '销售额异常上升，超出预期范围',
    '观看人数突然下降，可能存在技术问题',
    '转化率持续走低，需要关注用户体验',
    '订单量异常波动，建议检查库存状态',
    '用户活跃度异常，可能存在刷量行为',
  ]

  const anomalyCount = Mock.Random.integer(2, 6)
  for (let i = 0; i < anomalyCount; i += 1) {
    const type = Mock.Random.pick(types)
    const severity = Mock.Random.pick(severities)
    const value = Mock.Random.float(1000, 10000, 2, 2)
    const expectedValue = value * (0.8 + Math.random() * 0.4)
    const deviation = ((value - expectedValue) / expectedValue) * 100

    anomalies.push({
      id: i + 1,
      type,
      severity,
      description: Mock.Random.pick(descriptions),
      timestamp: Date.now() - Mock.Random.integer(0, 3600000),
      value,
      expectedValue,
      deviation,
      metric: Mock.Random.pick(['sales', 'orders', 'viewers', 'conversionRate']),
    })
  }

  return {
    code: 200,
    data: {
      anomalies,
      total: anomalies.length,
    },
    message: 'success',
  }
})

export default Mock
