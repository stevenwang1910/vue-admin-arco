<template>
  <div class="delivery-schedule-page">
    <a-page-header title="投放排期" :sub-title="'管理内容投放的排期'">
      <template #extra>
        <a-space>
          <a-select v-model="filterForm.status" placeholder="状态" style="width: 120px">
            <a-option value="">全部</a-option>
            <a-option value="scheduled">已排期</a-option>
            <a-option value="publishing">投放中</a-option>
            <a-option value="completed">已完成</a-option>
            <a-option value="cancelled">已取消</a-option>
          </a-select>
          <a-date-picker v-model="filterForm.date" placeholder="选择日期" style="width: 150px" />
          <a-input v-model="filterForm.keyword" placeholder="搜索标题" style="width: 200px">
            <template #suffix>
              <icon-search />
            </template>
          </a-input>
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

    <a-card class="mt-4">
      <a-table
        :columns="columns"
        :data="scheduleList"
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
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'scheduleTime'">
            <div class="schedule-time">
              <div>开始时间：{{ formatDate(record.scheduleTime.start) }}</div>
              <div>结束时间：{{ formatDate(record.scheduleTime.end) }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'channels'">
            <div class="channels">
              <a-tag v-for="channel in record.channels" :key="channel" size="small" style="margin-bottom: 4px">
                {{ getChannelText(channel) }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.key === 'operations'">
            <a-space>
              <a-button
                size="small"
                @click="handleView(record)"
              >
                <template #icon>
                  <icon-eye />
                </template>
                查看
              </a-button>
              <a-button
                size="small"
                type="primary"
                @click="handlePublishNow(record)"
                v-if="record.status === 'scheduled'"
              >
                <template #icon>
                  <icon-publish />
                </template>
                立即发布
              </a-button>
              <a-button
                size="small"
                @click="handleEditSchedule(record)"
                v-if="record.status === 'scheduled'"
              >
                <template #icon>
                  <icon-edit />
                </template>
                编辑排期
              </a-button>
              <a-button
                size="small"
                status="danger"
                @click="handleCancelSchedule(record)"
                v-if="record.status === 'scheduled' || record.status === 'publishing'"
              >
                <template #icon>
                  <icon-close />
                </template>
                取消
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑排期弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑排期"
      width="600px"
    >
      <a-form layout="vertical" :model="editForm">
        <a-form-item label="投放时间段" field="scheduleTime" :rules="[{ required: true, message: '请选择投放时间段' }]">
          <a-date-picker
            v-model="editForm.scheduleTime"
            type="datetimerange"
            placeholder="请选择投放时间段"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="投放渠道" field="channels" :rules="[{ required: true, message: '请选择投放渠道' }]">
          <a-checkbox-group v-model="editForm.channels">
            <a-space wrap>
              <a-checkbox value="app">APP</a-checkbox>
              <a-checkbox value="web">Web</a-checkbox>
              <a-checkbox value="wechat">微信</a-checkbox>
              <a-checkbox value="weibo">微博</a-checkbox>
              <a-checkbox value="douyin">抖音</a-checkbox>
              <a-checkbox value="xiaohongshu">小红书</a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-space>
          <a-button @click="editModalVisible = false">取消</a-button>
          <a-button type="primary" @click="handleSaveEdit">保存</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from '@arco-design/web-vue'
import { IconSearch, IconEye, IconPublish, IconEdit, IconClose } from '@arco-design/web-vue/es/icon'
import type { TableProps } from '@arco-design/web-vue'

// 筛选表单
const filterForm = ref({
  status: '',
  date: null,
  keyword: '',
})

// 表格列
const columns: TableProps['columns'] = [
  {
    title: '标题',
    key: 'title',
    width: 300,
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '投放时间段',
    key: 'scheduleTime',
    width: 250,
  },
  {
    title: '投放渠道',
    key: 'channels',
    width: 200,
  },
  {
    title: '操作',
    key: 'operations',
    width: 250,
  },
]

// 排期列表
const scheduleList = ref<any[]>([])

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

// 编辑弹窗可见性
const editModalVisible = ref(false)

// 选中的排期
const selectedSchedule = ref<any>(null)

// 编辑表单
const editForm = ref({
  scheduleTime: [],
  channels: [],
})

// 获取排期列表
const getScheduleList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000))
    scheduleList.value = [
      {
        id: 6,
        title: '测试已排期内容',
        subtitle: '这是一个测试已排期内容的副标题',
        type: 'image',
        status: 'scheduled',
        thumbnail: 'https://picsum.photos/200/200',
        scheduleTime: {
          start: '2025-11-30 10:00:00',
          end: '2025-12-07 23:59:59',
        },
        channels: ['app', 'wechat'],
      },
      {
        id: 10,
        title: '投放中内容',
        subtitle: '这是一个投放中内容的副标题',
        type: 'video',
        status: 'publishing',
        thumbnail: 'https://picsum.photos/200/200',
        scheduleTime: {
          start: '2025-11-25 08:00:00',
          end: '2025-12-02 23:59:59',
        },
        channels: ['app', 'web', 'douyin'],
      },
      {
        id: 11,
        title: '已完成内容',
        subtitle: '这是一个已完成内容的副标题',
        type: 'text',
        status: 'completed',
        thumbnail: '',
        scheduleTime: {
          start: '2025-11-10 08:00:00',
          end: '2025-11-24 23:59:59',
        },
        channels: ['web', 'weibo'],
      },
      {
        id: 12,
        title: '已取消内容',
        subtitle: '这是一个已取消内容的副标题',
        type: 'rich_media',
        status: 'cancelled',
        thumbnail: 'https://picsum.photos/200/200',
        scheduleTime: {
          start: '2025-11-20 08:00:00',
          end: '2025-11-27 23:59:59',
        },
        channels: ['wechat', 'xiaohongshu'],
      },
    ]
    pagination.value.total = scheduleList.value.length
  } catch (error) {
    message.error('获取排期列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  getScheduleList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    status: '',
    date: null,
    keyword: '',
  }
  handleSearch()
}

// 查看内容
const handleView = (record: any) => {
  message.info(`查看排期 ID: ${record.id}`)
}

// 立即发布
const handlePublishNow = (record: any) => {
  message.info(`立即发布排期 ID: ${record.id}`)
}

// 编辑排期
const handleEditSchedule = (record: any) => {
  selectedSchedule.value = record
  editForm.value = {
    scheduleTime: [new Date(record.scheduleTime.start), new Date(record.scheduleTime.end)],
    channels: [...record.channels],
  }
  editModalVisible.value = true
}

// 取消排期
const handleCancelSchedule = (record: any) => {
  message.info(`取消排期 ID: ${record.id}`)
}

// 保存编辑
const handleSaveEdit = () => {
  message.success('排期编辑成功')
  editModalVisible.value = false
  getScheduleList()
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

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    scheduled: 'purple',
    publishing: 'primary',
    completed: 'success',
    cancelled: 'danger',
  }
  return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    scheduled: '已排期',
    publishing: '投放中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return textMap[status] || '未知'
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

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.current = page
  pagination.value.pageSize = pageSize
  getScheduleList()
}

onMounted(() => {
  getScheduleList()
})
</script>

<style scoped>
.delivery-schedule-page {
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

.schedule-time div {
  font-size: 12px;
  line-height: 1.5;
}

.channels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>