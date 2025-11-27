<template>
  <div class="backup-restore-container">
    <a-page-header title="{{ $t('menu.helpDoc.backupRestore') }}">
      <template #extra>
        <a-button type="primary" @click="handleCreateBackup">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('helpDoc.createBackup') }}
        </a-button>
      </template>
    </a-page-header>

    <a-card>
      <a-tabs v-model:active-name="activeTab" type="card">
        <a-tab-pane name="backup" tab="{{ $t('helpDoc.backup') }}">
          <div class="backup-section">
            <a-form layout="inline" style="margin-bottom: 24px">
              <a-form-item label="{{ $t('helpDoc.backupType') }}">
                <a-select v-model="backupFormData.type" placeholder="{{ $t('helpDoc.selectBackupType') }}">
                  <a-option value="full">{{ $t('helpDoc.fullBackup') }}</a-option>
                  <a-option value="incremental">{{ $t('helpDoc.incrementalBackup') }}</a-option>
                  <a-option value="documents">{{ $t('helpDoc.documentsOnly') }}</a-option>
                  <a-option value="settings">{{ $t('helpDoc.settingsOnly') }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="{{ $t('helpDoc.description') }}">
                <a-input v-model="backupFormData.description" placeholder="{{ $t('helpDoc.enterBackupDescription') }}" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="handleCreateBackup">
                  {{ $t('helpDoc.createBackup') }}
                </a-button>
              </a-form-item>
            </a-form>

            <a-divider />

            <div class="backup-list">
              <a-table
                :columns="backupColumns"
                :data="backups"
                :loading="loading"
                row-key="id"
                :pagination="pagination"
                @page-change="onPageChange"
                @page-size-change="onPageSizeChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'type'">
                    <a-tag
                      :color="
                        record.type === 'full' ? 'success' : record.type === 'incremental' ? 'warning' : 'blue'
                      "
                    >
                      {{ $t(`helpDoc.${record.type}Backup`) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'size'">
                    {{ formatFileSize(record.size) }}
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag
                      :color="
                        record.status === 'completed' ? 'success' : record.status === 'running' ? 'processing' : 'danger'
                      "
                    >
                      {{ $t(`helpDoc.${record.status}`) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'actions'">
                    <a-space>
                      <a-button size="small" @click="handleDownloadBackup(record)">
                        {{ $t('helpDoc.download') }}
                      </a-button>
                      <a-button size="small" @click="handleRestoreBackup(record)">
                        {{ $t('helpDoc.restore') }}
                      </a-button>
                      <a-button size="small" status="danger" @click="handleDeleteBackup(record)">
                        {{ $t('helpDoc.delete') }}
                      </a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane name="restore" tab="{{ $t('helpDoc.restore') }}">
          <div class="restore-section">
            <a-card title="{{ $t('helpDoc.restoreFromBackup') }}" style="margin-bottom: 24px">
              <a-upload
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                accept=".zip,.tar,.gz"
              >
                <a-button type="primary">
                  <template #icon>
                    <icon-upload />
                  </template>
                  {{ $t('helpDoc.uploadBackupFile') }}
                </a-button>
              </a-upload>
              <p style="margin-top: 16px; color: #999; font-size: 14px">
                {{ $t('helpDoc.supportedFormats') }}
              </p>
            </a-card>

            <a-card title="{{ $t('helpDoc.restoreHistory') }}">
              <a-table
                :columns="restoreColumns"
                :data="restoreHistory"
                :loading="loading"
                row-key="id"
                :pagination="restorePagination"
                @page-change="onRestorePageChange"
                @page-size-change="onRestorePageSizeChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <a-tag
                      :color="
                        record.status === 'completed' ? 'success' : record.status === 'running' ? 'processing' : 'danger'
                      "
                    >
                      {{ $t(`helpDoc.${record.status}`) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'result'">
                    <a-tag
                      :color="record.result === 'success' ? 'success' : 'danger'"
                    >
                      {{ $t(`helpDoc.${record.result}`) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'actions'">
                    <a-button size="small" @click="handleViewRestoreLog(record)">
                      {{ $t('helpDoc.viewLog') }}
                    </a-button>
                  </template>
                </template>
              </a-table>
            </a-card>
          </div>
        </a-tab-pane>

        <a-tab-pane name="settings" tab="{{ $t('helpDoc.settings') }}">
          <div class="settings-section">
            <a-form layout="vertical">
              <a-form-item field="autoBackup" label="{{ $t('helpDoc.autoBackup') }}">
                <a-switch v-model="settings.autoBackup" />
              </a-form-item>

              <a-form-item field="backupInterval" label="{{ $t('helpDoc.backupInterval') }}" v-if="settings.autoBackup">
                <a-select v-model="settings.backupInterval">
                  <a-option value="daily">{{ $t('helpDoc.daily') }}</a-option>
                  <a-option value="weekly">{{ $t('helpDoc.weekly') }}</a-option>
                  <a-option value="monthly">{{ $t('helpDoc.monthly') }}</a-option>
                </a-select>
              </a-form-item>

              <a-form-item field="backupTime" label="{{ $t('helpDoc.backupTime') }}" v-if="settings.autoBackup">
                <a-time-picker v-model="settings.backupTime" />
              </a-form-item>

              <a-form-item field="backupRetention" label="{{ $t('helpDoc.backupRetention') }}">
                <a-input-number v-model="settings.backupRetention" :min="1" :max="365" />
                <span style="margin-left: 8px">{{ $t('helpDoc.days') }}</span>
              </a-form-item>

              <a-form-item field="backupPath" label="{{ $t('helpDoc.backupPath') }}">
                <a-input v-model="settings.backupPath" placeholder="{{ $t('helpDoc.enterBackupPath') }}" />
              </a-form-item>

              <a-form-item field="emailNotification" label="{{ $t('helpDoc.emailNotification') }}">
                <a-switch v-model="settings.emailNotification" />
              </a-form-item>

              <a-form-item field="notificationEmail" label="{{ $t('helpDoc.notificationEmail') }}" v-if="settings.emailNotification">
                <a-input v-model="settings.notificationEmail" placeholder="{{ $t('helpDoc.enterEmail') }}" />
              </a-form-item>

              <a-button type="primary" @click="handleSaveSettings">
                {{ $t('helpDoc.saveSettings') }}
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Restore Confirm Modal -->
    <a-modal
      v-model:visible="restoreConfirmVisible"
      title="{{ $t('helpDoc.confirmRestore') }}"
      status="warning"
      @ok="handleRestoreConfirm"
      @cancel="handleRestoreCancel"
    >
      <p>{{ $t('helpDoc.restoreWarning') }}</p>
      <p style="margin-top: 16px; color: #ff4d4f; font-weight: 600">
        {{ $t('helpDoc.restoreWarningStrong') }}
      </p>
    </a-modal>

    <!-- Restore Log Modal -->
    <a-modal
      v-model:visible="restoreLogVisible"
      title="{{ $t('helpDoc.restoreLog') }}"
      :width="800"
      :footer="null"
    >
      <a-textarea
        :value="restoreLogContent"
        :rows="20"
        readonly
        style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from '@arco-design/web-vue'
import type { TableColumns } from '@arco-design/web-vue/es/table/interface'
import { IconPlus, IconUpload } from '@arco-design/web-vue/es/icon'

// State
const activeTab = ref('backup')
const loading = ref(false)

// Backup state
const backupFormData = ref({
  type: 'full',
  description: '',
})

const backups = ref<any[]>([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `${total} ${$t('helpDoc.items')}`,
})

// Restore state
const restoreHistory = ref<any[]>([])
const restorePagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `${total} ${$t('helpDoc.items')}`,
})

// Settings state
const settings = ref({
  autoBackup: true,
  backupInterval: 'daily',
  backupTime: '02:00',
  backupRetention: 30,
  backupPath: '/backup',
  emailNotification: false,
  notificationEmail: '',
})

// Modal state
const restoreConfirmVisible = ref(false)
const restoreLogVisible = ref(false)
const restoreLogContent = ref('')
const currentRestoreBackup = ref<any>(null)

// Columns
const backupColumns: TableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: $t('helpDoc.type'),
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: $t('helpDoc.description'),
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: $t('helpDoc.size'),
    dataIndex: 'size',
    key: 'size',
    width: 100,
  },
  {
    title: $t('helpDoc.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('helpDoc.createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: $t('helpDoc.createdBy'),
    dataIndex: 'createdBy',
    key: 'createdBy',
    width: 120,
  },
  {
    title: $t('helpDoc.actions'),
    key: 'actions',
    width: 200,
  },
]

const restoreColumns: TableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: $t('helpDoc.backupId'),
    dataIndex: 'backupId',
    key: 'backupId',
    width: 120,
  },
  {
    title: $t('helpDoc.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('helpDoc.result'),
    dataIndex: 'result',
    key: 'result',
    width: 100,
  },
  {
    title: $t('helpDoc.startedAt'),
    dataIndex: 'startedAt',
    key: 'startedAt',
    width: 180,
  },
  {
    title: $t('helpDoc.completedAt'),
    dataIndex: 'completedAt',
    key: 'completedAt',
    width: 180,
  },
  {
    title: $t('helpDoc.restoredBy'),
    dataIndex: 'restoredBy',
    key: 'restoredBy',
    width: 120,
  },
  {
    title: $t('helpDoc.actions'),
    key: 'actions',
    width: 100,
  },
]

// Methods
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fetchBackups = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    backups.value = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      type: ['full', 'incremental', 'documents', 'settings'][Math.floor(Math.random() * 4)],
      description: `Backup ${i + 1}`,
      size: Math.floor(Math.random() * 1000 * 1024 * 1024), // 0-1GB
      status: 'completed',
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString(),
      createdBy: 'Admin',
    }))
    pagination.value.total = 15
  } catch (error) {
    message.error($t('helpDoc.fetchBackupsFailed'))
  } finally {
    loading.value = false
  }
}

const fetchRestoreHistory = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    restoreHistory.value = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      backupId: Math.floor(Math.random() * 15) + 1,
      status: 'completed',
      result: ['success', 'success', 'success', 'failed'][Math.floor(Math.random() * 4)],
      startedAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleString(),
      completedAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000 + 3600000).toLocaleString(),
      restoredBy: 'Admin',
    }))
    restorePagination.value.total = 10
  } catch (error) {
    message.error($t('helpDoc.fetchRestoreHistoryFailed'))
  } finally {
    loading.value = false
  }
}

const handleCreateBackup = () => {
  // TODO: Implement create backup functionality
  message.success($t('helpDoc.backupCreated'))
  fetchBackups()
}

const handleDownloadBackup = (record: any) => {
  // TODO: Implement download backup functionality
  message.success($t('helpDoc.backupDownloaded'))
}

const handleRestoreBackup = (record: any) => {
  currentRestoreBackup.value = record
  restoreConfirmVisible.value = true
}

const handleDeleteBackup = (record: any) => {
  // TODO: Implement delete backup functionality
  message.success($t('helpDoc.backupDeleted'))
  fetchBackups()
}

const handleRestoreConfirm = () => {
  // TODO: Implement restore backup functionality
  message.success($t('helpDoc.restoreStarted'))
  restoreConfirmVisible.value = false
  fetchRestoreHistory()
}

const handleRestoreCancel = () => {
  restoreConfirmVisible.value = false
  currentRestoreBackup.value = null
}

const handleBeforeUpload = (file: File) => {
  // TODO: Implement upload backup file functionality
  message.success($t('helpDoc.backupFileUploaded'))
  return false // Prevent default upload behavior
}

const handleViewRestoreLog = (record: any) => {
  // TODO: Implement view restore log functionality
  restoreLogContent.value = `Restore Log for ID: ${record.id}\n\nStart Time: ${record.startedAt}\nEnd Time: ${record.completedAt}\nStatus: ${record.status}\nResult: ${record.result}\n\nDetails:\n- Restored ${Math.floor(Math.random() * 1000)} documents\n- Restored ${Math.floor(Math.random() * 100)} categories\n- Restored ${Math.floor(Math.random() * 10)} users\n- No errors encountered`
  restoreLogVisible.value = true
}

const handleSaveSettings = () => {
  // TODO: Implement save settings functionality
  message.success($t('helpDoc.settingsSaved'))
}

const onPageChange = (page: number) => {
  pagination.value.current = page
  fetchBackups()
}

const onPageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.current = 1
  fetchBackups()
}

const onRestorePageChange = (page: number) => {
  restorePagination.value.current = page
  fetchRestoreHistory()
}

const onRestorePageSizeChange = (pageSize: number) => {
  restorePagination.value.pageSize = pageSize
  restorePagination.value.current = 1
  fetchRestoreHistory()
}

// Lifecycle
onMounted(() => {
  fetchBackups()
  fetchRestoreHistory()
})
</script>

<style scoped>
.backup-restore-container {
  padding: 20px;
}

.backup-section,
.restore-section,
.settings-section {
  padding: 20px;
}

.backup-list,
.restore-list {
  margin-top: 20px;
}
</style>
