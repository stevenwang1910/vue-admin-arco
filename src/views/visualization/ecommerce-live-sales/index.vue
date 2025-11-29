<template>
  <div class="container">
    <Breadcrumb :items="['menu.visualization', 'menu.visualization.ecommerceLiveSales']" />
    <a-space direction="vertical" :size="12" fill>
      <a-space direction="vertical" :size="16" fill>
        <!-- 数据筛选区域 -->
        <div class="filter-container">
          <a-row :gutter="[16, 16]">
            <a-col :span="6">
              <a-select v-model:value="timeRange" placeholder="选择时间范围">
                <a-select-option value="today">今日</a-select-option>
                <a-select-option value="yesterday">昨日</a-select-option>
                <a-select-option value="week">本周</a-select-option>
                <a-select-option value="month">本月</a-select-option>
                <a-select-option value="quarter">本季度</a-select-option>
                <a-select-option value="year">本年</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select v-model:value="productCategory" placeholder="选择商品类别">
                <a-select-option value="all">全部类别</a-select-option>
                <a-select-option value="electronics">电子产品</a-select-option>
                <a-select-option value="clothing">服装</a-select-option>
                <a-select-option value="home">家居用品</a-select-option>
                <a-select-option value="beauty">美妆个护</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select v-model:value="anchor" placeholder="选择主播">
                <a-select-option value="all">全部主播</a-select-option>
                <a-select-option value="anchor1">主播1</a-select-option>
                <a-select-option value="anchor2">主播2</a-select-option>
                <a-select-option value="anchor3">主播3</a-select-option>
                <a-select-option value="anchor4">主播4</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-button type="primary" @click="applyFilter">应用筛选</a-button>
            </a-col>
          </a-row>
        </div>

        <!-- 实时数据概览 -->
        <div class="overview-container">
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="6">
              <a-card title="实时在线人数" :bordered="false">
                <div class="big-number" ref="onlineCount">{{ overviewData.onlineCount }}</div>
                <div class="trend positive">+{{ overviewData.onlineGrowth }}%</div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card title="累计观看人次" :bordered="false">
                <div class="big-number">{{ overviewData.viewCount }}</div>
                <div class="trend positive">+{{ overviewData.viewGrowth }}%</div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card title="销售额" :bordered="false">
                <div class="big-number">¥{{ overviewData.salesAmount }}</div>
                <div class="trend positive">+{{ overviewData.salesGrowth }}%</div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card title="订单量" :bordered="false">
                <div class="big-number">{{ overviewData.orderCount }}</div>
                <div class="trend positive">+{{ overviewData.orderGrowth }}%</div>
              </a-card>
            </a-grid-item>
          </a-grid>
          <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
            <a-grid-item :span="6">
              <a-card title="客单价" :bordered="false">
                <div class="big-number">¥{{ overviewData.averageOrderValue }}</div>
                <div class="trend positive">+{{ overviewData.aovGrowth }}%</div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card title="转化率" :bordered="false">
                <div class="big-number">{{ overviewData.conversionRate }}%</div>
                <div class="trend positive">+{{ overviewData.conversionGrowth }}%</div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card title="新增粉丝" :bordered="false">
                <div class="big-number">{{ overviewData.newFans }}</div>
                <div class="trend positive">+{{ overviewData.fansGrowth }}%</div>
              </a-card>
            </a-grid-item>
            <a-grid-item :span="6">
              <a-card title="互动率" :bordered="false">
                <div class="big-number">{{ overviewData.interactionRate }}%</div>
                <div class="trend positive">+{{ overviewData.interactionGrowth }}%</div>
              </a-card>
            </a-grid-item>
          </a-grid>
        </div>

        <!-- 数据图表区域 -->
        <div class="charts-container">
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="16">
              <a-card title="销售趋势分析" :bordered="false">
                <line-chart :data="salesTrendData" />
              </a-card>
            </a-grid-item>
            <a-grid-item :span="8">
              <a-card title="用户画像分布" :bordered="false">
                <pie-chart :data="userProfileData" />
              </a-card>
            </a-grid-item>
          </a-grid>
          <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
            <a-grid-item :span="12">
              <a-card title="商品销量对比" :bordered="false">
                <bar-chart :data="productSalesData" />
              </a-card>
            </a-grid-item>
            <a-grid-item :span="12">
              <a-card title="主播表现对比" :bordered="false">
                <bar-chart :data="anchorPerformanceData" />
              </a-card>
            </a-grid-item>
          </a-grid>
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { useRequest } from '@/hooks/request'
import { onMounted, onUnmounted, ref } from 'vue'
import BarChart from './components/bar-chart.vue'
import LineChart from './components/line-chart.vue'
import PieChart from './components/pie-chart.vue'

// 状态定义
const timeRange = ref('today')
const productCategory = ref('all')
const anchor = ref('all')
const onlineCount = ref<HTMLElement | null>(null)

// 数据定义
const overviewData = ref({
  onlineCount: 0,
  onlineGrowth: 0,
  viewCount: 0,
  viewGrowth: 0,
  salesAmount: 0,
  salesGrowth: 0,
  orderCount: 0,
  orderGrowth: 0,
  averageOrderValue: 0,
  aovGrowth: 0,
  conversionRate: 0,
  conversionGrowth: 0,
  newFans: 0,
  fansGrowth: 0,
  interactionRate: 0,
  interactionGrowth: 0,
})

const salesTrendData = ref<{
  xAxis: string[]
  data: { name: string; value: number[] }[]
}>({
  xAxis: [],
  data: [],
})

const userProfileData = ref<{ name: string; value: number }[]>([])

const productSalesData = ref<{
  xAxis: string[]
  data: { name: string; value: number[] }[]
}>({
  xAxis: [],
  data: [],
})

const anchorPerformanceData = ref<{
  xAxis: string[]
  data: { name: string; value: number[] }[]
}>({
  xAxis: [],
  data: [],
})

// 定时器
let timer: number | null = null

// API请求
const { get: getOverviewData } = useRequest('GET /api/live-sales/overview')
const { get: getSalesTrendData } = useRequest('POST /api/live-sales/trend')
const { get: getUserProfileData } = useRequest('GET /api/live-sales/user-profile')
const { get: getProductSalesData } = useRequest('GET /api/live-sales/product-sales')
const { get: getAnchorPerformanceData } = useRequest('GET /api/live-sales/anchor-performance')

// 应用筛选
const applyFilter = async () => {
  console.log('应用筛选条件:', {
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })

  // 获取概览数据
  const overviewRes = await getOverviewData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (overviewRes.success) {
    overviewData.value = overviewRes.data
  }

  // 获取销售趋势数据
  const trendRes = await getSalesTrendData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (trendRes.success) {
    salesTrendData.value = trendRes.data
  }

  // 获取用户画像数据
  const profileRes = await getUserProfileData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (profileRes.success) {
    userProfileData.value = profileRes.data
  }

  // 获取商品销量数据
  const productRes = await getProductSalesData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (productRes.success) {
    productSalesData.value = productRes.data
  }

  // 获取主播表现数据
  const anchorRes = await getAnchorPerformanceData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (anchorRes.success) {
    anchorPerformanceData.value = anchorRes.data
  }
}

// 模拟实时数据更新
const updateRealTimeData = () => {
  // 随机更新实时在线人数
  const newOnlineCount = Math.floor(Math.random() * 1000) + 1000
  const onlineGrowth = (((newOnlineCount - overviewData.value.onlineCount) / overviewData.value.onlineCount) * 100).toFixed(2)
  overviewData.value.onlineCount = newOnlineCount
  overviewData.value.onlineGrowth = parseFloat(onlineGrowth)

  // 随机更新销售额
  const newSalesAmount = Math.floor(Math.random() * 50000) + overviewData.value.salesAmount
  const salesGrowth = (((newSalesAmount - overviewData.value.salesAmount) / overviewData.value.salesAmount) * 100).toFixed(2)
  overviewData.value.salesAmount = newSalesAmount
  overviewData.value.salesGrowth = parseFloat(salesGrowth)

  // 随机更新订单量
  const newOrderCount = Math.floor(Math.random() * 100) + overviewData.value.orderCount
  const orderGrowth = (((newOrderCount - overviewData.value.orderCount) / overviewData.value.orderCount) * 100).toFixed(2)
  overviewData.value.orderCount = newOrderCount
  overviewData.value.orderGrowth = parseFloat(orderGrowth)

  // 随机更新新增粉丝
  const newNewFans = Math.floor(Math.random() * 50) + overviewData.value.newFans
  const fansGrowth = (((newNewFans - overviewData.value.newFans) / overviewData.value.newFans) * 100).toFixed(2)
  overviewData.value.newFans = newNewFans
  overviewData.value.fansGrowth = parseFloat(fansGrowth)
}

// 初始化数据
const initData = async () => {
  // 获取概览数据
  const overviewRes = await getOverviewData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (overviewRes.success) {
    overviewData.value = overviewRes.data
  }

  // 获取销售趋势数据
  const trendRes = await getSalesTrendData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (trendRes.success) {
    salesTrendData.value = trendRes.data
  }

  // 获取用户画像数据
  const profileRes = await getUserProfileData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (profileRes.success) {
    userProfileData.value = profileRes.data
  }

  // 获取商品销量数据
  const productRes = await getProductSalesData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (productRes.success) {
    productSalesData.value = productRes.data
  }

  // 获取主播表现数据
  const anchorRes = await getAnchorPerformanceData({
    timeRange: timeRange.value,
    productCategory: productCategory.value,
    anchor: anchor.value,
  })
  if (anchorRes.success) {
    anchorPerformanceData.value = anchorRes.data
  }
}

// 生命周期钩子
onMounted(() => {
  initData()
  // 每5秒更新一次实时数据
  timer = setInterval(updateRealTimeData, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<script lang="ts">
export default {
  name: 'EcommerceLiveSales',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  margin-bottom: 20px;
}

.filter-container {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
}

.overview-container {
  margin-top: 16px;
}

.charts-container {
  margin-top: 16px;
}

.big-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.trend {
  font-size: 14px;

  &.positive {
    color: #52c41a;
  }

  &.negative {
    color: #ff4d4f;
  }
}

:deep(.arco-card-body) {
  padding: 16px;
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .big-number {
    font-size: 20px;
  }

  .trend {
    font-size: 12px;
  }
}

@media screen and (max-width: 992px) {
  .container {
    padding: 0 16px 16px 16px;
  }

  .filter-container {
    padding: 12px;
  }
}

@media screen and (max-width: 768px) {
  .big-number {
    font-size: 18px;
  }

  .trend {
    font-size: 11px;
  }

  :deep(.arco-card-body) {
    padding: 12px;
  }
}

@media screen and (max-width: 576px) {
  .big-number {
    font-size: 16px;
  }

  .trend {
    font-size: 10px;
  }

  .filter-container {
    padding: 8px;
  }

  :deep(.arco-card-body) {
    padding: 8px;
  }
}
</style>
