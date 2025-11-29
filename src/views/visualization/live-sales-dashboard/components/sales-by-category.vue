<template>
  <a-card class="general-card" :title="$t('liveSalesDashboard.salesByCategory.title')" :header-style="{ paddingBottom: '12px' }">
    <Chart v-if="!loading" :option="chartOption" height="300px" />
  </a-card>
</template>

<script lang="ts" setup>
import Chart from '@/components/chart/index.vue'
import useChartOption from '@/hooks/chart-option'
import useLoading from '@/hooks/loading'
import { ref, onMounted } from 'vue'
import { querySalesByCategory } from '@/api/visualization'
import useThemes from '@/hooks/themes'

const { isDark } = useThemes()
const { loading, setLoading } = useLoading(true)
const categoryData = ref([])

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
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: categoryData.value.map((item: any) => item.name),
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
        name: '销售额',
        type: 'bar',
        data: categoryData.value.map((item: any) => item.value),
        itemStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#165DFF' },
            { offset: 1, color: '#00B2FF' },
          ]),
        },
      },
    ],
  }
})

const fetchData = async () => {
  try {
    setLoading(true)
    const { data } = await querySalesByCategory()
    categoryData.value = data
  } catch (err) {
    console.error('Failed to fetch sales by category:', err)
  } finally {
    setLoading(false)
  }
}

onMounted(() => {
  fetchData()
  // 模拟数据更新
  setInterval(fetchData, 15000)
})
</script>
