<template>
  <div class="category-management-container">
    <a-page-header title="{{ $t('menu.helpDoc.categoryManagement') }}">
      <template #extra>
        <a-button type="primary" @click="handleAddCategory">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('helpDoc.addCategory') }}
        </a-button>
      </template>
    </a-page-header>

    <a-card>
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="category-tree-container">
            <a-tree
              v-model:expanded-keys="expandedKeys"
              :data="categories"
              :default-selected-keys="[selectedCategoryId]"
              @select="onCategorySelect"
              @drop="onDrop"
              draggable
            >
              <template #title="{ data }">
                <span class="category-title">
                  <icon-folder :size="16" />
                  <span style="margin-left: 8px">{{ data.title }}</span>
                  <span class="document-count">({{ data.documentCount || 0 }})</span>
                </span>
              </template>
            </a-tree>
          </div>
        </a-col>

        <a-col :span="16">
          <div class="category-detail-container">
            <a-form layout="vertical" v-if="selectedCategory">
              <a-form-item field="name" label="{{ $t('helpDoc.categoryName') }}" :rules="[{ required: true }]">
                <a-input v-model="formData.name" placeholder="{{ $t('helpDoc.enterCategoryName') }}" />
              </a-form-item>

              <a-form-item field="description" label="{{ $t('helpDoc.description') }}">
                <a-textarea v-model="formData.description" :rows="3" placeholder="{{ $t('helpDoc.enterDescription') }}" />
              </a-form-item>

              <a-form-item field="parentId" label="{{ $t('helpDoc.parentCategory') }}">
                <a-tree-select
                  v-model="formData.parentId"
                  :data="categories"
                  placeholder="{{ $t('helpDoc.selectParentCategory') }}"
                  style="width: 100%"
                />
              </a-form-item>

              <a-form-item field="order" label="{{ $t('helpDoc.order') }}">
                <a-input-number v-model="formData.order" :min="0" placeholder="{{ $t('helpDoc.enterOrder') }}" />
              </a-form-item>

              <a-form-item field="status" label="{{ $t('helpDoc.status') }}">
                <a-switch v-model="formData.status" />
              </a-form-item>

              <a-space>
                <a-button type="primary" @click="handleSaveCategory">
                  {{ $t('helpDoc.save') }}
                </a-button>
                <a-button @click="handleResetForm">
                  {{ $t('helpDoc.reset') }}
                </a-button>
                <a-button status="danger" @click="handleDeleteCategory" v-if="selectedCategoryId">
                  {{ $t('helpDoc.delete') }}
                </a-button>
              </a-space>
            </a-form>

            <div v-else class="no-category-selected">
              {{ $t('helpDoc.selectCategoryToEdit') }}
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- Add Category Modal -->
    <a-modal
      v-model:visible="addModalVisible"
      title="{{ $t('helpDoc.addCategory') }}"
      @ok="handleAddCategoryConfirm"
      @cancel="handleAddCategoryCancel"
    >
      <a-form layout="vertical">
        <a-form-item field="name" label="{{ $t('helpDoc.categoryName') }}" :rules="[{ required: true }]">
          <a-input v-model="addFormData.name" placeholder="{{ $t('helpDoc.enterCategoryName') }}" />
        </a-form-item>

        <a-form-item field="description" label="{{ $t('helpDoc.description') }}">
          <a-textarea v-model="addFormData.description" :rows="3" placeholder="{{ $t('helpDoc.enterDescription') }}" />
        </a-form-item>

        <a-form-item field="parentId" label="{{ $t('helpDoc.parentCategory') }}">
          <a-tree-select
            v-model="addFormData.parentId"
            :data="categories"
            placeholder="{{ $t('helpDoc.selectParentCategory') }}"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from '@arco-design/web-vue'
import { IconPlus, IconFolder } from '@arco-design/web-vue/es/icon'

// State
const expandedKeys = ref<string[]>([])
const selectedCategoryId = ref<string>('')
const categories = ref<any[]>([])
const formData = ref({
  name: '',
  description: '',
  parentId: '',
  order: 0,
  status: true,
})

const addModalVisible = ref(false)
const addFormData = ref({
  name: '',
  description: '',
  parentId: '',
})

// Computed
const selectedCategory = computed(() => {
  return findCategoryById(selectedCategoryId.value, categories.value)
})

// Methods
const findCategoryById = (id: string, categories: any[]): any => {
  for (const category of categories) {
    if (category.id === id) {
      return category
    }
    if (category.children) {
      const found = findCategoryById(id, category.children)
      if (found) {
        return found
      }
    }
  }
  return null
}

const fetchCategories = async () => {
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300))
    categories.value = [
      {
        id: '1',
        title: '技术文档',
        documentCount: 15,
        children: [
          {
            id: '11',
            title: '前端开发',
            documentCount: 8,
          },
          {
            id: '12',
            title: '后端开发',
            documentCount: 5,
          },
          {
            id: '13',
            title: '数据库',
            documentCount: 2,
          },
        ],
      },
      {
        id: '2',
        title: '用户指南',
        documentCount: 10,
        children: [
          {
            id: '21',
            title: '快速开始',
            documentCount: 3,
          },
          {
            id: '22',
            title: '高级功能',
            documentCount: 4,
          },
          {
            id: '23',
            title: '常见问题',
            documentCount: 3,
          },
        ],
      },
      {
        id: '3',
        title: 'API文档',
        documentCount: 5,
      },
    ]
  } catch (error) {
    message.error($t('helpDoc.fetchCategoriesFailed'))
  }
}

const onCategorySelect = (selectedKeys: string[]) => {
  if (selectedKeys.length > 0) {
    selectedCategoryId.value = selectedKeys[0]
    const category = selectedCategory.value
    if (category) {
      formData.value = {
        name: category.title,
        description: category.description || '',
        parentId: category.parentId || '',
        order: category.order || 0,
        status: category.status !== false,
      }
    }
  }
}

const onDrop = (info: any) => {
  // TODO: Implement drag and drop functionality
  message.success($t('helpDoc.categoryOrderUpdated'))
}

const handleAddCategory = () => {
  addFormData.value = {
    name: '',
    description: '',
    parentId: '',
  }
  addModalVisible.value = true
}

const handleAddCategoryConfirm = () => {
  // TODO: Implement add category functionality
  message.success($t('helpDoc.categoryAdded'))
  addModalVisible.value = false
  fetchCategories()
}

const handleAddCategoryCancel = () => {
  addModalVisible.value = false
}

const handleSaveCategory = () => {
  // TODO: Implement save category functionality
  message.success($t('helpDoc.categoryUpdated'))
  fetchCategories()
}

const handleResetForm = () => {
  if (selectedCategory.value) {
    formData.value = {
      name: selectedCategory.value.title,
      description: selectedCategory.value.description || '',
      parentId: selectedCategory.value.parentId || '',
      order: selectedCategory.value.order || 0,
      status: selectedCategory.value.status !== false,
    }
  }
}

const handleDeleteCategory = () => {
  // TODO: Implement delete category functionality
  message.success($t('helpDoc.categoryDeleted'))
  selectedCategoryId.value = ''
  fetchCategories()
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-management-container {
  padding: 20px;
}

.category-tree-container {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 16px;
  height: 500px;
  overflow-y: auto;
}

.category-title {
  display: flex;
  align-items: center;
}

.document-count {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

.category-detail-container {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 24px;
  min-height: 500px;
}

.no-category-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}
</style>
