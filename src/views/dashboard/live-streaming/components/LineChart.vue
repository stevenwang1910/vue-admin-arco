<template>
  <div ref="chartRef" class="line-chart" :style="{ height: `${height}px` }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: any[]
  height?: number
  color?: string
  dualAxis?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  color: '#1890ff',
  dualAxis: false,
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const emit = defineEmits<{
    click: [params: any]
    drillDown: [params: any]
  }>()

  // 监听图表点击事件
  chartInstance.on('click', (params: any) => {
    emit('click', params)
  })

  // 监听图表下钻事件
  chartInstance.on('dblclick', (params: any) => {
    emit('drillDown', params)
  })

  updateChart()
}

const updateChart = () => {
  if (!chartInstance || !props.data.length) return

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      data: props.dualAxis ? ['在线人数', '销售额'] : ['数据'],
      top: 10,
      textStyle: {
        fontSize: 12,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.map((item) => item.time),
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
    },
    yAxis: props.dualAxis
      ? [
          {
            type: 'value',
            name: '在线人数',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#52c41a',
              },
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
            },
          },
          {
            type: 'value',
            name: '销售额',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#1890ff',
              },
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
            },
          },
        ]
      : {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#e8e8e8',
            },
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
          },
        },
    series: props.dualAxis
      ? [
          {
            name: '在线人数',
            type: 'line',
            smooth: true,
            data: props.data.map((item) => item.onlineUsers),
            itemStyle: {
              color: '#52c41a',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.1)' },
              ]),
            },
          },
          {
            name: '销售额',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            data: props.data.map((item) => item.salesAmount),
            itemStyle: {
              color: '#1890ff',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
              ]),
            },
          },
        ]
      : [
          {
            name: '数据',
            type: 'line',
            smooth: true,
            data: props.data.map((item) => item.value),
            itemStyle: {
              color: props.color,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${props.color}30` },
                { offset: 1, color: `${props.color}10` },
              ]),
            },
          },
        ],
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)
</script>

<style scoped lang="less">
.line-chart {
  width: 100%;
}
</style>
