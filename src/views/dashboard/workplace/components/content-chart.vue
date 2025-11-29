<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      :title="$t('workplace.contentData')"
    >
      <template #extra>
        <a-button type="text" @click="handleViewMore">
          {{ $t('workplace.viewMore') }}
        </a-button>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>

  <!-- 数据管理模态框 -->
  <ContentManagementModal v-model:visible="modalVisible" @refresh="handleRefresh" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { graphic } from 'echarts'
import useLoading from '@/hooks/loading'
import { queryContentData, ContentDataRecord } from '@/api/dashboard'
import useChartOption from '@/hooks/chart-option'
import { ToolTipFormatterParams } from '@/types/echarts'
import { AnyObject } from '@/types/global'
import ContentManagementModal from './content-management-modal.vue'

function graphicFactory(side: AnyObject) {
  return {
    type: 'text',
    bottom: '8',
    ...side,
    style: {
      text: '',
      textAlign: 'center',
      fill: '#4E5969',
      fontSize: 12,
    },
  }
}
const { loading, setLoading } = useLoading(true)
const xAxis = ref<string[]>([])
const chartsData = ref<number[]>([])
const graphicElements = ref([graphicFactory({ left: '2.6%' }), graphicFactory({ right: 0 })])
const { chartOption } = useChartOption(() => {
  return {
    grid: {
      left: '2.6%',
      right: '0',
      top: '10',
      bottom: '30',
    },
    xAxis: {
      type: 'category',
      offset: 2,
      data: xAxis.value,
      boundaryGap: false,
      axisLabel: {
        color: '#4E5969',
        formatter(value: number, idx: number) {
          if (idx === 0) return ''
          if (idx === xAxis.value.length - 1) return ''
          return `${value}`
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        interval: (idx: number) => {
          if (idx === 0) return false
          if (idx === xAxis.value.length - 1) return false
          return true
        },
        lineStyle: {
          color: '#E5E8EF',
        },
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#23ADFF',
          width: 2,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisLabel: {
        formatter(value: any, idx: number) {
          if (idx === 0) return value
          return `${value}k`
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#E5E8EF',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const [firstElement] = params as ToolTipFormatterParams[]
        return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>总内容量</span><span class="tooltip-value">${(
              Number(firstElement.value) * 10000
            ).toLocaleString()}</span></div>
          </div>`
      },
      className: 'echarts-tooltip-diy',
    },
    graphic: {
      elements: graphicElements.value,
    },
    series: [
      {
        data: chartsData.value,
        type: 'line',
        smooth: true,
        // symbol: 'circle',
        symbolSize: 12,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
          },
        },
        lineStyle: {
          width: 3,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(30, 231, 255, 1)',
            },
            {
              offset: 0.5,
              color: 'rgba(36, 154, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(111, 66, 251, 1)',
            },
          ]),
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(17, 126, 255, 0.16)',
            },
            {
              offset: 1,
              color: 'rgba(17, 128, 255, 0)',
            },
          ]),
        },
      },
    ],
  }
})
const modalVisible = ref(false)

const handleViewMore = () => {
  modalVisible.value = true
}

const fetchData = async () => {
  setLoading(true)
  try {
    const { data: chartData } = await queryContentData()
    chartData.forEach((el: ContentDataRecord, idx: number) => {
      xAxis.value.push(el.x)
      chartsData.value.push(el.y)
      if (idx === 0) {
        graphicElements.value[0].style.text = el.x
      }
      if (idx === chartData.length - 1) {
        graphicElements.value[1].style.text = el.x
      }
    })
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const handleRefresh = () => {
  fetchData()
}

fetchData()
</script>

<style scoped lang="less">
.general-card {
  border-radius: 4px;
  border: none;
}

// 响应式设计
@media (max-width: 768px) {
  :deep(.arco-card-header) {
    padding: 12px 16px;
  }

  :deep(.arco-card-body) {
    padding: 16px;
  }

  :deep(.arco-statistic) {
    padding: 12px;
  }

  :deep(.arco-statistic-title) {
    font-size: 12px;
  }

  :deep(.arco-statistic-value) {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  :deep(.arco-card-header) {
    padding: 10px 12px;
  }

  :deep(.arco-card-body) {
    padding: 12px;
  }

  :deep(.arco-statistic) {
    padding: 8px;
  }

  :deep(.arco-statistic-title) {
    font-size: 11px;
  }

  :deep(.arco-statistic-value) {
    font-size: 16px;
  }

  :deep(.arco-btn) {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
