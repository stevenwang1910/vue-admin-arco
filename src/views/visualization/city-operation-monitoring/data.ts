// 城市运行监控页面模拟数据

// 城市运行指数卡片数据
export const cityOperationIndex = {
  score: 85.5,
  trend: '+2.3%',
  trendType: 'up', // up, down, same
  indicators: [
    { name: '事件处置率', value: '92.1%', trend: '+1.2%', trendType: 'up' },
    { name: '平均响应时长', value: '15.2分钟', trend: '-3.5分钟', trendType: 'down' },
    { name: '告警准确率', value: '95.8%', trend: '+0.5%', trendType: 'up' },
    { name: '资源利用率', value: '78.3%', trend: '+2.7%', trendType: 'up' }
  ]
}

// 全市热力图数据
export const cityHeatmapData = [
  { lng: 116.397128, lat: 39.916527, value: 80 },
  { lng: 116.405285, lat: 39.920386, value: 95 },
  { lng: 116.412302, lat: 39.915256, value: 70 },
  { lng: 116.400000, lat: 39.925000, value: 88 },
  { lng: 116.390000, lat: 39.910000, value: 65 },
  { lng: 116.420000, lat: 39.930000, value: 92 },
  { lng: 116.385000, lat: 39.920000, value: 75 },
  { lng: 116.415000, lat: 39.905000, value: 68 },
  { lng: 116.408000, lat: 39.935000, value: 98 },
  { lng: 116.395000, lat: 39.900000, value: 60 }
]

// 交通关键路段态势数据
export const trafficSituationData = [
  { name: '天安门广场', status: 'smooth', congestion: '15%', speed: '45km/h' },
  { name: '王府井大街', status: 'slow', congestion: '45%', speed: '25km/h' },
  { name: '中关村大街', status: 'congested', congestion: '75%', speed: '12km/h' },
  { name: '建国门内大街', status: 'smooth', congestion: '20%', speed: '40km/h' },
  { name: '西直门桥', status: 'congested', congestion: '80%', speed: '10km/h' },
  { name: '东三环中路', status: 'slow', congestion: '50%', speed: '22km/h' }
]

// 重要告警滚动栏数据
export const importantAlertsData = [
  { id: 1, type: '施工事故', level: 'high', area: '中关村大街', time: '10:30', description: '中关村大街发生施工坍塌事故，造成交通中断' },
  { id: 2, type: '水管爆裂', level: 'medium', area: '王府井大街', time: '10:15', description: '王府井大街水管爆裂，造成大面积积水' },
  { id: 3, type: '火灾报警', level: 'high', area: 'CBD商圈', time: '09:50', description: 'CBD商圈某写字楼发生火灾报警' },
  { id: 4, type: '交通拥堵', level: 'medium', area: '西直门桥', time: '09:30', description: '西直门桥发生严重交通拥堵，已持续30分钟' },
  { id: 5, type: '井盖丢失', level: 'low', area: '朝阳公园', time: '09:10', description: '朝阳公园附近发现井盖丢失' }
]

// 待办工单数据
export const todoWorkOrdersData = [
  { id: 1, type: '道路维修', level: 'medium', area: '中关村大街', time: '10:30', assignee: '张三', status: 'pending' },
  { id: 2, type: '水管抢修', level: 'high', area: '王府井大街', time: '10:15', assignee: '李四', status: 'processing' },
  { id: 3, type: '消防检查', level: 'medium', area: 'CBD商圈', time: '09:50', assignee: '王五', status: 'pending' },
  { id: 4, type: '交通疏导', level: 'high', area: '西直门桥', time: '09:30', assignee: '赵六', status: 'processing' },
  { id: 5, type: '井盖更换', level: 'low', area: '朝阳公园', time: '09:10', assignee: '孙七', status: 'pending' }
]

// 实时事件列表数据
export const realTimeEventsData = [
  { id: 1, type: '施工事故', level: 'high', area: '中关村大街', time: '10:30', status: 'new', source: '摄像头' },
  { id: 2, type: '水管爆裂', level: 'medium', area: '王府井大街', time: '10:15', status: 'assigned', source: '市民上报' },
  { id: 3, type: '火灾报警', level: 'high', area: 'CBD商圈', time: '09:50', status: 'processing', source: '消防系统' },
  { id: 4, type: '交通拥堵', level: 'medium', area: '西直门桥', time: '09:30', status: 'processing', source: '交通监控' },
  { id: 5, type: '井盖丢失', level: 'low', area: '朝阳公园', time: '09:10', status: 'pending', source: '巡查人员' },
  { id: 6, type: '路灯故障', level: 'low', area: '建国门内大街', time: '08:50', status: 'assigned', source: '物联网设备' },
  { id: 7, type: '垃圾堆积', level: 'medium', area: '东三环中路', time: '08:30', status: 'pending', source: '市民上报' },
  { id: 8, type: '交通事故', level: 'high', area: '西直门桥', time: '08:10', status: 'processing', source: '交通监控' }
]

// 资源池数据
export const resourcePoolData = {
  vehicles: [
    { id: 1, type: '工程车', status: 'available', location: '中关村', lng: 116.405285, lat: 39.920386 },
    { id: 2, type: '消防车', status: 'available', location: '王府井', lng: 116.412302, lat: 39.915256 },
    { id: 3, type: '救护车', status: 'busy', location: 'CBD', lng: 116.400000, lat: 39.925000 },
    { id: 4, type: '清障车', status: 'available', location: '西直门', lng: 116.390000, lat: 39.910000 },
    { id: 5, type: '洒水车', status: 'available', location: '朝阳公园', lng: 116.420000, lat: 39.930000 }
  ],
  personnel: [
    { id: 1, name: '张三', role: '工程师', status: 'available', location: '中关村' },
    { id: 2, name: '李四', role: '消防员', status: 'available', location: '王府井' },
    { id: 3, name: '王五', role: '医生', status: 'busy', location: 'CBD' },
    { id: 4, name: '赵六', role: '交警', status: 'available', location: '西直门' },
    { id: 5, name: '孙七', role: '环卫工人', status: 'available', location: '朝阳公园' }
  ],
  materials: [
    { id: 1, name: '井盖', quantity: 50, location: '仓库A' },
    { id: 2, name: '水管', quantity: 100, location: '仓库B' },
    { id: 3, name: '消防器材', quantity: 20, location: '仓库C' },
    { id: 4, name: '交通锥', quantity: 200, location: '仓库D' },
    { id: 5, name: '路灯', quantity: 30, location: '仓库E' }
  ]
}

// 历史分析数据
export const historicalAnalysisData = {
  trendData: [
    { date: '2023-01-01', events: 120,处置率: '85%', avgResponseTime: 20 },
    { date: '2023-01-02', events: 110,处置率: '87%', avgResponseTime: 18 },
    { date: '2023-01-03', events: 130,处置率: '83%', avgResponseTime: 22 },
    { date: '2023-01-04', events: 105,处置率: '90%', avgResponseTime: 16 },
    { date: '2023-01-05', events: 125,处置率: '88%', avgResponseTime: 17 },
    { date: '2023-01-06', events: 140,处置率: '82%', avgResponseTime: 23 },
    { date: '2023-01-07', events: 115,处置率: '89%', avgResponseTime: 15 }
  ],
  performanceData: [
    { area: '东城区', 处置率: '92%', avgResponseTime: 14, events: 250 },
    { area: '西城区', 处置率: '90%', avgResponseTime: 16, events: 230 },
    { area: '朝阳区', 处置率: '88%', avgResponseTime: 18, events: 350 },
    { area: '海淀区', 处置率: '85%', avgResponseTime: 20, events: 320 },
    { area: '丰台区', 处置率: '87%', avgResponseTime: 17, events: 280 }
  ]
}
