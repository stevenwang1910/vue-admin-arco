import Mock from 'mockjs'
import setupMock, { successResponseWrap } from '@/utils/setup-mock'
import {
  cityOperationIndex,
  cityHeatmapData,
  trafficSituationData,
  importantAlertsData,
  todoWorkOrdersData,
  realTimeEventsData,
  resourcePoolData,
  historicalAnalysisData
} from './data'

setupMock({
  setup() {
    // 城市运行指数
    Mock.mock(new RegExp('/api/city-operation-index'), () => {
      return successResponseWrap(cityOperationIndex)
    })

    // 全市热力图数据
    Mock.mock(new RegExp('/api/city-heatmap-data'), () => {
      return successResponseWrap({ data: cityHeatmapData })
    })

    // 交通关键路段态势数据
    Mock.mock(new RegExp('/api/traffic-situation-data'), () => {
      return successResponseWrap({ data: trafficSituationData })
    })

    // 重要告警数据
    Mock.mock(new RegExp('/api/important-alerts-data'), () => {
      return successResponseWrap({ data: importantAlertsData })
    })

    // 待办工单数据
    Mock.mock(new RegExp('/api/todo-work-orders-data'), () => {
      return successResponseWrap({ data: todoWorkOrdersData })
    })

    // 实时事件列表数据
    Mock.mock(new RegExp('/api/real-time-events-data'), () => {
      return successResponseWrap({ data: realTimeEventsData })
    })

    // 资源池数据
    Mock.mock(new RegExp('/api/resource-pool-data'), () => {
      return successResponseWrap(resourcePoolData)
    })

    // 历史分析数据
    Mock.mock(new RegExp('/api/historical-analysis-data'), () => {
      return successResponseWrap(historicalAnalysisData)
    })
  },
})
