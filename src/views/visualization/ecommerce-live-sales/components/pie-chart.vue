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
    type: Array as PropType<{ name: string; value: number }[]>,
    required: true,
  },
  height: {
    type: String,
    default: '300px',
  },
  radius: {
    type: Array as PropType<[string, string]>,
    default: ['40%', '70%'],
  },
})

const chartOptions = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: props.radius,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
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
        data: props.data,
      },
    ],
  }
})
</script>

<style scoped lang="less"></style>
