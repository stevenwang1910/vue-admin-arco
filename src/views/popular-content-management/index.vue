<template>
  <div class="container">
    <Breadcrumb :items="['menu.dashboard', 'menu.dashboard.workplace', 'popularContent.management']" />
    <a-card class="general-card" :title="$t('popularContent.management')">
      <!-- Search Form -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="title" :label="$t('popularContent.title')">
                  <a-input v-model="formModel.title" :placeholder="$t('popularContent.title.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('popularContent.type')">
                  <a-select v-model="formModel.type" :options="typeOptions" :placeholder="$t('popularContent.selectType')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('popularContent.status')">
                  <a-select v-model="formModel.status" :options="statusOptions" :placeholder="$t('popularContent.selectStatus')" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <!-- Action Buttons -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('popularContent.create') }}
            </a-button>
            <a-button @click="handleBatchDelete" :disabled="selectedKeys.length === 0">
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('popularContent.batchDelete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>

      <!-- Data Table -->
      <a-table
        row-key="key"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="{ type: 'checkbox', selectedKeys: selectedKeys, onChange: handleSelect }"
        @page-change="onPageChange"
      >
        <template #type="{ record }">
          <a-tag :color="typeTagColor[record.type]">
            {{ $t(`popularContent.type.${record.type}`) }}
          </a-tag>
        </template>
        <template #increases="{ record }">
          <div class="increases-cell">
            <span :class="{ positive: record.increases > 0, negative: record.increases < 0 }">{{ record.increases }}%</span>
            <icon-caret-up v-if="record.increases > 0" style="color: #f53f3f; font-size: 8px" />
            <icon-caret-down v-if="record.increases < 0" style="color: #00b42a; font-size: 8px" />
          </div>
        </template>
        <template #status="{ record }">
          <a-switch v-model="record.status" @change="handleStatusChange(record)" />
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">
              {{ $t('popularContent.edit') }}
            </a-button>
            <a-button type="text" size="small" status="danger" @click="handleDelete(record)">
              {{ $t('popularContent.delete') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { queryPopularList } from '@/api/dashboard'
import useLoading from '@/hooks/loading'
import { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loading, setLoading } = useLoading(true)
const renderData = ref<any[]>([])
const selectedKeys = ref<any[]>([])
const formModel = ref({
  title: '',
  type: '',
  status: '',
})
const size = ref<'mini' | 'small' | 'medium' | 'large'>('medium')

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
}
const pagination = reactive({
  ...basePagination,
  total: 0,
})

const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('searchTable.size.small'),
    value: 'small',
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('searchTable.size.large'),
    value: 'large',
  },
])

const typeTagColor = {
  text: 'arcoblue',
  image: 'green',
  video: 'purple',
}

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('popularContent.rank'),
    dataIndex: 'key',
    width: 80,
    align: 'center',
  },
  {
    title: t('popularContent.title'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('popularContent.type'),
    dataIndex: 'type',
    slotName: 'type',
    width: 120,
    align: 'center',
  },
  {
    title: t('popularContent.clickNumber'),
    dataIndex: 'clickNumber',
    width: 120,
    align: 'center',
  },
  {
    title: t('popularContent.increases'),
    dataIndex: 'increases',
    slotName: 'increases',
    width: 120,
    align: 'center',
    sortable: true,
  },
  {
    title: t('popularContent.status'),
    dataIndex: 'status',
    slotName: 'status',
    width: 120,
    align: 'center',
  },
  {
    title: t('popularContent.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    width: 160,
    align: 'center',
  },
])

const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('popularContent.type.text'),
    value: 'text',
  },
  {
    label: t('popularContent.type.image'),
    value: 'image',
  },
  {
    label: t('popularContent.type.video'),
    value: 'video',
  },
])

const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('popularContent.status.enabled'),
    value: true,
  },
  {
    label: t('popularContent.status.disabled'),
    value: false,
  },
])

const fetchData = async () => {
  try {
    setLoading(true)
    // Fetch all types of data for management
    const textData = await queryPopularList({ type: 'text' })
    const imageData = await queryPopularList({ type: 'image' })
    const videoData = await queryPopularList({ type: 'video' })

    // Combine data and add type information
    const allData = [
      ...textData.data.map((item) => ({ ...item, type: 'text', status: true })),
      ...imageData.data.map((item) => ({ ...item, type: 'image', status: true })),
      ...videoData.data.map((item) => ({ ...item, type: 'video', status: true })),
    ]

    renderData.value = allData
    pagination.total = allData.length
  } catch (err) {
    console.error('Failed to fetch popular content data:', err)
  } finally {
    setLoading(false)
  }
}

const search = () => {
  // Filter data based on formModel
  let filteredData = [...renderData.value]

  if (formModel.value.title) {
    filteredData = filteredData.filter((item) => item.title.includes(formModel.value.title))
  }

  if (formModel.value.type) {
    filteredData = filteredData.filter((item) => item.type === formModel.value.type)
  }

  if (formModel.value.status !== '') {
    filteredData = filteredData.filter((item) => item.status === formModel.value.status)
  }

  renderData.value = filteredData
  pagination.total = filteredData.length
  pagination.current = 1
}

const reset = () => {
  formModel.value = {
    title: '',
    type: '',
    status: '',
  }
  fetchData()
}

const onPageChange = (page: number) => {
  pagination.current = page
}

const handleSelect = (keys: any[]) => {
  selectedKeys.value = keys
}

const handleSelectDensity = (value: string) => {
  size.value = value as 'mini' | 'small' | 'medium' | 'large'
}

const handleStatusChange = (record: any) => {
  // Update status logic
  console.log('Status changed:', record)
}

const handleEdit = (record: any) => {
  // Edit logic
  console.log('Edit:', record)
}

const handleDelete = (record: any) => {
  // Delete logic
  console.log('Delete:', record)
}

const handleBatchDelete = () => {
  // Batch delete logic
  console.log('Batch delete:', selectedKeys.value)
}

// Initial fetch
fetchData()
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.general-card {
  min-height: 600px;
}

:deep(.arco-table-tr) {
  height: 44px;
  .arco-typography {
    margin-bottom: 0;
  }
}

.increases-cell {
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin-right: 4px;

    &.positive {
      color: #f53f3f;
    }

    &.negative {
      color: #00b42a;
    }
  }
}

.action-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-fill-2);
  }
}
</style>
