<template>
  <div ref="chartRef" class="bar-chart" :style="{ height: `${height}px` }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: any[]
  height?: number
  horizontal?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  horizontal: false,
  color: '#1890ff',
})

const emit = defineEmits<{
  click: [params: any]
  drillDown: [params: any]
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

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
    grid: {
      left: props.horizontal ? '15%' : '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: props.horizontal ? 'value' : 'category',
      data: props.horizontal ? null : props.data.map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        rotate: props.horizontal ? 0 : 45,
      },
    },
    yAxis: {
      type: props.horizontal ? 'category' : 'value',
      data: props.horizontal ? props.data.map((item) => item.name) : null,
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
    series: [
      {
        name: '销量',
        type: 'bar',
        data: props.data.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: props.color },
              { offset: 1, color: `${props.color}80` },
            ]),
          },
        })),
        barWidth: props.horizontal ? '60%' : '40%',
        label: {
          show: true,
          position: props.horizontal ? 'right' : 'top',
          formatter: '{c}',
          color: '#333',
          fontSize: 12,
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
.bar-chart {
  width: 100%;
}
</style>
