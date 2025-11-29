<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card :bordered="false" :style="cardStyle">
      <div class="content-wrap">
        <div class="content">
          <div class="icon" :style="{ color: iconColor }">
            <component :is="icon" />
          </div>
          <a-statistic :title="title" :value="value" :value-from="0" animation show-group-separator />
          <div class="desc">
            <a-typography-text type="secondary" class="label">
              {{ $t('liveSalesDashboard.coreMetrics.yesterday') }}
            </a-typography-text>
            <a-typography-text :type="growth >= 0 ? 'success' : 'danger'">
              {{ growth >= 0 ? '+' : '' }}{{ growth }}%
              <component :is="growth >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'" />
            </a-typography-text>
          </div>
        </div>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType, ref, computed } from 'vue'
import useLoading from '@/hooks/loading'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: [Number, String],
    default: 0,
  },
  growth: {
    type: Number,
    default: 0,
  },
  icon: {
    type: String,
    default: '',
  },
  cardStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => {
      return {}
    },
  },
})

const { loading, setLoading } = useLoading(true)

// 根据卡片背景色计算图标颜色
const iconColor = computed(() => {
  if (!props.cardStyle.background) {
    return '#165DFF'
  }
  // 简单判断背景色是亮色还是暗色
  const bgColor = props.cardStyle.background as string
  if (bgColor.includes('dark') || (bgColor.includes('#') && parseInt(bgColor.slice(1), 16) < 0xffffff / 2)) {
    return '#ffffff'
  }
  return '#165DFF'
})

// 模拟数据加载
setTimeout(() => {
  setLoading(false)
}, 500)
</script>

<style scoped lang="less">
:deep(.arco-card) {
  border-radius: 4px;
}
:deep(.arco-card-body) {
  width: 100%;
  height: 134px;
  padding: 0;
}
.content-wrap {
  width: 100%;
  padding: 16px;
  white-space: nowrap;
}
:deep(.content) {
  width: 100%;
  height: 102px;
}
:deep(.arco-statistic) {
  .arco-statistic-title {
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
  }
  .arco-statistic-content {
    margin-top: 10px;
  }
}

.icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.label {
  padding-right: 8px;
  font-size: 12px;
}
</style>
