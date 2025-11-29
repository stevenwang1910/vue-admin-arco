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
  isVertical: {
    type: Boolean,
    default: true,
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
    xAxis: props.isVertical
      ? {
          type: 'category',
          data: props.data.xAxis,
        }
      : {
          type: 'value',
        },
    yAxis: props.isVertical
      ? {
          type: 'value',
        }
      : {
          type: 'category',
          data: props.data.xAxis,
        },
    series: props.data.data.map((item) => ({
      name: item.name,
      type: 'bar',
      data: item.value,
      barWidth: '60%',
      itemStyle: {
        borderRadius: 4,
      },
    })),
  }
})
</script>

<style scoped lang="less"></style>
