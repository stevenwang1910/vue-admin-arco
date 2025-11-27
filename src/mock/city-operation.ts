import Mock from 'mockjs'
import cityOperationData from './city-operation.json'

// 获取城市运行总览数据
Mock.mock(/\/api\/city-operation\/overview/, 'get', () => {
  return {
    code: 200,
    data: cityOperationData.cityOverview,
    message: 'success',
  }
})

// 获取热力图数据
Mock.mock(/\/api\/city-operation\/heatmap/, 'get', () => {
  return {
    code: 200,
    data: cityOperationData.heatmapData,
    message: 'success',
  }
})

// 获取交通态势数据
Mock.mock(/\/api\/city-operation\/traffic/, 'get', () => {
  return {
    code: 200,
    data: cityOperationData.trafficSituation,
    message: 'success',
  }
})

// 获取实时事件数据
Mock.mock(/\/api\/city-operation\/events/, 'get', (options: any) => {
  let events = [...cityOperationData.realTimeEvents]
  const params = options.url.split('?')[1]

  if (params) {
    const paramObj = new URLSearchParams(params)
    const type = paramObj.get('type')
    const level = paramObj.get('level')
    const status = paramObj.get('status')

    if (type) {
      events = events.filter((event) => event.type === type)
    }
    if (level) {
      events = events.filter((event) => event.level === level)
    }
    if (status) {
      events = events.filter((event) => event.status === status)
    }
  }

  return {
    code: 200,
    data: events,
    message: 'success',
  }
})

// 获取资源池数据
Mock.mock(/\/api\/city-operation\/resources/, 'get', () => {
  return {
    code: 200,
    data: cityOperationData.resourcePool,
    message: 'success',
  }
})

// 获取历史趋势数据
Mock.mock(/\/api\/city-operation\/trends/, 'get', () => {
  return {
    code: 200,
    data: cityOperationData.historicalTrends,
    message: 'success',
  }
})

// 指派事件任务
Mock.mock(/\/api\/city-operation\/events\/[^/]+\/assign/, 'post', (options: any) => {
  const eventId = options.url.match(/\/api\/city-operation\/events\/([^/]+)\/assign/)[1]
  const data = JSON.parse(options.body)

  // 模拟更新事件状态为已指派
  const eventIndex = cityOperationData.realTimeEvents.findIndex((e) => e.id === eventId)
  if (eventIndex !== -1) {
    cityOperationData.realTimeEvents[eventIndex].status = 'assigned'
  }

  return {
    code: 200,
    data: {
      eventId,
      resourceIds: data.resourceIds,
      sla: data.sla,
      assignTime: new Date().toISOString(),
    },
    message: '任务指派成功',
  }
})

// 更新事件状态
Mock.mock(/\/api\/city-operation\/events\/[^/]+\/status/, 'put', (options: any) => {
  const eventId = options.url.match(/\/api\/city-operation\/events\/([^/]+)\/status/)[1]
  const data = JSON.parse(options.body)

  // 模拟更新事件状态
  const eventIndex = cityOperationData.realTimeEvents.findIndex((e) => e.id === eventId)
  if (eventIndex !== -1) {
    cityOperationData.realTimeEvents[eventIndex].status = data.status
  }

  return {
    code: 200,
    data: {
      eventId,
      status: data.status,
      updateTime: new Date().toISOString(),
    },
    message: '事件状态更新成功',
  }
})
