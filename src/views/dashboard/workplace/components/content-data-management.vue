<template>
  <a-modal v-model:visible="visible" title="内容数据管理" width="90%" :footer="null" :mask-closable="false" @cancel="handleCancel">
    <a-spin :loading="loading" style="width: 100%">
      <!-- Search Bar -->
      <div style="margin-bottom: 16px">
        <a-input v-model="searchKeyword" placeholder="搜索内容标题" style="width: 300px" :prefix-icon="IconSearch" @input="handleSearch" />
      </div>

      <!-- Filter Section -->
      <a-card :bordered="false" style="margin-bottom: 16px" :body-style="{ padding: '16px' }">
        <a-row :gutter="[16, 16]">
          <a-col :span="8">
            <a-form-item label="内容类型">
              <a-select v-model="filters.contentType" placeholder="选择内容类型">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="text">文本</a-select-option>
                <a-select-option value="image">图片</a-select-option>
                <a-select-option value="video">视频</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="日期范围">
              <a-range-picker v-model="filters.dateRange" style="width: 100%" @change="handleDateRangeChange" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态">
              <a-select v-model="filters.status" placeholder="选择状态">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="online">上线</a-select-option>
                <a-select-option value="offline">下线</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row justify="end">
          <a-button @click="handleResetFilters">重置</a-button>
          <a-button type="primary" @click="handleApplyFilters">应用</a-button>
        </a-row>
      </a-card>

      <!-- Table Section -->
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleCreate">新增</a-button>
      </div>

      <a-table
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :scroll="{ x: true }"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #title="{ record }">
          <a-typography-paragraph :ellipsis="{ rows: 1 }">
            {{ record.title }}
          </a-typography-paragraph>
        </template>
        <template #contentType="{ record }">
          <a-tag :color="record.contentType === 'text' ? 'blue' : record.contentType === 'image' ? 'green' : 'purple'">
            {{ record.contentType === 'text' ? '文本' : record.contentType === 'image' ? '图片' : '视频' }}
          </a-tag>
        </template>
        <template #status="{ record }">
          <a-tag :color="record.status === 'online' ? 'green' : 'red'">
            {{ record.status === 'online' ? '上线' : '下线' }}
          </a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" @click="() => handleEdit(record)">编辑</a-button>
          <a-button type="text" @click="() => handleDelete(record)">删除</a-button>
        </template>
      </a-table>
    </a-spin>

    <!-- Edit Modal -->
    <a-modal v-model:visible="editModalVisible" title="编辑内容" :footer="null" @cancel="handleEditCancel">
      <a-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-align="left" style="max-width: 600px; margin: 0 auto">
        <a-form-item field="title" label="标题">
          <a-input v-model="editForm.title" placeholder="请输入内容标题" />
        </a-form-item>
        <a-form-item field="contentType" label="内容类型">
          <a-select v-model="editForm.contentType" placeholder="选择内容类型">
            <a-select-option value="text">文本</a-select-option>
            <a-select-option value="image">图片</a-select-option>
            <a-select-option value="video">视频</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item field="clickNumber" label="点击量">
          <a-input-number v-model="editForm.clickNumber" placeholder="请输入点击量" style="width: 100%" />
        </a-form-item>
        <a-form-item field="increases" label="日涨幅">
          <a-input-number v-model="editForm.increases" placeholder="请输入日涨幅" style="width: 100%" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="editForm.status" placeholder="选择状态">
            <a-select-option value="online">上线</a-select-option>
            <a-select-option value="offline">下线</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item field="createdTime" label="创建时间">
          <a-date-picker v-model="editForm.createdTime" style="width: 100%" placeholder="请选择创建时间" />
        </a-form-item>
        <a-form-item justify="end">
          <a-space>
            <a-button @click="handleEditCancel">取消</a-button>
            <a-button type="primary" @click="handleEditSubmit">保存</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from '@arco-design/web-vue'
import { IconSearch } from '@arco-design/web-vue/es/icon'

import useLoading from '@/hooks/loading'
import type { TableColumnData, PaginationProps } from '@arco-design/web-vue/es/table/interface'
import type { FormInstance } from '@arco-design/web-vue/es/form'

// Import mock data
import { textList, imageList, videoList } from '../mock'

// Define types
interface ContentRecord {
  id: number
  key: number
  title: string
  clickNumber: string | number
  increases: number
  contentType: 'text' | 'image' | 'video'
  status: 'online' | 'offline'
  createdTime: string
}

interface Filters {
  contentType: string
  dateRange: [Date, Date] | []
  status: string
}

// Component props
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// State management
const { loading, setLoading } = useLoading()
const visible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

const searchKeyword = ref('')
const filters = reactive<Filters>({
  contentType: '',
  dateRange: [],
  status: '',
})

const pagination = reactive<PaginationProps>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '25', '50', '100'],
})

const columns: TableColumnData[] = [
  {
    title: '排名',
    dataIndex: 'key',
    width: 80,
    align: 'center',
  },
  {
    title: '内容标题',
    dataIndex: 'title',
    slotName: 'title',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '内容类型',
    dataIndex: 'contentType',
    slotName: 'contentType',
    width: 120,
    align: 'center',
  },
  {
    title: '点击量',
    dataIndex: 'clickNumber',
    width: 120,
    align: 'center',
    sorter: true,
  },
  {
    title: '日涨幅',
    dataIndex: 'increases',
    width: 120,
    align: 'center',
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 180,
    align: 'center',
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 140,
    align: 'center',
  },
]

const tableData = ref<ContentRecord[]>([])
const allData = ref<ContentRecord[]>([])

// Edit modal state
const editModalVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  id: 0,
  title: '',
  contentType: 'text' as 'text' | 'image' | 'video',
  clickNumber: 0,
  increases: 0,
  status: 'online' as 'online' | 'offline',
  createdTime: '',
})

const editFormRules = {
  title: [
    { required: true, message: '请输入内容标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  contentType: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
  clickNumber: [
    { required: true, message: '请输入点击量', trigger: 'blur' },
    { type: 'number', min: 0, message: '点击量不能为负数', trigger: 'blur' },
  ],
  increases: [
    { required: true, message: '请输入日涨幅', trigger: 'blur' },
    { type: 'number', min: -100, max: 100, message: '日涨幅范围在 -100 到 100 之间', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  createdTime: [{ required: true, message: '请选择创建时间', trigger: 'change' }],
}

// Mock data generation
const generateMockData = () => {
  // Combine all lists and add additional fields
  const combinedList = [...textList, ...imageList, ...videoList]

  // Add id, contentType, status, and createdTime fields
  const enrichedData = combinedList.map((item, index) => {
    // Parse clickNumber to number (e.g., '346.3w+' -> 3463000)
    let { clickNumber } = item
    if (typeof clickNumber === 'string') {
      clickNumber = parseFloat(clickNumber)
      if (item.clickNumber.includes('w+')) {
        clickNumber *= 10000
      }
    }

    // Determine contentType based on which list the item is from
    let contentType: 'text' | 'image' | 'video' = 'text'
    if (imageList.some((i) => i.key === item.key)) {
      contentType = 'image'
    } else if (videoList.some((i) => i.key === item.key)) {
      contentType = 'video'
    }

    return {
      ...item,
      id: index + 1,
      contentType,
      status: Math.random() > 0.2 ? 'online' : 'offline', // 80% online, 20% offline
      createdTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  })

  allData.value = enrichedData
  pagination.total = enrichedData.length
  return enrichedData.slice(0, pagination.pageSize)
}

// Filter data based on search keyword and filters
const filterData = () => {
  let filtered = [...allData.value]

  // Search filter
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.title.toLowerCase().includes(keyword))
  }

  // Content type filter
  if (filters.contentType) {
    filtered = filtered.filter((item) => item.contentType === filters.contentType)
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((item) => item.status === filters.status)
  }

  // Date range filter
  if (filters.dateRange.length === 2) {
    const [startDate, endDate] = filters.dateRange.map((date) => date.getTime())

    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.createdTime).getTime()
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  pagination.total = filtered.length
  return filtered.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)
}

// Methods
const handleCancel = () => {
  visible.value = false
}

const handleSearch = () => {
  pagination.current = 1
  tableData.value = filterData()
}

const handleDateRangeChange = (date: [Date, Date] | []) => {
  filters.dateRange = date
}

const handleResetFilters = () => {
  filters.contentType = ''
  filters.dateRange = []
  filters.status = ''
}

const handleApplyFilters = () => {
  pagination.current = 1
  tableData.value = filterData()
}

const handlePageChange = (current: number) => {
  pagination.current = current
  tableData.value = filterData()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  tableData.value = filterData()
}

const handleCreate = () => {
  editModalVisible.value = true
  // Reset form
  editForm.id = 0
  editForm.title = ''
  editForm.contentType = 'text'
  editForm.clickNumber = 0
  editForm.increases = 0
  editForm.status = 'online'
  const [date] = new Date().toISOString().split('T')
  editForm.createdTime = date
}

const handleEdit = (record: ContentRecord) => {
  editModalVisible.value = true
  // Populate form with record data
  editForm.id = record.id
  editForm.title = record.title
  editForm.contentType = record.contentType
  editForm.clickNumber = typeof record.clickNumber === 'string' ? parseFloat(record.clickNumber) : record.clickNumber
  editForm.increases = record.increases
  editForm.status = record.status
  editForm.createdTime = record.createdTime
}

const handleEditCancel = () => {
  editModalVisible.value = false
  // Clear form
  editFormRef.value?.resetFields()
}

const handleEditSubmit = async () => {
  try {
    const form = editFormRef.value
    if (form) {
      const valid = await form.validate()
      if (valid) {
        if (editForm.id === 0) {
          // Create new record
          const newRecord: ContentRecord = {
            ...editForm,
            id: allData.value.length + 1,
            key: allData.value.length + 1,
            clickNumber: editForm.clickNumber.toString(),
          }
          allData.value.unshift(newRecord)
          message.success('内容创建成功')
        } else {
          // Update existing record
          const index = allData.value.findIndex((item) => item.id === editForm.id)
          if (index !== -1) {
            allData.value[index] = {
              ...allData.value[index],
              ...editForm,
              clickNumber: editForm.clickNumber.toString(),
            }
            message.success('内容更新成功')
          }
        }
        // Update table data
        tableData.value = filterData()
        // Close modal
        editModalVisible.value = false
        // Clear form
        form.resetFields()
      }
    }
  } catch (error) {
    // console.error('Form validation failed:', error)
  }
}

const handleDelete = (record: ContentRecord) => {
  // Show confirmation dialog
  message.confirm(`确定要删除内容“${record.title}”吗？`, '删除确认', {
    okText: '删除',
    cancelText: '取消',
    onOk: () => {
      // Remove record from data
      allData.value = allData.value.filter((item) => item.id !== record.id)
      // Update table data
      tableData.value = filterData()
      message.success('内容删除成功')
    },
  })
}

// Initialize
onMounted(() => {
  setLoading(true)
  // Simulate API call
  setTimeout(() => {
    tableData.value = generateMockData()
    setLoading(false)
  }, 800)
})
</script>

<style scoped lang="less">
// Add any custom styles here
</style>
