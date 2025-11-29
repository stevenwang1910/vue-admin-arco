<template>
  <div class="warning-panel">
    <a-card title="异常预警" size="small">
      <template #extra>
        <a-space>
          <a-button type="text" size="small" @click="handleRefresh">
            <template #icon><icon-refresh /></template>
          </a-button>
          <a-switch v-model="autoRefresh" size="small" @change="handleAutoRefreshChange">
            <template #checked>自动</template>
            <template #unchecked>手动</template>
          </a-switch>
        </a-space>
      </template>

      <div class="warning-list">
        <div v-for="warning in warnings" :key="warning.id" class="warning-item" :class="`warning-${warning.type}`">
          <div class="warning-icon">
            <icon-exclamation-circle v-if="warning.type === 'warning'" />
            <icon-close-circle v-else-if="warning.type === 'error'" />
            <icon-info-circle v-else-if="warning.type === 'info'" />
            <icon-check-circle v-else />
          </div>
          <div class="warning-content">
            <div class="warning-message">{{ warning.message }}</div>
            <div class="warning-time">{{ formatTime(warning.timestamp) }}</div>
          </div>
          <div class="warning-actions">
            <a-button type="text" size="mini" @click="handleViewDetail(warning)">查看</a-button>
            <a-button type="text" size="mini" @click="handleIgnore(warning)">忽略</a-button>
          </div>
        </div>

        <div v-if="warnings.length === 0" class="no-warnings">
          <icon-check-circle class="no-warnings-icon" />
          <span>暂无异常预警</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconRefresh, IconExclamationCircle, IconCloseCircle, IconInfoCircle, IconCheckCircle } from '@arco-design/web-vue/es/icon'
import { getWarningData } from '@/api/live-streaming'
import type { LiveStreamingWarning } from '@/types/live-streaming'

interface Props {
  maxWarnings?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxWarnings: 10,
})

const emit = defineEmits(['view-detail', 'ignore-warning'])

const warnings = ref<LiveStreamingWarning[]>([])
const autoRefresh = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | null = null

// 获取预警数据
const fetchWarnings = async () => {
  try {
    const response = await getWarningData()
    warnings.value = response.slice(0, props.maxWarnings)
  } catch (error) {
    Message.error('获取预警数据失败')
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60000) {
    return '刚刚'
  }
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  return new Date(timestamp).toLocaleString()
}

// 手动刷新
const handleRefresh = () => {
  fetchWarnings()
  Message.success('预警数据已刷新')
}

// 自动刷新切换
const handleAutoRefreshChange = (value: boolean) => {
  if (value) {
    refreshTimer = setInterval(fetchWarnings, 60000) // 1分钟刷新一次
    Message.success('已开启自动刷新')
  } else {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
    Message.info('已关闭自动刷新')
  }
}

// 查看详情
const handleViewDetail = (warning: LiveStreamingWarning) => {
  emit('view-detail', warning)
}

// 忽略预警
const handleIgnore = (warning: LiveStreamingWarning) => {
  const index = warnings.value.findIndex((w) => w.id === warning.id)
  if (index > -1) {
    warnings.value.splice(index, 1)
    Message.success('已忽略该预警')
    emit('ignore-warning', warning)
  }
}

onMounted(() => {
  fetchWarnings()
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped lang="less">
.warning-panel {
  .warning-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .warning-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    border: 1px solid var(--color-border-2);
    background: var(--color-fill-1);

    &.warning-warning {
      border-color: #faad14;
      background: rgba(250, 173, 20, 0.05);

      .warning-icon {
        color: #faad14;
      }
    }

    &.warning-error {
      border-color: #f5222d;
      background: rgba(245, 34, 45, 0.05);

      .warning-icon {
        color: #f5222d;
      }
    }

    &.warning-info {
      border-color: #1890ff;
      background: rgba(24, 144, 255, 0.05);

      .warning-icon {
        color: #1890ff;
      }
    }

    &.warning-success {
      border-color: #52c41a;
      background: rgba(82, 196, 26, 0.05);

      .warning-icon {
        color: #52c41a;
      }
    }
  }

  .warning-icon {
    font-size: 16px;
    margin-right: 12px;
    margin-top: 2px;
  }

  .warning-content {
    flex: 1;

    .warning-message {
      font-size: 14px;
      color: var(--color-text-1);
      margin-bottom: 4px;
    }

    .warning-time {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }

  .warning-actions {
    display: flex;
    gap: 8px;
    margin-left: 12px;
  }

  .no-warnings {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--color-text-3);

    .no-warnings-icon {
      font-size: 48px;
      color: #52c41a;
      margin-bottom: 16px;
    }
  }
}
</style>
