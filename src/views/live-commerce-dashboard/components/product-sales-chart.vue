<template>
  <div class="product-sales-chart" v-loading="loading">
    <div ref="chartRef" class="chart-container"></div>
    <div class="product-ranking" v-if="showRanking">
      <div class="ranking-header">
        <span>排名</span>
        <span>商品</span>
        <span>销量</span>
        <span>销售额</span>
      </div>
      <div class="ranking-list">
        <div class="ranking-item" v-for="(item, index) in topProducts" :key="item.name" @click="handleProductClick(item)">
          <div class="ranking-number" :class="`rank-${index + 1}`">
            {{ index + 1 }}
          </div>
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-price">¥{{ item.price }}</div>
          </div>
          <div class="sales-count">{{ item.sales.toLocaleString() }}</div>
          <div class="sales-amount">¥{{ item.revenue.toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Message } from '@arco-design/web-vue'
import { ProductSalesData } from '../types'

interface Props {
  data: ProductSalesData[]
  loading?: boolean
  showRanking?: boolean
  height?: number
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showRanking: true,
  height: 250,
  maxItems: 5,
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 计算属性
const chartData = computed(() => {
  return props.data.slice(0, props.maxItems)
})

const topProducts = computed(() => {
  return props.data.slice(0, props.maxItems)
})

// 图表配置
const chartOption = computed(() => {
  if (!chartData.value || chartData.value.length === 0) {
    return getEmptyOption()
  }

  const names = chartData.value.map((item) => item.name)
  const sales = chartData.value.map((item) => item.sales)
  const revenues = chartData.value.map((item) => item.revenue)

  return {
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any[]) => {
        const salesParam = params.find((p) => p.seriesName === '销量')
        const revenueParam = params.find((p) => p.seriesName === '销售额')
        const name = salesParam?.name || revenueParam?.name || ''

        return `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${name}</div>
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${salesParam?.color}; margin-right: 4px;"></span>
            <span>销量:</span>
            <span style="font-weight: bold; margin-left: 8px;">${salesParam?.value?.toLocaleString()}</span>
          </div>
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${revenueParam?.color}; margin-right: 4px;"></span>
            <span>销售额:</span>
            <span style="font-weight: bold; margin-left: 8px;">¥${revenueParam?.value?.toLocaleString()}</span>
          </div>
        </div>`
      },
    },
    legend: {
      show: true,
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        fontSize: 12,
        color: 'var(--color-text-2)',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        color: 'var(--color-text-3)',
        fontSize: 11,
        rotate: 30,
        formatter: (value: string) => {
          // 商品名称过长时截断
          return value.length > 8 ? value.substring(0, 8) + '...' : value
        },
      },
      axisLine: {
        lineStyle: {
          color: 'var(--color-border-2)',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '销量',
        position: 'left',
        axisLabel: {
          color: 'var(--color-text-3)',
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}k`
            }
            return value.toString()
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'var(--color-border-2)',
          },
        },
        splitLine: {
          lineStyle: {
            color: 'var(--color-border-1)',
            type: 'dashed',
          },
        },
      },
      {
        type: 'value',
        name: '销售额(元)',
        position: 'right',
        axisLabel: {
          color: 'var(--color-text-3)',
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 10000) {
              return `${(value / 10000).toFixed(0)}万`
            }
            return value.toLocaleString()
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'var(--color-border-2)',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '销量',
        type: 'bar',
        yAxisIndex: 0,
        data: sales,
        barWidth: '40%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#165dff' },
            { offset: 1, color: '#6aa1ff' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0e42d2' },
              { offset: 1, color: '#165dff' },
            ]),
          },
        },
      },
      {
        name: '销售额',
        type: 'line',
        yAxisIndex: 1,
        data: revenues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#14c9c9',
        },
        itemStyle: {
          color: '#14c9c9',
          borderWidth: 2,
          borderColor: '#fff',
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
    color: ['#165dff', '#14c9c9'],
  }
})

// 空数据配置
const getEmptyOption = () => {
  return {
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: {
        color: 'var(--color-text-3)',
        fontSize: 14,
      },
    },
    xAxis: {
      type: 'category',
      data: [],
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [],
  }
}

// 事件处理
const handleProductClick = (product: ProductSalesData) => {
  Message.info(`查看商品详情: ${product.name}`)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(chartOption.value)

  // 添加点击事件
  chartInstance.on('click', (params: any) => {
    const product = chartData.value[params.dataIndex]
    if (product) {
      handleProductClick(product)
    }
  })

  // 响应式
  window.addEventListener('resize', handleResize)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  chartInstance.setOption(chartOption.value, {
    notMerge: false,
    lazyUpdate: true,
  })
}

// 调整大小
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 销毁图表
const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
}

// 监听数据变化
watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  disposeChart()
})
</script>

<style lang="less" scoped>
.product-sales-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container {
  width: 100%;
  height: v-bind(props.height) + 'px';
}

.product-ranking {
  margin-top: 16px;
  border-top: 1px solid var(--color-border-1);
  padding-top: 16px;
}

.ranking-header {
  display: grid;
  grid-template-columns: 40px 1fr 80px 100px;
  gap: 8px;
  padding: 8px 0;
  font-size: 12px;
  color: var(--color-text-3);
  font-weight: 500;
  border-bottom: 1px solid var(--color-border-2);

  span {
    text-align: center;

    &:nth-child(2) {
      text-align: left;
    }
  }
}

.ranking-list {
  max-height: 200px;
  overflow-y: auto;
}

.ranking-item {
  display: grid;
  grid-template-columns: 40px 1fr 80px 100px;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-fill-1);
    border-radius: 4px;
  }

  &:last-child {
    border-bottom: none;
  }
}

.ranking-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;

  &.rank-1 {
    background-color: #fff7e6;
    color: #ff7d00;
  }

  &.rank-2 {
    background-color: #f6ffed;
    color: #52c41a;
  }

  &.rank-3 {
    background-color: #e6fffb;
    color: #13c2c2;
  }

  &:not(.rank-1):not(.rank-2):not(.rank-3) {
    background-color: var(--color-fill-2);
    color: var(--color-text-3);
  }
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .product-name {
    font-size: 13px;
    color: var(--color-text-1);
    font-weight: 500;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .product-price {
    font-size: 11px;
    color: var(--color-text-3);
  }
}

.sales-count,
.sales-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-text-2);
  font-weight: 500;
}

.sales-amount {
  color: rgb(var(--red-6));
  font-weight: 600;
}

// 响应式设计
@media (max-width: 768px) {
  .ranking-header,
  .ranking-item {
    grid-template-columns: 32px 1fr 60px 80px;
    gap: 6px;
  }

  .sales-count,
  .sales-amount {
    font-size: 11px;
  }
}

// 加载状态
:deep(.arco-spin) {
  width: 100%;
  height: 100%;
}
</style>
