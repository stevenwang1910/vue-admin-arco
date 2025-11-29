import axios from 'axios'
import { GeneralChart } from '@/types/global'

export interface ChartDataRecord {
  x: string
  y: number
  name: string
}
export interface DataChainGrowth {
  quota: string
}

export interface DataChainGrowthRes {
  count: number
  growth: number
  chartData: {
    xAxis: string[]
    data: { name: string; value: number[] }
  }
}
export function queryDataChainGrowth(data: DataChainGrowth) {
  return axios.post<DataChainGrowthRes>('/api/data-chain-growth', data)
}

export interface PopularAuthorRes {
  list: {
    ranking: number
    author: string
    contentCount: number
    clickCount: number
  }[]
}

export function queryPopularAuthor() {
  return axios.get<PopularAuthorRes>('/api/popular-author/list')
}

export interface ContentPublishRecord {
  x: string[]
  y: number[]
  name: string
}

export function queryContentPublish() {
  return axios.get<ContentPublishRecord[]>('/api/content-publish')
}

export function queryContentPeriodAnalysis() {
  return axios.post<GeneralChart>('/api/content-period-analysis')
}

export interface PublicOpinionAnalysis {
  quota: string
}
export interface PublicOpinionAnalysisRes {
  count: number
  growth: number
  chartData: ChartDataRecord[]
}
export function queryPublicOpinionAnalysis(data: DataChainGrowth) {
  return axios.post<PublicOpinionAnalysisRes>('/api/public-opinion-analysis', data)
}
export interface DataOverviewRes {
  xAxis: string[]
  data: Array<{ name: string; value: number[]; count: number }>
}

export function queryDataOverview() {
  return axios.post<DataOverviewRes>('/api/data-overview')
}

// 直播销售数据大盘接口
interface CoreMetricsRes {
  realTimeOnline: number
  totalViews: number
  totalSales: number
  totalOrders: number
  avgOrderValue: number
  conversionRate: number
  growthRates: {
    realTimeOnline: number
    totalViews: number
    totalSales: number
    totalOrders: number
    avgOrderValue: number
    conversionRate: number
  }
}

export function queryCoreMetrics() {
  return axios.get<CoreMetricsRes>('/api/live-sales/core-metrics')
}

interface SalesTrendParams {
  timeRange: string
}

interface SalesTrendRes {
  xAxis: string[]
  data: Array<{ name: string; data: number[] }>
}

export function querySalesTrend(params: SalesTrendParams) {
  return axios.post<SalesTrendRes>('/api/live-sales/sales-trend', params)
}

interface ProductSalesRankRes {
  list: Array<{
    ranking: number
    productName: string
    salesVolume: number
    salesAmount: number
  }>
}

export function queryProductSalesRank() {
  return axios.get<ProductSalesRankRes>('/api/live-sales/product-sales-rank')
}

interface UserPortraitRes {
  genderDistribution: Array<{ name: string; value: number }>
  ageDistribution: Array<{ name: string; value: number }>
  regionDistribution: Array<{ name: string; value: number }>
}

export function queryUserPortrait() {
  return axios.get<UserPortraitRes>('/api/live-sales/user-portrait')
}

export function querySalesByCategory() {
  return axios.get<Array<{ name: string; value: number }>>('/api/live-sales/sales-by-category')
}
