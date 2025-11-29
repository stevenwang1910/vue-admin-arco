<template>
  <a-modal v-model:visible="visible" :title="$t('liveStreaming.detail.view')" :footer="false" width="80%" @cancel="handleClose">
    <div class="detail-modal">
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="realtime" :title="$t('liveStreaming.detail.realtimeData')">
          <div class="realtime-content">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-card title="实时在线趋势">
                  <line-chart :data="realtimeTrendData" :height="250" color="#52c41a" />
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card title="实时销售趋势">
                  <line-chart :data="realtimeSalesData" :height="250" color="#1890ff" />
                </a-card>
              </a-col>
            </a-row>

            <a-card title="实时商品销售" style="margin-top: 16px">
              <a-table :columns="productColumns" :data="realtimeProductData" :pagination="false" size="small" />
            </a-card>
          </div>
        </a-tab-pane>

        <a-tab-pane key="historical" :title="$t('liveStreaming.detail.historicalData')">
          <div class="historical-content">
            <a-form :model="historicalQuery" layout="inline" style="margin-bottom: 16px">
              <a-form-item label="时间范围">
                <a-range-picker v-model="historicalQuery.dateRange" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="handleHistoricalQuery">查询</a-button>
              </a-form-item>
            </a-form>

            <a-row :gutter="16">
              <a-col :span="24">
                <a-card title="历史数据对比">
                  <streamer-performance-chart :data="historicalPerformanceData" :height="300" />
                </a-card>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LineChart from './LineChart.vue'
import StreamerPerformanceChart from './StreamerPerformanceChart.vue'
import { getRealtimeTrendData, getRealtimeProductData, getHistoricalPerformanceData } from '@/api/live-streaming'

const { t } = useI18n()

interface Props {
  visible: boolean
  streamerId?: string
  streamerName?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  streamerId: '',
  streamerName: '',
})

const emit = defineEmits(['update:visible'])

const activeTab = ref('realtime')

// 实时数据
const realtimeTrendData = ref([])
const realtimeSalesData = ref([])
const realtimeProductData = ref([])

// 历史数据查询
const historicalQuery = reactive({
  dateRange: [],
})
const historicalPerformanceData = ref([])

// 商品表格列定义
const productColumns = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
    sorter: (a: any, b: any) => a.sales - b.sales,
  },
  {
    title: '销售额',
    dataIndex: 'salesAmount',
    key: 'salesAmount',
    sorter: (a: any, b: any) => a.salesAmount - b.salesAmount,
  },
  {
    title: '库存',
    dataIndex: 'inventory',
    key: 'inventory',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: { customRender: 'status' },
  },
]

// 获取实时趋势数据
const fetchRealtimeData = async () => {
  try {
    const [trendData, salesData, productData] = await Promise.all([
      getRealtimeTrendData(),
      getRealtimeSalesData(),
      getRealtimeProductData(),
    ])

    realtimeTrendData.value = trendData
    realtimeSalesData.value = salesData
    realtimeProductData.value = productData
  } catch (error) {
    console.error('获取实时数据失败:', error)
  }
}

// 查询历史数据
const handleHistoricalQuery = async () => {
  try {
    const data = await getHistoricalPerformanceData({
      startDate: historicalQuery.dateRange[0],
      endDate: historicalQuery.dateRange[1],
      streamerId: props.streamerId,
    })
    historicalPerformanceData.value = data
  } catch (error) {
    console.error('获取历史数据失败:', error)
  }
}

const handleClose = () => {
  emit('update:visible', false)
}

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchRealtimeData()
    }
  }
)
</script>

<style scoped lang="less">
.detail-modal {
  .realtime-content,
  .historical-content {
    padding: 16px 0;
  }
}
</style>
