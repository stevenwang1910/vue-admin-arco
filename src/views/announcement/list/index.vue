<template>
  <div class="container">
    <Breadcrumb :items="['menu.announcement', 'menu.announcement.list']" />
    <a-space direction="vertical" :size="12" fill>
      <a-card class="search-card">
        <a-form layout="inline" :model="searchForm" @submit.prevent="handleSearch">
          <a-form-item label="公告标题">
            <a-input v-model="searchForm.title" placeholder="请输入公告标题" style="width: 200px" />
          </a-form-item>
          <a-form-item label="发布状态">
            <a-select v-model="searchForm.status" placeholder="请选择发布状态" style="width: 150px">
              <a-option value="">全部</a-option>
              <a-option value="draft">草稿</a-option>
              <a-option value="published">已发布</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="创建时间">
            <a-range-picker v-model="searchForm.dateRange" style="width: 300px" @change="handleDateChange" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card class="action-card">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <icon-plus />
            </template>
            新建公告
          </a-button>
          <a-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <template #icon>
              <icon-delete />
            </template>
            批量删除
          </a-button>
        </a-space>
      </a-card>
      <a-card class="table-card">
        <a-table
          v-model:selectedRows="selectedRows"
          :columns="columns"
          :data="announcementList"
          :pagination="pagination"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
        >
          <template #cell:status="{ record }">
            <a-tag :color="record.status === 'published' ? 'success' : 'default'">
              {{ record.status === 'published' ? '已发布' : '草稿' }}
            </a-tag>
          </template>
          <template #cell:createTime="{ record }">
            {{ formatDate(record.createTime) }}
          </template>
          <template #cell:publishTime="{ record }">
            {{ record.publishTime ? formatDate(record.publishTime) : '-' }}
          </template>
          <template #cell:action="{ record }">
            <a-space size="small">
              <a-button type="text" @click="handleEdit(record.id)">编辑</a-button>
              <a-button type="text" :status="record.status === 'published' ? 'warning' : 'success'" @click="handlePublish(record)">
                {{ record.status === 'published' ? '撤销发布' : '发布' }}
              </a-button>
              <a-button type="text" status="danger" @click="handleDelete(record.id)">删除</a-button>
            </a-space>
          </template>
        </a-table>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
import type { TableProps } from '@arco-design/web-vue/es/table/interface'
import { format } from '@/utils/index'

import { getAnnouncementList, deleteAnnouncement, publishAnnouncement, unpublishAnnouncement } from '@/api/announcement'
import type { Announcement } from '@/api/announcement'
import useLoading from '@/hooks/loading'

const router = useRouter()
const { loading, setLoading } = useLoading()

// 搜索表单
const searchForm = reactive({
  title: '',
  status: '',
  dateRange: [] as Date[],
  startTime: '',
  endTime: '',
})

// 表格数据
const announcementList = ref<Announcement[]>([])
const selectedRows = ref<Announcement[]>([])
const totalCount = ref(0)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (totalRecords: number) => `共 ${totalRecords} 条记录`,
})

// 表格列配置
const columns: TableProps['columns'] = [
  {
    type: 'selection',
    width: 60,
  },
  {
    title: '公告标题',
    dataIndex: 'title',
    ellipsis: true,
    minWidth: 200,
  },
  {
    title: '发布状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    sortable: true,
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    width: 180,
    sortable: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
}

// 获取公告列表
const fetchAnnouncementList = async () => {
  try {
    setLoading(true)
    const { data } = await getAnnouncementList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      title: searchForm.title,
      status: searchForm.status as 'draft' | 'published' | undefined,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
    })
    announcementList.value = data.list
    totalCount.value = data.total
    pagination.total = data.total
  } catch (error) {
    Message.error('获取公告列表失败')
  } finally {
    setLoading(false)
  }
}

// 处理日期范围变化
const handleDateChange = (dateRange: Date[]) => {
  if (dateRange && dateRange.length === 2) {
    searchForm.startTime = dateRange[0].toISOString()
    searchForm.endTime = dateRange[1].toISOString()
  } else {
    searchForm.startTime = ''
    searchForm.endTime = ''
  }
}

// 搜索公告
const handleSearch = () => {
  pagination.current = 1
  fetchAnnouncementList()
}

// 重置搜索表单
const handleReset = () => {
  searchForm.title = ''
  searchForm.status = ''
  searchForm.dateRange = []
  searchForm.startTime = ''
  searchForm.endTime = ''
  pagination.current = 1
  fetchAnnouncementList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchAnnouncementList()
}

// 排序变化
const handleSortChange = (sort: any) => {
  // console.log('sort change', sort)
  // 这里可以添加排序逻辑
  fetchAnnouncementList()
}

// 新建公告
const handleCreate = () => {
  router.push('/announcement/edit')
}

// 编辑公告
const handleEdit = (id: number) => {
  router.push(`/announcement/edit/${id}`)
}

// 发布/撤销发布公告
const handlePublish = async (record: Announcement) => {
  try {
    setLoading(true)
    if (record.status === 'published') {
      await unpublishAnnouncement(record.id)
      Message.success('撤销发布成功')
    } else {
      await publishAnnouncement(record.id)
      Message.success('发布成功')
    }
    fetchAnnouncementList()
  } catch (error) {
    Message.error(record.status === 'published' ? '撤销发布失败' : '发布失败')
  } finally {
    setLoading(false)
  }
}

// 删除公告
const handleDelete = async (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '您确定要删除这条公告吗？',
    async onOk() {
      try {
        setLoading(true)
        await deleteAnnouncement([id])
        Message.success('删除成功')
        fetchAnnouncementList()
      } catch (error) {
        Message.error('删除失败')
      } finally {
        setLoading(false)
      }
    },
  })
}

// 批量删除公告
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    Message.warning('请选择要删除的公告')
    return
  }
  Modal.confirm({
    title: '确认批量删除',
    content: `您确定要删除选中的 ${selectedRows.value.length} 条公告吗？`,
    async onOk() {
      try {
        setLoading(true)
        const ids = selectedRows.value.map((item) => item.id)
        await deleteAnnouncement(ids)
        Message.success('批量删除成功')
        selectedRows.value = []
        fetchAnnouncementList()
      } catch (error) {
        Message.error('批量删除失败')
      } finally {
        setLoading(false)
      }
    },
  })
}

// 页面挂载时获取公告列表
onMounted(() => {
  fetchAnnouncementList()
})
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.search-card {
  margin-bottom: 12px;
}

.action-card {
  margin-bottom: 12px;
}

.table-card {
  overflow: hidden;
}
</style>
