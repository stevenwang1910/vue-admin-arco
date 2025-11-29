<template>
  <div ref="chartRef" class="streamer-performance-chart" :style="{ height: `${height}px` }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: any[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
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
    legend: {
      data: ['销售额', '订单量', '转化率', '观看人数'],
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
      data: props.data.map((item) => item.name),
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
    yAxis: [
      {
        type: 'value',
        name: '销售额/订单量/观看人数',
        position: 'left',
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
      {
        type: 'value',
        name: '转化率(%)',
        position: 'right',
        max: 10,
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          },
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: props.data.map((item) => item.salesAmount),
        itemStyle: {
          color: '#1890ff',
        },
        barWidth: '20%',
      },
      {
        name: '订单量',
        type: 'bar',
        data: props.data.map((item) => item.orderCount),
        itemStyle: {
          color: '#52c41a',
        },
        barWidth: '20%',
      },
      {
        name: '观看人数',
        type: 'bar',
        data: props.data.map((item) => item.viewers),
        itemStyle: {
          color: '#faad14',
        },
        barWidth: '20%',
      },
      {
        name: '转化率',
        type: 'line',
        yAxisIndex: 1,
        data: props.data.map((item) => item.conversionRate),
        itemStyle: {
          color: '#eb2f96',
        },
        lineStyle: {
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 8,
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
.streamer-performance-chart {
  width: 100%;
}
</style>
