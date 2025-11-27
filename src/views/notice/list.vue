<template>
  <div class="container">
    <Breadcrumb :items="['menu.notice', 'menu.notice.list']" />
    <a-card class="general-card" :title="$t('menu.notice.list')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="title" :label="$t('notice.form.title')">
                  <a-input v-model="formModel.title" :placeholder="$t('notice.form.title.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('notice.form.status')">
                  <a-select v-model="formModel.status" :options="statusOptions" :placeholder="$t('notice.form.selectDefault')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createTime" :label="$t('notice.form.createTime')">
                  <a-range-picker v-model="formModel.createTime" style="width: 100%" />
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
              {{ $t('notice.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('notice.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleCreate">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('notice.operation.create') }}
            </a-button>
            <a-button v-if="selectedRowKeys.length > 0" @click="handleBatchDelete" status="danger">
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('notice.operation.batchDelete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-tooltip :content="$t('notice.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns as TableColumnData[]"
        :data="tableData"
        :bordered="false"
        :row-selection="{ selectedRowKeys, onChange: handleRowSelectChange }"
        @page-change="onPageChange"
      >
        <template #status="{ record }">
          <a-tag v-if="record.status === 'published'" color="success">{{ $t('notice.status.published') }}</a-tag>
          <a-tag v-else color="default">{{ $t('notice.status.draft') }}</a-tag>
        </template>
        <template #priority="{ record }">
          <a-tag v-if="record.priority === 'high'" color="danger">{{ $t('notice.priority.high') }}</a-tag>
          <a-tag v-else-if="record.priority === 'medium'" color="warning">{{ $t('notice.priority.medium') }}</a-tag>
          <a-tag v-else color="default">{{ $t('notice.priority.low') }}</a-tag>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleView(record)">
              {{ $t('notice.operations.view') }}
            </a-button>
            <a-button type="text" size="small" @click="handleEdit(record)">
              {{ $t('notice.operations.edit') }}
            </a-button>
            <a-button v-if="record.status === 'draft'" type="text" size="small" @click="handlePublish(record)" status="success">
              {{ $t('notice.operations.publish') }}
            </a-button>
            <a-button v-else type="text" size="small" @click="handleUnpublish(record)" status="warning">
              {{ $t('notice.operations.unpublish') }}
            </a-button>
            <a-button type="text" size="small" @click="handleDelete(record)" status="danger">
              {{ $t('notice.operations.delete') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useLoading from '@/hooks/loading'
import { Message } from '@arco-design/web-vue'
import { getNoticeList, deleteNotice, batchDeleteNotice, publishNotice, unpublishNotice, Notice, NoticeListParams } from '@/api/notice'
import { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import { IconPlus, IconSearch, IconRefresh, IconDelete, IconEye, IconEdit } from '@arco-design/web-vue/es/icon'

const { loading, setLoading } = useLoading(true)
const { t } = useI18n()
const router = useRouter()

// 表格数据
const tableData = ref<Notice[]>([])

// 分页信息
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
}
const pagination = reactive({
  ...basePagination,
})

// 选中的行
const selectedRowKeys = ref<string[]>([])

// 搜索表单
const formModel = reactive({
  title: '',
  status: '',
  createTime: [] as string[],
})

// 状态选项
const statusOptions = computed<SelectOptionData[]>(() => [
  { label: t('notice.status.draft'), value: 'draft' },
  { label: t('notice.status.published'), value: 'published' },
])

// 表格列
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('notice.columns.title'),
    dataIndex: 'title',
    ellipsis: true,
    width: 200,
  },
  {
    title: t('notice.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
    width: 100,
  },
  {
    title: t('notice.columns.priority'),
    dataIndex: 'priority',
    slotName: 'priority',
    width: 100,
  },
  {
    title: t('notice.columns.author'),
    dataIndex: 'author',
    width: 120,
  },
  {
    title: t('notice.columns.createTime'),
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: t('notice.columns.updateTime'),
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: t('notice.columns.publishTime'),
    dataIndex: 'publishTime',
    width: 180,
  },
  {
    title: t('notice.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    width: 250,
    fixed: 'right',
  },
])

// 获取公告列表
const fetchNoticeList = async (params: NoticeListParams) => {
  try {
    setLoading(true)
    const response = await getNoticeList(params)
    tableData.value = response.list
    pagination.total = response.total
    pagination.page = response.page
    pagination.pageSize = response.pageSize
  } catch (error) {
    Message.error(t('notice.message.fetchFailed'))
  } finally {
    setLoading(false)
  }
}

// 搜索
const search = () => {
  const params: NoticeListParams = {
    page: pagination.current,
    pageSize: pagination.pageSize,
    title: formModel.title,
    status: formModel.status,
  }

  if (formModel.createTime && formModel.createTime.length === 2) {
    const [startTime, endTime] = formModel.createTime
    params.startTime = startTime
    params.endTime = endTime
  }

  fetchNoticeList(params)
}

// 重置
const reset = () => {
  formModel.title = ''
  formModel.status = ''
  formModel.createTime = []
  pagination.current = 1
  search()
}

// 分页变化
const onPageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  search()
}

// 行选择变化
const handleRowSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

// 创建公告
const handleCreate = () => {
  router.push('/notice/edit')
}

// 查看公告
const handleView = (record: Notice) => {
  router.push(`/notice/edit?id=${record.id}&view=true`)
}

// 编辑公告
const handleEdit = (record: Notice) => {
  router.push(`/notice/edit?id=${record.id}`)
}

// 发布公告
const handlePublish = async (record: Notice) => {
  try {
    await publishNotice(record.id)
    Message.success(t('notice.message.publishSuccess'))
    search()
  } catch (error) {
    Message.error(t('notice.message.publishFailed'))
  }
}

// 撤销发布公告
const handleUnpublish = async (record: Notice) => {
  try {
    await unpublishNotice(record.id)
    Message.success(t('notice.message.unpublishSuccess'))
    search()
  } catch (error) {
    Message.error(t('notice.message.unpublishFailed'))
  }
}

// 删除公告
const handleDelete = async (record: Notice) => {
  try {
    await deleteNotice(record.id)
    Message.success(t('notice.message.deleteSuccess'))
    search()
  } catch (error) {
    Message.error(t('notice.message.deleteFailed'))
  }
}

// 批量删除公告
const handleBatchDelete = async () => {
  try {
    await batchDeleteNotice(selectedRowKeys.value)
    Message.success(t('notice.message.batchDeleteSuccess'))
    selectedRowKeys.value = []
    search()
  } catch (error) {
    Message.error(t('notice.message.batchDeleteFailed'))
  }
}

// 初始化加载数据
search()
</script>

<style scoped>
.container {
  padding: 16px;
}

.general-card {
  margin-bottom: 16px;
}

.action-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-icon:hover {
  background-color: var(--color-fill-2);
}
</style>
