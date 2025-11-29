<template>
  <div class="online-users-chart" v-loading="loading">
    <div class="chart-header-info">
      <div class="current-users">
        <span class="users-number">{{ currentUsers.toLocaleString() }}</span>
        <span class="users-label">当前在线</span>
      </div>
      <div class="users-change" :class="changeClass">
        <icon :name="changeIcon" :size="14" />
        <span>{{ Math.abs(usersChange) }}%</span>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
    <div class="chart-footer">
      <div class="peak-info">
        <span class="peak-label">峰值:</span>
        <span class="peak-value">{{ peakUsers.toLocaleString() }}</span>
      </div>
      <div class="average-info">
        <span class="average-label">平均:</span>
        <span class="average-value">{{ averageUsers.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Message } from '@arco-design/web-vue'
import { ChartDataPoint } from '../types'

interface Props {
  data: ChartDataPoint[]
  loading?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: 200,
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 计算属性
const currentUsers = computed(() => {
  if (!props.data || props.data.length === 0) return 0
  return props.data[props.data.length - 1]?.value || 0
})

const previousUsers = computed(() => {
  if (!props.data || props.data.length < 2) return 0
  return props.data[props.data.length - 2]?.value || 0
})

const usersChange = computed(() => {
  if (previousUsers.value === 0) return 0
  return Math.round(((currentUsers.value - previousUsers.value) / previousUsers.value) * 100)
})

const changeClass = computed(() => ({
  'change-up': usersChange.value > 0,
  'change-down': usersChange.value < 0,
  'change-stable': usersChange.value === 0,
}))

const changeIcon = computed(() => {
  if (usersChange.value > 0) return 'icon-arrow-rise'
  if (usersChange.value < 0) return 'icon-arrow-fall'
  return 'icon-minus'
})

const peakUsers = computed(() => {
  if (!props.data || props.data.length === 0) return 0
  return Math.max(...props.data.map((item) => item.value))
})

const averageUsers = computed(() => {
  if (!props.data || props.data.length === 0) return 0
  const sum = props.data.reduce((acc, item) => acc + item.value, 0)
  return Math.round(sum / props.data.length)
})

// 图表配置
const chartOption = computed(() => {
  if (!props.data || props.data.length === 0) {
    return getEmptyOption()
  }

  return {
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#165dff',
          width: 1,
        },
      },
      formatter: (params: any[]) => {
        const param = params[0]
        return `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${param.axisValue}</div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 4px;"></span>
            <span>在线人数:</span>
            <span style="font-weight: bold; margin-left: 8px;">${param.value.toLocaleString()}</span>
          </div>
        </div>`
      },
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.map((item) => item.time),
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: Math.max(peakUsers.value * 1.2, 100), // 至少显示100
    },
    series: [
      {
        name: '在线人数',
        type: 'line',
        data: props.data.map((item) => item.value),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#165dff' },
            { offset: 1, color: '#14c9c9' },
          ]),
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22, 93, 255, 0.3)' },
            { offset: 1, color: 'rgba(22, 93, 255, 0.05)' },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  }
})

// 空数据配置
const getEmptyOption = () => {
  return {
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: {
        color: 'var(--color-text-3)',
        fontSize: 14,
      },
    },
    xAxis: {
      type: 'category',
      data: [],
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [],
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(chartOption.value)

  // 添加点击事件
  chartInstance.on('click', (params: any) => {
    Message.info(`时间: ${params.name}, 在线人数: ${params.value}`)
  })

  // 响应式
  window.addEventListener('resize', handleResize)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  chartInstance.setOption(chartOption.value, {
    notMerge: false,
    lazyUpdate: true,
  })
}

// 调整大小
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 销毁图表
const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
}

// 监听数据变化
watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  disposeChart()
})
</script>

<style lang="less" scoped>
.online-users-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.current-users {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .users-number {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-1);
    line-height: 1;
  }

  .users-label {
    font-size: 12px;
    color: var(--color-text-3);
    margin-top: 2px;
  }
}

.users-change {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.change-up {
    color: rgb(var(--green-6));
    background-color: #f6ffed;
  }

  &.change-down {
    color: rgb(var(--red-6));
    background-color: #fff1f0;
  }

  &.change-stable {
    color: var(--color-text-3);
    background-color: var(--color-fill-2);
  }
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: v-bind(props.height) + 'px';
}

.chart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 8px;
  background-color: var(--color-fill-1);
  border-radius: 4px;
  font-size: 12px;

  .peak-info,
  .average-info {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .peak-label,
  .average-label {
    color: var(--color-text-3);
  }

  .peak-value,
  .average-value {
    color: var(--color-text-1);
    font-weight: 500;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chart-header-info {
    margin-bottom: 12px;
  }

  .current-users .users-number {
    font-size: 20px;
  }

  .chart-footer {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

// 加载状态
:deep(.arco-spin) {
  width: 100%;
  height: 100%;
}
</style>
