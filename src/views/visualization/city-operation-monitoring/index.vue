<template>
  <div class="city-operation-monitoring">
    <h1>城市运行监控中心</h1>
    
    <!-- 城市运行指数卡片 -->
    <div class="operation-index-card" v-if="cityOperationIndex">
      <h2>城市运行指数</h2>
      <div class="index-score">
        <span class="score">{{ cityOperationIndex.score }}</span>
        <span class="trend" :class="cityOperationIndex.trendType">{{ cityOperationIndex.trend }}</span>
      </div>
      <div class="index-indicators">
        <div class="indicator" v-for="(indicator, index) in cityOperationIndex.indicators" :key="index">
          <span class="indicator-name">{{ indicator.name }}</span>
          <span class="indicator-value">{{ indicator.value }}</span>
          <span class="indicator-trend" :class="indicator.trendType">{{ indicator.trend }}</span>
        </div>
      </div>
    </div>
    
    <!-- 全市热力图 -->
    <div class="heatmap-card">
      <h2>全市热力图</h2>
      <div class="heatmap-container">
        <!-- 这里可以集成地图组件，比如百度地图、高德地图或ECharts地图 -->
        <div class="placeholder">热力图展示区域</div>
      </div>
    </div>
    
    <!-- 交通关键路段态势 -->
    <div class="traffic-situation-card">
      <h2>交通关键路段态势</h2>
      <div class="traffic-list">
        <div class="traffic-item" v-for="(item, index) in trafficSituationData" :key="index">
          <span class="road-name">{{ item.name }}</span>
          <span class="status" :class="item.status">{{ getStatusText(item.status) }}</span>
          <span class="congestion">拥堵率: {{ item.congestion }}</span>
          <span class="speed">速度: {{ item.speed }}</span>
        </div>
      </div>
    </div>
    
    <!-- 重要告警与待办工单 -->
    <div class="alerts-orders-card">
      <div class="alerts-section">
        <h2>重要告警</h2>
        <div class="alerts-list">
          <div class="alert-item" v-for="(alert, index) in importantAlertsData" :key="index">
            <span class="alert-type">{{ alert.type }}</span>
            <span class="alert-level" :class="alert.level">{{ getLevelText(alert.level) }}</span>
            <span class="alert-area">{{ alert.area }}</span>
            <span class="alert-time">{{ alert.time }}</span>
            <span class="alert-description">{{ alert.description }}</span>
          </div>
        </div>
      </div>
      
      <div class="orders-section">
        <h2>待办工单</h2>
        <div class="orders-list">
          <div class="order-item" v-for="(order, index) in todoWorkOrdersData" :key="index">
            <span class="order-type">{{ order.type }}</span>
            <span class="order-level" :class="order.level">{{ getLevelText(order.level) }}</span>
            <span class="order-area">{{ order.area }}</span>
            <span class="order-time">{{ order.time }}</span>
            <span class="order-assignee">负责人: {{ order.assignee }}</span>
            <span class="order-status" :class="order.status">{{ getStatusText(order.status) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 实时事件列表 -->
    <div class="real-time-events-card">
      <h2>实时事件列表</h2>
      <div class="events-list">
        <div class="event-item" v-for="(event, index) in realTimeEventsData" :key="index">
          <span class="event-type">{{ event.type }}</span>
          <span class="event-level" :class="event.level">{{ getLevelText(event.level) }}</span>
          <span class="event-area">{{ event.area }}</span>
          <span class="event-time">{{ event.time }}</span>
          <span class="event-status" :class="event.status">{{ getStatusText(event.status) }}</span>
          <span class="event-source">来源: {{ event.source }}</span>
        </div>
      </div>
    </div>
    
    <!-- 资源池 -->
    <div class="resource-pool-card">
      <h2>资源池</h2>
      <div class="resource-tabs">
        <button class="tab-btn" :class="{ active: activeResourceTab === 'vehicles' }" @click="activeResourceTab = 'vehicles'">车辆</button>
        <button class="tab-btn" :class="{ active: activeResourceTab === 'personnel' }" @click="activeResourceTab = 'personnel'">人员</button>
        <button class="tab-btn" :class="{ active: activeResourceTab === 'materials' }" @click="activeResourceTab = 'materials'">物资</button>
      </div>
      
      <div class="resource-list" v-if="activeResourceTab === 'vehicles' && resourcePoolData">
        <div class="resource-item" v-for="(vehicle, index) in resourcePoolData.vehicles" :key="index">
          <span class="resource-type">{{ vehicle.type }}</span>
          <span class="resource-status" :class="vehicle.status">{{ getStatusText(vehicle.status) }}</span>
          <span class="resource-location">{{ vehicle.location }}</span>
        </div>
      </div>
      
      <div class="resource-list" v-if="activeResourceTab === 'personnel' && resourcePoolData">
        <div class="resource-item" v-for="(person, index) in resourcePoolData.personnel" :key="index">
          <span class="resource-name">{{ person.name }}</span>
          <span class="resource-role">{{ person.role }}</span>
          <span class="resource-status" :class="person.status">{{ getStatusText(person.status) }}</span>
          <span class="resource-location">{{ person.location }}</span>
        </div>
      </div>
      
      <div class="resource-list" v-if="activeResourceTab === 'materials' && resourcePoolData">
        <div class="resource-item" v-for="(material, index) in resourcePoolData.materials" :key="index">
          <span class="resource-name">{{ material.name }}</span>
          <span class="resource-quantity">数量: {{ material.quantity }}</span>
          <span class="resource-location">{{ material.location }}</span>
        </div>
      </div>
    </div>
    
    <!-- 历史分析 -->
    <div class="historical-analysis-card">
      <h2>历史分析</h2>
      <div class="analysis-tabs">
        <button class="tab-btn" :class="{ active: activeAnalysisTab === 'trend' }" @click="activeAnalysisTab = 'trend'">趋势分析</button>
        <button class="tab-btn" :class="{ active: activeAnalysisTab === 'performance' }" @click="activeAnalysisTab = 'performance'">绩效看板</button>
      </div>
      
      <div class="analysis-content" v-if="activeAnalysisTab === 'trend'">
        <div class="trend-chart">
          <!-- 这里可以集成ECharts趋势图 -->
          <div class="placeholder">趋势图展示区域</div>
        </div>
      </div>
      
      <div class="analysis-content" v-if="activeAnalysisTab === 'performance' && historicalAnalysisData">
        <div class="performance-table">
          <div class="table-header">
            <span>区域</span>
            <span>处置率</span>
            <span>平均响应时长</span>
            <span>事件数量</span>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="(item, index) in historicalAnalysisData.performanceData" :key="index">
              <span>{{ item.area }}</span>
              <span>{{ item.处置率 }}</span>
              <span>{{ item.avgResponseTime }}分钟</span>
              <span>{{ item.events }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  queryCityOperationIndex,
  queryCityHeatmapData,
  queryTrafficSituationData,
  queryImportantAlertsData,
  queryTodoWorkOrdersData,
  queryRealTimeEventsData,
  queryResourcePoolData,
  queryHistoricalAnalysisData
} from '@/api/visualization'

// 活跃的资源标签
const activeResourceTab = ref('vehicles')

// 活跃的分析标签
const activeAnalysisTab = ref('trend')

// 城市运行指数数据
const cityOperationIndex = ref<any>(null)

// 全市热力图数据
const cityHeatmapData = ref<any[]>([])

// 交通关键路段态势数据
const trafficSituationData = ref<any[]>([])

// 重要告警数据
const importantAlertsData = ref<any[]>([])

// 待办工单数据
const todoWorkOrdersData = ref<any[]>([])

// 实时事件列表数据
const realTimeEventsData = ref<any[]>([])

// 资源池数据
const resourcePoolData = ref<any>(null)

// 历史分析数据
const historicalAnalysisData = ref<any>(null)

// 组件挂载时获取数据
onMounted(async () => {
  try {
    // 获取城市运行指数
    const indexRes = await queryCityOperationIndex()
    cityOperationIndex.value = indexRes.data

    // 获取全市热力图数据
    const heatmapRes = await queryCityHeatmapData()
    cityHeatmapData.value = heatmapRes.data.data

    // 获取交通关键路段态势数据
    const trafficRes = await queryTrafficSituationData()
    trafficSituationData.value = trafficRes.data.data

    // 获取重要告警数据
    const alertsRes = await queryImportantAlertsData()
    importantAlertsData.value = alertsRes.data.data

    // 获取待办工单数据
    const ordersRes = await queryTodoWorkOrdersData()
    todoWorkOrdersData.value = ordersRes.data.data

    // 获取实时事件列表数据
    const eventsRes = await queryRealTimeEventsData()
    realTimeEventsData.value = eventsRes.data.data

    // 获取资源池数据
    const resourceRes = await queryResourcePoolData()
    resourcePoolData.value = resourceRes.data

    // 获取历史分析数据
    const analysisRes = await queryHistoricalAnalysisData()
    historicalAnalysisData.value = analysisRes.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'smooth': '畅通',
    'slow': '缓慢',
    'congested': '拥堵',
    'pending': '待处理',
    'processing': '处理中',
    'available': '可用',
    'busy': '忙碌',
    'new': '新事件',
    'assigned': '已指派'
  }
  return statusMap[status] || status
}

// 获取级别文本
const getLevelText = (level: string): string => {
  const levelMap: Record<string, string> = {
    'high': '高危',
    'medium': '中危',
    'low': '低危'
  }
  return levelMap[level] || level
}
</script>

<style scoped>
.city-operation-monitoring {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

/* 城市运行指数卡片 */
.operation-index-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.index-score {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.score {
  font-size: 36px;
  font-weight: 700;
  color: #165DFF;
  margin-right: 10px;
}

.trend {
  font-size: 16px;
  font-weight: 500;
}

.trend.up {
  color: #00B42A;
}

.trend.down {
  color: #F53F3F;
}

.index-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.indicator {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.indicator-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.indicator-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.indicator-trend {
  font-size: 14px;
  font-weight: 500;
}

.indicator-trend.up {
  color: #00B42A;
}

.indicator-trend.down {
  color: #F53F3F;
}

/* 热力图卡片 */
.heatmap-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.heatmap-container {
  height: 400px;
  background-color: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

/* 交通关键路段态势卡片 */
.traffic-situation-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.traffic-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
}

.traffic-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.road-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 5px;
}

.status.smooth {
  background-color: #E6F7FF;
  color: #165DFF;
}

.status.slow {
  background-color: #FFF7E6;
  color: #FAAD14;
}

.status.congested {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.congestion {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.speed {
  font-size: 12px;
  color: #666;
}

/* 重要告警与待办工单卡片 */
.alerts-orders-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.alerts-section, .orders-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alerts-list, .orders-list {
  max-height: 300px;
  overflow-y: auto;
}

.alert-item, .order-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}

.alert-type, .order-type {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.alert-level, .order-level {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 5px;
}

.alert-level.high, .order-level.high {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.alert-level.medium, .order-level.medium {
  background-color: #FFF7E6;
  color: #FAAD14;
}

.alert-level.low, .order-level.low {
  background-color: #F6FFED;
  color: #52C41A;
}

.alert-area, .order-area {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.alert-time, .order-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}

.alert-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.order-assignee {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.order-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
}

.order-status.pending {
  background-color: #FFF7E6;
  color: #FAAD14;
}

.order-status.processing {
  background-color: #E6F7FF;
  color: #165DFF;
}

/* 实时事件列表卡片 */
.real-time-events-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.events-list {
  max-height: 300px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}

.event-type {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.event-level {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 5px;
}

.event-level.high {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.event-level.medium {
  background-color: #FFF7E6;
  color: #FAAD14;
}

.event-level.low {
  background-color: #F6FFED;
  color: #52C41A;
}

.event-area {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.event-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}

.event-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 3px;
}

.event-status.new {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.event-status.assigned {
  background-color: #E6F7FF;
  color: #165DFF;
}

.event-status.processing {
  background-color: #F6FFED;
  color: #52C41A;
}

.event-source {
  font-size: 12px;
  color: #666;
}

/* 资源池卡片 */
.resource-pool-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.resource-tabs {
  display: flex;
  margin-bottom: 15px;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  cursor: pointer;
  font-size: 14px;
}

.tab-btn.active {
  background-color: #fff;
  border-bottom: 1px solid #fff;
  font-weight: 600;
}

.resource-list {
  max-height: 300px;
  overflow-y: auto;
}

.resource-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}

.resource-type, .resource-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.resource-role {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.resource-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 3px;
}

.resource-status.available {
  background-color: #F6FFED;
  color: #52C41A;
}

.resource-status.busy {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.resource-location {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.resource-quantity {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

/* 历史分析卡片 */
.historical-analysis-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.analysis-tabs {
  display: flex;
  margin-bottom: 15px;
}

.analysis-content {
  height: 400px;
  background-color: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.performance-table {
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 10px;
  background-color: #f9f9f9;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .alerts-orders-card {
    grid-template-columns: 1fr;
  }
  
  .index-indicators {
    grid-template-columns: 1fr;
  }
  
  .traffic-list {
    grid-template-columns: 1fr;
  }
}
</style>
