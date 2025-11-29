<template>
  <page-layout :title="$t('menu.dashboard.dataManagement')">
    <a-card class="general-card">
      <template #title>热门内容数据管理</template>
      <a-space direction="vertical" fill :size="16">
        <!-- Search and filter -->
        <a-form layout="inline" @submit="handleSearch($event)">
          <a-form-item label="内容类型">
            <a-select v-model:value="searchForm.type" placeholder="请选择内容类型">
              <a-select-option value="text">文本</a-select-option>
              <a-select-option value="image">图片</a-select-option>
              <a-select-option value="video">视频</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="搜索关键词">
            <a-input v-model:value="searchForm.keyword" placeholder="请输入关键词" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>

        <!-- Batch operations -->
        <a-space>
          <a-button @click="handleBatchDelete">批量删除</a-button>
        </a-space>

        <!-- Data table -->
        <a-table
          :data="renderList"
          :pagination="pagination"
          :bordered="false"
          :row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onSelectedRowKeysChange }"
          @change="handleTableChange"
        >
          <template #columns>
            <a-table-column title="ID" data-index="key" width="80" />
            <a-table-column title="内容类型" data-index="type" width="100" />
            <a-table-column title="内容标题" data-index="title">
              <template #cell="{ record }">
                <a-typography-paragraph :ellipsis="{ rows: 2 }">
                  {{ record.title }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column title="点击量" data-index="clickNumber" width="120" />
            <a-table-column title="日涨幅" data-index="increases" width="100">
              <template #cell="{ record }">
                <div class="increases-cell">
                  <span>{{ record.increases }}%</span>
                  <icon-caret-up v-if="record.increases > 0" style="color: #f53f3f; font-size: 12px" />
                  <icon-caret-down v-if="record.increases < 0" style="color: #52c41a; font-size: 12px" />
                </div>
              </template>
            </a-table-column>
            <a-table-column title="操作" width="160" fixed="right">
              <template #cell="{ record }">
                <a-space>
                  <a-button type="text" @click="handleEdit(record)">编辑</a-button>
                  <a-button type="text" danger @click="handleDelete(record)">删除</a-button>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>

    <!-- Edit modal -->
    <a-modal v-model:visible="editModalVisible" title="编辑热门内容" @ok="handleEditOk" @cancel="handleEditCancel">
      <a-form :model="editForm" ref="editFormRef" :rules="editRules">
        <a-form-item label="内容类型" name="type">
          <a-select v-model:value="editForm.type" placeholder="请选择内容类型">
            <a-select-option value="text">文本</a-select-option>
            <a-select-option value="image">图片</a-select-option>
            <a-select-option value="video">视频</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="内容标题" name="title">
          <a-input v-model:value="editForm.title" placeholder="请输入内容标题" />
        </a-form-item>
        <a-form-item label="点击量" name="clickNumber">
          <a-input v-model:value="editForm.clickNumber" placeholder="请输入点击量" />
        </a-form-item>
        <a-form-item label="日涨幅" name="increases">
          <a-input-number v-model:value="editForm.increases" placeholder="请输入日涨幅" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { queryPopularList } from '@/api/dashboard'
import type { TableData } from '@arco-design/web-vue/es/table/interface'

const router = useRouter()

// Search form
const searchForm = reactive({
  type: '',
  keyword: '',
})

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// Selected row keys
const selectedRowKeys = ref<string[]>([])

// Render list
const renderList = ref<TableData[]>([])

// Edit modal
const editModalVisible = ref(false)
const editForm = reactive({
  key: undefined,
  type: '',
  title: '',
  clickNumber: '',
  increases: 0,
})
const editRules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  clickNumber: [{ required: true, message: '请输入点击量', trigger: 'blur' }],
}
const editFormRef = ref()

// Fetch data
const fetchData = async (params = {}) => {
  const { data } = await queryPopularList({ type: params.type || 'text' })

  // Filter data by keyword if provided
  let filteredData = data
  if (params.keyword) {
    filteredData = data.filter((item) => item.title.includes(params.keyword))
  }

  renderList.value = filteredData
  pagination.total = filteredData.length
}

// Search
const handleSearch = (e) => {
  if (e && e.preventDefault) {
    e.preventDefault()
  }
  fetchData(searchForm)
}

// Reset
const handleReset = () => {
  searchForm.type = ''
  searchForm.keyword = ''
  fetchData()
}

// Table change
const handleTableChange = (page, filters, sorter) => {
  pagination.page = page.current
  pagination.pageSize = page.pageSize
  fetchData({ ...searchForm, page, filters, sorter })
}

// Selected row keys change
const onSelectedRowKeysChange = (keys) => {
  selectedRowKeys.value = keys
}

// Batch delete
const handleBatchDelete = () => {
  // TODO: Implement batch delete
}

// Edit
const handleEdit = (record) => {
  editModalVisible.value = true
  editForm.key = record.key
  editForm.type = record.type
  editForm.title = record.title
  editForm.clickNumber = record.clickNumber
  editForm.increases = record.increases
}

// Edit ok
const handleEditOk = async () => {
  // TODO: Implement edit
  editModalVisible.value = false
}

// Edit cancel
const handleEditCancel = () => {
  editModalVisible.value = false
}

// Delete
const handleDelete = (record) => {
  // TODO: Implement delete
}

// Mounted
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.general-card {
  min-height: 500px;
}
.increases-cell {
  display: flex;
  align-items: center;
  span {
    margin-right: 4px;
  }
}
</style>
