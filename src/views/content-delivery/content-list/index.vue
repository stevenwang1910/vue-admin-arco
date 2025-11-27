<template>
  <div class="content-list-page">
    <a-page-header title="内容列表" :sub-title="'管理所有内容'">
      <template #extra>
        <a-button type="primary" @click="handleCreateContent">
          <template #icon>
            <icon-plus />
          </template>
          创建内容
        </a-button>
      </template>
    </a-page-header>

    <a-card class="mt-4">
      <template #extra>
        <a-space>
          <a-select v-model="filterForm.status" placeholder="状态" style="width: 120px">
            <a-option value="">全部</a-option>
            <a-option value="draft">草稿</a-option>
            <a-option value="pending_review">待审核</a-option>
            <a-option value="approved">已审核</a-option>
            <a-option value="rejected">已拒绝</a-option>
            <a-option value="published">已发布</a-option>
            <a-option value="scheduled">已排期</a-option>
          </a-select>
          <a-select v-model="filterForm.type" placeholder="内容类型" style="width: 120px">
            <a-option value="">全部</a-option>
            <a-option value="text">文本</a-option>
            <a-option value="image">图片</a-option>
            <a-option value="video">视频</a-option>
            <a-option value="rich_media">富媒体</a-option>
          </a-select>
          <a-input v-model="filterForm.keyword" placeholder="搜索标题或内容" style="width: 200px">
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

      <a-table :columns="columns" :data="contentList" :pagination="pagination" :loading="loading" row-key="id">
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
          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>
          <template v-else-if="column.key === 'publishTime'">
            {{ record.publishTime ? formatDate(record.publishTime) : '-' }}
          </template>
          <template v-else-if="column.key === 'operations'">
            <a-space>
              <a-button size="small" @click="handleView(record)" v-if="record.status === 'published'">
                <template #icon>
                  <icon-eye />
                </template>
                查看
              </a-button>
              <a-button size="small" @click="handleEdit(record)" v-if="record.status === 'draft' || record.status === 'rejected'">
                <template #icon>
                  <icon-edit />
                </template>
                编辑
              </a-button>
              <a-button size="small" type="primary" @click="handleSubmitReview(record)" v-if="record.status === 'draft'">
                <template #icon>
                  <icon-check />
                </template>
                提交审核
              </a-button>
              <a-button size="small" type="primary" @click="handlePublish(record)" v-if="record.status === 'approved'">
                <template #icon>
                  <icon-publish />
                </template>
                立即发布
              </a-button>
              <a-button size="small" @click="handleSchedule(record)" v-if="record.status === 'approved'">
                <template #icon>
                  <icon-calendar />
                </template>
                排期发布
              </a-button>
              <a-button size="small" status="danger" @click="handleDelete(record)">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from '@arco-design/web-vue'
import { IconPlus, IconSearch, IconEye, IconEdit, IconCheck, IconPublish, IconCalendar, IconDelete } from '@arco-design/web-vue/es/icon'
import type { TableProps } from '@arco-design/web-vue'

const router = useRouter()

// 筛选表单
const filterForm = ref({
  status: '',
  type: '',
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
    title: '创建时间',
    key: 'createTime',
    width: 150,
  },
  {
    title: '发布时间',
    key: 'publishTime',
    width: 150,
  },
  {
    title: '操作',
    key: 'operations',
    width: 250,
  },
]

// 内容列表
const contentList = ref<any[]>([])

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

// 获取内容列表
const getContentList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    contentList.value = [
      {
        id: 1,
        title: '测试文本内容',
        subtitle: '这是一个测试文本内容的副标题',
        type: 'text',
        status: 'published',
        thumbnail: '',
        createTime: '2025-11-20 10:00:00',
        publishTime: '2025-11-20 14:00:00',
      },
      {
        id: 2,
        title: '测试图片内容',
        subtitle: '这是一个测试图片内容的副标题',
        type: 'image',
        status: 'approved',
        thumbnail: 'https://picsum.photos/200/200',
        createTime: '2025-11-21 09:00:00',
        publishTime: null,
      },
      {
        id: 3,
        title: '测试视频内容',
        subtitle: '这是一个测试视频内容的副标题',
        type: 'video',
        status: 'pending_review',
        thumbnail: 'https://picsum.photos/200/200',
        createTime: '2025-11-22 11:00:00',
        publishTime: null,
      },
      {
        id: 4,
        title: '测试富媒体内容',
        subtitle: '这是一个测试富媒体内容的副标题',
        type: 'rich_media',
        status: 'draft',
        thumbnail: 'https://picsum.photos/200/200',
        createTime: '2025-11-23 15:00:00',
        publishTime: null,
      },
      {
        id: 5,
        title: '测试已拒绝内容',
        subtitle: '这是一个测试已拒绝内容的副标题',
        type: 'text',
        status: 'rejected',
        thumbnail: '',
        createTime: '2025-11-24 10:00:00',
        publishTime: null,
      },
      {
        id: 6,
        title: '测试已排期内容',
        subtitle: '这是一个测试已排期内容的副标题',
        type: 'image',
        status: 'scheduled',
        thumbnail: 'https://picsum.photos/200/200',
        createTime: '2025-11-25 14:00:00',
        publishTime: '2025-11-30 10:00:00',
      },
    ]
    pagination.value.total = contentList.value.length
  } catch (error) {
    message.error('获取内容列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  getContentList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    status: '',
    type: '',
    keyword: '',
  }
  handleSearch()
}

// 创建内容
const handleCreateContent = () => {
  router.push('/content-delivery/create-content')
}

// 查看内容
const handleView = (record: any) => {
  message.info(`查看内容 ID: ${record.id}`)
}

// 编辑内容
const handleEdit = (record: any) => {
  router.push(`/content-delivery/edit-content/${record.id}`)
}

// 提交审核
const handleSubmitReview = (record: any) => {
  message.info(`提交审核内容 ID: ${record.id}`)
}

// 立即发布
const handlePublish = (record: any) => {
  message.info(`立即发布内容 ID: ${record.id}`)
}

// 排期发布
const handleSchedule = (record: any) => {
  message.info(`排期发布内容 ID: ${record.id}`)
}

// 删除内容
const handleDelete = (record: any) => {
  message.info(`删除内容 ID: ${record.id}`)
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
    draft: 'default',
    pending_review: 'warning',
    approved: 'success',
    rejected: 'danger',
    published: 'primary',
    scheduled: 'purple',
  }
  return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    draft: '草稿',
    pending_review: '待审核',
    approved: '已审核',
    rejected: '已拒绝',
    published: '已发布',
    scheduled: '已排期',
  }
  return textMap[status] || '未知'
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
  getContentList()
}

onMounted(() => {
  getContentList()
})
</script>

<style scoped>
.content-list-page {
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
</style>
