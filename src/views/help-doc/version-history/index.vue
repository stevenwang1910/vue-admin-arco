<template>
  <div class="version-history-container">
    <a-page-header title="{{ $t('menu.helpDoc.versionHistory') }}">
      <template #extra>
        <a-button @click="handleCompareVersions" :disabled="selectedVersions.length !== 2">
          {{ $t('helpDoc.compareVersions') }}
        </a-button>
      </template>
    </a-page-header>

    <a-card>
      <a-table
        :columns="columns"
        :data="versions"
        :loading="loading"
        row-key="id"
        :row-selection="{ selectedRowKeys: selectedVersions, onChange: onVersionSelect }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'version'">
            <a-tag color="blue">{{ record.version }}</a-tag>
          </template>
          <template v-else-if="column.key === 'author'">
            <a-avatar :size="24" :src="record.authorAvatar">{{ record.authorName.charAt(0) }}</a-avatar>
            <span style="margin-left: 8px">{{ record.authorName }}</span>
          </template>
          <template v-else-if="column.key === 'changeType'">
            <a-tag
              :color="
                record.changeType === 'create' ? 'success' : record.changeType === 'update' ? 'warning' : 'danger'
              "
            >
              {{ $t(`helpDoc.${record.changeType}`) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button size="small" @click="handleViewVersion(record)">
                {{ $t('helpDoc.view') }}
              </a-button>
              <a-button size="small" @click="handleRestoreVersion(record)">
                {{ $t('helpDoc.restore') }}
              </a-button>
              <a-button size="small" @click="handleDownloadVersion(record)">
                {{ $t('helpDoc.download') }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Version Compare Modal -->
    <a-modal
      v-model:visible="compareModalVisible"
      title="{{ $t('helpDoc.versionCompare') }}"
      :width="1200"
      :footer="null"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="version-panel">
            <h4>{{ $t('helpDoc.version') }}: {{ comparedVersions[0]?.version }}</h4>
            <div class="version-content" v-html="comparedContent[0]"></div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="version-panel">
            <h4>{{ $t('helpDoc.version') }}: {{ comparedVersions[1]?.version }}</h4>
            <div class="version-content" v-html="comparedContent[1]"></div>
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <!-- Version View Modal -->
    <a-modal
      v-model:visible="viewModalVisible"
      title="{{ $t('helpDoc.versionView') }}"
      :width="800"
      :footer="null"
    >
      <div class="version-info">
        <p><strong>{{ $t('helpDoc.version') }}:</strong> {{ currentVersion?.version }}</p>
        <p><strong>{{ $t('helpDoc.author') }}:</strong> {{ currentVersion?.authorName }}</p>
        <p><strong>{{ $t('helpDoc.createdAt') }}:</strong> {{ currentVersion?.createdAt }}</p>
        <p><strong>{{ $t('helpDoc.changeType') }}:</strong> {{ $t(`helpDoc.${currentVersion?.changeType}`) }}</p>
        <p><strong>{{ $t('helpDoc.changeLog') }}:</strong> {{ currentVersion?.changeLog }}</p>
      </div>
      <a-divider />
      <div class="version-content" v-html="currentVersionContent"></div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from '@arco-design/web-vue'
import type { TableColumns } from '@arco-design/web-vue/es/table/interface'
import { marked } from 'marked'

const route = useRoute()

// State
const loading = ref(false)
const versions = ref<any[]>([])
const selectedVersions = ref<string[]>([])
const compareModalVisible = ref(false)
const viewModalVisible = ref(false)
const comparedVersions = ref<any[]>([])
const comparedContent = ref<string[]>(['', ''])
const currentVersion = ref<any>(null)
const currentVersionContent = ref('')

// Columns
const columns: TableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: $t('helpDoc.version'),
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: $t('helpDoc.author'),
    dataIndex: 'authorName',
    key: 'author',
    width: 150,
  },
  {
    title: $t('helpDoc.changeType'),
    dataIndex: 'changeType',
    key: 'changeType',
    width: 120,
  },
  {
    title: $t('helpDoc.changeLog'),
    dataIndex: 'changeLog',
    key: 'changeLog',
    ellipsis: true,
  },
  {
    title: $t('helpDoc.createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: $t('helpDoc.actions'),
    key: 'actions',
    width: 200,
  },
]

// Methods
const fetchVersions = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    versions.value = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      version: `1.${i}.0`,
      authorName: 'Admin',
      authorAvatar: '',
      changeType: ['create', 'update', 'update', 'update'][Math.floor(Math.random() * 4)],
      changeLog: `This is a change log for version 1.${i}.0`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString(),
      content: `# Document Content v1.${i}.0\n\nThis is the content for version 1.${i}.0 of the document.\n\n## Changes\n\n- Some changes were made in this version\n- More changes...`,
    }))
  } catch (error) {
    message.error($t('helpDoc.fetchVersionsFailed'))
  } finally {
    loading.value = false
  }
}

const onVersionSelect = (selectedRowKeys: string[]) => {
  selectedVersions.value = selectedRowKeys
}

const handleCompareVersions = () => {
  if (selectedVersions.value.length !== 2) {
    message.warning($t('helpDoc.selectTwoVersions'))
    return
  }

  comparedVersions.value = versions.value.filter((v) => selectedVersions.value.includes(v.id.toString()))
  comparedContent.value = comparedVersions.value.map((v) => marked(v.content))
  compareModalVisible.value = true
}

const handleViewVersion = (record: any) => {
  currentVersion.value = record
  currentVersionContent.value = marked(record.content)
  viewModalVisible.value = true
}

const handleRestoreVersion = (record: any) => {
  // TODO: Implement restore functionality
  message.success($t('helpDoc.restoreSuccess'))
}

const handleDownloadVersion = (record: any) => {
  // TODO: Implement download functionality
  message.success($t('helpDoc.downloadSuccess'))
}

// Lifecycle
onMounted(() => {
  fetchVersions()
})
</script>

<style scoped>
.version-history-container {
  padding: 20px;
}

.version-panel {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 16px;
  height: 500px;
  overflow-y: auto;
}

.version-panel h4 {
  margin-bottom: 16px;
  color: #333;
}

.version-content {
  line-height: 1.6;
  color: #666;
}

.version-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.version-info p {
  margin-bottom: 8px;
}
</style>
