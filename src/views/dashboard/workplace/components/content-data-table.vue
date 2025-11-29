<template>
  <div class="content-data-table">
    <!-- 工具栏 -->
    <div class="table-toolbar">
      <a-row :gutter="16" align="center">
        <a-col :span="8">
          <a-input-search
            v-model="searchKeyword"
            :placeholder="$t('workplace.searchPlaceholder')"
            allow-clear
            @search="handleSearch"
            @clear="handleSearchClear"
          />
        </a-col>
        <a-col :span="16" style="text-align: right">
          <a-space>
            <a-button type="primary" @click="$emit('create')">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('workplace.create') }}
            </a-button>
            <a-button @click="handleRefresh">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('workplace.refresh') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <!-- 数据表格 -->
    <a-table
      :loading="loading"
      :data="data"
      :columns="columns"
      :pagination="false"
      :bordered="false"
      :scroll="{ x: 1200 }"
      @sorter-change="handleSorterChange"
    >
      <!-- 状态标签 -->
      <template #status="{ record }">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusLabel(record.status) }}
        </a-tag>
      </template>

      <!-- 标签列表 -->
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="tag in record.tags" :key="tag" size="small">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>

      <!-- 数字格式化 -->
      <template #views="{ record }">
        {{ formatNumber(record.views) }}
      </template>

      <template #likes="{ record }">
        {{ formatNumber(record.likes) }}
      </template>

      <template #comments="{ record }">
        {{ formatNumber(record.comments) }}
      </template>

      <!-- 日期格式化 -->
      <template #publishDate="{ record }">
        {{ formatDate(record.publishDate) }}
      </template>

      <template #createdAt="{ record }">
        {{ formatDate(record.createdAt) }}
      </template>

      <template #updatedAt="{ record }">
        {{ formatDate(record.updatedAt) }}
      </template>

      <!-- 操作列 -->
      <template #operations="{ record }">
        <a-button type="text" size="small" @click="$emit('edit', record)">
          {{ $t('workplace.edit') }}
        </a-button>
        <a-popconfirm :content="$t('workplace.deleteConfirm')" @ok="$emit('delete', record)">
          <a-button type="text" status="danger" size="small">
            {{ $t('workplace.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>

    <!-- 分页 -->
    <div class="table-pagination">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="pagination.total"
        :page-size-options="pagination.pageSizeOptions"
        show-total
        show-jumper
        show-page-size
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import { ContentDataRecord } from '@/api/content-management'
import dayjs from 'dayjs'

interface Props {
  loading: boolean
  data: ContentDataRecord[]
  pagination: {
    current: number
    pageSize: number
    total: number
    pageSizeOptions: number[]
  }
}

interface Emits {
  (e: 'page-change', page: number): void
  (e: 'page-size-change', pageSize: number): void
  (e: 'sort-change', field: string, order: 'asc' | 'desc'): void
  (e: 'filter-change', filters: any): void
  (e: 'search', keyword: string): void
  (e: 'create'): void
  (e: 'edit', record: ContentDataRecord): void
  (e: 'delete', record: ContentDataRecord): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const searchKeyword = ref('')
const currentPage = computed(() => props.pagination.current)
const pageSize = computed(() => props.pagination.pageSize)

// 表格列配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('workplace.title'),
    dataIndex: 'title',
    width: 200,
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('workplace.category'),
    dataIndex: 'category',
    width: 100,
    filters: [
      { text: t('workplace.categoryTech'), value: '技术' },
      { text: t('workplace.categoryProduct'), value: '产品' },
      { text: t('workplace.categoryDesign'), value: '设计' },
      { text: t('workplace.categoryOperation'), value: '运营' },
      { text: t('workplace.categoryMarket'), value: '市场' },
      { text: t('workplace.categorySales'), value: '销售' },
      { text: t('workplace.categoryHR'), value: '人力资源' },
      { text: t('workplace.categoryFinance'), value: '财务' },
    ],
    filterable: {
      filters: [
        { text: t('workplace.categoryTech'), value: '技术' },
        { text: t('workplace.categoryProduct'), value: '产品' },
        { text: t('workplace.categoryDesign'), value: '设计' },
        { text: t('workplace.categoryOperation'), value: '运营' },
        { text: t('workplace.categoryMarket'), value: '市场' },
        { text: t('workplace.categorySales'), value: '销售' },
        { text: t('workplace.categoryHR'), value: '人力资源' },
        { text: t('workplace.categoryFinance'), value: '财务' },
      ],
      filter: (value: string, record: ContentDataRecord) => record.category === value,
    },
  },
  {
    title: t('workplace.status'),
    dataIndex: 'status',
    width: 100,
    slotName: 'status',
    filters: [
      { text: t('workplace.statusPublished'), value: 'published' },
      { text: t('workplace.statusDraft'), value: 'draft' },
      { text: t('workplace.statusArchived'), value: 'archived' },
    ],
    filterable: {
      filters: [
        { text: t('workplace.statusPublished'), value: 'published' },
        { text: t('workplace.statusDraft'), value: 'draft' },
        { text: t('workplace.statusArchived'), value: 'archived' },
      ],
      filter: (value: string, record: ContentDataRecord) => record.status === value,
    },
  },
  {
    title: t('workplace.author'),
    dataIndex: 'author',
    width: 120,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('workplace.tags'),
    dataIndex: 'tags',
    slotName: 'tags',
    width: 150,
  },
  {
    title: t('workplace.views'),
    dataIndex: 'views',
    slotName: 'views',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    align: 'right',
  },
  {
    title: t('workplace.likes'),
    dataIndex: 'likes',
    slotName: 'likes',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    align: 'right',
  },
  {
    title: t('workplace.comments'),
    dataIndex: 'comments',
    slotName: 'comments',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    align: 'right',
  },
  {
    title: t('workplace.publishDate'),
    dataIndex: 'publishDate',
    slotName: 'publishDate',
    width: 120,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('workplace.operations'),
    slotName: 'operations',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
])

// 工具函数
const getStatusColor = (status: string) => {
  const colorMap = {
    published: 'green',
    draft: 'orange',
    archived: 'gray',
  }
  return colorMap[status as keyof typeof colorMap] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labelMap = {
    published: t('workplace.statusPublished'),
    draft: t('workplace.statusDraft'),
    archived: t('workplace.statusArchived'),
  }
  return labelMap[status as keyof typeof labelMap] || status
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 事件处理
const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleSearchClear = () => {
  emit('search', '')
}

const handleRefresh = () => {
  emit('search', searchKeyword.value)
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handlePageSizeChange = (pageSize: number) => {
  emit('page-size-change', pageSize)
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  if (direction) {
    emit('sort-change', dataIndex, direction === 'ascend' ? 'asc' : 'desc')
  } else {
    emit('sort-change', '', 'desc')
  }
}
</script>

<style lang="less" scoped>
.content-data-table {
  .table-toolbar {
    margin-bottom: 16px;
    padding: 16px;
    background-color: var(--color-fill-2);
    border-radius: 6px;
  }

  .table-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .content-data-table {
    .table-toolbar {
      .arco-row {
        flex-direction: column;
        gap: 12px;
      }

      .arco-col {
        width: 100%;
      }
    }

    .table-pagination {
      justify-content: center;
    }
  }

  :deep(.arco-table) {
    font-size: 12px;
  }

  :deep(.arco-table-th) {
    padding: 8px 4px;
  }

  :deep(.arco-table-td) {
    padding: 8px 4px;
  }
}

@media (max-width: 480px) {
  .content-data-table {
    .table-toolbar {
      gap: 8px;
    }
  }

  :deep(.arco-table) {
    font-size: 11px;
  }

  :deep(.arco-table-th) {
    padding: 6px 2px;
  }

  :deep(.arco-table-td) {
    padding: 6px 2px;
  }

  :deep(.arco-btn) {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>
