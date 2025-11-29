import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  MetricData,
  ChartDataPoint,
  ProductSalesData,
  UserProfileData,
  OrderData,
  Anchor,
  Category,
  SalesTrendData,
  FilterOptions,
} from '@/views/live-commerce-dashboard/types'

// Mock数据生成函数
const generateMockData = () => {
  // 生成核心指标数据
  const generateMetrics = (): MetricData[] => {
    const baseValues = {
      onlineUsers: Math.floor(Math.random() * 2000) + 800,
      totalViews: Math.floor(Math.random() * 50000) + 20000,
      salesAmount: Math.floor(Math.random() * 500000) + 200000,
      orderCount: Math.floor(Math.random() * 2000) + 800,
      avgOrderValue: Math.floor(Math.random() * 500) + 200,
      conversionRate: (Math.random() * 5 + 2).toFixed(1),
    }

    return [
      {
        key: 'onlineUsers',
        title: '实时在线人数',
        value: baseValues.onlineUsers,
        unit: '人',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: Math.floor(Math.random() * 20) + 5,
        icon: 'icon-user',
        color: 'blue',
      },
      {
        key: 'totalViews',
        title: '累计观看人次',
        value: baseValues.totalViews,
        unit: '次',
        trend: 'up',
        trendValue: Math.floor(Math.random() * 30) + 10,
        icon: 'icon-eye',
        color: 'green',
      },
      {
        key: 'salesAmount',
        title: '销售额',
        value: baseValues.salesAmount,
        unit: '元',
        trend: 'up',
        trendValue: Math.floor(Math.random() * 25) + 15,
        icon: 'icon-money',
        color: 'orange',
        isCurrency: true,
      },
      {
        key: 'orderCount',
        title: '订单量',
        value: baseValues.orderCount,
        unit: '单',
        trend: 'up',
        trendValue: Math.floor(Math.random() * 20) + 8,
        icon: 'icon-calendar',
        color: 'purple',
      },
      {
        key: 'avgOrderValue',
        title: '客单价',
        value: baseValues.avgOrderValue,
        unit: '元',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: Math.floor(Math.random() * 10) + 2,
        icon: 'icon-tag',
        color: 'cyan',
        isCurrency: true,
      },
      {
        key: 'conversionRate',
        title: '转化率',
        value: baseValues.conversionRate,
        unit: '%',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: Math.floor(Math.random() * 5) + 1,
        icon: 'icon-star',
        color: 'red',
      },
    ]
  }

  // 生成销售趋势数据
  const generateSalesTrendData = (): SalesTrendData => {
    const hours = 24
    const sales: ChartDataPoint[] = []
    const orders: ChartDataPoint[] = []
    const conversionRate: ChartDataPoint[] = []

    for (let i = 0; i < hours; i += 1) {
      const time = `${String(i).padStart(2, '0')}:00`
      const baseSales = Math.floor(Math.random() * 50000) + 20000
      const baseOrders = Math.floor(Math.random() * 200) + 80
      const baseRate = Math.random() * 3 + 2

      sales.push({ time, value: baseSales })
      orders.push({ time, value: baseOrders })
      conversionRate.push({ time, value: parseFloat(baseRate.toFixed(1)) })
    }

    return { sales, orders, conversionRate }
  }

  // 生成在线人数数据
  const generateOnlineUsersData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = []
    const now = new Date()

    for (let i = 59; i >= 0; i -= 1) {
      const time = new Date(now.getTime() - i * 60000) // 每分钟一个数据点
      const value = Math.floor(Math.random() * 1000) + 500 + Math.sin(i * 0.1) * 200

      data.push({
        time: time.toLocaleTimeString(),
        value: Math.max(0, Math.floor(value)),
      })
    }

    return data
  }

  // 生成商品销量数据
  const generateProductSalesData = (): ProductSalesData[] => {
    const products = [
      'iPhone 15 Pro',
      '华为Mate 60',
      '小米14',
      'iPad Air',
      '华为手表',
      'AirPods Pro',
      '华为耳机',
      '小米手环',
      'MacBook Air',
      '华为平板',
      'iPhone 14',
      '小米13',
      '华为P60',
      'iPad Pro',
      '小米手表',
    ]

    return products
      .slice(0, 10)
      .map((name, index) => ({
        name,
        sales: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 100000) + 50000,
        price: Math.floor(Math.random() * 8000) + 2000,
      }))
      .sort((a, b) => b.sales - a.sales)
  }

  // 生成用户画像数据
  const generateUserProfileData = (): UserProfileData[] => {
    const profileData = {
      age: [
        { name: '18-25岁', value: 35, percentage: 35 },
        { name: '26-35岁', value: 40, percentage: 40 },
        { name: '36-45岁', value: 20, percentage: 20 },
        { name: '46岁以上', value: 5, percentage: 5 },
      ],
      gender: [
        { name: '男性', value: 55, percentage: 55 },
        { name: '女性', value: 45, percentage: 45 },
      ],
      region: [
        { name: '广东', value: 25, percentage: 25 },
        { name: '江苏', value: 18, percentage: 18 },
        { name: '浙江', value: 15, percentage: 15 },
        { name: '山东', value: 12, percentage: 12 },
        { name: '河南', value: 10, percentage: 10 },
        { name: '其他', value: 20, percentage: 20 },
      ],
    }

    return profileData[props.type] || profileData.age
  }

  // 生成实时订单数据
  const generateRealtimeOrders = (): OrderData[] => {
    const statuses: OrderData['status'][] = ['pending', 'paid', 'shipped', 'completed']
    const buyers = ['张小明', '李小红', '王小华', '赵小丽', '陈小军', '刘小美', '孙小强', '周小燕']
    const products = [
      'iPhone 15 Pro Max 256GB',
      '华为Mate 60 Pro 512GB',
      '小米14 Ultra 1TB',
      'iPad Air 5 256GB WiFi版',
      '华为Watch GT 4',
      'AirPods Pro 2代',
      '华为FreeBuds Pro 3',
      '小米手环8 Pro',
      'MacBook Air M2 8GB+256GB',
    ]

    return Array.from({ length: 20 }, (_, index) => {
      const now = new Date()
      const timeOffset = Math.floor(Math.random() * 3600000) // 1小时内随机时间

      return {
        id: `ORDER${Date.now() + index}`,
        productName: products[Math.floor(Math.random() * products.length)],
        price: Math.floor(Math.random() * 8000) + 1000,
        quantity: Math.floor(Math.random() * 3) + 1,
        buyer: buyers[Math.floor(Math.random() * buyers.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: new Date(now.getTime() - timeOffset).toISOString(),
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // 生成主播数据
  const generateAnchorList = (): Anchor[] => {
    const anchors = [
      { name: '李佳琦', followers: 5000000 },
      { name: '薇娅', followers: 4000000 },
      { name: '罗永浩', followers: 3000000 },
      { name: '辛巴', followers: 3500000 },
      { name: '李子柒', followers: 2800000 },
    ]

    return anchors.map((anchor, index) => ({
      id: `anchor_${index + 1}`,
      name: anchor.name,
      followers: anchor.followers,
      isLive: Math.random() > 0.3,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${anchor.name}`,
    }))
  }

  // 生成商品类别数据
  const generateCategoryList = (): Category[] => {
    const categories = [
      '手机数码',
      '电脑办公',
      '家用电器',
      '美妆护肤',
      '服装鞋包',
      '食品生鲜',
      '家居日用',
      '运动户外',
      '汽车用品',
      '图书音像',
    ]

    return categories.map((category, index) => ({
      id: `category_${index + 1}`,
      name: category,
      productCount: Math.floor(Math.random() * 1000) + 100,
      icon: 'icon-tag',
    }))
  }

  return {
    metrics: generateMetrics(),
    salesTrendData: generateSalesTrendData(),
    onlineUsersData: generateOnlineUsersData(),
    productSalesData: generateProductSalesData(),
    userProfileData: generateUserProfileData(),
    realtimeOrders: generateRealtimeOrders(),
    anchorList: generateAnchorList(),
    categoryList: generateCategoryList(),
  }
}

// eslint-disable-next-line no-use-before-define
export default useLiveCommerceData

const useLiveCommerceData = () => {
  // 状态数据
  const metrics = ref<MetricData[]>([])
  const salesTrendData = ref<SalesTrendData>({ sales: [], orders: [], conversionRate: [] })
  const onlineUsersData = ref<ChartDataPoint[]>([])
  const productSalesData = ref<ProductSalesData[]>([])
  const userProfileData = ref<UserProfileData[]>([])
  const realtimeOrders = ref<OrderData[]>([])
  const anchorList = ref<Anchor[]>([])
  const categoryList = ref<Category[]>([])

  const chartLoading = ref(false)
  const newOrderCount = ref(0)

  let realtimeTimer: NodeJS.Timeout | null = null
  let updateInterval = 5000 // 5秒更新一次

  // 获取数据
  const fetchData = async (filters?: FilterOptions) => {
    chartLoading.value = true
    try {
      // 模拟API调用延迟
      await new Promise((resolve) => {
        setTimeout(resolve, 500)
      })

      const mockData = generateMockData()

      // 应用筛选条件（这里简化处理，实际应该调用后端API）
      if (filters) {
        // 根据筛选条件调整数据
        if (filters.timeDimension === 'realtime') {
          // 实时数据不需要特殊处理
        } else if (filters.timeDimension === 'today') {
          // 今日数据
        }
        // 其他筛选逻辑...
      }

      metrics.value = mockData.metrics
      salesTrendData.value = mockData.salesTrendData
      onlineUsersData.value = mockData.onlineUsersData
      productSalesData.value = mockData.productSalesData
      userProfileData.value = mockData.userProfileData
      realtimeOrders.value = mockData.realtimeOrders
      anchorList.value = mockData.anchorList
      categoryList.value = mockData.categoryList
    } catch (error) {
      Message.error('获取数据失败')
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error)
    } finally {
      chartLoading.value = false
    }
  }

  // 刷新数据
  const refreshData = async (filters?: FilterOptions) => {
    await fetchData(filters)
  }

  // 停止实时更新
  const stopRealtimeUpdate = () => {
    if (realtimeTimer) {
      clearInterval(realtimeTimer)
      realtimeTimer = null
    }
  }

  // 开始实时更新
  const startRealtimeUpdate = () => {
    stopRealtimeUpdate() // 先停止之前的定时器

    realtimeTimer = setInterval(async () => {
      try {
        // 更新实时数据
        const mockData = generateMockData()

        // 更新在线人数（平滑过渡）
        if (onlineUsersData.value.length > 0) {
          const lastValue = onlineUsersData.value[onlineUsersData.value.length - 1].value
          const newValue = Math.max(0, lastValue + (Math.random() - 0.5) * 100)
          onlineUsersData.value.push({
            time: new Date().toLocaleTimeString(),
            value: Math.floor(newValue),
          })

          // 保持最近60个数据点
          if (onlineUsersData.value.length > 60) {
            onlineUsersData.value.shift()
          }
        }

        // 更新订单数据
        const newOrders = mockData.realtimeOrders.slice(0, 3)
        if (newOrders.length > 0) {
          realtimeOrders.value.unshift(...newOrders)

          // 保持最多20个订单
          if (realtimeOrders.value.length > 20) {
            realtimeOrders.value = realtimeOrders.value.slice(0, 20)
          }

          newOrderCount.value += newOrders.length
        }

        // 更新指标数据（小幅波动）
        metrics.value.forEach((metric) => {
          if (metric.key === 'onlineUsers') {
            const lastValue = typeof metric.value === 'number' ? metric.value : 0
            const change = (Math.random() - 0.5) * 50
            metric.value = Math.max(0, Math.floor(lastValue + change))
          }
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating realtime data:', error)
      }
    }, updateInterval)
  }

  // 设置更新间隔
  const setUpdateInterval = (interval: number) => {
    updateInterval = Math.max(1000, interval) // 最少1秒

    // 如果正在运行，重启定时器
    if (realtimeTimer) {
      startRealtimeUpdate()
    }
  }

  // 重置新订单计数
  const resetNewOrderCount = () => {
    newOrderCount.value = 0
  }

  // 初始化
  const init = async () => {
    await fetchData()
  }

  return {
    // 数据
    metrics,
    salesTrendData,
    onlineUsersData,
    productSalesData,
    userProfileData,
    realtimeOrders,
    anchorList,
    categoryList,
    chartLoading,
    newOrderCount,

    // 方法
    fetchData,
    refreshData,
    startRealtimeUpdate,
    stopRealtimeUpdate,
    setUpdateInterval,
    resetNewOrderCount,
    init,
  }
}
