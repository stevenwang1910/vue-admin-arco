<template>
  <div class="metric-card" @click="handleClick">
    <div class="metric-header">
      <div class="metric-icon" :style="{ backgroundColor: `${color}20`, color }">
        <component :is="iconComponent" />
      </div>
      <div class="metric-trend" :class="trend">
        <icon-arrow-rise v-if="trend === 'up'" />
        <icon-arrow-fall v-else />
        <span>{{ Math.abs(trendValue) }}%</span>
      </div>
    </div>
    <div class="metric-content">
      <div class="metric-title">{{ title }}</div>
      <div class="metric-value">
        <span class="value-number">{{ formatValue(value) }}</span>
        <span class="value-unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconArrowRise, IconArrowFall } from '@arco-design/web-vue/es/icon'

interface Props {
  title: string
  value: number | string
  unit: string
  trend: 'up' | 'down'
  trendValue: number
  icon: string
  color: string
}

const props = withDefaults(defineProps<Props>(), {
  trend: 'up',
  trendValue: 0,
})

const emit = defineEmits<{
  click: [metric: string]
}>()

const handleClick = () => {
  emit('click', props.title)
}

const iconComponent = computed(() => {
  // 动态图标组件映射
  const iconMap: Record<string, any> = {
    'icon-user': 'icon-user',
    'icon-eye': 'icon-eye',
    'icon-bulb': 'icon-bulb',
    'icon-file': 'icon-file',
    'icon-calendar': 'icon-calendar',
    'icon-star': 'icon-star',
  }
  return iconMap[props.icon] || 'icon-star'
})

const formatValue = (value: number | string) => {
  if (typeof value === 'number') {
    if (value >= 10000) {
      return (value / 10000).toFixed(1) + '万'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toLocaleString()
  }
  return value
}
</script>

<style scoped lang="less">
.metric-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
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
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;

  &.up {
    color: #52c41a;
  }

  &.down {
    color: #f5222d;
  }
}

.metric-content {
  .metric-title {
    font-size: 14px;
    color: var(--color-text-3);
    margin-bottom: 8px;
  }

  .metric-value {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .value-number {
      font-size: 28px;
      font-weight: 600;
      color: var(--color-text-1);
    }

    .value-unit {
      font-size: 14px;
      color: var(--color-text-3);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .metric-card {
    padding: 16px;
  }

  .metric-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .metric-value .value-number {
    font-size: 24px;
  }
}
</style>
