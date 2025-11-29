import Mock from 'mockjs'
import setupMock, { successResponseWrap } from '@/utils/setup-mock'
import { PostData } from '@/types/global'

// 生成随机数
const randomNumber = (min: number, max: number) => Mock.Random.natural(min, max)

// 生成时间轴
const generateTimeAxis = (type: 'hour' | 'day' | 'week' | 'month') => {
  const axis = []
  switch (type) {
    case 'hour':
      for (let i = 0; i < 24; i += 1) {
        axis.push(`${i}:00`)
      }
      break
    case 'day':
      for (let i = 1; i <= 30; i += 1) {
        axis.push(`${i}日`)
      }
      break
    case 'week':
      axis.push('周一', '周二', '周三', '周四', '周五', '周六', '周日')
      break
    case 'month':
      for (let i = 1; i <= 12; i += 1) {
        axis.push(`${i}月`)
      }
      break
    default:
      break
  }
  return axis
}

setupMock({
  setup() {
    // 实时数据概览
    Mock.mock(new RegExp('/api/live-sales/overview'), (params: any) => {
      const {
        timeRange = 'today',
        productCategory = 'all',
        anchor = 'all',
      } = params.type === 'POST' ? JSON.parse(params.body) : params.query

      // 根据筛选参数调整数据范围
      let onlineCountMin = 1000
      let onlineCountMax = 5000
      let salesAmountMin = 1000000
      let salesAmountMax = 5000000

      if (anchor !== 'all') {
        // 单个主播的数据范围更小
        onlineCountMin = 500
        onlineCountMax = 2000
        salesAmountMin = 200000
        salesAmountMax = 1000000
      }

      if (productCategory !== 'all') {
        // 单个商品类别的数据范围更小
        salesAmountMin *= 0.3
        salesAmountMax *= 0.3
      }

      return successResponseWrap({
        onlineCount: randomNumber(onlineCountMin, onlineCountMax),
        onlineGrowth: randomNumber(0, 20),
        viewCount: randomNumber(50000, 200000),
        viewGrowth: randomNumber(0, 15),
        salesAmount: randomNumber(salesAmountMin, salesAmountMax),
        salesGrowth: randomNumber(0, 30),
        orderCount: randomNumber(5000, 20000),
        orderGrowth: randomNumber(0, 25),
        averageOrderValue: randomNumber(200, 500),
        aovGrowth: randomNumber(0, 10),
        conversionRate: randomNumber(1, 10),
        conversionGrowth: randomNumber(0, 5),
        newFans: randomNumber(1000, 5000),
        fansGrowth: randomNumber(0, 30),
        interactionRate: randomNumber(10, 30),
        interactionGrowth: randomNumber(0, 10),
      })
    })

    // 销售趋势分析
    Mock.mock(new RegExp('/api/live-sales/trend'), (params: PostData) => {
      const { timeRange = 'today', productCategory = 'all', anchor = 'all' } = JSON.parse(params.body)
      let axisType: 'hour' | 'day' | 'week' | 'month' = 'hour'

      if (timeRange === 'week') axisType = 'day'
      if (timeRange === 'month') axisType = 'week'
      if (timeRange === 'quarter' || timeRange === 'year') axisType = 'month'

      const xAxis = generateTimeAxis(axisType)

      // 根据筛选参数调整数据范围
      let salesMin = 50000
      let salesMax = 150000

      if (anchor !== 'all') {
        // 单个主播的数据范围更小
        salesMin = 10000
        salesMax = 50000
      }

      if (productCategory !== 'all') {
        // 单个商品类别的数据范围更小
        salesMin *= 0.3
        salesMax *= 0.3
      }

      return successResponseWrap({
        xAxis,
        data: [
          { name: '今日销售额', value: xAxis.map(() => randomNumber(salesMin, salesMax)) },
          { name: '昨日销售额', value: xAxis.map(() => randomNumber(salesMin * 0.8, salesMax * 0.8)) },
        ],
      })
    })

    // 用户画像分布
    Mock.mock(new RegExp('/api/live-sales/user-profile'), (params: any) => {
      const {
        timeRange = 'today',
        productCategory = 'all',
        anchor = 'all',
      } = params.type === 'POST' ? JSON.parse(params.body) : params.query

      // 根据商品类别调整用户画像分布
      let ageGroups = [
        { name: '18-24岁', value: randomNumber(20, 40) },
        { name: '25-30岁', value: randomNumber(30, 50) },
        { name: '31-40岁', value: randomNumber(10, 25) },
        { name: '41岁以上', value: randomNumber(5, 15) },
      ]

      if (productCategory === 'beauty') {
        // 美妆个护产品的用户更年轻
        ageGroups = [
          { name: '18-24岁', value: randomNumber(30, 50) },
          { name: '25-30岁', value: randomNumber(30, 40) },
          { name: '31-40岁', value: randomNumber(15, 25) },
          { name: '41岁以上', value: randomNumber(5, 10) },
        ]
      } else if (productCategory === 'home') {
        // 家居用品的用户年龄更大
        ageGroups = [
          { name: '18-24岁', value: randomNumber(10, 20) },
          { name: '25-30岁', value: randomNumber(20, 30) },
          { name: '31-40岁', value: randomNumber(30, 40) },
          { name: '41岁以上', value: randomNumber(20, 30) },
        ]
      }

      return successResponseWrap(ageGroups)
    })

    // 商品销量对比
    Mock.mock(new RegExp('/api/live-sales/product-sales'), (params: any) => {
      const {
        timeRange = 'today',
        productCategory = 'all',
        anchor = 'all',
      } = params.type === 'POST' ? JSON.parse(params.body) : params.query

      let xAxis = ['电子产品', '服装', '家居用品', '美妆个护']
      let salesData = [
        { name: '今日销量', value: [1200, 800, 500, 300] },
        { name: '昨日销量', value: [1000, 700, 400, 250] },
      ]

      if (productCategory !== 'all') {
        // 如果选择了特定商品类别，只显示该类别的数据
        let categoryName = '电子产品'
        if (productCategory === 'clothing') {
          categoryName = '服装'
        } else if (productCategory === 'home') {
          categoryName = '家居用品'
        } else if (productCategory === 'beauty') {
          categoryName = '美妆个护'
        }
        xAxis = [categoryName]
        salesData = [
          { name: '今日销量', value: [randomNumber(200, 1000)] },
          { name: '昨日销量', value: [randomNumber(150, 800)] },
        ]
      }

      if (anchor !== 'all') {
        // 单个主播的销量数据更小
        salesData = salesData.map((item) => ({
          ...item,
          value: item.value.map((v) => Math.floor(v * 0.3)),
        }))
      }

      return successResponseWrap({
        xAxis,
        data: salesData,
      })
    })

    // 主播表现对比
    Mock.mock(new RegExp('/api/live-sales/anchor-performance'), (params: any) => {
      const {
        timeRange = 'today',
        productCategory = 'all',
        anchor = 'all',
      } = params.type === 'POST' ? JSON.parse(params.body) : params.query

      let xAxis = ['主播1', '主播2', '主播3', '主播4']
      let performanceData = [
        { name: '销售额(万)', value: [85.2, 68.5, 52.3, 32.1] },
        { name: '订单量', value: [2800, 2200, 1700, 1000] },
      ]

      if (anchor !== 'all') {
        // 如果选择了特定主播，只显示该主播的数据
        let anchorName = '主播1'
        if (anchor === 'anchor2') {
          anchorName = '主播2'
        } else if (anchor === 'anchor3') {
          anchorName = '主播3'
        } else if (anchor === 'anchor4') {
          anchorName = '主播4'
        }
        xAxis = [anchorName]
        performanceData = [
          { name: '销售额(万)', value: [randomNumber(10, 50)] },
          { name: '订单量', value: [randomNumber(300, 1500)] },
        ]
      }

      if (productCategory !== 'all') {
        // 单个商品类别的销售额更小
        performanceData = performanceData.map((item) => ({
          ...item,
          value: item.value.map((v) => Math.floor(v * 0.3)),
        }))
      }

      return successResponseWrap({
        xAxis,
        data: performanceData,
      })
    })
  },
})
