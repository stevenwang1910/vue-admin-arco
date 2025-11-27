<template>
  <div class="data-analysis-page">
    <a-page-header title="数据分析" :sub-title="'查看内容投放效果数据'">
      <template #extra>
        <a-space>
          <a-select v-model="filterForm.contentId" placeholder="选择内容" style="width: 200px">
            <a-option value="">全部内容</a-option>
            <a-option value="1">测试内容1</a-option>
            <a-option value="2">测试内容2</a-option>
            <a-option value="3">测试内容3</a-option>
          </a-select>
          <a-select v-model="filterForm.channel" placeholder="选择渠道" style="width: 120px">
            <a-option value="">全部渠道</a-option>
            <a-option value="app">APP</a-option>
            <a-option value="web">Web</a-option>
            <a-option value="wechat">微信</a-option>
            <a-option value="weibo">微博</a-option>
            <a-option value="douyin">抖音</a-option>
            <a-option value="xiaohongshu">小红书</a-option>
          </a-select>
          <a-date-picker v-model="filterForm.dateRange" type="datetimerange" placeholder="选择时间段" style="width: 300px" />
          <a-button type="primary" @click="handleSearch">
            <template #icon>
              <icon-search />
            </template>
            搜索
          </a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- 数据概览卡片 -->
    <a-row :gutter="16" class="mt-4">
      <a-col :span="6">
        <a-statistic-card
          title="总曝光量"
          :value="stats.totalImpressions"
          :value-style="{ color: '#3f51b5' }"
          :trend="stats.impressionsTrend"
          trend-placement="right"
        >
          <template #prefix>
            <icon-eye />
          </template>
        </a-statistic-card>
      </a-col>
      <a-col :span="6">
        <a-statistic-card
          title="总点击量"
          :value="stats.totalClicks"
          :value-style="{ color: '#4caf50' }"
          :trend="stats.clicksTrend"
          trend-placement="right"
        >
          <template #prefix>
            <icon-hand-up />
          </template>
        </a-statistic-card>
      </a-col>
      <a-col :span="6">
        <a-statistic-card
          title="点击率"
          :value="stats.clickRate"
          :value-style="{ color: '#ff9800' }"
          suffix="%"
          :trend="stats.clickRateTrend"
          trend-placement="right"
        >
          <template #prefix>
            <icon-percentage />
          </template>
        </a-statistic-card>
      </a-col>
      <a-col :span="6">
        <a-statistic-card
          title="转化率"
          :value="stats.conversionRate"
          :value-style="{ color: '#e91e63' }"
          suffix="%"
          :trend="stats.conversionRateTrend"
          trend-placement="right"
        >
          <template #prefix>
            <icon-refresh />
          </template>
        </a-statistic-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="16" class="mt-4">
      <a-col :span="16">
        <a-card title="曝光量趋势" :bordered="false">
          <div style="height: 300px">
            <!-- 这里应该是图表组件，暂时用占位符表示 -->
            <div class="chart-placeholder">曝光量趋势图表</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="渠道分布" :bordered="false">
          <div style="height: 300px">
            <!-- 这里应该是图表组件，暂时用占位符表示 -->
            <div class="chart-placeholder">渠道分布图表</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mt-4">
      <a-col :span="16">
        <a-card title="点击量趋势" :bordered="false">
          <div style="height: 300px">
            <!-- 这里应该是图表组件，暂时用占位符表示 -->
            <div class="chart-placeholder">点击量趋势图表</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="内容类型分布" :bordered="false">
          <div style="height: 300px">
            <!-- 这里应该是图表组件，暂时用占位符表示 -->
            <div class="chart-placeholder">内容类型分布图表</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 详细数据表格 -->
    <a-card title="详细数据" :bordered="false" class="mt-4">
      <a-table
        :columns="columns"
        :data="detailData"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="title-cell">
              <a-image
                v-if="record.thumbnail"
                :src="record.thumbnail"
                style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 12px"
              />
              <div class="title-info">
                <div class="title">{{ record.title }}</div>
                <div class="subtitle">{{ record.subtitle }}</div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeText(record.type) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'channel'">
            <a-tag :color="getChannelColor(record.channel)">
              {{ getChannelText(record.channel) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'clickRate' || column.key === 'conversionRate'">
            <span>{{ record[column.key] }}%</span>
          </template>
          <template v-else-if="column.key === 'operations'">
            <a-space>
              <a-button
                size="small"
                @click="handleViewDetail(record)"
              >
                <template #icon>
                  <icon-eye />
                </template>
                查看详情
              </a-button>
              <a-button
                size="small"
                @click="handleExportData(record)"
              >
                <template #icon>
                  <icon-download />
                </template>
                导出数据
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 数据详情弹窗 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="数据详情"
      width="800px"
    >
      <div v-if="selectedData" class="data-detail">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-statistic-card title="曝光量" :value="selectedData.impressions" />
          </a-col>
          <a-col :span="12">
            <a-statistic-card title="点击量" :value="selectedData.clicks" />
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mt-4">
          <a-col :span="12">
            <a-statistic-card title="点击率" :value="selectedData.clickRate" suffix="%" />
          </a-col>
          <a-col :span="12">
            <a-statistic-card title="转化率" :value="selectedData.conversionRate" suffix="%" />
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mt-4">
          <a-col :span="12">
            <a-statistic-card title="平均停留时间" :value="selectedData.avgStayTime" suffix="秒" />
          </a-col>
          <a-col :span="12">
            <a-statistic-card title="分享次数" :value="selectedData.shares" />
          </a-col>
        </a-row>
      </div>

      <template #footer>
        <a-space>
          <a-button @click="detailModalVisible = false">关闭</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from '@arco-design/web-vue'
import { 
  IconSearch, 
  IconEye, 
  IconHandUp, 
  IconPercentage, 
  IconRefresh, 
  IconDownload 
} from '@arco-design/web-vue/es/icon'
import type { TableProps } from '@arco-design/web-vue'

// 筛选表单
const filterForm = ref({
  contentId: '',
  channel: '',
  dateRange: null,
})

// 数据概览
const stats = ref({
  totalImpressions: 125000,
  impressionsTrend: '+12.5%',
  totalClicks: 8750,
  clicksTrend: '+8.3%',
  clickRate: 7.0,
  clickRateTrend: '-2.1%',
  conversionRate: 3.2,
  conversionRateTrend: '+5.6%',
})

// 表格列
const columns: TableProps['columns'] = [
  {
    title: '内容标题',
    key: 'title',
    width: 300,
  },
  {
    title: '内容类型',
    key: 'type',
    width: 100,
  },
  {
    title: '投放渠道',
    key: 'channel',
    width: 100,
  },
  {
    title: '曝光量',
    key: 'impressions',
    width: 100,
  },
  {
    title: '点击量',
    key: 'clicks',
    width: 100,
  },
  {
    title: '点击率',
    key: 'clickRate',
    width: 100,
  },
  {
    title: '转化率',
    key: 'conversionRate',
    width: 100,
  },
  {
    title: '操作',
    key: 'operations',
    width: 150,
  },
]

// 详细数据
const detailData = ref<any[]>([])

// 分页
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条记录`,
})

// 加载状态
const loading = ref(false)

// 详情弹窗可见性
const detailModalVisible = ref(false)

// 选中的数据
const selectedData = ref<any>(null)

// 获取详细数据
const getDetailData = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000))
    detailData.value = [
      {
        id: 1,
        title: '测试内容1',
        subtitle: '这是一个测试内容的副标题',
        type: 'text',
        channel: 'app',
        thumbnail: '',
        impressions: 25000,
        clicks: 1750,
        clickRate: 7.0,
        conversionRate: 3.5,
        avgStayTime: 15,
        shares: 234,
      },
      {
        id: 2,
        title: '测试内容2',
        subtitle: '这是一个测试内容的副标题',
        type: 'image',
        channel: 'web',
        thumbnail: 'https://picsum.photos/200/200',
        impressions: 35000,
        clicks: 2800,
        clickRate: 8.0,
        conversionRate: 4.2,
        avgStayTime: 22,
        shares: 456,
      },
      {
        id: 3,
        title: '测试内容3',
        subtitle: '这是一个测试内容的副标题',
        type: 'video',
        channel: 'wechat',
        thumbnail: 'https://picsum.photos/200/200',
        impressions: 45000,
        clicks: 3150,
        clickRate: 7.0,
        conversionRate: 2.8,
        avgStayTime: 35,
        shares: 678,
      },
      {
        id: 4,
        title: '测试内容4',
        subtitle: '这是一个测试内容的副标题',
        type: 'rich_media',
        channel: 'douyin',
        thumbnail: 'https://picsum.photos/200/200',
        impressions: 20000,
        clicks: 1050,
        clickRate: 5.25,
        conversionRate: 2.5,
        avgStayTime: 18,
        shares: 123,
      },
    ]
    pagination.value.total = detailData.value.length
  } catch (error) {
    message.error('获取详细数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  getDetailData()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    contentId: '',
    channel: '',
    dateRange: null,
  }
  handleSearch()
}

// 查看详情
const handleViewDetail = (record: any) => {
  selectedData.value = record
  detailModalVisible.value = true
}

// 导出数据
const handleExportData = (record: any) => {
  message.info(`导出数据 ID: ${record.id}`)
}

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    text: 'blue',
    image: 'green',
    video: 'orange',
    rich_media: 'purple',
  }
  return colorMap[type] || 'default'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    text: '文本',
    image: '图片',
    video: '视频',
    rich_media: '富媒体',
  }
  return textMap[type] || '未知'
}

// 获取渠道颜色
const getChannelColor = (channel: string) => {
  const colorMap: Record<string, string> = {
    app: 'primary',
    web: 'success',
    wechat: 'warning',
    weibo: 'danger',
    douyin: 'purple',
    xiaohongshu: 'cyan',
  }
  return colorMap[channel] || 'default'
}

// 获取渠道文本
const getChannelText = (channel: string) => {
  const textMap: Record<string, string> = {
    app: 'APP',
    web: 'Web',
    wechat: '微信',
    weibo: '微博',
    douyin: '抖音',
    xiaohongshu: '小红书',
  }
  return textMap[channel] || '未知'
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.current = page
  pagination.value.pageSize = pageSize
  getDetailData()
}

onMounted(() => {
  getDetailData()
})
</script>

<style scoped>
.data-analysis-page {
  padding: 24px;
}

.title-cell {
  display: flex;
  align-items: center;
}

.title-info {
  flex: 1;
  min-width: 0;
}

.title {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--color-fill-2);
  border-radius: 4px;
  color: var(--color-text-secondary);
}

.data-detail {
  padding: 20px 0;
}
</style>