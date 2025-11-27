<template>
  <page-layout>
    <template #header>
      <a-space size="large">
        <a-input-search v-model="searchKeyword" placeholder="搜索文档标题或内容" style="width: 300px" @search="onSearch" />
        <a-select v-model="selectedCategory" placeholder="选择分类" style="width: 200px">
          <a-option value="">全部分类</a-option>
          <a-option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </a-option>
        </a-select>
        <a-button type="primary" @click="handleCreateDocument">
          <template #icon>
            <icon-plus />
          </template>
          新建文档
        </a-button>
      </a-space>
    </template>
    <a-table :columns="columns" :data="documents" :pagination="pagination" @page-change="onPageChange" @sort-change="onSortChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a-link @click="handleViewDocument(record)">{{ record.title }}</a-link>
        </template>
        <template v-if="column.key === 'category'">
          {{ record.category?.name || '未分类' }}
        </template>
        <template v-if="column.key === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in record.tags" :key="tag" size="small">
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :type="record.status === 'published' ? 'success' : 'warning'">
            {{ record.status === 'published' ? '已发布' : '草稿' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="text" @click="handleEditDocument(record)">编辑</a-button>
            <a-button type="text" @click="handleViewVersion(record)">版本历史</a-button>
            <a-button type="text" @click="handleDeleteDocument(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </page-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from '@arco-design/web-vue'
import type { TableColumns, TableSortParams } from '@arco-design/web-vue'

const router = useRouter()

// 搜索条件
const searchKeyword = ref('')
const selectedCategory = ref('')

// 分页信息
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 文档列表
const documents = ref<any[]>([])

// 分类列表
const categories = ref<any[]>([])

// 表格列配置
const columns: TableColumns = [
  {
    title: '标题',
    key: 'title',
    sortable: true,
    width: 200,
  },
  {
    title: '分类',
    key: 'category',
    width: 150,
  },
  {
    title: '标签',
    key: 'tags',
    width: 200,
  },
  {
    title: '作者',
    key: 'author',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    sortable: true,
    width: 150,
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    sortable: true,
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 获取文档列表
const fetchDocuments = async () => {
  try {
    // 模拟API请求
    const mockDocuments = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `帮助文档 ${i + 1}`,
      category: { id: 1, name: '使用指南' },
      tags: ['指南', '使用'],
      author: 'admin',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
      status: i % 2 === 0 ? 'published' : 'draft',
    }))

    documents.value = mockDocuments
    pagination.value.total = mockDocuments.length
  } catch (error) {
    message.error('获取文档列表失败')
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    // 模拟API请求
    const mockCategories = [
      { id: 1, name: '使用指南', description: '系统使用指南' },
      { id: 2, name: 'API文档', description: 'API接口文档' },
      { id: 3, name: '常见问题', description: '常见问题解答' },
      { id: 4, name: '技术支持', description: '技术支持文档' },
    ]

    categories.value = mockCategories
  } catch (error) {
    message.error('获取分类列表失败')
  }
}

// 搜索文档
const onSearch = () => {
  pagination.value.current = 1
  fetchDocuments()
}

// 分页变化
const onPageChange = (page: number, pageSize: number) => {
  pagination.value.current = page
  pagination.value.pageSize = pageSize
  fetchDocuments()
}

// 排序变化
const onSortChange = (params: TableSortParams) => {
  console.log('排序变化:', params)
  fetchDocuments()
}

// 新建文档
const handleCreateDocument = () => {
  router.push('/help/document-edit')
}

// 编辑文档
const handleEditDocument = (record: any) => {
  router.push(`/help/document-edit/${record.id}`)
}

// 查看文档
const handleViewDocument = (record: any) => {
  router.push(`/help/document-edit/${record.id}`)
}

// 查看版本历史
const handleViewVersion = (record: any) => {
  router.push(`/help/version-history/${record.id}`)
}

// 删除文档
const handleDeleteDocument = (record: any) => {
  message.confirm('确定要删除该文档吗？', '删除确认', {
    onOk: () => {
      message.success('文档删除成功')
      fetchDocuments()
    },
  })
}

// 页面挂载时获取数据
onMounted(() => {
  fetchDocuments()
  fetchCategories()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
