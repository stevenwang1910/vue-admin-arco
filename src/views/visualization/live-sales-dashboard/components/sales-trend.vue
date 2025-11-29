<template>
  <a-card class="general-card" :title="$t('liveSalesDashboard.salesTrend.title')" :header-style="{ paddingBottom: '12px' }">
    <div class="filter-bar">
      <a-radio-group v-model="timeRange" type="button" style="margin-bottom: 16px">
        <a-radio value="today">{{ $t('liveSalesDashboard.salesTrend.today') }}</a-radio>
        <a-radio value="week">{{ $t('liveSalesDashboard.salesTrend.week') }}</a-radio>
      </a-radio-group>
    </div>
    <div class="chart-container">
      <Chart v-if="!loading" :option="chartOption" height="300px" />
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import Chart from '@/components/chart/index.vue'
import useChartOption from '@/hooks/chart-option'
import useLoading from '@/hooks/loading'
import { ref, watch } from 'vue'
import { querySalesTrend } from '@/api/visualization'
import useThemes from '@/hooks/themes'

const { isDark } = useThemes()
const { loading, setLoading } = useLoading(true)
const timeRange = ref('today')
const xAxis = ref<string[]>([])
const salesData = ref<number[]>([])
const orderData = ref<number[]>([])

// 配置图表选项
const { chartOption } = useChartOption(() => {
  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [$t('liveSalesDashboard.salesTrend.salesAmount'), $t('liveSalesDashboard.salesTrend.orderVolume')],
      textStyle: {
        color: isDark ? '#fff' : '#000',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis.value,
      axisLine: {
        lineStyle: {
          color: isDark ? '#4E5969' : '#C9CDD4',
        },
      },
      axisLabel: {
        color: isDark ? '#C9CDD4' : '#4E5969',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDark ? '#4E5969' : '#C9CDD4',
        },
      },
      axisLabel: {
        color: isDark ? '#C9CDD4' : '#4E5969',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    series: [
      {
        name: $t('liveSalesDashboard.salesTrend.salesAmount'),
        type: 'line',
        smooth: true,
        data: salesData.value,
        lineStyle: {
          color: '#165DFF',
          width: 2,
        },
        itemStyle: {
          color: '#165DFF',
        },
      },
      {
        name: $t('liveSalesDashboard.salesTrend.orderVolume'),
        type: 'line',
        smooth: true,
        data: orderData.value,
        lineStyle: {
          color: '#52C41A',
          width: 2,
        },
        itemStyle: {
          color: '#52C41A',
        },
      },
    ],
  }
})

const fetchData = async () => {
  try {
    setLoading(true)
    const { data } = await querySalesTrend({ timeRange: timeRange.value })
    xAxis.value = data.xAxis
    salesData.value = data.data[0].data
    orderData.value = data.data[1].data
  } catch (err) {
    console.error('Failed to fetch sales trend:', err)
  } finally {
    setLoading(false)
  }
}

watch(timeRange, fetchData, { immediate: true })
</script>

<style scoped lang="less">
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
