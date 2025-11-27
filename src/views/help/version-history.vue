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
        <a-button type="primary" @click="handleCompareVersions" :disabled="selectedVersions.length !== 2">
          <template #icon>
            <icon-compare />
          </template>
          比较版本
        </a-button>
      </a-space>
    </template>
    <a-card>
      <a-table
        :columns="columns"
        :data="versions"
        :row-selection="{
          type: 'checkbox',
          onChange: onVersionSelect,
          max: 2,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'version'">
            <a-tag type="primary">v{{ record.version }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="text" @click="handleViewVersion(record)">查看</a-button>
              <a-button type="text" @click="handleRestoreVersion(record)">恢复</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 版本查看弹窗 -->
    <a-modal v-model:visible="versionViewVisible" :title="`版本 v${currentVersion?.version}`" width="800px" footer="">
      <a-tabs v-model="versionViewTab" type="card">
        <a-tab-pane key="content" title="内容">
          <div class="markdown-preview">
            <div v-html="renderMarkdown(currentVersion?.content || '')"></div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="info" title="版本信息">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="版本号">v{{ currentVersion?.version }}</a-descriptions-item>
            <a-descriptions-item label="更新时间">{{ currentVersion?.updatedAt }}</a-descriptions-item>
            <a-descriptions-item label="更新人">{{ currentVersion?.updatedBy }}</a-descriptions-item>
            <a-descriptions-item label="更新描述">{{ currentVersion?.description || '无' }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <!-- 版本比较弹窗 -->
    <a-modal v-model:visible="versionCompareVisible" title="版本比较" width="1000px" footer="">
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="version-compare-panel">
            <h3>版本 v{{ compareVersions[0]?.version }}</h3>
            <div class="markdown-preview">
              <div v-html="renderMarkdown(compareVersions[0]?.content || '')"></div>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="version-compare-panel">
            <h3>版本 v{{ compareVersions[1]?.version }}</h3>
            <div class="markdown-preview">
              <div v-html="renderMarkdown(compareVersions[1]?.content || '')"></div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </page-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from '@arco-design/web-vue'
import type { TableColumns } from '@arco-design/web-vue'

const router = useRouter()
const route = useRoute()

// 文档ID
const documentId = ref(Number(route.params.id))

// 版本列表
const versions = ref<any[]>([])

// 选中的版本
const selectedVersions = ref<any[]>([])

// 版本查看弹窗
const versionViewVisible = ref(false)
const currentVersion = ref<any>(null)
const versionViewTab = ref('content')

// 版本比较弹窗
const versionCompareVisible = ref(false)
const compareVersions = ref<any[]>([])

// 表格列配置
const columns: TableColumns = [
  {
    title: '版本号',
    key: 'version',
    width: 100,
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 150,
  },
  {
    title: '更新人',
    key: 'updatedBy',
    width: 100,
  },
  {
    title: '更新描述',
    key: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

// 获取版本历史
const fetchVersionHistory = async () => {
  try {
    // 模拟API请求
    const mockVersions = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      documentId: documentId.value,
      version: i + 1,
      content: `# 帮助文档 v${i + 1}\n\n这是版本 ${i + 1} 的内容。\n\n## 章节 ${i + 1}\n\n这是章节 ${i + 1} 的内容。`,
      updatedBy: 'admin',
      updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
      description: i === 0 ? '初始版本' : `更新了内容 ${i + 1}`,
    }))

    versions.value = mockVersions
  } catch (error) {
    message.error('获取版本历史失败')
  }
}

// 版本选择变化
const onVersionSelect = (selectedRowKeys: any[], selectedRows: any[]) => {
  selectedVersions.value = selectedRows
}

// 查看版本
const handleViewVersion = (record: any) => {
  currentVersion.value = record
  versionViewVisible.value = true
}

// 恢复版本
const handleRestoreVersion = (record: any) => {
  message.confirm(`确定要恢复到版本 v${record.version} 吗？`, '恢复确认', {
    onOk: () => {
      try {
        // 模拟API请求
        message.success(`已恢复到版本 v${record.version}`)
        router.push(`/help/document-edit/${documentId.value}`)
      } catch (error) {
        message.error('恢复版本失败')
      }
    },
  })
}

// 比较版本
const handleCompareVersions = () => {
  compareVersions.value = selectedVersions.value
  versionCompareVisible.value = true
}

// 返回文档列表
const handleBack = () => {
  router.push(`/help/document-edit/${documentId.value}`)
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

// 页面挂载时获取数据
onMounted(() => {
  fetchVersionHistory()
})
</script>

<style scoped>
.markdown-preview {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  min-height: 400px;
  background-color: #f9fafb;
  overflow-y: auto;
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

.version-compare-panel {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.version-compare-panel h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.version-compare-panel .markdown-preview {
  flex: 1;
}
</style>
