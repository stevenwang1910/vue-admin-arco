<template>
  <page-layout>
    <template #header>
      <a-space size="large">
        <a-button @click="handleBack">
          <template #icon>
            <icon-arrow-left />
          </template>
          返回
        </a-button>
        <a-button type="primary" @click="handleSaveDraft">保存草稿</a-button>
        <a-button type="success" @click="handlePublish">发布</a-button>
      </a-space>
    </template>
    <a-card>
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item label="文档标题">
              <a-input v-model="documentForm.title" placeholder="请输入文档标题" size="large" />
            </a-form-item>
            <a-form-item label="文档内容">
              <a-tabs v-model="activeTab" type="card">
                <a-tab-pane key="edit" title="编辑">
                  <a-textarea
                    v-model="documentForm.content"
                    placeholder="请输入文档内容（支持Markdown格式）"
                    :rows="20"
                    style="font-family: monospace"
                  />
                </a-tab-pane>
                <a-tab-pane key="preview" title="预览">
                  <div class="markdown-preview">
                    <div v-html="renderMarkdown(documentForm.content)"></div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-form-item>
            <a-form-item label="标签">
              <a-select v-model="documentForm.tags" placeholder="请选择标签" mode="multiple" style="width: 100%">
                <a-option v-for="tag in availableTags" :key="tag" :value="tag">
                  {{ tag }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分类">
              <a-select v-model="documentForm.categoryId" placeholder="请选择分类" style="width: 100%">
                <a-option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item label="文档状态">
              <a-radio-group v-model="documentForm.status">
                <a-radio value="draft">草稿</a-radio>
                <a-radio value="published">发布</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="作者">
              <a-input v-model="documentForm.author" placeholder="请输入作者" disabled />
            </a-form-item>
            <a-form-item label="创建时间">
              <a-input v-model="documentForm.createdAt" placeholder="创建时间" disabled />
            </a-form-item>
            <a-form-item label="更新时间">
              <a-input v-model="documentForm.updatedAt" placeholder="更新时间" disabled />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from '@arco-design/web-vue'

const router = useRouter()
const route = useRoute()

// 活跃标签页
const activeTab = ref('edit')

// 文档表单
const documentForm = reactive({
  id: undefined,
  title: '',
  content: '',
  categoryId: undefined,
  tags: [] as string[],
  status: 'draft',
  author: 'admin',
  createdAt: '',
  updatedAt: '',
})

// 分类列表
const categories = ref<any[]>([])

// 可用标签
const availableTags = ref<string[]>(['指南', '使用', 'API', '接口', '问题', '解答', '技术', '支持', '配置', '部署'])

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

// 获取文档详情
const fetchDocumentDetail = async (id: number) => {
  try {
    // 模拟API请求
    const mockDocument = {
      id: id,
      title: `帮助文档 ${id}`,
      content: '# 帮助文档\n\n这是一个帮助文档的示例内容。\n\n## 章节1\n\n这是章节1的内容。\n\n## 章节2\n\n这是章节2的内容。',
      categoryId: 1,
      tags: ['指南', '使用'],
      status: 'draft',
      author: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    Object.assign(documentForm, mockDocument)
  } catch (error) {
    message.error('获取文档详情失败')
  }
}

// 渲染Markdown内容
const renderMarkdown = (content: string) => {
  // 简单的Markdown渲染实现
  let html = content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')

  return html
}

// 返回文档列表
const handleBack = () => {
  router.push('/help/document-list')
}

// 保存草稿
const handleSaveDraft = () => {
  documentForm.status = 'draft'
  saveDocument()
}

// 发布文档
const handlePublish = () => {
  documentForm.status = 'published'
  saveDocument()
}

// 保存文档
const saveDocument = async () => {
  try {
    if (!documentForm.title.trim()) {
      message.warning('请输入文档标题')
      return
    }

    if (!documentForm.content.trim()) {
      message.warning('请输入文档内容')
      return
    }

    // 模拟API请求
    if (documentForm.id) {
      message.success('文档更新成功')
    } else {
      message.success('文档创建成功')
    }

    router.push('/help/document-list')
  } catch (error) {
    message.error('保存文档失败')
  }
}

// 页面挂载时获取数据
onMounted(() => {
  fetchCategories()

  const id = route.params.id
  if (id) {
    fetchDocumentDetail(Number(id))
  } else {
    documentForm.createdAt = new Date().toISOString()
    documentForm.updatedAt = new Date().toISOString()
  }
})
</script>

<style scoped>
.markdown-preview {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  min-height: 400px;
  background-color: #f9fafb;
}

.markdown-preview h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.markdown-preview h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 24px;
}

.markdown-preview h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-top: 20px;
}

.markdown-preview strong {
  font-weight: 600;
}

.markdown-preview em {
  font-style: italic;
}

.markdown-preview code {
  background-color: #e5e7eb;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
