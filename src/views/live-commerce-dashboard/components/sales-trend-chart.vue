<template>
  <div class="sales-trend-chart" v-loading="loading">
    <div ref="chartRef" class="chart-container"></div>
    <div class="chart-legend" v-if="showLegend">
      <div class="legend-item" v-for="item in legendData" :key="item.name">
        <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-text">{{ item.name }}</span>
        <span class="legend-value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import { Message } from '@arco-design/web-vue'
import { SalesTrendData } from '../types'

interface Props {
  data: SalesTrendData
  loading?: boolean
  showLegend?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showLegend: true,
  height: 300,
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 图表配置
const chartOption = computed(() => {
  if (!props.data || !props.data.sales || props.data.sales.length === 0) {
    return getEmptyOption()
  }

  return {
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      formatter: (params: any[]) => {
        let result = `<div style="padding: 8px;"><div style="font-weight: bold; margin-bottom: 4px;">${params[0].axisValue}</div>`
        params.forEach((param) => {
          const value = param.seriesName.includes('率') ? `${param.value}%` : param.value.toLocaleString()
          result += `<div style="display: flex; align-items: center; margin: 2px 0;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 4px;"></span>
            <span style="flex: 1;">${param.seriesName}:</span>
            <span style="font-weight: bold; margin-left: 8px;">${value}</span>
          </div>`
        })
        result += '</div>'
        return result
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.sales.map((item) => item.time),
      axisLabel: {
        color: 'var(--color-text-3)',
        fontSize: 12,
        formatter: (value: string) => {
          // 时间格式化
          if (value.includes(':')) {
            return value.split(' ')[1] || value
          }
          return value
        },
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
    yAxis: [
      {
        type: 'value',
        name: '销售额(元)',
        position: 'left',
        axisLabel: {
          color: 'var(--color-text-3)',
          fontSize: 12,
          formatter: (value: number) => {
            if (value >= 10000) {
              return `${(value / 10000).toFixed(0)}万`
            }
            return value.toLocaleString()
          },
        },
        axisLine: {
          show: true,
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
      {
        type: 'value',
        name: '订单量',
        position: 'right',
        axisLabel: {
          color: 'var(--color-text-3)',
          fontSize: 12,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'var(--color-border-2)',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        yAxisIndex: 0,
        data: props.data.sales.map((item) => item.value),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#165dff',
        },
        itemStyle: {
          color: '#165dff',
          borderWidth: 2,
          borderColor: '#fff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22, 93, 255, 0.3)' },
            { offset: 1, color: 'rgba(22, 93, 255, 0.05)' },
          ]),
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(22, 93, 255, 0.5)',
          },
        },
      },
      {
        name: '订单量',
        type: 'line',
        yAxisIndex: 1,
        data: props.data.orders.map((item) => item.value),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#14c9c9',
          type: 'dashed',
        },
        itemStyle: {
          color: '#14c9c9',
          borderWidth: 2,
          borderColor: '#fff',
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
    color: ['#165dff', '#14c9c9', '#ff7d00', '#f53f3f'],
  }
})

const legendData = computed(() => {
  if (!props.data || !props.data.sales || props.data.sales.length === 0) return []

  const latestSales = props.data.sales[props.data.sales.length - 1]?.value || 0
  const latestOrders = props.data.orders[props.data.orders.length - 1]?.value || 0

  return [
    { name: '销售额', value: `¥${latestSales.toLocaleString()}`, color: '#165dff' },
    { name: '订单量', value: latestOrders.toLocaleString(), color: '#14c9c9' },
  ]
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
    Message.info(`点击了 ${params.seriesName}: ${params.name} - ${params.value}`)
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
.sales-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: v-bind(props.height) + 'px';
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding: 12px;
  background-color: var(--color-fill-1);
  border-radius: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-2);
}

.legend-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-text {
  font-weight: 500;
}

.legend-value {
  font-weight: bold;
  color: var(--color-text-1);
}

// 加载状态
:deep(.arco-spin) {
  width: 100%;
  height: 100%;
}
</style>
