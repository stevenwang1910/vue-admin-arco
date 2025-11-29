<template>
  <div class="data-drill-down">
    <a-card title="数据下钻分析" :bordered="false">
      <template #extra>
        <a-space>
          <a-select v-model="selectedMetric" style="width: 120px">
            <a-option value="online">在线人数</a-option>
            <a-option value="sales">销售数据</a-option>
            <a-option value="products">商品数据</a-option>
            <a-option value="performance">历史表现</a-option>
          </a-select>
          <a-range-picker v-model="dateRange" style="width: 240px" />
          <a-button type="primary" @click="handleQuery">
            <template #icon>
              <icon-search />
            </template>
            查询
          </a-button>
        </a-space>
      </template>

      <a-row :gutter="16">
        <a-col :span="18">
          <div class="chart-container">
            <div ref="chartRef" style="height: 400px"></div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="data-summary">
            <a-card title="数据概览" size="small">
              <div class="summary-item">
                <div class="label">峰值</div>
                <div class="value">{{ formatNumber(summaryData.peak) }}</div>
              </div>
              <div class="summary-item">
                <div class="label">均值</div>
                <div class="value">{{ formatNumber(summaryData.average) }}</div>
              </div>
              <div class="summary-item">
                <div class="label">总计</div>
                <div class="value">{{ formatNumber(summaryData.total) }}</div>
              </div>
              <div class="summary-item">
                <div class="label">增长率</div>
                <div class="value" :class="{ 'positive': summaryData.growth > 0, 'negative': summaryData.growth < 0 }">
                  {{ formatPercent(summaryData.growth) }}
                </div>
              </div>
            </a-card>

            <a-card title="异常预警" size="small" style="margin-top: 16px">
              <div v-if="warnings.length === 0" class="no-warnings">
                <icon-check-circle style="color: #00b42a; font-size: 24px" />
                <div>暂无异常预警</div>
              </div>
              <div v-else class="warning-list">
                <div v-for="warning in warnings" :key="warning.id" class="warning-item">
                  <div class="warning-icon">
                    <icon-exclamation-circle v-if="warning.type === 'warning'" style="color: #ff7d00" />
                    <icon-close-circle v-else-if="warning.type === 'error'" style="color: #f53f3f" />
                    <icon-info-circle v-else style="color: #14c9c9" />
                  </div>
                  <div class="warning-content">
                    <div class="warning-message">{{ warning.message }}</div>
                    <div class="warning-time">{{ formatTime(warning.timestamp) }}</div>
                  </div>
                  <div class="warning-actions">
                    <a-button size="mini" @click="handleViewWarning(warning)">查看</a-button>
                    <a-button size="mini" @click="handleIgnoreWarning(warning)">忽略</a-button>
                  </div>
                </div>
              </div>
            </a-card>
          </div>
        </a-col>
      </a-row>

      <!-- 详细数据表格 -->
      <a-card title="详细数据" size="small" style="margin-top: 16px">
        <a-table :data="tableData" :columns="tableColumns" :pagination="pagination" />
      </a-card>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChart } from '@/hooks/useChart'
import { formatNumber, formatPercent, formatTime } from '@/utils/format'
import * as echarts from 'echarts'

interface SummaryData {
  peak: number
  average: number
  total: number
  growth: number
}

interface WarningItem {
  id: number
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: number
}

interface TableItem {
  time: string
  value: number
  change: number
  changePercent: number
}

const { t } = useI18n()
const chartRef = ref<HTMLElement>()
const selectedMetric = ref('online')
const dateRange = ref<Date[]>([])

const summaryData = reactive<SummaryData>({
  peak: 0,
  average: 0,
  total: 0,
  growth: 0,
})

const warnings = ref<WarningItem[]>([])
const tableData = ref<TableItem[]>([])

const tableColumns = computed(() => [
  {
    title: '时间',
    dataIndex: 'time',
    width: 120,
  },
  {
    title: '数值',
    dataIndex: 'value',
    width: 100,
    render: ({ value }: { value: number }) => formatNumber(value),
  },
  {
    title: '变化',
    dataIndex: 'change',
    width: 100,
    render: ({ value }: { value: number }) => (
      <span style={{ color: value >= 0 ? '#00b42a' : '#f53f3f' }}>
        {value >= 0 ? '+' : ''}{formatNumber(value)}
      </span>
    ),
  },
  {
    title: '变化率',
    dataIndex: 'changePercent',
    width: 100,
    render: ({ value }: { value: number }) => (
      <span style={{ color: value >= 0 ? '#00b42a' : '#f53f3f' }}>
        {value >= 0 ? '+' : ''}{formatPercent(value)}
      </span>
    ),
  },
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
})

let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return

  const option = {
    title: {
      text: getChartTitle(),
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        const param = params[0]
        return `${param.axisValue}<br/>${param.seriesName}: ${formatNumber(param.value)}`
      },
    },
    legend: {
      data: [getSeriesName()],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getXAxisData(),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => formatNumber(value),
      },
    },
    series: [
      {
        name: getSeriesName(),
        type: 'line',
        smooth: true,
        data: getSeriesData(),
        areaStyle: {
          opacity: 0.3,
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' },
            { type: 'max', name: '最大值' },
          ],
        },
      },
    ],
  }

  chart.setOption(option)
}

// 获取图表标题
const getChartTitle = () => {
  const titles = {
    online: '实时在线人数趋势',
    sales: '实时销售趋势',
    products: '商品销售排行',
    performance: '历史表现对比',
  }
  return titles[selectedMetric.value as keyof typeof titles]
}

// 获取系列名称
const getSeriesName = () => {
  const names = {
    online: '在线人数',
    sales: '销售额',
    products: '销量',
    performance: '表现指数',
  }
  return names[selectedMetric.value as keyof typeof names]
}

// 获取X轴数据
const getXAxisData = () => {
  return tableData.value.map(item => item.time)
}

// 获取系列数据
const getSeriesData = () => {
  return tableData.value.map(item => item.value)
}

// 查询数据
const handleQuery = async () => {
  try {
    // 模拟API调用
    await fetchData()
    updateChart()
  } catch (error) {
    console.error('查询数据失败:', error)
  }
}

// 获取数据
const fetchData = async () => {
  // 这里应该调用实际的API
  // 现在使用模拟数据
  const mockData = generateMockData()
  tableData.value = mockData.tableData
  summaryData.peak = mockData.summary.peak
  summaryData.average = mockData.summary.average
  summaryData.total = mockData.summary.total
  summaryData.growth = mockData.summary.growth
  warnings.value = mockData.warnings
  pagination.total = mockData.tableData.length
}

// 生成模拟数据
const generateMockData = () => {
  const tableData: TableItem[] = []
  const now = new Date()
  
  for (let i = 0; i < 60; i++) {
    const time = new Date(now.getTime() - i * 60000)
    const value = Math.floor(Math.random() * 10000) + 5000
    const prevValue = i > 0 ? tableData[i - 1]?.value || value : value
    const change = value - prevValue
    const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0
    
    tableData.push({
      time: time.toLocaleTimeString(),
      value,
      change,
      changePercent,
    })
  }
  
  const values = tableData.map(item => item.value)
  const peak = Math.max(...values)
  const average = values.reduce((sum, val) => sum + val, 0) / values.length
  const total = values.reduce((sum, val) => sum + val, 0)
  const growth = ((values[values.length - 1] - values[0]) / values[0]) * 100
  
  const warnings: WarningItem[] = [
    {
      id: 1,
      type: 'warning',
      message: '转化率低于预期，当前转化率仅2.1%',
      timestamp: Date.now() - 5 * 60 * 1000,
    },
    {
      id: 2,
      type: 'error',
      message: '商品库存不足，请及时补货',
      timestamp: Date.now() - 15 * 60 * 1000,
    },
  ]
  
  return {
    tableData: tableData.reverse(),
    summary: { peak, average, total, growth },
    warnings,
  }
}

// 查看预警详情
const handleViewWarning = (warning: WarningItem) => {
  console.log('查看预警:', warning)
  // 这里可以实现查看详情的逻辑
}

// 忽略预警
const handleIgnoreWarning = (warning: WarningItem) => {
  const index = warnings.value.findIndex(w => w.id === warning.id)
  if (index > -1) {
    warnings.value.splice(index, 1)
  }
}

// 监听指标变化
watch(selectedMetric, () => {
  handleQuery()
})

// 监听日期范围变化
watch(dateRange, () => {
  handleQuery()
})

// 组件挂载时初始化
onMounted(() => {
  // 设置默认日期范围（最近1小时）
  const end = new Date()
  const start = new Date(end.getTime() - 60 * 60 * 1000)
  dateRange.value = [start, end]
  
  initChart()
  handleQuery()
  
  // 窗口大小改变时重新调整图表
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped lang="less">
.data-drill-down {
  .chart-container {
    background: var(--color-bg-2);
    border-radius: 6px;
    padding: 16px;
  }

  .data-summary {
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border-2);

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: var(--color-text-2);
        font-size: 14px;
      }

      .value {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-1);

        &.positive {
          color: #00b42a;
        }

        &.negative {
          color: #f53f3f;
        }
      }
    }

    .no-warnings {
      text-align: center;
      padding: 20px;
      color: var(--color-text-2);

      div {
        margin-top: 8px;
        font-size: 14px;
      }
    }

    .warning-list {
      .warning-item {
        display: flex;
        align-items: flex-start;
        padding: 12px 0;
        border-bottom: 1px solid var(--color-border-2);

        &:last-child {
          border-bottom: none;
        }

        .warning-icon {
          margin-right: 8px;
          padding-top: 2px;
        }

        .warning-content {
          flex: 1;
          margin-right: 8px;

          .warning-message {
            font-size: 14px;
            color: var(--color-text-1);
            margin-bottom: 4px;
          }

          .warning-time {
            font-size: 12px;
            color: var(--color-text-3);
          }
        }

        .warning-actions {
          display: flex;
          gap: 4px;
        }
      }
    }
  }
}
</style>