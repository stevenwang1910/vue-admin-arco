<template>
  <div class="container">
    <Breadcrumb :items="['menu.visualization', 'menu.visualization.cityOperation']" />
    <a-space direction="vertical" :size="12" fill>
      <a-space direction="vertical" :size="16" fill>
        <!-- 城市运行总览卡片 -->
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="6">
              <a-card hoverable>
                <div class="card-content">
                  <div class="card-title">城市运行指数</div>
                  <div class="card-value">{{ cityOverview.operationIndex }}</div>
                  <div class="card-desc">综合得分</div>
                </div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card hoverable>
                <div class="card-content">
                  <div class="card-title">事件密度</div>
                  <div class="card-value">{{ cityOverview.eventDensity }}</div>
                  <div class="card-desc">每平方公里事件数</div>
                </div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card hoverable>
                <div class="card-content">
                  <div class="card-title">拥堵指数</div>
                  <div class="card-value">{{ cityOverview.congestionIndex }}</div>
                  <div class="card-desc">交通拥堵情况</div>
                </div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card hoverable>
                <div class="card-content">
                  <div class="card-title">待处理事件</div>
                  <div class="card-value">{{ cityOverview.pendingTasks }}</div>
                  <div class="card-desc">当前待处理任务数</div>
                </div>
              </a-card>
            </a-grid-item>
          </a-grid>
        </div>

        <!-- 地图和事件列表 -->
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="16">
              <a-card title="城市事件热力图" :bordered="false">
                <div class="map-container">
                  <div class="map-placeholder">
                    <icon-location style="font-size: 48px; color: var(--color-text-3)" />
                    <p>地图组件占位</p>
                    <p>实际项目中可集成 ECharts 地图或其他地图库</p>
                  </div>
                </div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="8">
              <a-card title="实时事件列表" :bordered="false">
                <div class="event-list">
                  <a-list :data-source="realTimeEvents" :locale="{ emptyText: '暂无事件' }">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta>
                          <template #title>
                            <a-tag :color="getEventLevelColor(item.level)">
                              {{ item.type }}
                            </a-tag>
                          </template>
                          <template #description>
                            <div class="event-info">
                              <p>{{ item.location }}</p>
                              <p class="event-time">{{ item.reportTime }}</p>
                              <a-tag :color="getEventStatusColor(item.status)">
                                {{ getEventStatusText(item.status) }}
                              </a-tag>
                            </div>
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </div>
              </a-card>
            </a-grid-item>
          </a-grid>
        </div>

        <!-- 交通态势和历史趋势 -->
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="12">
              <a-card title="交通关键路段态势" :bordered="false">
                <a-list :data-source="trafficSituation" :locale="{ emptyText: '暂无交通数据' }">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #title>{{ item.roadName }}</template>
                        <template #description>
                          <div class="traffic-info">
                            <a-progress
                              :percent="item.congestionLevel"
                              :status="getTrafficStatus(item.status)"
                              :show-info="false"
                              stroke-width="6"
                            />
                            <p class="traffic-desc">拥堵度: {{ item.congestionLevel }}% | 延误: {{ item.delayTime }}分钟</p>
                          </div>
                        </template>
                      </a-list-item-meta>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="12">
              <a-card title="事件历史趋势" :bordered="false">
                <div class="chart-placeholder">
                  <icon-bar-chart style="font-size: 48px; color: var(--color-text-3)" />
                  <p>图表组件占位</p>
                  <p>实际项目中可集成 ECharts 折线图展示趋势</p>
                </div>
              </a-card>
            </a-grid-item>
          </a-grid>
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { IconLocation, IconBarChart } from '@arco-design/web-vue/es/icon'
import { getCityOverview, getRealTimeEvents, getTrafficSituation } from '@/api/city-operation'

// 城市运行总览数据
const cityOverview = ref({
  operationIndex: 0,
  eventDensity: 0,
  congestionIndex: 0,
  alarmCount: 0,
  pendingTasks: 0,
})

// 实时事件数据
const realTimeEvents = ref([])

// 交通态势数据
const trafficSituation = ref([])

// 获取事件级别颜色
const getEventLevelColor = (level: string) => {
  const colorMap = {
    high: 'danger',
    medium: 'warning',
    low: 'success',
  }
  return colorMap[level] || 'default'
}

// 获取事件状态颜色
const getEventStatusColor = (status: string) => {
  const colorMap = {
    pending: 'warning',
    assigned: 'processing',
    processing: 'primary',
    completed: 'success',
    closed: 'default',
  }
  return colorMap[status] || 'default'
}

// 获取事件状态文本
const getEventStatusText = (status: string) => {
  const textMap = {
    pending: '待处理',
    assigned: '已指派',
    processing: '处理中',
    completed: '已完成',
    closed: '已关闭',
  }
  return textMap[status] || status
}

// 获取交通状态
const getTrafficStatus = (status: string) => {
  const statusMap = {
    congested: 'exception',
    slow: 'warning',
    normal: 'success',
  }
  return statusMap[status] || 'default'
}

// 加载数据
const loadData = async () => {
  try {
    const overviewRes = await getCityOverview()
    if (overviewRes.code === 200) {
      cityOverview.value = overviewRes.data
    }

    const eventsRes = await getRealTimeEvents()
    if (eventsRes.code === 200) {
      realTimeEvents.value = eventsRes.data
    }

    const trafficRes = await getTrafficSituation()
    if (trafficRes.code === 200) {
      trafficSituation.value = trafficRes.data
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
  // 模拟实时数据更新
  setInterval(() => {
    loadData()
  }, 30000) // 每30秒更新一次
})
</script>

<script lang="ts">
export default {
  name: 'CityOperation',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  margin-bottom: 20px;
}

.card-content {
  text-align: center;
}

.card-title {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 8px;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 12px;
  color: var(--color-text-3);
}

.map-container {
  height: 400px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder,
.chart-placeholder {
  text-align: center;
  color: var(--color-text-3);
}

.event-list {
  max-height: 400px;
  overflow-y: auto;
}

.event-info {
  p {
    margin: 0 0 4px 0;
    font-size: 12px;
  }

  .event-time {
    color: var(--color-text-3);
  }
}

.traffic-info {
  .traffic-desc {
    margin: 8px 0 0 0;
    font-size: 12px;
    color: var(--color-text-3);
  }
}
</style>
