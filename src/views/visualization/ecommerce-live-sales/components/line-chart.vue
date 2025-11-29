<template>
  <Chart :options="chartOptions" :height="height" />
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from '@/components/chart/index.vue'

const { t } = useI18n()

defineProps({
  data: {
    type: Object as PropType<{
      xAxis: string[]
      data: { name: string; value: number[] }[]
    }>,
    required: true,
  },
  height: {
    type: String,
    default: '300px',
  },
})

const chartOptions = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: props.data.data.map((item) => item.name),
      top: 0,
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
      boundaryGap: false,
      data: props.data.xAxis,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 元',
      },
    },
    series: props.data.data.map((item) => ({
      name: item.name,
      type: 'line',
      stack: 'Total',
      data: item.value,
      smooth: true,
      lineStyle: {
        width: 2,
      },
      itemStyle: {
        borderRadius: 4,
      },
    })),
  }
})
</script>

<style scoped lang="less"></style>
