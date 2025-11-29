<template>
  <div class="live-commerce-dashboard">
    <!-- 头部筛选区域 -->
    <div class="dashboard-header">
      <div class="header-title">
        <icon-dashboard class="title-icon" />
        <span>直播销售数据大盘</span>
      </div>
      <div class="header-actions">
        <a-space>
          <a-badge :count="alertCount" :dot="hasUnreadAlerts">
            <a-button type="text" @click="showAlertPanel = !showAlertPanel">
              <icon-exclamation-circle />
              预警
            </a-button>
          </a-badge>
          <a-button type="primary" @click="handleRefresh">
            <icon-refresh />
            刷新数据
          </a-button>
        </a-space>
      </div>
      <div class="header-filters">
        <a-space>
          <a-select v-model="timeDimension" placeholder="时间维度" style="width: 120px" @change="handleFilterChange">
            <a-option value="realtime">实时</a-option>
            <a-option value="today">今日</a-option>
            <a-option value="week">本周</a-option>
            <a-option value="month">本月</a-option>
          </a-select>
          <a-select v-model="selectedCategory" placeholder="商品类别" style="width: 120px" @change="handleFilterChange">
            <a-option value="">全部类别</a-option>
            <a-option v-for="category in categoryList" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-option>
          </a-select>
          <a-select v-model="selectedAnchor" placeholder="主播" style="width: 120px" @change="handleFilterChange">
            <a-option value="">全部主播</a-option>
            <a-option v-for="anchor in anchorList" :key="anchor.id" :value="anchor.id">
              {{ anchor.name }}
            </a-option>
          </a-select>
        </a-space>
      </div>
    </div>

    <!-- 预警面板 -->
    <div v-if="showAlertPanel" class="alert-panel-container">
      <alert-panel :alerts="alerts" @mark-read="markAlertAsRead" @clear-all="clearAllAlerts" @clear-read="clearReadAlerts" />
    </div>

    <!-- 核心指标卡片 -->
    <div class="metrics-section">
      <a-row :gutter="16">
        <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" v-for="metric in metrics" :key="metric.key">
          <metric-card :data="metric" @click="handleMetricClick(metric)" @drill-down="handleMetricDrillDown" />
        </a-col>
      </a-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <a-row :gutter="16">
        <!-- 销售趋势图表 -->
        <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <a-card title="销售趋势" :bordered="false">
            <sales-trend-chart :data="salesTrendData" :loading="chartLoading" @drill-down="handleChartDrillDown" />
          </a-card>
        </a-col>

        <!-- 实时在线人数图表 -->
        <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <a-card title="实时在线人数" :bordered="false">
            <online-users-chart :data="onlineUsersData" :loading="chartLoading" @drill-down="handleChartDrillDown" />
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 商品销量排行图表 -->
        <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <a-card title="商品销量排行" :bordered="false">
            <product-sales-chart
              :data="productSalesData"
              :loading="chartLoading"
              @product-click="handleProductClick"
              @drill-down="handleProductDrillDown"
            />
          </a-card>
        </a-col>

        <!-- 用户画像分布图表 -->
        <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <a-card title="用户画像分布" :bordered="false">
            <a-tabs v-model="userProfileType" type="card">
              <a-tab-pane key="age" title="年龄分布">
                <user-profile-chart type="age" :data="userProfileData.age" :loading="chartLoading" @drill-down="handleChartDrillDown" />
              </a-tab-pane>
              <a-tab-pane key="gender" title="性别分布">
                <user-profile-chart
                  type="gender"
                  :data="userProfileData.gender"
                  :loading="chartLoading"
                  @drill-down="handleChartDrillDown"
                />
              </a-tab-pane>
              <a-tab-pane key="region" title="地区分布">
                <user-profile-chart
                  type="region"
                  :data="userProfileData.region"
                  :loading="chartLoading"
                  @drill-down="handleChartDrillDown"
                />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 实时订单列表 -->
    <div class="orders-section">
      <a-card title="实时订单" :bordered="false">
        <template #extra>
          <a-space>
            <a-badge :count="newOrderCount" :dot="newOrderCount > 0">
              <span>新订单</span>
            </a-badge>
            <a-button type="text" size="mini" @click="resetNewOrderCount">
              <icon-check />
              标记已读
            </a-button>
          </a-space>
        </template>
        <realtime-orders-list
          :orders="realtimeOrders"
          :new-count="newOrderCount"
          @order-click="handleOrderClick"
          @drill-down="handleOrderDrillDown"
        />
      </a-card>
    </div>

    <!-- 数据下钻详情弹窗 -->
    <drill-down-modal
      v-model:visible="drillDownVisible"
      :data="drillDownData"
      :title="drillDownTitle"
      :type="drillDownType"
      @close="closeDrillDown"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useAppStore } from '@/store'
import { useLiveCommerceData } from '@/hooks/use-live-commerce-data'
import { useDataDrillDown, useAlertSystem } from '@/hooks/use-live-commerce-drilldown'
import MetricCard from './components/metric-card.vue'
import SalesTrendChart from './components/sales-trend-chart.vue'
import OnlineUsersChart from './components/online-users-chart.vue'
import ProductSalesChart from './components/product-sales-chart.vue'
import UserProfileChart from './components/user-profile-chart.vue'
import RealtimeOrdersList from './components/realtime-orders-list.vue'
import DrillDownModal from './components/drill-down-modal.vue'
import AlertPanel from './components/alert-panel.vue'
import type {
  MetricData,
  ChartDataPoint,
  ProductSalesData,
  UserProfileData,
  OrderData,
  Anchor,
  Category,
  SalesTrendData,
  FilterOptions,
} from './types'

const appStore = useAppStore()

// 使用数据Hook
const {
  metrics,
  salesTrendData,
  onlineUsersData,
  productSalesData,
  userProfileData,
  realtimeOrders,
  anchorList,
  categoryList,
  chartLoading,
  newOrderCount,
  fetchData,
  refreshData,
  startRealtimeUpdate,
  stopRealtimeUpdate,
  resetNewOrderCount,
} = useLiveCommerceData()

// 使用下钻Hook
const {
  drillDownVisible,
  drillDownData,
  drillDownTitle,
  drillDownType,
  openDrillDown,
  closeDrillDown,
  getMetricDetails,
  getProductDetails,
  getOrderDetails,
} = useDataDrillDown()

// 使用预警Hook
const { alerts, alertCount, hasUnreadAlerts, checkAlerts, markAlertAsRead, clearAllAlerts, clearReadAlerts } = useAlertSystem()

// 状态数据
const loading = ref(false)
const timeDimension = ref('realtime')
const selectedAnchor = ref('')
const selectedCategory = ref('')
const userProfileType = ref('age')
const showAlertPanel = ref(false)

// 筛选条件
const filters = reactive<FilterOptions>({
  timeDimension: 'realtime',
  anchor: '',
  category: '',
  startTime: '',
  endTime: '',
})

// 监听筛选条件变化
watch(
  [timeDimension, selectedAnchor, selectedCategory],
  () => {
    filters.timeDimension = timeDimension.value
    filters.anchor = selectedAnchor.value
    filters.category = selectedCategory.value
    fetchData(filters)
  },
  { immediate: false }
)

// 刷新数据
const handleRefresh = () => {
  refreshData(filters)
}

// 处理指标卡片点击
const handleMetricClick = (metric: MetricData) => {
  // TODO: 查看指标详情功能待实现
}

// 处理指标下钻
const handleMetricDrillDown = (metric: MetricData) => {
  const details = getMetricDetails(metric)
  openDrillDown(details, `${metric.title} - 详细分析`, 'metric')
}

// 处理商品点击
const handleProductClick = (product: ProductSalesData) => {
  // TODO: 查看商品详情功能待实现
}

// 处理商品下钻
const handleProductDrillDown = (product: ProductSalesData) => {
  const details = getProductDetails(product)
  openDrillDown(details, `${product.name} - 商品分析`, 'product')
}

// 处理订单点击
const handleOrderClick = (order: OrderData) => {
  // TODO: 查看订单详情功能待实现
}

// 处理订单下钻
const handleOrderDrillDown = (order: OrderData) => {
  const details = getOrderDetails(order)
  openDrillDown(details, `订单详情 - ${order.id}`, 'order')
}

// 处理图表下钻
const handleChartDrillDown = (data: any, title: string) => {
  openDrillDown(data, title, 'metric')
}

// 监听指标数据变化，检查预警
watch(
  metrics,
  (newMetrics) => {
    checkAlerts(newMetrics)
  },
  { deep: true, immediate: false }
)

// 生命周期
onMounted(async () => {
  await fetchData(filters)
  startRealtimeUpdate()
})

onUnmounted(() => {
  stopRealtimeUpdate()
})

// 计算属性
const onlineStatusColor = computed(() => {
  const currentUsers = onlineUsersData.value[onlineUsersData.value.length - 1]?.value || 0
  if (currentUsers > 1000) return 'green'
  if (currentUsers > 500) return 'orange'
  return 'red'
})

const onlineStatusText = computed(() => {
  const currentUsers = onlineUsersData.value[onlineUsersData.value.length - 1]?.value || 0
  if (currentUsers > 1000) return '活跃'
  if (currentUsers > 500) return '正常'
  return '偏低'
})

// 显示更多商品
const showMoreProducts = () => {
  // TODO: 查看更多商品功能待实现
}

// 查看全部订单
const viewAllOrders = () => {
  // TODO: 查看全部订单功能待实现
}
</script>

<script lang="ts">
export default {
  name: 'LiveCommerceDashboard',
}
</script>

<style lang="less" scoped>
.live-commerce-dashboard {
  padding: 16px;
  background-color: var(--color-fill-2);
  min-height: 100vh;
}

.filter-header {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.filter-label {
  font-size: 14px;
  color: var(--color-text-2);
  margin-right: 8px;
}

.metrics-cards {
  margin-bottom: 16px;
}

.charts-container {
  margin-bottom: 16px;
}

.chart-panel {
  background-color: var(--color-bg-2);
  border-radius: 4px;
  padding: 16px;
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-1);
  }
}

.realtime-orders {
  background-color: var(--color-bg-2);
  border-radius: 4px;
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-1);
  }
}

// 响应式布局
@media (max-width: 768px) {
  .filter-header {
    .arco-col {
      margin-bottom: 12px;
    }
  }

  .chart-panel {
    margin-bottom: 16px;
  }
}
</style>
