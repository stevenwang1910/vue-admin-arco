<template>
  <div class="document-editor-container">
    <a-page-header
      :title="isEditMode ? $t('helpDoc.editDocument') : $t('helpDoc.createDocument')"
    >
      <template #extra>
        <a-space>
          <a-button @click="handleSaveDraft">
            {{ $t('helpDoc.saveDraft') }}
          </a-button>
          <a-button type="primary" @click="handlePublish">
            {{ $t('helpDoc.publish') }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card>
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item field="title" label="{{ $t('helpDoc.title') }}" :rules="[{ required: true }]">
              <a-input v-model="formData.title" placeholder="{{ $t('helpDoc.enterTitle') }}" />
            </a-form-item>

            <a-form-item field="content" label="{{ $t('helpDoc.content') }}" :rules="[{ required: true }]">
              <a-tabs v-model:active-name="activeTab" type="card">
                <a-tab-pane name="editor" tab="{{ $t('helpDoc.editor') }}">
                  <a-textarea
                    v-model="formData.content"
                    :rows="20"
                    placeholder="{{ $t('helpDoc.enterContent') }}"
                    style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace"
                  />
                </a-tab-pane>
                <a-tab-pane name="preview" tab="{{ $t('helpDoc.preview') }}">
                  <div class="preview-content" v-html="previewContent"></div>
                </a-tab-pane>
              </a-tabs>
            </a-form-item>

            <a-form-item field="description" label="{{ $t('helpDoc.description') }}">
              <a-textarea v-model="formData.description" :rows="3" placeholder="{{ $t('helpDoc.enterDescription') }}" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item field="categoryId" label="{{ $t('helpDoc.category') }}" :rules="[{ required: true }]">
              <a-tree-select
                v-model="formData.categoryId"
                :data="categories"
                placeholder="{{ $t('helpDoc.selectCategory') }}"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item field="tags" label="{{ $t('helpDoc.tags') }}">
              <a-select
                v-model="formData.tags"
                mode="multiple"
                placeholder="{{ $t('helpDoc.selectTags') }}"
                style="width: 100%"
              >
                <a-option v-for="tag in availableTags" :key="tag" :value="tag">
                  {{ tag }}
                </a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="format" label="{{ $t('helpDoc.format') }}">
              <a-select v-model="formData.format" placeholder="{{ $t('helpDoc.selectFormat') }}">
                <a-option value="markdown">Markdown</a-option>
                <a-option value="html">HTML</a-option>
                <a-option value="plaintext">Plain Text</a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="visibility" label="{{ $t('helpDoc.visibility') }}">
              <a-radio-group v-model="formData.visibility">
                <a-radio value="public">{{ $t('helpDoc.public') }}</a-radio>
                <a-radio value="private">{{ $t('helpDoc.private') }}</a-radio>
                <a-radio value="protected">{{ $t('helpDoc.protected') }}</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item field="allowComments" label="{{ $t('helpDoc.allowComments') }}">
              <a-switch v-model="formData.allowComments" />
            </a-form-item>

            <a-divider />

            <div class="document-meta">
              <div v-if="isEditMode">
                <p><strong>{{ $t('helpDoc.createdAt') }}:</strong> {{ documentMeta.createdAt }}</p>
                <p><strong>{{ $t('helpDoc.updatedAt') }}:</strong> {{ documentMeta.updatedAt }}</p>
                <p><strong>{{ $t('helpDoc.version') }}:</strong> {{ documentMeta.version }}</p>
              </div>
              <div>
                <p><strong>{{ $t('helpDoc.wordCount') }}:</strong> {{ wordCount }}</p>
                <p><strong>{{ $t('helpDoc.charCount') }}:</strong> {{ charCount }}</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from '@arco-design/web-vue'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()

// State
const isEditMode = ref(!!route.params.id)
const activeTab = ref('editor')
const formData = ref({
  title: '',
  content: '',
  description: '',
  categoryId: '',
  tags: [] as string[],
  format: 'markdown',
  visibility: 'public',
  allowComments: true,
})

const categories = ref<any[]>([])
const availableTags = ref<string[]>(['Vue', 'TypeScript', 'Arco Design', 'JavaScript', 'CSS', 'HTML'])
const documentMeta = ref({
  createdAt: '',
  updatedAt: '',
  version: '1.0.0',
})

// Computed
const previewContent = computed(() => {
  if (formData.value.format === 'markdown') {
    return marked(formData.value.content)
  }
  return formData.value.content
})

const wordCount = computed(() => {
  return formData.value.content.trim().split(/\s+/).length
})

const charCount = computed(() => {
  return formData.value.content.length
})

// Methods
const fetchCategories = async () => {
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300))
    categories.value = [
      {
        id: 1,
        title: '技术文档',
        children: [
          { id: 11, title: '前端开发' },
          { id: 12, title: '后端开发' },
          { id: 13, title: '数据库' },
        ],
      },
      {
        id: 2,
        title: '用户指南',
        children: [
          { id: 21, title: '快速开始' },
          { id: 22, title: '高级功能' },
          { id: 23, title: '常见问题' },
        ],
      },
      {
        id: 3,
        title: 'API文档',
      },
    ]
  } catch (error) {
    message.error($t('helpDoc.fetchCategoriesFailed'))
  }
}

const fetchDocument = async (id: string) => {
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    formData.value = {
      title: '示例文档',
      content: '# 示例文档\n\n这是一个使用Markdown格式编写的示例文档。\n\n## 章节1\n\n这是章节1的内容。\n\n### 子章节1.1\n\n这是子章节1.1的内容。\n\n## 章节2\n\n这是章节2的内容。',
      description: '这是一个示例文档的描述',
      categoryId: '11',
      tags: ['Vue', 'TypeScript'],
      format: 'markdown',
      visibility: 'public',
      allowComments: true,
    }
    documentMeta.value = {
      createdAt: '2023-01-01 10:00:00',
      updatedAt: '2023-01-02 15:30:00',
      version: '1.1.0',
    }
  } catch (error) {
    message.error($t('helpDoc.fetchDocumentFailed'))
  }
}

const handleSaveDraft = () => {
  // TODO: Implement save draft functionality
  message.success($t('helpDoc.saveDraftSuccess'))
}

const handlePublish = () => {
  // TODO: Implement publish functionality
  message.success($t('helpDoc.publishSuccess'))
  router.push('/help-doc/document-list')
}

// Lifecycle
onMounted(() => {
  fetchCategories()
  if (isEditMode.value) {
    fetchDocument(route.params.id as string)
  }
})

// Watchers
watch(
  () => formData.value.content,
  () => {
    // Auto-save draft after 2 seconds of inactivity
  },
  { deep: true }
)
</script>

<style scoped>
.document-editor-container {
  padding: 20px;
}

.preview-content {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  min-height: 400px;
}

.document-meta {
  font-size: 14px;
  color: #666;
}

.document-meta p {
  margin-bottom: 8px;
}
</style>
