<template>
  <div class="user-profile-chart" v-loading="loading">
    <div ref="chartRef" class="chart-container"></div>
    <div class="profile-summary" v-if="showSummary">
      <div class="summary-item" v-for="item in summaryData" :key="item.name">
        <div class="summary-label">{{ item.name }}</div>
        <div class="summary-value">{{ item.percentage }}%</div>
        <div class="summary-count">{{ item.count.toLocaleString() }}人</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Message } from '@arco-design/web-vue'
import { UserProfileData } from '../types'

interface Props {
  data: UserProfileData[]
  type: 'age' | 'gender' | 'region'
  loading?: boolean
  showSummary?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showSummary: true,
  height: 250,
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 计算属性
const chartTitle = computed(() => {
  const titles = {
    age: '年龄分布',
    gender: '性别分布',
    region: '地区分布',
  }
  return titles[props.type]
})

const chartColors = computed(() => {
  const colorSchemes = {
    age: ['#165dff', '#14c9c9', '#ff7d00', '#f53f3f', '#722ed1', '#13c2c2'],
    gender: ['#165dff', '#ff7d00', '#14c9c9'],
    region: ['#165dff', '#14c9c9', '#ff7d00', '#f53f3f', '#722ed1', '#13c2c2', '#fa8c16', '#52c41a'],
  }
  return colorSchemes[props.type]
})

const summaryData = computed(() => {
  return props.data.map((item) => ({
    ...item,
    count: Math.round((item.percentage / 100) * getTotalUsers()),
  }))
})

const getTotalUsers = () => {
  // 模拟总用户数，实际应该从接口获取
  return 12580
}

// 图表配置
const chartOption = computed(() => {
  if (!props.data || props.data.length === 0) {
    return getEmptyOption()
  }

  // 根据类型选择图表类型
  if (props.type === 'region') {
    return getBarChartOption()
  } else {
    return getPieChartOption()
  }
})

const getPieChartOption = () => {
  return {
    title: {
      text: chartTitle.value,
      left: 'center',
      top: 'middle',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'var(--color-text-2)',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${params.color}; margin-right: 4px;"></span>
            <span>占比:</span>
            <span style="font-weight: bold; margin-left: 8px;">${params.percent}%</span>
          </div>
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span>人数:</span>
            <span style="font-weight: bold; margin-left: 8px;">${params.value.toLocaleString()}</span>
          </div>
        </div>`
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        fontSize: 11,
        color: 'var(--color-text-2)',
      },
      formatter: (name: string) => {
        const item = props.data.find((d) => d.name === name)
        return item ? `${name} ${item.percentage}%` : name
      },
    },
    series: [
      {
        name: chartTitle.value,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data: props.data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: chartColors.value[index % chartColors.value.length],
          },
        })),
      },
    ],
    animation: true,
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: (idx: number) => Math.random() * 200,
  }
}

const getBarChartOption = () => {
  return {
    title: {
      text: chartTitle.value,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'var(--color-text-2)',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any[]) => {
        const param = params[0]
        return `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${param.name}</div>
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 4px;"></span>
            <span>占比:</span>
            <span style="font-weight: bold; margin-left: 8px;">${param.value.percentage}%</span>
          </div>
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span>人数:</span>
            <span style="font-weight: bold; margin-left: 8px;">${param.value.value.toLocaleString()}</span>
          </div>
        </div>`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.name),
      axisLabel: {
        color: 'var(--color-text-3)',
        fontSize: 11,
        rotate: 30,
      },
      axisLine: {
        lineStyle: {
          color: 'var(--color-border-2)',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '人数',
      nameTextStyle: {
        color: 'var(--color-text-3)',
        fontSize: 11,
      },
      axisLabel: {
        color: 'var(--color-text-3)',
        fontSize: 11,
        formatter: (value: number) => {
          if (value >= 10000) {
            return `${(value / 10000).toFixed(0)}万`
          } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`
          }
          return value.toString()
        },
      },
      axisLine: {
        lineStyle: {
          color: 'var(--color-border-2)',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'var(--color-border-1)',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: chartTitle.value,
        type: 'bar',
        data: props.data.map((item, index) => ({
          value: item,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: chartColors.value[index % chartColors.value.length] },
              { offset: 1, color: `${chartColors.value[index % chartColors.value.length]}80` },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          color: 'var(--color-text-2)',
          fontSize: 10,
          formatter: (params: any) => `${params.value.percentage}%`,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  }
}

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
    Message.info(`点击了 ${params.name}: ${params.value.percentage}%`)
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
  () => [props.data, props.type],
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
.user-profile-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: v-bind(props.height) + 'px';
}

.profile-summary {
  margin-top: 16px;
  padding: 12px;
  background-color: var(--color-fill-1);
  border-radius: 4px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-2);

  &:last-child {
    border-bottom: none;
  }
}

.summary-label {
  font-size: 12px;
  color: var(--color-text-2);
  flex: 1;
}

.summary-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-1);
  min-width: 40px;
  text-align: right;
}

.summary-count {
  font-size: 11px;
  color: var(--color-text-3);
  min-width: 60px;
  text-align: right;
  margin-left: 8px;
}

// 响应式设计
@media (max-width: 768px) {
  .chart-container {
    min-height: 200px;
  }

  .profile-summary {
    margin-top: 12px;
    padding: 8px;
  }
}

// 加载状态
:deep(.arco-spin) {
  width: 100%;
  height: 100%;
}
</style>
