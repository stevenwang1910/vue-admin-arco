<template>
  <div class="review-content-page">
    <a-page-header title="内容审核" :sub-title="'审核待审核的内容'">
      <template #extra>
        <a-space>
          <a-select v-model="filterForm.status" placeholder="状态" style="width: 120px">
            <a-option value="pending_review">待审核</a-option>
            <a-option value="approved">已审核</a-option>
            <a-option value="rejected">已拒绝</a-option>
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
    </a-page-header>

    <a-card class="mt-4">
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
          <template v-else-if="column.key === 'submitter'">
            <a-avatar :src="record.submitter.avatar" size="small" style="margin-right: 8px" />
            {{ record.submitter.name }}
          </template>
          <template v-else-if="column.key === 'operations'">
            <a-space>
              <a-button size="small" @click="handleView(record)">
                <template #icon>
                  <icon-eye />
                </template>
                查看
              </a-button>
              <a-button size="small" type="primary" @click="handleApprove(record)" v-if="record.status === 'pending_review'">
                <template #icon>
                  <icon-check />
                </template>
                审核通过
              </a-button>
              <a-button size="small" status="danger" @click="handleReject(record)" v-if="record.status === 'pending_review'">
                <template #icon>
                  <icon-close />
                </template>
                拒绝
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 审核详情弹窗 -->
    <a-modal v-model:visible="reviewModalVisible" title="内容审核" :footer="null" width="800px">
      <div v-if="selectedContent" class="review-modal-content">
        <div class="content-header">
          <h2>{{ selectedContent.title }}</h2>
          <p>{{ selectedContent.subtitle }}</p>
          <div class="content-meta">
            <a-tag :color="getTypeColor(selectedContent.type)">
              {{ getTypeText(selectedContent.type) }}
            </a-tag>
            <span>创建时间：{{ formatDate(selectedContent.createTime) }}</span>
            <span>提交者：{{ selectedContent.submitter.name }}</span>
          </div>
        </div>

        <div class="content-body mt-4">
          <div v-if="selectedContent.type === 'text'" class="text-content">
            {{ selectedContent.textContent }}
          </div>
          <div v-else-if="selectedContent.type === 'image'" class="image-content">
            <a-image :src="selectedContent.imageContent" />
          </div>
          <div v-else-if="selectedContent.type === 'video'" class="video-content">
            <video :src="selectedContent.videoContent" controls style="width: 100%" />
          </div>
          <div v-else-if="selectedContent.type === 'rich_media'" class="rich-media-content">
            <div v-html="selectedContent.richMediaContent"></div>
          </div>
        </div>

        <div class="content-footer mt-4">
          <a-form layout="vertical" :model="reviewForm">
            <a-form-item label="审核意见" field="comment" :rules="[{ required: true, message: '请输入审核意见' }]">
              <a-textarea v-model="reviewForm.comment" placeholder="请输入审核意见" :rows="4" />
            </a-form-item>
          </a-form>

          <div class="action-buttons">
            <a-space>
              <a-button @click="reviewModalVisible = false">取消</a-button>
              <a-button type="primary" @click="handleConfirmApprove" v-if="selectedContent.status === 'pending_review'">
                <template #icon>
                  <icon-check />
                </template>
                审核通过
              </a-button>
              <a-button status="danger" @click="handleConfirmReject" v-if="selectedContent.status === 'pending_review'">
                <template #icon>
                  <icon-close />
                </template>
                拒绝
              </a-button>
            </a-space>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from '@arco-design/web-vue'
import { IconSearch, IconEye, IconCheck, IconClose } from '@arco-design/web-vue/es/icon'
import type { TableProps } from '@arco-design/web-vue'

// 筛选表单
const filterForm = ref({
  status: 'pending_review',
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
    title: '提交者',
    key: 'submitter',
    width: 150,
  },
  {
    title: '操作',
    key: 'operations',
    width: 200,
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

// 审核弹窗可见性
const reviewModalVisible = ref(false)

// 选中的内容
const selectedContent = ref<any>(null)

// 审核表单
const reviewForm = ref({
  comment: '',
})

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
        id: 3,
        title: '测试视频内容',
        subtitle: '这是一个测试视频内容的副标题',
        type: 'video',
        status: 'pending_review',
        thumbnail: 'https://picsum.photos/200/200',
        videoContent: 'https://www.w3schools.com/html/mov_bbb.mp4',
        createTime: '2025-11-22 11:00:00',
        submitter: {
          name: '张三',
          avatar: 'https://picsum.photos/40/40',
        },
      },
      {
        id: 7,
        title: '新的测试内容',
        subtitle: '这是一个新的测试内容的副标题',
        type: 'text',
        status: 'pending_review',
        thumbnail: '',
        textContent: '这是新的测试内容的具体内容...',
        createTime: '2025-11-26 10:00:00',
        submitter: {
          name: '李四',
          avatar: 'https://picsum.photos/40/40',
        },
      },
      {
        id: 8,
        title: '已审核的内容',
        subtitle: '这是一个已审核的内容的副标题',
        type: 'image',
        status: 'approved',
        thumbnail: 'https://picsum.photos/200/200',
        imageContent: 'https://picsum.photos/200/200',
        createTime: '2025-11-25 14:00:00',
        submitter: {
          name: '王五',
          avatar: 'https://picsum.photos/40/40',
        },
      },
      {
        id: 9,
        title: '已拒绝的内容',
        subtitle: '这是一个已拒绝的内容的副标题',
        type: 'rich_media',
        status: 'rejected',
        thumbnail: 'https://picsum.photos/200/200',
        richMediaContent: '<p>这是已拒绝的富媒体内容</p>',
        createTime: '2025-11-24 10:00:00',
        submitter: {
          name: '赵六',
          avatar: 'https://picsum.photos/40/40',
        },
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
    status: 'pending_review',
    keyword: '',
  }
  handleSearch()
}

// 查看内容
const handleView = (record: any) => {
  selectedContent.value = record
  reviewModalVisible.value = true
}

// 审核通过
const handleApprove = (record: any) => {
  selectedContent.value = record
  reviewModalVisible.value = true
}

// 拒绝
const handleReject = (record: any) => {
  selectedContent.value = record
  reviewModalVisible.value = true
}

// 确认审核通过
const handleConfirmApprove = () => {
  message.success('审核通过')
  reviewModalVisible.value = false
  reviewForm.value.comment = ''
  getContentList()
}

// 确认拒绝
const handleConfirmReject = () => {
  message.success('已拒绝')
  reviewModalVisible.value = false
  reviewForm.value.comment = ''
  getContentList()
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
    pending_review: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending_review: '待审核',
    approved: '已审核',
    rejected: '已拒绝',
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
.review-content-page {
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

.review-modal-content {
  max-height: 600px;
  overflow-y: auto;
}

.content-header h2 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
}

.content-header p {
  margin: 0 0 16px 0;
  color: var(--color-text-secondary);
}

.content-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.content-meta span {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.text-content {
  line-height: 1.6;
  white-space: pre-wrap;
}

.image-content {
  display: flex;
  justify-content: center;
}

.rich-media-content {
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
