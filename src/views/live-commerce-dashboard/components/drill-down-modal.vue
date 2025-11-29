<template>
  <a-modal :visible="visible" :title="title" :width="800" :footer="false" @cancel="handleCancel">
    <div class="drill-down-content">
      <!-- 指标详情 -->
      <div v-if="type === 'metric'" class="metric-details">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-card title="小时趋势" :bordered="false">
              <div ref="hourlyChart" class="chart-container"></div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="TOP商品" :bordered="false">
              <a-list size="small" :data="data.details?.topProducts">
                <template #item="{ item, index }">
                  <a-list-item>
                    <a-space>
                      <span class="rank">{{ index + 1 }}</span>
                      <span class="product-name">{{ item.name }}</span>
                      <span class="product-value">{{ item.value }}</span>
                    </a-space>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="12">
            <a-card title="峰值时间" :bordered="false">
              <div class="peak-time">
                <div class="time">{{ data.details?.peakTime?.time }}</div>
                <div class="value">{{ data.details?.peakTime?.value }}</div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="对比分析" :bordered="false">
              <div class="comparison">
                <div class="comparison-item">
                  <span class="label">昨日</span>
                  <span class="value">{{ data.details?.comparison?.yesterday }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">上周</span>
                  <span class="value">{{ data.details?.comparison?.lastWeek }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">上月</span>
                  <span class="value">{{ data.details?.comparison?.lastMonth }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 商品详情 -->
      <div v-if="type === 'product'" class="product-details">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-card title="销售趋势" :bordered="false">
              <div ref="salesTrendChart" class="chart-container"></div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="基本信息" :bordered="false">
              <div class="product-info">
                <div class="info-item">
                  <span class="label">商品名称</span>
                  <span class="value">{{ data.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">销量</span>
                  <span class="value">{{ data.sales }}</span>
                </div>
                <div class="info-item">
                  <span class="label">销售额</span>
                  <span class="value">¥{{ data.revenue }}</span>
                </div>
                <div class="info-item">
                  <span class="label">单价</span>
                  <span class="value">¥{{ data.price }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="8">
            <a-card title="客户评价" :bordered="false">
              <div class="reviews">
                <div class="rating">
                  <span class="score">{{ data.details?.customerReviews?.rating }}</span>
                  <span class="stars">★★★★☆</span>
                </div>
                <div class="count">{{ data.details?.customerReviews?.count }} 条评价</div>
                <div class="positive-rate">好评率 {{ data.details?.customerReviews?.positiveRate }}%</div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="库存状态" :bordered="false">
              <div class="inventory">
                <div class="current">当前库存: {{ data.details?.inventory?.current }}</div>
                <div class="total">总库存: {{ data.details?.inventory?.total }}</div>
                <div class="status" :class="data.details?.inventory?.status">
                  {{ data.details?.inventory?.status === 'low' ? '库存不足' : '库存充足' }}
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="竞品对比" :bordered="false">
              <a-list size="small" :data="data.details?.competitors">
                <template #item="{ item }">
                  <a-list-item>
                    <a-space>
                      <span class="competitor-name">{{ item.name }}</span>
                      <span class="competitor-price">¥{{ item.price }}</span>
                      <span class="competitor-sales">销量: {{ item.sales }}</span>
                    </a-space>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 订单详情 -->
      <div v-if="type === 'order'" class="order-details">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-card title="客户信息" :bordered="false">
              <div class="customer-info">
                <div class="info-item">
                  <span class="label">姓名</span>
                  <span class="value">{{ data.details?.customerInfo?.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">电话</span>
                  <span class="value">{{ data.details?.customerInfo?.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">地址</span>
                  <span class="value">{{ data.details?.customerInfo?.address }}</span>
                </div>
                <div class="info-item">
                  <span class="label">等级</span>
                  <span class="value">{{ data.details?.customerInfo?.level }}</span>
                </div>
                <div class="info-item">
                  <span class="label">总订单</span>
                  <span class="value">{{ data.details?.customerInfo?.totalOrders }} 单</span>
                </div>
                <div class="info-item">
                  <span class="label">总金额</span>
                  <span class="value">¥{{ data.details?.customerInfo?.totalAmount }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="支付信息" :bordered="false">
              <div class="payment-info">
                <div class="info-item">
                  <span class="label">支付方式</span>
                  <span class="value">{{ data.details?.paymentInfo?.method }}</span>
                </div>
                <div class="info-item">
                  <span class="label">支付状态</span>
                  <span class="value">{{ data.details?.paymentInfo?.status }}</span>
                </div>
                <div class="info-item">
                  <span class="label">支付金额</span>
                  <span class="value">¥{{ data.details?.paymentInfo?.amount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">支付时间</span>
                  <span class="value">{{ data.details?.paymentInfo?.time }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="物流信息" :bordered="false">
              <div class="shipping-info">
                <div class="info-item">
                  <span class="label">快递公司</span>
                  <span class="value">{{ data.details?.shippingInfo?.company }}</span>
                </div>
                <div class="info-item">
                  <span class="label">运单号</span>
                  <span class="value">{{ data.details?.shippingInfo?.trackingNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="label">物流状态</span>
                  <span class="value">{{ data.details?.shippingInfo?.status }}</span>
                </div>
                <div class="info-item">
                  <span class="label">预计送达</span>
                  <span class="value">{{ data.details?.shippingInfo?.estimatedDelivery }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="24">
            <a-card title="历史订单" :bordered="false">
              <a-table :data="data.details?.history" :columns="historyColumns" size="small">
                <template #product="{ record }">
                  <span>{{ record.product }}</span>
                </template>
                <template #amount="{ record }">
                  <span>¥{{ record.amount }}</span>
                </template>
                <template #date="{ record }">
                  <span>{{ record.date }}</span>
                </template>
              </a-table>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface Props {
  visible: boolean
  data: any
  title: string
  type: 'metric' | 'product' | 'order'
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const hourlyChart = ref<HTMLElement>()
const salesTrendChart = ref<HTMLElement>()

const historyColumns = [
  { title: '商品', dataIndex: 'product', slotName: 'product' },
  { title: '金额', dataIndex: 'amount', slotName: 'amount' },
  { title: '日期', dataIndex: 'date', slotName: 'date' },
]

const handleCancel = () => {
  emit('update:visible', false)
  emit('close')
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    if (props.type === 'metric' && hourlyChart.value) {
      const chart = echarts.init(hourlyChart.value)
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 100),
            type: 'line',
            smooth: true,
            areaStyle: {},
          },
        ],
      }
      chart.setOption(option)
    }

    if (props.type === 'product' && salesTrendChart.value) {
      const chart = echarts.init(salesTrendChart.value)
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['销量', '销售额'],
        },
        xAxis: {
          type: 'category',
          data: ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'],
        },
        yAxis: [
          {
            type: 'value',
            name: '销量',
          },
          {
            type: 'value',
            name: '销售额',
          },
        ],
        series: [
          {
            name: '销量',
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 20),
            type: 'bar',
            yAxisIndex: 0,
          },
          {
            name: '销售额',
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000) + 5000),
            type: 'line',
            yAxisIndex: 1,
          },
        ],
      }
      chart.setOption(option)
    }
  })
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      initCharts()
    }
  }
)
</script>

<style scoped lang="less">
.drill-down-content {
  max-height: 600px;
  overflow-y: auto;
}

.chart-container {
  height: 200px;
}

.rank {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: white;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  font-size: 12px;
}

.product-name {
  flex: 1;
  margin-left: 8px;
}

.product-value {
  color: #1890ff;
  font-weight: bold;
}

.peak-time {
  text-align: center;
  padding: 20px;

  .time {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .value {
    font-size: 24px;
    color: #1890ff;
    font-weight: bold;
  }
}

.comparison {
  .comparison-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .label {
      color: #666;
    }

    .value {
      color: #1890ff;
      font-weight: bold;
    }
  }
}

.product-info,
.customer-info,
.payment-info,
.shipping-info {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .label {
      color: #666;
      min-width: 80px;
    }

    .value {
      color: #333;
      font-weight: bold;
      text-align: right;
    }
  }
}

.reviews {
  text-align: center;
  padding: 20px;

  .rating {
    margin-bottom: 12px;

    .score {
      font-size: 24px;
      font-weight: bold;
      color: #1890ff;
      margin-right: 8px;
    }

    .stars {
      color: #faad14;
    }
  }

  .count {
    color: #666;
    margin-bottom: 8px;
  }

  .positive-rate {
    color: #52c41a;
    font-weight: bold;
  }
}

.inventory {
  text-align: center;
  padding: 20px;

  .current,
  .total {
    margin-bottom: 8px;
    color: #666;
  }

  .status {
    font-weight: bold;

    &.low {
      color: #ff4d4f;
    }

    &.normal {
      color: #52c41a;
    }
  }
}

.competitor-name {
  flex: 1;
}

.competitor-price {
  color: #ff4d4f;
  font-weight: bold;
}

.competitor-sales {
  color: #666;
  font-size: 12px;
}
</style>
