// 直播实时数据
export interface LiveStreamingRealtimeData {
  onlineUsers: number
  totalViews: number
  salesAmount: number
  orderCount: number
  avgOrderValue: number
  conversionRate: number
}

// 图表数据
export interface LiveStreamingChartData {
  time?: string
  name?: string
  value: number
  onlineUsers?: number
  salesAmount?: number
  orderCount?: number
  viewers?: number
  conversionRate?: number
}

// 异常预警
export interface LiveStreamingWarning {
  id: number
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: number
}

// 筛选条件
export interface LiveStreamingFilter {
  timeRange: string
  productCategory: string
  streamer: string
  platform: string
  startDate?: string
  endDate?: string
}

// 主播表现数据
export interface StreamerPerformance {
  name: string
  salesAmount: number
  orderCount: number
  viewers: number
  conversionRate: number
  avgOrderValue: number
  liveDuration: number
  status: 'live' | 'offline' | 'scheduled'
}

// 数据下钻数据
export interface DrillDownData {
  id: number
  timestamp: number
  sales: number
  orders: number
  viewers: number
  conversionRate: number
  productId?: string
  productName?: string
  category?: string
}

// 异常信息
export interface AnomalyInfo {
  id: number
  type: 'spike' | 'drop' | 'trend' | 'outlier'
  severity: 'low' | 'medium' | 'high'
  description: string
  timestamp: number
  value: number
  expectedValue: number
  deviation: number
  metric: string
}
