<template>
  <div class="content-management">
    <Breadcrumb :items="['menu.dashboard', 'menu.dashboard.contentManagement']" />
    <a-card :title="$t('contentManagement.title')">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('contentManagement.add') }}
          </a-button>
          <a-button @click="handleExport" :loading="exportLoading">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('contentManagement.export') }}
          </a-button>
        </a-space>
      </template>

      <!-- 搜索和筛选区域 -->
      <a-row style="margin-bottom: 16px">
        <a-col :flex="1">
          <a-form :model="searchForm" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="keyword" :label="$t('contentManagement.search')">
                  <a-input
                    v-model="searchForm.keyword"
                    :placeholder="$t('contentManagement.search.placeholder')"
                    allow-clear
                    @press-enter="handleSearch"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contentType" :label="$t('contentManagement.contentType')">
                  <a-select v-model="searchForm.contentType" :placeholder="$t('contentManagement.contentType.placeholder')" allow-clear>
                    <a-option value="text">{{ $t('workplace.popularContent.text') }}</a-option>
                    <a-option value="image">{{ $t('workplace.popularContent.image') }}</a-option>
                    <a-option value="video">{{ $t('workplace.popularContent.video') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('contentManagement.status')">
                  <a-select v-model="searchForm.status" :placeholder="$t('contentManagement.status.placeholder')" allow-clear>
                    <a-option value="active">{{ $t('contentManagement.status.active') }}</a-option>
                    <a-option value="inactive">{{ $t('contentManagement.status.inactive') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="handleSearch">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('contentManagement.search') }}
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('contentManagement.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <!-- 批量操作区域 -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button @click="handleBatchDelete" :disabled="selectedKeys.length === 0">
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('contentManagement.batchDelete') }}
            </a-button>
            <a-button @click="handleBatchStatus" :disabled="selectedKeys.length === 0">
              <template #icon>
                <icon-edit />
              </template>
              {{ $t('contentManagement.batchStatus') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <span>{{ $t('contentManagement.selected', { count: selectedKeys.length }) }}</span>
        </a-col>
      </a-row>

      <!-- 数据表格 -->
      <a-table
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :row-selection="rowSelection"
        :pagination="pagination"
        row-key="id"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #contentType="{ record }">
          <a-tag :color="getContentTypeColor(record.contentType)">
            {{ getContentTypeLabel(record.contentType) }}
          </a-tag>
        </template>
        <template #status="{ record }">
          <a-switch v-model="record.status" :checked-value="'active'" :unchecked-value="'inactive'" @change="handleStatusChange(record)">
            <template #checked>{{ $t('contentManagement.status.active') }}</template>
            <template #unchecked>{{ $t('contentManagement.status.inactive') }}</template>
          </a-switch>
        </template>
        <template #actions="{ record }">
          <a-button type="text" size="small" @click="handleView(record)">
            {{ $t('contentManagement.view') }}
          </a-button>
          <a-button type="text" size="small" @click="handleEdit(record)">
            {{ $t('contentManagement.edit') }}
          </a-button>
          <a-popconfirm :content="$t('contentManagement.delete.confirm')" @ok="handleDelete(record)">
            <a-button type="text" size="small" status="danger">
              {{ $t('contentManagement.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑/新增对话框 -->
    <a-modal v-model:visible="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel">
      <a-form ref="formRef" :model="formData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
        <a-form-item
          field="title"
          :label="$t('contentManagement.form.title')"
          :rules="[{ required: true, message: $t('contentManagement.form.title.required') }]"
        >
          <a-input v-model="formData.title" :placeholder="$t('contentManagement.form.title.placeholder')" />
        </a-form-item>
        <a-form-item
          field="contentType"
          :label="$t('contentManagement.form.contentType')"
          :rules="[{ required: true, message: $t('contentManagement.form.contentType.required') }]"
        >
          <a-select v-model="formData.contentType" :placeholder="$t('contentManagement.form.contentType.placeholder')">
            <a-option value="text">{{ $t('workplace.popularContent.text') }}</a-option>
            <a-option value="image">{{ $t('workplace.popularContent.image') }}</a-option>
            <a-option value="video">{{ $t('workplace.popularContent.video') }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          field="clickNumber"
          :label="$t('contentManagement.form.clickNumber')"
          :rules="[{ required: true, message: $t('contentManagement.form.clickNumber.required') }]"
        >
          <a-input-number v-model="formData.clickNumber" :placeholder="$t('contentManagement.form.clickNumber.placeholder')" :min="0" />
        </a-form-item>
        <a-form-item
          field="increases"
          :label="$t('contentManagement.form.increases')"
          :rules="[{ required: true, message: $t('contentManagement.form.increases.required') }]"
        >
          <a-input-number v-model="formData.increases" :placeholder="$t('contentManagement.form.increases.placeholder')" :min="0" />
        </a-form-item>
        <a-form-item field="status" :label="$t('contentManagement.form.status')">
          <a-radio-group v-model="formData.status">
            <a-radio value="active">{{ $t('contentManagement.status.active') }}</a-radio>
            <a-radio value="inactive">{{ $t('contentManagement.status.inactive') }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { IconDelete, IconDownload, IconEdit, IconPlus, IconRefresh, IconSearch } from '@arco-design/web-vue/es/icon'
import { computed, onMounted, reactive, ref } from 'vue'

const loading = ref(false)
const modalLoading = ref(false)
const tableData = ref([])
const selectedKeys = ref<string[]>([])
const modalVisible = ref(false)
const modalTitle = ref('')
const formRef = ref<FormInstance>()

const formData = reactive({
  id: '',
  title: '',
  clickNumber: 0,
  increases: 0,
  contentType: 'text',
  status: 'active',
})

const searchForm = reactive({
  keyword: '',
  contentType: '',
  status: '',
})

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
})

const fetchData = async (params?: any) => {
  loading.value = true
  try {
    // 模拟API调用，传入搜索参数
    const searchParams = params || {
      keyword: searchForm.keyword,
      contentType: searchForm.contentType,
      status: searchForm.status,
    }
    const mockData = generateMockData(searchParams)
    tableData.value = mockData.list
    pagination.total = mockData.total
  } catch (error) {
    Message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const generateMockData = (params?: any) => {
  const list: any[] = []
  const types = ['text', 'image', 'video']
  const statuses = ['active', 'inactive']

  // 生成所有数据（用于过滤）
  const allData: any[] = []
  for (let i = 0; i < 100; i += 1) {
    const index = i + 1
    allData.push({
      id: index.toString(),
      title: `热门内容标题 ${index}`,
      contentType: types[i % 3],
      clickNumber: Math.floor(Math.random() * 1000000) + 1000,
      increases: Math.floor(Math.random() * 100),
      status: statuses[Math.floor(Math.random() * 2)],
      createTime: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    })
  }

  // 根据搜索条件过滤数据
  let filteredData = allData
  if (params?.keyword) {
    filteredData = filteredData.filter((item) => item.title.toLowerCase().includes(params.keyword.toLowerCase()))
  }
  if (params?.contentType) {
    filteredData = filteredData.filter((item) => item.contentType === params.contentType)
  }
  if (params?.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  // 分页
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  const pageData = filteredData.slice(start, end)

  return {
    list: pageData,
    total: filteredData.length,
  }
}

const handleSearch = () => {
  const params = {
    ...searchForm,
    current: pagination.current,
    pageSize: pagination.pageSize,
  }
  fetchData(params)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.contentType = ''
  searchForm.status = ''
  pagination.current = 1
  fetchData()
}

const handleRefresh = () => {
  fetchData()
  Message.success('刷新成功')
}

const handleAdd = () => {
  modalTitle.value = '新增内容'
  Object.assign(formData, {
    id: '',
    title: '',
    clickNumber: 0,
    increases: 0,
    contentType: 'text',
    status: 'active',
  })
  modalVisible.value = true
}

const handleEdit = (record: any) => {
  modalTitle.value = '编辑内容'
  Object.assign(formData, {
    id: record.id,
    title: record.title,
    clickNumber: record.clickNumber,
    increases: record.increases,
    contentType: record.contentType,
    status: record.status,
  })
  modalVisible.value = true
}

const handleDelete = (record: any) => {
  const index = tableData.value.findIndex((item: any) => item.id === record.id)
  if (index > -1) {
    tableData.value.splice(index, 1)
    Message.success('删除成功')
    fetchData()
  }
}

const handleBatchDelete = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请选择要删除的数据')
    return
  }

  tableData.value = tableData.value.filter((item: any) => !selectedKeys.value.includes(item.id))
  selectedKeys.value = []
  Message.success('批量删除成功')
  fetchData()
}

const handleSelectionChange = (keys: string[]) => {
  selectedKeys.value = keys
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true

    if (modalTitle.value === '新增内容') {
      const newItem = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      }
      tableData.value.unshift(newItem)
      Message.success('新增成功')
    } else {
      const index = tableData.value.findIndex((item: any) => item.id === formData.id)
      if (index > -1) {
        tableData.value[index] = { ...formData }
        Message.success('编辑成功')
      }
    }

    modalVisible.value = false
    fetchData()
  } catch (error) {
    // 表单验证失败，已在表单中显示错误信息
  } finally {
    modalLoading.value = false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  formRef.value?.resetFields()
}

const getContentTypeColor = (type: string) => {
  const colors = {
    text: 'blue',
    image: 'orange',
    video: 'purple',
  }
  return colors[type as keyof typeof colors] || 'default'
}

const getContentTypeLabel = (type: string) => {
  const labels = {
    text: '文本',
    image: '图片',
    video: '视频',
  }
  return labels[type as keyof typeof labels] || '未知'
}

const getRankColor = (rank: number) => {
  const colors = {
    1: '#f53f3f',
    2: '#ff7d00',
    3: '#f7ba1e',
  }
  return colors[rank as keyof typeof colors] || '#999'
}

const getClickBarWidth = (clicks: number) => {
  const maxClicks = Math.max(...(tableData.value.map((item: any) => item.clickNumber) || [clicks]))
  return `${Math.max((clicks / maxClicks) * 80, 6)}px`
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '内容类型',
    dataIndex: 'contentType',
    slotName: 'contentType',
    width: 120,
  },
  {
    title: '点击量',
    dataIndex: 'clickNumber',
    width: 120,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: '增长率',
    dataIndex: 'increases',
    width: 120,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'actions',
    width: 180,
    fixed: 'right',
  },
]

const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
}

const handlePageChange = (page: number) => {
  pagination.current = page
  fetchData()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchData()
}

const handleStatusChange = (record: any) => {
  Message.success('状态更新成功')
}

const handleView = (record: any) => {
  Message.info('查看功能待实现')
}

const handleExport = () => {
  Message.info('导出功能待实现')
}

const handleBatchStatus = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请选择要修改状态的数据')
    return
  }
  Message.info('批量修改状态功能待实现')
}

const selectedCount = computed(() => selectedKeys.value.length)

onMounted(() => {
  fetchData()
})
</script>
}]}

<script lang="ts">
export default {
  name: 'ContentManagement',
}
</script>

<style scoped lang="less">
.content-management {
  padding: 0 20px 20px 20px;

  .search-area {
    margin-bottom: 16px;
    padding: 16px;
    background: var(--color-fill-2);
    border-radius: 6px;
  }

  .batch-operation {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .selected-info {
      color: var(--color-text-3);
      font-size: 14px;
    }
  }

  .rank-cell {
    display: flex;
    align-items: center;
    gap: 6px;

    .rank-number {
      font-weight: 600;
      font-size: 14px;
      color: var(--color-text-1);
    }

    .rank-icon {
      font-size: 16px;
    }
  }

  .content-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .content-type-badge {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.type-text {
        background-color: #e8f7ff;
        color: #165dff;
      }

      &.type-image {
        background-color: #fff3e0;
        color: #ff7d00;
      }

      &.type-video {
        background-color: #f3e5f5;
        color: #7816ff;
      }

      .type-icon {
        font-size: 14px;
      }
    }

    .content-title {
      font-weight: 500;
      color: var(--color-text-1);
      margin: 0;
    }
  }

  .click-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .click-number {
      font-weight: 600;
      color: var(--color-text-1);
      min-width: 50px;
    }

    .click-bar {
      height: 4px;
      background: linear-gradient(90deg, #165dff 0%, #14c9c9 100%);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }

  .increases-cell {
    display: flex;
    align-items: center;
    gap: 4px;

    &.is-positive {
      color: #00b42a;

      .increases-icon {
        color: #00b42a;
      }
    }

    &.is-negative {
      color: #f53f3f;

      .increases-icon {
        color: #f53f3f;
      }
    }

    .increases-value {
      font-weight: 600;
      min-width: 45px;
    }

    .increases-icon {
      font-size: 12px;
    }
  }

  .type-tag {
    display: flex;
    align-items: center;
    gap: 4px;

    .arco-icon {
      font-size: 12px;
    }
  }

  .arco-table {
    .arco-table-th {
      background-color: var(--color-fill-2);
      font-weight: 600;
    }

    .arco-table-tr:hover {
      background-color: var(--color-fill-1);
    }
  }

  @media (max-width: 768px) {
    .search-area {
      .arco-col {
        margin-bottom: 8px;
      }
    }

    .batch-operation {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .click-cell .click-bar {
      display: none;
    }
  }
}
</style>
