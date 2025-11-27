<template>
  <div class="content-list-page">
    <a-card title="内容列表">
      <template #extra>
        <a-button type="primary" @click="$router.push('/content/create')">
          <template #icon>
            <icon-plus />
          </template>
          创建内容
        </a-button>
      </template>
      <a-space direction="vertical" :style="{ width: '100%' }">
        <a-form layout="inline">
          <a-form-item label="标题">
            <a-input v-model="searchForm.title" placeholder="请输入内容标题" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-model="searchForm.type" placeholder="请选择内容类型">
              <a-option value="">全部</a-option>
              <a-option value="text">文本</a-option>
              <a-option value="image">图片</a-option>
              <a-option value="video">视频</a-option>
              <a-option value="richText">富媒体</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model="searchForm.status" placeholder="请选择内容状态">
              <a-option value="">全部</a-option>
              <a-option value="draft">草稿</a-option>
              <a-option value="pending">待审核</a-option>
              <a-option value="approved">已审核</a-option>
              <a-option value="rejected">已拒绝</a-option>
              <a-option value="published">已发布</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
        <a-table
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag
                :color="
                  record.status === 'published'
                    ? 'success'
                    : record.status === 'approved'
                      ? 'processing'
                      : record.status === 'pending'
                        ? 'warning'
                        : record.status === 'rejected'
                          ? 'danger'
                          : 'default'
                "
              >
                {{ statusMap[record.status] }}
              </a-tag>
            </template>
            <template v-if="column.key === 'channel'">
              {{ channelMap[record.channel] }}
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button size="small" @click="handleEdit(record.id)">编辑</a-button>
                <a-button size="small" type="primary" @click="handleSubmitAudit(record.id)">提交审核</a-button>
                <a-button size="small" type="success" @click="handlePublish(record.id)">发布</a-button>
                <a-button size="small" type="danger" @click="handleDelete(record.id)">删除</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { getContentList, deleteContent, submitAudit, publishContent } from '@/api/content'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  title: '',
  type: '',
  status: '',
})

// 表格列配置
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '渠道', dataIndex: 'channel', key: 'channel', width: 120 },
  { title: '作者', dataIndex: 'author', key: 'author', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
  { title: '操作', key: 'action', width: 250, fixed: 'right' },
]

// 表格数据
const tableData = ref([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
})

// 状态映射
const statusMap = {
  draft: '草稿',
  pending: '待审核',
  approved: '已审核',
  rejected: '已拒绝',
  published: '已发布',
}

// 渠道映射
const channelMap = {
  wechat: '微信公众号',
  weibo: '新浪微博',
  app: '移动应用',
  website: '官方网站',
}

// 获取内容列表
const fetchContentList = async () => {
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm,
    }
    const response = await getContentList(params)
    if (response.code === 20000) {
      tableData.value = response.data.list
      pagination.total = response.data.total
    } else {
      Message.error(response.message)
    }
  } catch (error) {
    Message.error('获取内容列表失败')
  }
}

// 页面加载时获取内容列表
onMounted(() => {
  fetchContentList()
})

// 处理查询
const handleSearch = () => {
  pagination.current = 1
  fetchContentList()
}

// 处理重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.type = ''
  searchForm.status = ''
  pagination.current = 1
  fetchContentList()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.current = page
  fetchContentList()
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchContentList()
}

// 处理编辑
const handleEdit = (id: string) => {
  router.push(`/content/edit/${id}`)
}

// 处理提交审核
const handleSubmitAudit = async (id: string) => {
  try {
    const response = await submitAudit(id)
    if (response.code === 200) {
      Message.success('提交审核成功')
      fetchContentList()
    } else {
      Message.error(response.message)
    }
  } catch (error) {
    Message.error('提交审核失败')
  }
}

// 处理发布
const handlePublish = async (id: string) => {
  try {
    const response = await publishContent(id)
    if (response.code === 200) {
      Message.success('发布成功')
      fetchContentList()
    } else {
      Message.error(response.message)
    }
  } catch (error) {
    Message.error('发布失败')
  }
}

// 处理删除
const handleDelete = async (id: string) => {
  try {
    const response = await deleteContent(id)
    if (response.code === 200) {
      Message.success('删除成功')
      fetchContentList()
    } else {
      Message.error(response.message)
    }
  } catch (error) {
    Message.error('删除失败')
  }
}
</script>

<style scoped>
.content-list-page {
  padding: 20px;
}
</style>
