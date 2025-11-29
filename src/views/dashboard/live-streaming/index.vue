<template>
  <div class="live-streaming-dashboard">
    <!-- 页面标题和操作区 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1>{{ $t('liveStreaming.title') }}</h1>
        <div class="live-status">
          <a-badge status="success" text="直播中" />
          <span class="live-time">已直播 2小时35分钟</span>
        </div>
      </div>
      <div class="header-right">
        <a-space>
          <a-button type="primary" @click="handleRefresh">
            <template #icon><icon-refresh /></template>
            {{ $t('liveStreaming.refresh.manual') }}
          </a-button>
          <a-switch v-model="autoRefresh" @change="handleAutoRefreshChange">
            <template #checked>{{ $t('liveStreaming.refresh.auto') }}</template>
            <template #unchecked>{{ $t('liveStreaming.refresh.auto') }}</template>
          </a-switch>
        </a-space>
      </div>
    </div>

    <!-- 数据筛选栏 -->
    <div class="filter-bar">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item :label="$t('liveStreaming.filter.timeRange')">
            <a-select v-model="timeRange" style="width: 100%">
              <a-option value="today">{{ $t('liveStreaming.filter.today') }}</a-option>
              <a-option value="yesterday">{{ $t('liveStreaming.filter.yesterday') }}</a-option>
              <a-option value="thisWeek">{{ $t('liveStreaming.filter.thisWeek') }}</a-option>
              <a-option value="thisMonth">{{ $t('liveStreaming.filter.thisMonth') }}</a-option>
              <a-option value="custom">{{ $t('liveStreaming.filter.custom') }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('liveStreaming.filter.productCategory')">
            <a-select v-model="productCategory" style="width: 100%" allow-clear>
              <a-option value="all">全部</a-option>
              <a-option value="clothing">服装</a-option>
              <a-option value="electronics">电子产品</a-option>
              <a-option value="beauty">美妆</a-option>
              <a-option value="food">食品</a-option>
              <a-option value="home">家居</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('liveStreaming.filter.streamer')">
            <a-select v-model="streamer" style="width: 100%" allow-clear>
              <a-option value="all">全部主播</a-option>
              <a-option value="zhang">张主播</a-option>
              <a-option value="li">李主播</a-option>
              <a-option value="wang">王主播</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('liveStreaming.filter.platform')">
            <a-select v-model="platform" style="width: 100%" allow-clear>
              <a-option value="all">全部平台</a-option>
              <a-option value="douyin">抖音</a-option>
              <a-option value="taobao">淘宝</a-option>
              <a-option value="kuaishou">快手</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </div>

    <!-- 核心指标卡片 -->
    <a-row :gutter="16" class="metrics-row">
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <metric-card
          :title="$t('liveStreaming.realtime.onlineUsers')"
          :value="realtimeData.onlineUsers"
          unit="人"
          trend="up"
          :trend-value="12.5"
          icon="icon-user"
          color="#52c41a"
        />
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <metric-card
          :title="$t('liveStreaming.realtime.totalViews')"
          :value="realtimeData.totalViews"
          unit="人"
          trend="up"
          :trend-value="8.3"
          icon="icon-eye"
          color="#1890ff"
        />
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <metric-card
          :title="$t('liveStreaming.realtime.salesAmount')"
          :value="realtimeData.salesAmount"
          unit="元"
          trend="up"
          :trend-value="15.7"
          icon="icon-bulb"
          color="#fa8c16"
        />
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <metric-card
          :title="$t('liveStreaming.realtime.orderCount')"
          :value="realtimeData.orderCount"
          unit="单"
          trend="down"
          :trend-value="-3.2"
          icon="icon-file"
          color="#722ed1"
        />
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <metric-card
          :title="$t('liveStreaming.realtime.avgOrderValue')"
          :value="realtimeData.avgOrderValue"
          unit="元"
          trend="up"
          :trend-value="5.1"
          icon="icon-calendar"
          color="#13c2c2"
        />
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <metric-card
          :title="$t('liveStreaming.realtime.conversionRate')"
          :value="realtimeData.conversionRate"
          unit="%"
          trend="up"
          :trend-value="2.8"
          icon="icon-star"
          color="#eb2f96"
        />
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="16" class="charts-row">
      <!-- 在线人数趋势图 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card :title="$t('liveStreaming.chart.onlineTrend')" class="chart-card">
          <line-chart :data="onlineTrendData" :height="300" color="#52c41a" />
        </a-card>
      </a-col>

      <!-- 销售趋势图 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card :title="$t('liveStreaming.chart.salesTrend')" class="chart-card">
          <line-chart :data="salesTrendData" :height="300" color="#1890ff" dual-axis />
        </a-card>
      </a-col>

      <!-- 商品销量排行 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card :title="$t('liveStreaming.chart.productSales')" class="chart-card">
          <bar-chart :data="productSalesData" :height="300" horizontal />
        </a-card>
      </a-col>

      <!-- 用户画像分布 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card :title="$t('liveStreaming.chart.userProfile')" class="chart-card">
          <pie-chart :data="userProfileData" :height="300" />
        </a-card>
      </a-col>

      <!-- 主播表现对比 -->
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card :title="$t('liveStreaming.chart.streamerPerformance')" class="chart-card">
          <streamer-performance-chart :data="streamerPerformanceData" :height="400" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 数据下钻分析 -->
    <div class="drill-down-section">
      <data-drill-down />
    </div>

    <!-- 异常预警面板 -->
    <div class="warning-section">
      <warning-panel @view-detail="handleWarningDetail" @ignore-warning="handleIgnoreWarning" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getOnlineTrendData,
  getProductSalesData,
  getRealtimeData,
  getSalesTrendData,
  getStreamerPerformanceData,
  getUserProfileData,
} from '@/api/live-streaming'
import { Message } from '@arco-design/web-vue'
import { IconRefresh } from '@arco-design/web-vue/es/icon'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BarChart from './components/BarChart.vue'
import DataDrillDown from './components/DataDrillDown.vue'
import LineChart from './components/LineChart.vue'
import MetricCard from './components/MetricCard.vue'
import PieChart from './components/PieChart.vue'
import StreamerPerformanceChart from './components/StreamerPerformanceChart.vue'
import WarningPanel from './components/WarningPanel.vue'

const { t } = useI18n()

// 响应式数据
const timeRange = ref('today')
const productCategory = ref('all')
const streamer = ref('all')
const platform = ref('all')
const autoRefresh = ref(false)

// 实时数据
const realtimeData = reactive({
  onlineUsers: 12856,
  totalViews: 456789,
  salesAmount: 892345.67,
  orderCount: 3456,
  avgOrderValue: 258.4,
  conversionRate: 3.8,
})

// 图表数据
const onlineTrendData = ref([])
const salesTrendData = ref([])
const productSalesData = ref([])
const userProfileData = ref([])
const streamerPerformanceData = ref([])

// 异常预警
const warnings = ref([
  {
    id: 1,
    type: 'warning',
    message: t('liveStreaming.warning.lowConversion'),
  },
  {
    id: 2,
    type: 'error',
    message: t('liveStreaming.warning.inventoryLow'),
  },
])

// 数据下钻状态
const detailModalVisible = ref(false)
const selectedStreamerId = ref('')
const selectedStreamerName = ref('')

let refreshTimer: ReturnType<typeof setInterval> | null = null

// 获取数据
const fetchData = async () => {
  try {
    const [onlineTrend, salesTrend, productSales, userProfile, streamerPerformance] = await Promise.all([
      getOnlineTrendData(),
      getSalesTrendData(),
      getProductSalesData(),
      getUserProfileData(),
      getStreamerPerformanceData(),
    ])

    onlineTrendData.value = onlineTrend
    salesTrendData.value = salesTrend
    productSalesData.value = productSales
    userProfileData.value = userProfile
    streamerPerformanceData.value = streamerPerformance

    // 更新实时数据
    const realtime = await getRealtimeData()
    Object.assign(realtimeData, realtime)
  } catch (error) {
    Message.error('数据加载失败')
  }
}

// 手动刷新
const handleRefresh = () => {
  fetchData()
  Message.success('数据已刷新')
}

// 自动刷新切换
const handleAutoRefreshChange = (value: boolean) => {
  if (value) {
    refreshTimer = setInterval(fetchData, 30000) // 30秒刷新一次
    Message.success('已开启自动刷新')
  } else {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
    Message.info('已关闭自动刷新')
  }
}

// 监听筛选条件变化
watch([timeRange, productCategory, streamer, platform], () => {
  fetchData()
})

// 指标卡片点击事件
const handleMetricClick = (metric: string) => {
  Message.info(`查看${metric}详细数据`)
  // 这里可以跳转到详细页面或显示详细弹窗
}

// 图表点击事件
const handleChartClick = (params: any) => {
  // 这里可以实现图表的数据下钻功能
  // 暂时注释掉console.log以避免ESLint警告
  // console.log('图表点击事件:', params)
}

// 预警详情处理
const handleWarningDetail = (warning: any) => {
  Message.info(`查看预警详情: ${warning.message}`)
  // 这里可以显示详细的预警信息或跳转到相关页面
}

// 忽略预警处理
const handleIgnoreWarning = (warning: any) => {
  Message.success(`已忽略预警: ${warning.message}`)
}

// 主播数据下钻
const handleStreamerDetail = (streamerId: string, streamerName: string) => {
  selectedStreamerId.value = streamerId
  selectedStreamerName.value = streamerName
  detailModalVisible.value = true
}

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped lang="less">
.live-streaming-dashboard {
  padding: 16px;
  background-color: var(--color-fill-2);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .header-left {
    h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: var(--color-text-1);
    }

    .live-status {
      display: flex;
      align-items: center;
      gap: 12px;

      .live-time {
        color: var(--color-text-3);
        font-size: 14px;
      }
    }
  }
}

.filter-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metrics-row {
  margin-bottom: 16px;
}

.charts-row {
  .chart-card {
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    :deep(.arco-card-header) {
      border-bottom: 1px solid var(--color-border-2);
    }
  }
}

.drill-down-section {
  margin-bottom: 16px;
}

.warning-section {
  margin-bottom: 16px;
}

.warning-bar {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 300px;
  z-index: 1000;

  .arco-alert {
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .warning-bar {
    position: static;
    width: 100%;
    margin-top: 16px;
  }
}
</style>
