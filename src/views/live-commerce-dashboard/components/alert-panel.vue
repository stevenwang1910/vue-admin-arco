<template>
  <div class="alert-panel">
    <div class="alert-header">
      <div class="alert-title">
        <icon-exclamation-circle class="alert-icon" />
        <span>数据预警</span>
      </div>
      <div class="alert-actions">
        <a-button type="text" size="mini" @click="clearReadAlerts">
          <icon-delete />
          清除已读
        </a-button>
        <a-button type="text" size="mini" @click="clearAllAlerts">
          <icon-close />
          全部清除
        </a-button>
      </div>
    </div>

    <div class="alert-content">
      <div v-if="alerts.length === 0" class="alert-empty">
        <icon-check-circle class="empty-icon" />
        <span>暂无预警消息</span>
      </div>

      <div v-else class="alert-list">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-item"
          :class="[`alert-${alert.level}`, { 'alert-unread': !alert.read }]"
          @click="markAlertAsRead(alert.id)"
        >
          <div class="alert-item-header">
            <div class="alert-level">
              <icon-exclamation-circle v-if="alert.level === 'error'" />
              <icon-warning v-else-if="alert.level === 'warning'" />
              <icon-info-circle v-else />
              <span>{{ getLevelText(alert.level) }}</span>
            </div>
            <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
          </div>

          <div class="alert-message">{{ alert.message }}</div>

          <div class="alert-value">
            <span>当前值: {{ alert.currentValue }}</span>
            <span class="rule-info">
              {{ getRuleInfo(alert.rule) }}
            </span>
          </div>

          <div v-if="!alert.read" class="unread-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertMessage } from '@/views/live-commerce-dashboard/types'

interface Props {
  alerts: AlertMessage[]
}

interface Emits {
  (e: 'mark-read', alertId: string): void
  (e: 'clear-all'): void
  (e: 'clear-read'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const markAlertAsRead = (alertId: string) => {
  emit('mark-read', alertId)
}

const clearAllAlerts = () => {
  emit('clear-all')
}

const clearReadAlerts = () => {
  emit('clear-read')
}

const getLevelText = (level: string) => {
  const levelMap = {
    error: '异常',
    warning: '警告',
    info: '提示',
  }
  return levelMap[level as keyof typeof levelMap] || '提示'
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  } else {
    return date.toLocaleDateString()
  }
}

const getRuleInfo = (rule: any) => {
  const conditionMap = {
    greater_than: '>',
    less_than: '<',
    equal: '=',
    not_equal: '≠',
  }
  const operator = conditionMap[rule.condition as keyof typeof conditionMap] || '>'
  return `${operator} ${rule.threshold}`
}
</script>

<style scoped lang="less">
.alert-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
}

.alert-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;

  .alert-icon {
    margin-right: 8px;
    color: #faad14;
    font-size: 18px;
  }
}

.alert-actions {
  display: flex;
  gap: 8px;
}

.alert-content {
  max-height: 400px;
  overflow-y: auto;
}

.alert-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;

  .empty-icon {
    font-size: 48px;
    color: #52c41a;
    margin-bottom: 16px;
  }
}

.alert-list {
  padding: 0;
}

.alert-item {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }

  &.alert-error {
    border-left: 4px solid #ff4d4f;
    background: #fff1f0;
  }

  &.alert-warning {
    border-left: 4px solid #faad14;
    background: #fffbe6;
  }

  &.alert-info {
    border-left: 4px solid #1890ff;
    background: #e6f7ff;
  }

  &.alert-unread {
    background: #f6ffed;
  }
}

.alert-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-level {
  display: flex;
  align-items: center;
  font-weight: 500;

  span {
    margin-left: 4px;
  }

  .arco-icon {
    font-size: 14px;
  }
}

.alert-time {
  font-size: 12px;
  color: #999;
}

.alert-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
}

.alert-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;

  .rule-info {
    color: #999;
  }
}

.unread-dot {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 6px;
  height: 6px;
  background: #ff4d4f;
  border-radius: 50%;
}
</style>
