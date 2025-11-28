<template>
  <a-modal v-model:visible="visibleModal" title="内容数据管理" width="90%" :footer="null" :mask-closable="false" destroy-on-close>
    <div class="content-data-management">
      <!-- Search and Filter Section -->
      <a-card class="filter-card" :body-style="{ padding: '16px' }">
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item :span="8">
            <a-input v-model:value="searchKeyword" placeholder="搜索内容标题" prefix="<icon-search />" @input="handleSearch" />
          </a-grid-item>
          <a-grid-item :span="6">
            <a-select v-model:value="contentType" placeholder="内容类型" style="width: 100%">
              <a-option value="">全部类型</a-option>
              <a-option value="text">图文</a-option>
              <a-option value="image">图片</a-option>
              <a-option value="video">视频</a-option>
            </a-select>
          </a-grid-item>
          <a-grid-item :span="6">
            <a-date-picker
              v-model:value="dateRange"
              type="daterange"
              placeholder="选择日期范围"
              style="width: 100%"
              @change="handleDateRangeChange"
            />
          </a-grid-item>
          <a-grid-item :span="4">
            <a-button type="primary" @click="handleAdd" style="width: 100%">
              <icon-plus-circle />
              添加内容
            </a-button>
          </a-grid-item>
        </a-grid>
      </a-card>

      <!-- Data Table Section -->
      <a-table
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :row-key="(record) => record.key"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <!-- Edit and Delete Actions -->
        <template #operation="{ record }">
          <a-space>
            <a-button type="text" @click="handleEdit(record)">编辑</a-button>
            <a-button type="text" status="danger" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- Add/Edit Modal -->
    <a-modal v-model:visible="editVisible" :title="isEdit ? '编辑内容' : '添加内容'" :footer="null" @ok="handleSave" @cancel="handleCancel">
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-form-item label="内容类型" name="type">
          <a-select v-model:value="formData.type" placeholder="选择内容类型" style="width: 100%">
            <a-option value="text">图文</a-option>
            <a-option value="image">图片</a-option>
            <a-option value="video">视频</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formData.title" placeholder="输入内容标题" />
        </a-form-item>
        <a-form-item label="点击量" name="clickNumber">
          <a-input-number v-model:value="formData.clickNumber" placeholder="输入点击量" :min="0" />
        </a-form-item>
        <a-form-item label="增长率(%)" name="increases">
          <a-input-number v-model:value="formData.increases" placeholder="输入增长率" :min="0" />
        </a-form-item>
        <a-form-item label="发布日期" name="publishDate">
          <a-date-picker v-model:value="formData.publishDate" style="width: 100%" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="published">已发布</a-radio>
            <a-radio value="draft">草稿</a-radio>
            <a-radio value="pending">审核中</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSave">保存</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, h } from 'vue'
import { message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:visible'])

// Computed property for v-model binding
const visibleModal = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

// States
const { loading, setLoading } = useLoading(false)
const searchKeyword = ref('')
const contentType = ref('')
const dateRange = ref<dayjs.Dayjs[] | null>(null)
const editVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// Mock data
const mockData = [
  {
    key: 1,
    type: 'text',
    title: '经济日报：财政政策要精准提升…',
    clickNumber: 3463000,
    increases: 35,
    publishDate: dayjs('2023-01-15'),
    status: 'published',
    author: '经济日报',
  },
  {
    key: 2,
    type: 'image',
    title: '杨涛接替陆慷出任外交部美大司…',
    clickNumber: 153000,
    increases: 15,
    publishDate: dayjs('2023-01-16'),
    status: 'published',
    author: '环球时报',
  },
  {
    key: 3,
    type: 'video',
    title: '这是今日10点的南京',
    clickNumber: 3676000,
    increases: 5,
    publishDate: dayjs('2023-01-17'),
    status: 'draft',
    author: '央视新闻',
  },
  {
    key: 4,
    type: 'text',
    title: '双12遇冷，消费者厌倦了电商平…',
    clickNumber: 3242000,
    increases: 22,
    publishDate: dayjs('2023-01-18'),
    status: 'published',
    author: '界面新闻',
  },
  {
    key: 5,
    type: 'image',
    title: '图集：龙卷风袭击美国多州房屋…',
    clickNumber: 122000,
    increases: 26,
    publishDate: dayjs('2023-01-19'),
    status: 'pending',
    author: '人民日报',
  },
  {
    key: 6,
    type: 'video',
    title: '立陶宛不断挑衅致经济受损民众…',
    clickNumber: 3522000,
    increases: 17,
    publishDate: dayjs('2023-01-20'),
    status: 'published',
    author: '新华社',
  },
  {
    key: 7,
    type: 'text',
    title: '致敬坚守战“疫”一线的社区工作…',
    clickNumber: 3189000,
    increases: 9,
    publishDate: dayjs('2023-01-21'),
    status: 'published',
    author: '光明日报',
  },
  {
    key: 8,
    type: 'image',
    title: '52岁大姐贴钱照顾自闭症儿童八…',
    clickNumber: 189000,
    increases: 9,
    publishDate: dayjs('2023-01-22'),
    status: 'published',
    author: '中国青年报',
  },
  {
    key: 9,
    type: 'video',
    title: '韩国艺人刘在石确诊新冠',
    clickNumber: 3489000,
    increases: 30,
    publishDate: dayjs('2023-01-23'),
    status: 'published',
    author: '环球网',
  },
  {
    key: 10,
    type: 'text',
    title: '普高还是职高？家长们陷入选择…',
    clickNumber: 2579000,
    increases: 17,
    publishDate: dayjs('2023-01-24'),
    status: 'draft',
    author: '中国教育报',
  },
]

// Form data
const formData = reactive({
  key: undefined,
  type: 'text',
  title: '',
  clickNumber: 0,
  increases: 0,
  publishDate: dayjs(),
  status: 'draft',
  author: '',
})

// Form rules
const formRules = {
  type: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
  title: [
    { required: true, message: '请输入内容标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  clickNumber: [
    { required: true, message: '请输入点击量', trigger: 'blur' },
    { type: 'number', min: 0, message: '点击量不能为负数', trigger: 'blur' },
  ],
  increases: [
    { required: true, message: '请输入增长率', trigger: 'blur' },
    { type: 'number', min: 0, message: '增长率不能为负数', trigger: 'blur' },
  ],
  publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// Pagination
const pagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '25', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条数据`,
  showPageSize: true,
  total: mockData.length,
})

// Columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'key',
    key: 'key',
    width: 80,
    align: 'center',
    sortable: true,
  },
  {
    title: '内容类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    align: 'center',
    render: (type: string) => {
      const typeMap = {
        text: '图文',
        image: '图片',
        video: '视频',
      }
      return typeMap[type] || type
    },
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    render: (title: string) => {
      if (searchKeyword.value) {
        const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
        return title.replace(regex, '<span style="background-color: #fff2cc; color: #e6a23c;">$1</span>')
      }
      return title
    },
  },
  {
    title: '点击量',
    dataIndex: 'clickNumber',
    key: 'clickNumber',
    width: 140,
    align: 'right',
    sortable: true,
    render: (clickNumber: number) => {
      if (clickNumber >= 10000) {
        return `${(clickNumber / 10000).toFixed(1)}w+`
      }
      return clickNumber.toLocaleString()
    },
  },
  {
    title: '增长率',
    dataIndex: 'increases',
    key: 'increases',
    width: 120,
    align: 'right',
    sortable: true,
    render: (increases: number) => `${increases}%`,
  },
  {
    title: '发布日期',
    dataIndex: 'publishDate',
    key: 'publishDate',
    width: 180,
    align: 'center',
    sortable: true,
    render: (date: dayjs.Dayjs) => date.format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    render: (status: string) => {
      const statusMap = {
        published: { text: '已发布', status: 'success' },
        draft: { text: '草稿', status: 'default' },
        pending: { text: '审核中', status: 'warning' },
      }
      const { text, status: statusColor } = statusMap[status] || { text: status, status: 'default' }
      return h('a-tag', { status: statusColor }, text)
    },
  },
  {
    title: '操作',
    key: 'operation',
    width: 140,
    align: 'center',
    slot: 'operation',
  },
]

// Filtered data
const filteredData = computed(() => {
  let data = [...mockData]

  // Filter by search keyword
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter((item) => item.title.toLowerCase().includes(keyword))
  }

  // Filter by content type
  if (contentType.value) {
    data = data.filter((item) => item.type === contentType.value)
  }

  // Filter by date range
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0].startOf('day')
    const endDate = dateRange.value[1].endOf('day')
    data = data.filter((item) => {
      const itemDate = dayjs(item.publishDate)
      return itemDate.isAfter(startDate) && itemDate.isBefore(endDate)
    })
  }

  // Update pagination total
  pagination.value.total = data.length

  return data
})

// Table data with pagination
const tableData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredData.value.slice(start, end)
})

// Handle search
const handleSearch = () => {
  pagination.value.current = 1
}

// Handle date range change
const handleDateRangeChange = () => {
  pagination.value.current = 1
}

// Handle page change
const handlePageChange = (current: number) => {
  pagination.value.current = current
}

// Handle page size change
const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.current = 1
}

// Handle add
const handleAdd = () => {
  isEdit.value = false
  formData.key = undefined
  formData.type = 'text'
  formData.title = ''
  formData.clickNumber = 0
  formData.increases = 0
  formData.publishDate = dayjs()
  formData.status = 'draft'
  formData.author = ''
  editVisible.value = true
}

// Handle edit
const handleEdit = (record: any) => {
  isEdit.value = true
  formData.key = record.key
  formData.type = record.type
  formData.title = record.title
  formData.clickNumber = record.clickNumber
  formData.increases = record.increases
  formData.publishDate = record.publishDate
  formData.status = record.status
  formData.author = record.author
  editVisible.value = true
}

// Handle delete
const handleDelete = (record: any) => {
  // In a real application, you would send a request to delete the data
  message.success('删除成功')
}

// Handle save
const handleSave = () => {
  formRef.value.validate().then(() => {
    // In a real application, you would send a request to save the data
    if (isEdit.value) {
      message.success('修改成功')
    } else {
      message.success('添加成功')
    }
    editVisible.value = false
  })
}

// Handle cancel
const handleCancel = () => {
  editVisible.value = false
}
</script>

<style lang="less" scoped>
.content-data-management {
  .filter-card {
    margin-bottom: 16px;
  }
}
</style>
