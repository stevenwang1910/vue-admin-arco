<template>
  <div class="document-list-container">
    <a-page-header title="{{ t('menu.helpDoc.documentList') }}">
      <template #extra>
        <a-space>
          <a-input-search
            v-model="searchKeyword"
            placeholder="{{ t('helpDoc.searchPlaceholder') }}"
            style="width: 300px"
            @search="onSearch"
          />
          <a-button type="primary" @click="handleCreateDocument">
            <template #icon>
              <icon-plus />
            </template>
            {{ t('helpDoc.createDocument') }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card>
      <template #extra>
        <a-space>
          <a-select v-model="categoryFilter" placeholder="{{ t('helpDoc.selectCategory') }}">
            <a-option value="">{{ t('helpDoc.allCategories') }}</a-option>
            <a-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-option>
          </a-select>
          <a-select v-model="statusFilter" placeholder="{{ t('helpDoc.selectStatus') }}">
            <a-option value="">{{ t('helpDoc.allStatus') }}</a-option>
            <a-option value="draft">{{ t('helpDoc.draft') }}</a-option>
            <a-option value="published">{{ t('helpDoc.published') }}</a-option>
            <a-option value="archived">{{ t('helpDoc.archived') }}</a-option>
          </a-select>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data="documents"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <a-link @click="handleViewDocument(record)">{{ record.title }}</a-link>
          </template>
          <template v-else-if="column.key === 'category'">
            <a-tag color="blue">{{ record.categoryName }}</a-tag>
          </template>
          <template v-else-if="column.key === 'tags'">
            <a-space wrap>
              <a-tag v-for="tag in record.tags" :key="tag">{{ tag }}</a-tag>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'published' ? 'success' : record.status === 'draft' ? 'warning' : 'default'">
              {{ t(`helpDoc.${record.status}`) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button size="small" @click="handleViewDocument(record)">
                {{ t('helpDoc.view') }}
              </a-button>
              <a-button size="small" @click="handleEditDocument(record)">
                {{ t('helpDoc.edit') }}
              </a-button>
              <a-button size="small" @click="handleViewVersion(record)">
                {{ t('helpDoc.version') }}
              </a-button>
              <a-dropdown>
                <template #content>
                  <a-doption @click="handlePublishDocument(record)">
                    {{ t('helpDoc.publish') }}
                  </a-doption>
                  <a-doption @click="handleArchiveDocument(record)">
                    {{ t('helpDoc.archive') }}
                  </a-doption>
                  <a-doption @click="handleDeleteDocument(record)" status="danger">
                    {{ t('helpDoc.delete') }}
                  </a-doption>
                </template>
                <a-button size="small" status="default">
                  {{ t('helpDoc.more') }}
                  <icon-down />
                </a-button>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { message } from '@arco-design/web-vue'
import type { TableColumns } from '@arco-design/web-vue/es/table/interface'
import { IconPlus, IconDown } from '@arco-design/web-vue/es/icon'

const { t } = useI18n()

const router = useRouter()

// State
const searchKeyword = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const loading = ref(false)
const documents = ref<any[]>([])
const categories = ref<any[]>([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `${total} ${t('helpDoc.items')}`,
})

// Columns
const columns: TableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: t('helpDoc.title'),
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: t('helpDoc.category'),
    dataIndex: 'categoryName',
    key: 'category',
    width: 150,
  },
  {
    title: t('helpDoc.tags'),
    dataIndex: 'tags',
    key: 'tags',
    width: 200,
  },
  {
    title: t('helpDoc.author'),
    dataIndex: 'author',
    key: 'author',
    width: 120,
  },
  {
    title: t('helpDoc.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: t('helpDoc.updatedAt'),
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
  },
  {
    title: t('helpDoc.actions'),
    key: 'actions',
    width: 250,
  },
]

// Methods
const fetchDocuments = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    documents.value = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Document ${i + 1}`,
      categoryName: ['技术文档', '用户指南', 'API文档'][Math.floor(Math.random() * 3)],
      tags: ['Vue', 'TypeScript', 'Arco Design'].slice(0, Math.floor(Math.random() * 3) + 1),
      author: 'Admin',
      status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)],
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
    }))
    pagination.value.total = 15
  } catch (error) {
    message.error(t('helpDoc.fetchFailed'))
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })
    categories.value = [
      { id: 1, name: '技术文档' },
      { id: 2, name: '用户指南' },
      { id: 3, name: 'API文档' },
      { id: 4, name: '常见问题' },
    ]
  } catch (error) {
    message.error(t('helpDoc.fetchCategoriesFailed'))
  }
}

const onSearch = () => {
  pagination.value.current = 1
  fetchDocuments()
}

const onPageChange = (page: number) => {
  pagination.value.current = page
  fetchDocuments()
}

const onPageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.current = 1
  fetchDocuments()
}

const handleCreateDocument = () => {
  router.push('/help-doc/document-editor')
}

const handleViewDocument = (record: any) => {
  router.push(`/help-doc/document-editor/${record.id}?mode=view`)
}

const handleEditDocument = (record: any) => {
  router.push(`/help-doc/document-editor/${record.id}`)
}

const handleViewVersion = (record: any) => {
  router.push(`/help-doc/version-history/${record.id}`)
}

const handlePublishDocument = (record: any) => {
  message.success(t('helpDoc.publishSuccess'))
}

const handleArchiveDocument = (record: any) => {
  message.success(t('helpDoc.archiveSuccess'))
}

const handleDeleteDocument = (record: any) => {
  message.success(t('helpDoc.deleteSuccess'))
}

// Lifecycle
onMounted(() => {
  fetchDocuments()
  fetchCategories()
})
</script>

<style scoped>
.document-list-container {
  padding: 20px;
}
</style>
