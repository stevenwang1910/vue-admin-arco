import axios from 'axios'
import type { LiveStreamingRealtimeData, LiveStreamingChartData } from '@/types/live-streaming'

// 获取实时数据
export function getRealtimeData(): Promise<LiveStreamingRealtimeData> {
  return axios.get('/api/live-streaming/realtime')
}

// 获取在线人数趋势数据
export function getOnlineTrendData(): Promise<LiveStreamingChartData[]> {
  return axios.get('/api/live-streaming/online-trend')
}

// 获取销售趋势数据
export function getSalesTrendData(): Promise<LiveStreamingChartData[]> {
  return axios.get('/api/live-streaming/sales-trend')
}

// 获取商品销量排行数据
export function getProductSalesData(): Promise<LiveStreamingChartData[]> {
  return axios.get('/api/live-streaming/product-sales')
}

// 获取用户画像分布数据
export function getUserProfileData(): Promise<LiveStreamingChartData[]> {
  return axios.get('/api/live-streaming/user-profile')
}

// 获取主播表现对比数据
export function getStreamerPerformanceData(): Promise<LiveStreamingChartData[]> {
  return axios.get('/api/live-streaming/streamer-performance')
}

// 获取异常预警数据
export function getWarningData(): Promise<any[]> {
  return axios.get('/api/live-streaming/warnings')
}

// 获取实时趋势数据（用于数据下钻）
export function getRealtimeTrendData() {
  return axios.get<LiveStreamingChartData>('/api/live-streaming/realtime-trend')
}

// 获取实时销售数据（用于数据下钻）
export function getRealtimeSalesData() {
  return axios.get<LiveStreamingChartData>('/api/live-streaming/realtime-sales')
}

// 获取实时商品数据（用于数据下钻）
export function getRealtimeProductData() {
  return axios.get<any[]>('/api/live-streaming/realtime-products')
}

// 获取历史表现数据（用于数据下钻）
export function getHistoricalPerformanceData(params: { startDate: string; endDate: string; streamerId?: string }) {
  return axios.get<any[]>('/api/live-streaming/historical-performance', { params })
}

// 获取数据下钻分析数据
export function getDrillDownData(params: { metric: string; startTime: number; endTime: number }) {
  return axios.get<any>('/api/live-streaming/drill-down', { params })
}

// 获取异常检测数据
export function getAnomalyData(params: { metric: string; startTime: number; endTime: number }) {
  return axios.get<any>('/api/live-streaming/anomaly', { params })
}
