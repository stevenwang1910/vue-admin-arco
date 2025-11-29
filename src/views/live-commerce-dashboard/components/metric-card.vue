<template>
  <div class="metric-card" :class="{ 'is-loading': loading }">
    <div class="metric-header">
      <div class="metric-icon" :style="{ backgroundColor: iconBgColor }">
        <icon :name="data.icon || 'icon-dashboard'" :size="24" :style="{ color: iconColor }" />
      </div>
      <div class="metric-trend" v-if="data.trend">
        <span :class="trendClass">
          <icon :name="trendIcon" :size="12" />
          {{ formatTrendValue }}
        </span>
      </div>
    </div>

    <div class="metric-content">
      <div class="metric-title">{{ data.title }}</div>
      <div class="metric-value" :style="{ color: valueColor }">
        {{ formatValue }}
        <span class="metric-unit" v-if="data.unit">{{ data.unit }}</span>
      </div>
    </div>

    <div class="metric-footer" v-if="showFooter">
      <div class="metric-progress" v-if="data.target">
        <a-progress :percent="progressPercent" :size="'small'" :status="progressStatus" :show-text="false" />
        <span class="progress-text">{{ progressText }}</span>
      </div>
    </div>

    <!-- 异常预警标识 -->
    <div class="warning-badge" v-if="showWarning">
      <a-badge dot status="danger">
        <icon name="icon-warning" :size="16" style="color: rgb(var(--red-6))" />
      </a-badge>
    </div>

    <!-- 数据更新时间 -->
    <div class="update-time" v-if="lastUpdateTime">更新于 {{ formatUpdateTime }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { MetricData } from '../types'

interface Props {
  data: MetricData
  loading?: boolean
  showFooter?: boolean
  showWarning?: boolean
  lastUpdateTime?: Date
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showFooter: false,
  showWarning: false,
  lastUpdateTime: undefined,
})

// 计算属性
const iconBgColor = computed(() => {
  const colors = {
    blue: '#e6f4ff',
    green: '#f6ffed',
    orange: '#fff7e6',
    red: '#fff1f0',
    purple: '#f9f0ff',
    cyan: '#e6fffb',
  }
  return colors[props.data.color as keyof typeof colors] || colors.blue
})

const iconColor = computed(() => {
  const colors = {
    blue: 'rgb(var(--arcoblue-6))',
    green: 'rgb(var(--green-6))',
    orange: 'rgb(var(--orange-6))',
    red: 'rgb(var(--red-6))',
    purple: 'rgb(var(--purple-6))',
    cyan: 'rgb(var(--cyan-6))',
  }
  return colors[props.data.color as keyof typeof colors] || colors.blue
})

const valueColor = computed(() => {
  if (props.data.color) {
    const colors = {
      blue: 'rgb(var(--arcoblue-6))',
      green: 'rgb(var(--green-6))',
      orange: 'rgb(var(--orange-6))',
      red: 'rgb(var(--red-6))',
      purple: 'rgb(var(--purple-6))',
      cyan: 'rgb(var(--cyan-6))',
    }
    return colors[props.data.color as keyof typeof colors]
  }
  return 'var(--color-text-1)'
})

const trendClass = computed(() => [
  'trend-value',
  {
    'trend-up': props.data.trend === 'up',
    'trend-down': props.data.trend === 'down',
    'trend-stable': props.data.trend === 'stable',
  },
])

const trendIcon = computed(() => {
  switch (props.data.trend) {
    case 'up':
      return 'icon-arrow-rise'
    case 'down':
      return 'icon-arrow-fall'
    default:
      return 'icon-minus'
  }
})

const formatValue = computed(() => {
  const value = props.data.value
  if (props.data.isCurrency && typeof value === 'number') {
    return `¥${value.toLocaleString()}`
  }
  if (typeof value === 'number' && value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`
  }
  return value.toLocaleString()
})

const formatTrendValue = computed(() => {
  if (!props.data.trendValue) return ''
  const value = Math.abs(props.data.trendValue)
  return `${value > 0 ? '+' : ''}${value}%`
})

const formatUpdateTime = computed(() => {
  if (!props.lastUpdateTime) return ''
  const now = new Date()
  const diff = now.getTime() - props.lastUpdateTime.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
})

const progressPercent = computed(() => {
  if (!props.data.target || typeof props.data.value !== 'number') return 0
  return Math.min((props.data.value / props.data.target) * 100, 100)
})

const progressStatus = computed(() => {
  const percent = progressPercent.value
  if (percent >= 100) return 'success'
  if (percent >= 80) return 'warning'
  return 'normal'
})

const progressText = computed(() => {
  const percent = progressPercent.value
  if (!props.data.target) return ''
  return `${percent.toFixed(1)}%`
})

// 事件处理
const handleCardClick = () => {
  Message.info(`查看${props.data.title}详情`)
}
</script>

<style lang="less" scoped>
.metric-card {
  position: relative;
  background-color: var(--color-bg-2);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &.is-loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.metric-trend {
  font-size: 12px;

  .trend-value {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 6px;
    border-radius: 4px;

    &.trend-up {
      color: rgb(var(--green-6));
      background-color: #f6ffed;
    }

    &.trend-down {
      color: rgb(var(--red-6));
      background-color: #fff1f0;
    }

    &.trend-stable {
      color: var(--color-text-3);
      background-color: var(--color-fill-2);
    }
  }
}

.metric-content {
  .metric-title {
    font-size: 14px;
    color: var(--color-text-3);
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.2;
    display: flex;
    align-items: baseline;
    gap: 4px;

    .metric-unit {
      font-size: 14px;
      font-weight: normal;
      color: var(--color-text-3);
    }
  }
}

.metric-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);

  .metric-progress {
    display: flex;
    align-items: center;
    gap: 8px;

    .progress-text {
      font-size: 12px;
      color: var(--color-text-3);
      min-width: 40px;
    }
  }
}

.warning-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.update-time {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 11px;
  color: var(--color-text-4);
}

// 响应式设计
@media (max-width: 768px) {
  .metric-card {
    padding: 16px;
  }

  .metric-value {
    font-size: 24px;
  }

  .metric-icon {
    width: 40px;
    height: 40px;
  }
}

// 加载动画
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.is-loading {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
