// 直播电商数据类型定义

export interface MetricData {
  key: string
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  icon?: string
  color?: string
  isCurrency?: boolean
}

export interface ChartDataPoint {
  time: string
  value: number
  [key: string]: any
}

export interface ProductSalesData {
  name: string
  sales: number
  revenue: number
  image?: string
}

export interface UserProfileData {
  name: string
  value: number
  percentage: number
}

export interface OrderData {
  id: string
  productName: string
  price: number
  quantity: number
  buyer: string
  status: 'pending' | 'paid' | 'shipped' | 'completed'
  timestamp: string
  avatar?: string
}

export interface Anchor {
  id: string
  name: string
  avatar?: string
  followers: number
  isLive: boolean
}

export interface Category {
  id: string
  name: string
  icon?: string
  productCount: number
}

export interface FilterOptions {
  timeDimension?: string
  anchorId?: string
  categoryId?: string
  startDate?: string
  endDate?: string
}

export interface SalesTrendData {
  sales: ChartDataPoint[]
  orders: ChartDataPoint[]
  conversionRate: ChartDataPoint[]
}

export interface LiveRoomData {
  roomId: string
  title: string
  anchor: Anchor
  viewers: number
  likes: number
  comments: number
  products: ProductSalesData[]
  startTime: string
  duration: number
  status: 'live' | 'ended' | 'scheduled'
}
