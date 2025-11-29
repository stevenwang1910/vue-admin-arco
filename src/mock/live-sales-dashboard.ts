import Mock from 'mockjs'
import setupMock, { successResponseWrap } from '@/utils/setup-mock'

setupMock({
  setup() {
    // 核心指标
    Mock.mock('/api/live-sales/core-metrics', 'get', () => {
      return successResponseWrap({
        realTimeOnline: Mock.mock('@integer(1000, 5000)'),
        totalViews: Mock.mock('@integer(100000, 500000)'),
        totalSales: Mock.mock('@float(100000, 500000, 2, 2)'),
        totalOrders: Mock.mock('@integer(5000, 20000)'),
        avgOrderValue: Mock.mock('@float(50, 200, 2, 2)'),
        conversionRate: Mock.mock('@float(1, 5, 2, 2)'),
        growthRates: {
          realTimeOnline: Mock.mock('@float(-5, 10, 2, 2)'),
          totalViews: Mock.mock('@float(-5, 10, 2, 2)'),
          totalSales: Mock.mock('@float(-5, 10, 2, 2)'),
          totalOrders: Mock.mock('@float(-5, 10, 2, 2)'),
          avgOrderValue: Mock.mock('@float(-5, 10, 2, 2)'),
          conversionRate: Mock.mock('@float(-5, 10, 2, 2)'),
        },
      })
    })

    // 销售趋势
    Mock.mock('/api/live-sales/sales-trend', 'post', () => {
      const timeRange = Mock.mock('@pick(["today", "week"])')
      const xAxis = []
      const salesData = []
      const orderData = []

      if (timeRange === 'today') {
        // 今天的时间轴为小时
        for (let i = 0; i < 24; i += 1) {
          xAxis.push(`${i}:00`)
          salesData.push(Mock.mock('@float(1000, 5000, 2, 2)'))
          orderData.push(Mock.mock('@integer(50, 200)'))
        }
      } else {
        // 本周的时间轴为日期
        for (let i = 0; i < 7; i += 1) {
          xAxis.push(`2023-10-${i + 1}`)
          salesData.push(Mock.mock('@float(5000, 20000, 2, 2)'))
          orderData.push(Mock.mock('@integer(200, 800)'))
        }
      }

      return successResponseWrap({
        xAxis,
        data: [
          { name: '销售额', data: salesData },
          { name: '订单量', data: orderData },
        ],
      })
    })

    // 商品销售排名
    Mock.mock('/api/live-sales/product-sales-rank', 'get', () => {
      const productList = []
      for (let i = 0; i < 10; i += 1) {
        productList.push({
          ranking: i + 1,
          productName: Mock.mock('@ctitle(5, 10)'),
          salesVolume: Mock.mock('@integer(100, 1000)'),
          salesAmount: Mock.mock('@float(5000, 20000, 2, 2)'),
        })
      }
      return successResponseWrap({
        list: productList,
      })
    })

    // 用户画像
    Mock.mock('/api/live-sales/user-portrait', 'get', () => {
      return successResponseWrap({
        genderDistribution: [
          { name: '男性', value: Mock.mock('@integer(30, 70)') },
          { name: '女性', value: Mock.mock('@integer(30, 70)') },
        ],
        ageDistribution: [
          { name: '18-24', value: Mock.mock('@integer(10, 30)') },
          { name: '25-34', value: Mock.mock('@integer(30, 50)') },
          { name: '35-44', value: Mock.mock('@integer(10, 30)') },
          { name: '45+', value: Mock.mock('@integer(5, 15)') },
        ],
        regionDistribution: [
          { name: '华东', value: Mock.mock('@integer(20, 40)') },
          { name: '华北', value: Mock.mock('@integer(10, 30)') },
          { name: '华南', value: Mock.mock('@integer(10, 30)') },
          { name: '西南', value: Mock.mock('@integer(5, 15)') },
          { name: '西北', value: Mock.mock('@integer(5, 15)') },
          { name: '东北', value: Mock.mock('@integer(5, 15)') },
        ],
      })
    })

    // 销售分类
    Mock.mock('/api/live-sales/sales-by-category', 'get', () => {
      const categories = ['电子产品', '服装服饰', '家居用品', '食品饮料', '美妆个护', '母婴用品']
      const categoryData = []
      categories.forEach((category) => {
        categoryData.push({
          name: category,
          value: Mock.mock('@float(10000, 50000, 2, 2)'),
        })
      })
      return successResponseWrap(categoryData)
    })
  },
})
