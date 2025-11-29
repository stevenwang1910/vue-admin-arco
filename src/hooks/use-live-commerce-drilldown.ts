import { ref, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { MetricData, ProductSalesData, OrderData, AlertRule, AlertLevel, AlertMessage } from '@/views/live-commerce-dashboard/types'

// 辅助函数 - 在导出函数前定义
const evaluateCondition = (value: number, condition: string, threshold: number): boolean => {
  switch (condition) {
    case 'greater_than':
      return value > threshold
    case 'less_than':
      return value < threshold
    case 'equal':
      return value === threshold
    case 'not_equal':
      return value !== threshold
    default:
      return false
  }
}

const generateHourlyTrend = (metricKey: string) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  return hours.map((time) => ({
    time,
    value: Math.floor(Math.random() * 1000) + 100,
  }))
}

const generateTopProducts = (metricKey: string) => {
  const products = ['iPhone 15', '华为Mate 60', '小米14', 'iPad Air', '华为手表']
  return products.map((name) => ({
    name,
    value: Math.floor(Math.random() * 100) + 10,
  }))
}

const generatePeakTime = (metricKey: string) => {
  return {
    time: '20:00-22:00',
    value: Math.floor(Math.random() * 1000) + 500,
  }
}

const generateComparison = (metricKey: string) => {
  return {
    yesterday: Math.floor(Math.random() * 1000) + 500,
    lastWeek: Math.floor(Math.random() * 1000) + 400,
    lastMonth: Math.floor(Math.random() * 1000) + 300,
  }
}

const generateProductSalesTrend = (productName: string) => {
  const days = Array.from({ length: 7 }, (_, i) => `第${i + 1}天`)
  return days.map((day) => ({
    day,
    sales: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 10000) + 1000,
  }))
}

const generateCustomerReviews = (productName: string) => {
  return {
    rating: (Math.random() * 2 + 3).toFixed(1),
    count: Math.floor(Math.random() * 1000) + 100,
    positiveRate: Math.floor(Math.random() * 30) + 70,
  }
}

const generateInventory = (productName: string) => {
  return {
    current: Math.floor(Math.random() * 1000) + 100,
    total: Math.floor(Math.random() * 2000) + 500,
    status: Math.random() > 0.7 ? 'low' : 'normal',
  }
}

const generateCompetitors = (productName: string) => {
  const competitors = ['竞品A', '竞品B', '竞品C']
  return competitors.map((name) => ({
    name,
    price: Math.floor(Math.random() * 1000) + 500,
    sales: Math.floor(Math.random() * 100) + 10,
  }))
}

const generateCustomerInfo = (buyer: string) => {
  return {
    name: buyer,
    phone: '138****8888',
    address: '北京市朝阳区',
    level: Math.random() > 0.5 ? 'VIP' : '普通用户',
    totalOrders: Math.floor(Math.random() * 50) + 1,
    totalAmount: Math.floor(Math.random() * 10000) + 1000,
  }
}

const generatePaymentInfo = (orderId: string) => {
  return {
    method: Math.random() > 0.5 ? '微信支付' : '支付宝',
    status: '已支付',
    amount: Math.floor(Math.random() * 10000) + 100,
    time: new Date().toISOString(),
  }
}

const generateShippingInfo = (orderId: string) => {
  return {
    company: '顺丰快递',
    trackingNumber: `SF${Date.now()}`,
    status: '已发货',
    estimatedDelivery: '2024-12-16',
  }
}

const generateOrderHistory = (buyer: string) => {
  const products = ['iPhone 15', '华为Mate 60', '小米14', 'iPad Air']
  return Array.from({ length: 5 }, () => ({
    product: products[Math.floor(Math.random() * products.length)],
    amount: Math.floor(Math.random() * 10000) + 100,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }))
}

// 预警规则配置
const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    metric: 'onlineUsers',
    condition: 'less_than',
    threshold: 500,
    level: 'warning',
    message: '在线人数过低，建议调整直播策略',
  },
  {
    metric: 'conversionRate',
    condition: 'less_than',
    threshold: 2,
    level: 'error',
    message: '转化率过低，需要优化商品展示或价格策略',
  },
  {
    metric: 'salesAmount',
    condition: 'less_than',
    threshold: 100000,
    level: 'warning',
    message: '销售额低于预期，建议推出促销活动',
  },
  {
    metric: 'avgOrderValue',
    condition: 'less_than',
    threshold: 200,
    level: 'info',
    message: '客单价偏低，可推荐高价值商品',
  },
]

export const useDataDrillDown = () => {
  // 状态
  const drillDownVisible = ref(false)
  const drillDownData = ref<any>(null)
  const drillDownTitle = ref('')
  const drillDownType = ref<'metric' | 'product' | 'order'>('metric')

  // 打开数据下钻
  const openDrillDown = (data: any, title: string, type: 'metric' | 'product' | 'order') => {
    drillDownData.value = data
    drillDownTitle.value = title
    drillDownType.value = type
    drillDownVisible.value = true
  }

  // 关闭数据下钻
  const closeDrillDown = () => {
    drillDownVisible.value = false
    drillDownData.value = null
    drillDownTitle.value = ''
  }

  // 获取指标详情数据
  const getMetricDetails = (metric: MetricData) => {
    const details = {
      ...metric,
      details: {
        hourlyTrend: generateHourlyTrend(metric.key),
        topProducts: generateTopProducts(metric.key),
        peakTime: generatePeakTime(metric.key),
        comparison: generateComparison(metric.key),
      },
    }
    return details
  }

  // 获取商品详情数据
  const getProductDetails = (product: ProductSalesData) => {
    const details = {
      ...product,
      details: {
        salesTrend: generateProductSalesTrend(product.name),
        customerReviews: generateCustomerReviews(product.name),
        inventory: generateInventory(product.name),
        competitors: generateCompetitors(product.name),
      },
    }
    return details
  }

  // 获取订单详情数据
  const getOrderDetails = (order: OrderData) => {
    const details = {
      ...order,
      details: {
        customerInfo: generateCustomerInfo(order.buyer),
        paymentInfo: generatePaymentInfo(order.id),
        shippingInfo: generateShippingInfo(order.id),
        history: generateOrderHistory(order.buyer),
      },
    }
    return details
  }

  return {
    drillDownVisible,
    drillDownData,
    drillDownTitle,
    drillDownType,
    openDrillDown,
    closeDrillDown,
    getMetricDetails,
    getProductDetails,
    getOrderDetails,
  }
}

export const useAlertSystem = (rules: AlertRule[] = DEFAULT_ALERT_RULES) => {
  // 状态
  const alerts = ref<AlertMessage[]>([])
  const alertCount = computed(() => alerts.value.length)
  const hasUnreadAlerts = computed(() => alerts.value.some((alert) => !alert.read))

  // 显示预警通知
  const showAlertNotification = (alert: AlertMessage) => {
    const duration = alert.level === 'error' ? 0 : 5000
    const closable = true

    switch (alert.level) {
      case 'error':
        Message.error({
          content: `异常预警: ${alert.message}`,
          duration,
          closable,
        })
        break
      case 'warning':
        Message.warning({
          content: `警告: ${alert.message}`,
          duration,
          closable,
        })
        break
      case 'info':
        Message.info({
          content: `提示: ${alert.message}`,
          duration: 3000,
          closable,
        })
        break
      default:
        // 默认处理，避免default-case错误
        break
    }
  }

  // 检查预警规则
  const checkAlerts = (metrics: MetricData[]) => {
    const newAlerts: AlertMessage[] = []

    rules.forEach((rule) => {
      const metric = metrics.find((m) => m.key === rule.metric)
      if (!metric) {
        return
      }

      const currentValue = typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value
      const shouldAlert = evaluateCondition(currentValue, rule.condition, rule.threshold)

      if (shouldAlert) {
        newAlerts.push({
          id: `alert_${Date.now()}_${rule.metric}`,
          rule,
          currentValue,
          message: rule.message,
          level: rule.level,
          timestamp: new Date().toISOString(),
          read: false,
        })
      }
    })

    // 更新预警列表
    if (newAlerts.length > 0) {
      alerts.value.unshift(...newAlerts)

      // 显示重要预警
      newAlerts.forEach((alert) => {
        if (alert.level === 'error' || alert.level === 'warning') {
          showAlertNotification(alert)
        }
      })
    }

    // 限制预警数量，保留最近50条
    if (alerts.value.length > 50) {
      alerts.value = alerts.value.slice(0, 50)
    }
  }

  // 标记预警为已读
  const markAlertAsRead = (alertId: string) => {
    const alert = alerts.value.find((a) => a.id === alertId)
    if (alert) {
      alert.read = true
    }
    // 如果没有找到预警，静默处理
  }

  // 清除所有预警
  const clearAllAlerts = () => {
    alerts.value = []
  }

  // 清除已读预警
  const clearReadAlerts = () => {
    alerts.value = alerts.value.filter((alert) => !alert.read)
  }

  return {
    alerts,
    alertCount,
    hasUnreadAlerts,
    checkAlerts,
    markAlertAsRead,
    clearAllAlerts,
    clearReadAlerts,
  }
}
