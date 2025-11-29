<template>
  <a-card class="general-card" :title="$t('liveSalesDashboard.userPortrait.title')" :header-style="{ paddingBottom: '12px' }">
    <a-grid :cols="24" :col-gap="16" :row-gap="16">
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }">
        <div class="chart-title">{{ $t('liveSalesDashboard.userPortrait.genderDistribution') }}</div>
        <Chart v-if="!loading" :option="genderChartOption" height="200px" />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }">
        <div class="chart-title">{{ $t('liveSalesDashboard.userPortrait.ageDistribution') }}</div>
        <Chart v-if="!loading" :option="ageChartOption" height="200px" />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }">
        <div class="chart-title">{{ $t('liveSalesDashboard.userPortrait.regionDistribution') }}</div>
        <Chart v-if="!loading" :option="regionChartOption" height="200px" />
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts" setup>
import Chart from '@/components/chart/index.vue'
import useChartOption from '@/hooks/chart-option'
import useLoading from '@/hooks/loading'
import { ref, onMounted } from 'vue'
import { queryUserPortrait } from '@/api/visualization'
import useThemes from '@/hooks/themes'

const { isDark } = useThemes()
const { loading, setLoading } = useLoading(true)
const genderData = ref([])
const ageData = ref([])
const regionData = ref([])

// 性别分布图表
const { chartOption: genderChartOption } = useChartOption(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: isDark ? '#fff' : '#000',
      },
    },
    series: [
      {
        name: $t('liveSalesDashboard.userPortrait.genderDistribution'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
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
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: genderData.value,
      },
    ],
  }
})

// 年龄分布图表
const { chartOption: ageChartOption } = useChartOption(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: isDark ? '#fff' : '#000',
      },
    },
    series: [
      {
        name: $t('liveSalesDashboard.userPortrait.ageDistribution'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
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
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: ageData.value,
      },
    ],
  }
})

// 地域分布图表
const { chartOption: regionChartOption } = useChartOption(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: isDark ? '#fff' : '#000',
      },
    },
    series: [
      {
        name: $t('liveSalesDashboard.userPortrait.regionDistribution'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
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
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: regionData.value,
      },
    ],
  }
})

const fetchData = async () => {
  try {
    setLoading(true)
    const { data } = await queryUserPortrait()
    genderData.value = data.genderDistribution
    ageData.value = data.ageDistribution
    regionData.value = data.regionDistribution
  } catch (err) {
    console.error('Failed to fetch user portrait:', err)
  } finally {
    setLoading(false)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.chart-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}
</style>
