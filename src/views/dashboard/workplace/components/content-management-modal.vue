<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('workplace.contentManagement')"
    :width="1200"
    :footer="false"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <div class="content-management">
      <!-- 统计卡片 -->
      <a-row :gutter="16" class="stats-row">
        <a-col :span="6">
          <a-statistic :title="$t('workplace.totalContent')" :value="stats.totalContent" show-group-separator>
            <template #prefix>
              <icon-file />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic :title="$t('workplace.publishedContent')" :value="stats.publishedContent" show-group-separator>
            <template #prefix>
              <icon-check-circle />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic :title="$t('workplace.draftContent')" :value="stats.draftContent" show-group-separator>
            <template #prefix>
              <icon-edit />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic :title="$t('workplace.totalViews')" :value="stats.totalViews" show-group-separator>
            <template #prefix>
              <icon-eye />
            </template>
          </a-statistic>
        </a-col>
      </a-row>

      <!-- 数据表格 -->
      <ContentDataTable
        ref="tableRef"
        :loading="loading"
        :data="tableData"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @search="handleSearch"
        @create="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- 创建/编辑模态框 -->
    <ContentFormModal
      v-model:visible="formModalVisible"
      :mode="formMode"
      :data="currentData"
      :categories="categories"
      @submit="handleFormSubmit"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import {
  queryContentList,
  createContent,
  updateContent,
  deleteContent,
  getContentCategories,
  getContentStats,
  ContentListParams,
  ContentDataRecord,
  CategoryOption,
  ContentStats,
  ContentListResponse,
} from '@/api/content-management'
import useLoading from '@/hooks/loading'
import ContentDataTable from './content-data-table.vue'
import ContentFormModal from './content-form-modal.vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const { loading, setLoading } = useLoading(false)
const tableRef = ref()

// 数据状态
const tableData = ref<ContentDataRecord[]>([])
const categories = ref<CategoryOption[]>([])
const stats = reactive<ContentStats>({
  totalContent: 0,
  publishedContent: 0,
  draftContent: 0,
  archivedContent: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
})

// 分页状态
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 25, 50, 100],
})

// 查询参数
const queryParams = reactive<ContentListParams>({
  current: 1,
  pageSize: 10,
  title: '',
  category: '',
  status: '',
  author: '',
  startDate: '',
  endDate: '',
  sortField: '',
  sortOrder: 'desc',
})

// 表单模态框状态
const formModalVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentData = ref<ContentDataRecord | null>(null)

// 获取数据
const fetchData = async () => {
  setLoading(true)
  try {
    const params = { ...queryParams, current: pagination.current, pageSize: pagination.pageSize }
    const { data } = await queryContentList(params)

    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    Message.error(t('workplace.fetchDataError'))
  } finally {
    setLoading(false)
  }
}

// 获取分类数据
const fetchCategories = async () => {
  try {
    const { data } = await getContentCategories()
    categories.value = data
  } catch (error) {
    Message.error(t('workplace.fetchCategoriesError'))
  }
}

// 获取统计数据
const fetchStats = async () => {
  try {
    const { data } = await getContentStats()
    Object.assign(stats, data)
  } catch (error) {
    Message.error(t('workplace.fetchStatsError'))
  }
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.current = page
  fetchData()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchData()
}

const handleSortChange = (sortField: string, sortOrder: 'asc' | 'desc') => {
  queryParams.sortField = sortField
  queryParams.sortOrder = sortOrder
  fetchData()
}

const handleFilterChange = (filters: any) => {
  Object.assign(queryParams, filters)
  pagination.current = 1
  fetchData()
}

const handleSearch = (keyword: string) => {
  queryParams.title = keyword
  pagination.current = 1
  fetchData()
}

const handleCreate = () => {
  formMode.value = 'create'
  currentData.value = null
  formModalVisible.value = true
}

const handleEdit = (record: ContentDataRecord) => {
  formMode.value = 'edit'
  currentData.value = record
  formModalVisible.value = true
}

const handleDelete = async (record: ContentDataRecord) => {
  try {
    await deleteContent(record.id)
    Message.success(t('workplace.deleteSuccess'))
    fetchData()
    fetchStats()
  } catch (error) {
    Message.error(t('workplace.deleteError'))
  }
}

const handleRefresh = () => {
  // 显示加载状态
  const loadingMsg = Message.loading({
    content: t('workplace.refresh'),
    duration: 0,
  })

  // 并行获取所有数据
  Promise.all([fetchData(), fetchCategories(), fetchStats()])
    .then(() => {
      loadingMsg.close()
      Message.success(t('workplace.refresh') + t('workplace.success'))
    })
    .catch(() => {
      loadingMsg.close()
      Message.error(t('workplace.fetchDataError'))
    })
}

const handleFormSubmit = async (data: any) => {
  try {
    if (formMode.value === 'create') {
      await createContent(data)
      Message.success(t('workplace.createSuccess'))
    } else {
      await updateContent({ id: currentData.value!.id, ...data })
      Message.success(t('workplace.updateSuccess'))
    }

    formModalVisible.value = false
    fetchData()
    fetchStats()
  } catch (error) {
    Message.error(t('workplace.submitError'))
  }
}

const handleCancel = () => {
  emit('update:visible', false)
}

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchData()
      fetchCategories()
      fetchStats()
    }
  }
)
</script>

<style lang="less" scoped>
.content-management {
  .stats-row {
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--color-fill-2);
    border-radius: 6px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content-management {
    .stats-row {
      padding: 12px;
      margin-bottom: 16px;
    }
  }

  :deep(.arco-modal) {
    width: 95vw !important;
    max-width: 95vw;
    margin: 10px auto;
  }

  :deep(.arco-modal-body) {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .content-management {
    .stats-row {
      padding: 8px;
      margin-bottom: 12px;
    }
  }

  :deep(.arco-modal) {
    width: 98vw !important;
    max-width: 98vw;
    margin: 5px auto;
  }

  :deep(.arco-modal-body) {
    padding: 12px;
  }
}
</style>
