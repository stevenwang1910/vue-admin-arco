import axios from 'axios'

// 获取城市运行总览数据
export function getCityOverview() {
  return axios.get('/api/city-operation/overview')
}

// 获取热力图数据
export function getHeatmapData() {
  return axios.get('/api/city-operation/heatmap')
}

// 获取交通态势数据
export function getTrafficSituation() {
  return axios.get('/api/city-operation/traffic')
}

// 获取实时事件数据
export function getRealTimeEvents(params?: { type?: string; level?: string; status?: string }) {
  return axios.get('/api/city-operation/events', { params })
}

// 获取资源池数据
export function getResourcePool() {
  return axios.get('/api/city-operation/resources')
}

// 获取历史趋势数据
export function getHistoricalTrends() {
  return axios.get('/api/city-operation/trends')
}

// 指派事件任务
export function assignEventTask(
  eventId: string,
  data: {
    resourceIds: string[]
    sla: number
  }
) {
  return axios.post(`/api/city-operation/events/${eventId}/assign`, data)
}

// 更新事件状态
export function updateEventStatus(eventId: string, status: string) {
  return axios.put(`/api/city-operation/events/${eventId}/status`, { status })
}
