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

// 城市运行监控API

export interface CityOperationIndexRes {
  score: number
  trend: string
  trendType: 'up' | 'down' | 'same'
  indicators: Array<{
    name: string
    value: string
    trend: string
    trendType: 'up' | 'down' | 'same'
  }>
}

export function queryCityOperationIndex() {
  return axios.get<CityOperationIndexRes>('/api/city-operation-index')
}

export interface CityHeatmapDataRes {
  data: Array<{
    lng: number
    lat: number
    value: number
  }>
}

export function queryCityHeatmapData() {
  return axios.get<CityHeatmapDataRes>('/api/city-heatmap-data')
}

export interface TrafficSituationDataRes {
  data: Array<{
    name: string
    status: 'smooth' | 'slow' | 'congested'
    congestion: string
    speed: string
  }>
}

export function queryTrafficSituationData() {
  return axios.get<TrafficSituationDataRes>('/api/traffic-situation-data')
}

export interface ImportantAlertsDataRes {
  data: Array<{
    id: number
    type: string
    level: 'high' | 'medium' | 'low'
    area: string
    time: string
    description: string
  }>
}

export function queryImportantAlertsData() {
  return axios.get<ImportantAlertsDataRes>('/api/important-alerts-data')
}

export interface TodoWorkOrdersDataRes {
  data: Array<{
    id: number
    type: string
    level: 'high' | 'medium' | 'low'
    area: string
    time: string
    assignee: string
    status: 'pending' | 'processing'
  }>
}

export function queryTodoWorkOrdersData() {
  return axios.get<TodoWorkOrdersDataRes>('/api/todo-work-orders-data')
}

export interface RealTimeEventsDataRes {
  data: Array<{
    id: number
    type: string
    level: 'high' | 'medium' | 'low'
    area: string
    time: string
    status: 'new' | 'assigned' | 'processing'
    source: string
  }>
}

export function queryRealTimeEventsData() {
  return axios.get<RealTimeEventsDataRes>('/api/real-time-events-data')
}

export interface ResourcePoolDataRes {
  vehicles: Array<{
    id: number
    type: string
    status: 'available' | 'busy'
    location: string
    lng: number
    lat: number
  }>
  personnel: Array<{
    id: number
    name: string
    role: string
    status: 'available' | 'busy'
    location: string
  }>
  materials: Array<{
    id: number
    name: string
    quantity: number
    location: string
  }>
}

export function queryResourcePoolData() {
  return axios.get<ResourcePoolDataRes>('/api/resource-pool-data')
}

export interface HistoricalAnalysisDataRes {
  trendData: Array<{
    date: string
    events: number
    处置率: string
    avgResponseTime: number
  }>
  performanceData: Array<{
    area: string
    处置率: string
    avgResponseTime: number
    events: number
  }>
}

export function queryHistoricalAnalysisData() {
  return axios.get<HistoricalAnalysisDataRes>('/api/historical-analysis-data')
}
