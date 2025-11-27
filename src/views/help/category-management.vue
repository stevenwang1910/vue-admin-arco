<template>
  <page-layout>
    <template #header>
      <a-space size="large">
        <a-button type="primary" @click="handleCreateCategory">
          <template #icon>
            <icon-plus />
          </template>
          新建分类
        </a-button>
      </a-space>
    </template>
    <a-table :columns="columns" :data="categories" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-link @click="handleEditCategory(record)">{{ record.name }}</a-link>
        </template>
        <template v-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="text" @click="handleEditCategory(record)">编辑</a-button>
            <a-button type="text" status="danger" @click="handleDeleteCategory(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </page-layout>

  <!-- 分类编辑弹窗 -->
  <a-modal v-model:visible="categoryModalVisible" :title="categoryModalTitle" @ok="handleSaveCategory" @cancel="handleCancelCategory">
    <a-form layout="vertical">
      <a-form-item label="分类名称">
        <a-input v-model="categoryForm.name" placeholder="请输入分类名称" />
      </a-form-item>
      <a-form-item label="分类描述">
        <a-textarea v-model="categoryForm.description" placeholder="请输入分类描述" :rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from '@arco-design/web-vue'
import type { TableColumns } from '@arco-design/web-vue'

// 分类列表
const categories = ref<any[]>([])

// 分类编辑弹窗
const categoryModalVisible = ref(false)
const categoryModalTitle = ref('新建分类')

// 分类表单
const categoryForm = reactive({
  id: undefined,
  name: '',
  description: '',
})

// 表格列配置
const columns: TableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '分类名称',
    key: 'name',
    width: 200,
  },
  {
    title: '描述',
    key: 'description',
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 150,
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

// 获取分类列表
const fetchCategories = async () => {
  try {
    // 模拟API请求
    const mockCategories = [
      {
        id: 1,
        name: '使用指南',
        description: '系统使用指南',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 2,
        name: 'API文档',
        description: 'API接口文档',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 3,
        name: '常见问题',
        description: '常见问题解答',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 4,
        name: '技术支持',
        description: '技术支持文档',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    categories.value = mockCategories
  } catch (error) {
    message.error('获取分类列表失败')
  }
}

// 新建分类
const handleCreateCategory = () => {
  categoryModalTitle.value = '新建分类'
  Object.assign(categoryForm, {
    id: undefined,
    name: '',
    description: '',
  })
  categoryModalVisible.value = true
}

// 编辑分类
const handleEditCategory = (record: any) => {
  categoryModalTitle.value = '编辑分类'
  Object.assign(categoryForm, record)
  categoryModalVisible.value = true
}

// 保存分类
const handleSaveCategory = async () => {
  try {
    if (!categoryForm.name.trim()) {
      message.warning('请输入分类名称')
      return
    }

    // 模拟API请求
    if (categoryForm.id) {
      // 更新分类
      const index = categories.value.findIndex((item) => item.id === categoryForm.id)
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          ...categoryForm,
          updatedAt: new Date().toISOString(),
        }
      }
      message.success('分类更新成功')
    } else {
      // 新建分类
      const newCategory = {
        id: categories.value.length + 1,
        ...categoryForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      categories.value.push(newCategory)
      message.success('分类创建成功')
    }

    categoryModalVisible.value = false
  } catch (error) {
    message.error('保存分类失败')
  }
}

// 取消分类编辑
const handleCancelCategory = () => {
  categoryModalVisible.value = false
}

// 删除分类
const handleDeleteCategory = (record: any) => {
  message.confirm('确定要删除该分类吗？删除后该分类下的所有文档将被移动到未分类', '删除确认', {
    onOk: () => {
      try {
        // 模拟API请求
        const index = categories.value.findIndex((item) => item.id === record.id)
        if (index !== -1) {
          categories.value.splice(index, 1)
        }
        message.success('分类删除成功')
      } catch (error) {
        message.error('删除分类失败')
      }
    },
  })
}

// 页面挂载时获取数据
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
