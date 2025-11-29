<template>
  <div class="realtime-orders-list">
    <div class="orders-container" ref="ordersContainer">
      <transition-group name="order-list" tag="div" class="orders-list">
        <div v-for="order in displayOrders" :key="order.id" class="order-item" :class="{ 'is-new': isNewOrder(order.id) }">
          <div class="order-avatar">
            <a-avatar :size="32" :style="{ backgroundColor: getAvatarColor(order.buyer) }">
              {{ order.buyer.charAt(0) }}
            </a-avatar>
          </div>
          <div class="order-content">
            <div class="order-header">
              <span class="buyer-name">{{ order.buyer }}</span>
              <span class="order-time">{{ formatTime(order.timestamp) }}</span>
            </div>
            <div class="order-product">{{ order.productName }}</div>
            <div class="order-details">
              <span class="order-quantity">×{{ order.quantity }}</span>
              <span class="order-price">¥{{ order.price.toLocaleString() }}</span>
              <a-tag :color="getStatusColor(order.status)" size="small">
                {{ getStatusText(order.status) }}
              </a-tag>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="orders-footer" v-if="orders.length === 0">
      <div class="empty-state">
        <icon name="icon-empty" :size="48" style="color: var(--color-text-4)" />
        <p>暂无订单数据</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { OrderData } from '../types'

interface Props {
  orders: OrderData[]
  autoScroll?: boolean
  maxDisplay?: number
  scrollInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: true,
  maxDisplay: 10,
  scrollInterval: 3000,
})

const ordersContainer = ref<HTMLElement>()
const newOrderIds = ref<Set<string>>(new Set())
const scrollTimer = ref<NodeJS.Timeout | null>(null)

// 计算属性
const displayOrders = computed(() => {
  return props.orders.slice(0, props.maxDisplay)
})

// 方法
const isNewOrder = (orderId: string) => {
  return newOrderIds.value.has(orderId)
}

const getAvatarColor = (name: string) => {
  const colors = ['#165dff', '#14c9c9', '#ff7d00', '#f53f3f', '#722ed1', '#13c2c2', '#fa8c16', '#52c41a', '#1890ff', '#eb2f96']
  const hash = name.charCodeAt(0) || 0
  return colors[hash % colors.length]
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  return date.toLocaleDateString()
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    paid: 'green',
    shipped: 'blue',
    completed: 'gray',
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
  }
  return texts[status as keyof typeof texts] || status
}

// 自动滚动
const startAutoScroll = () => {
  if (!props.autoScroll || props.orders.length <= props.maxDisplay) return

  stopAutoScroll() // 先停止之前的定时器

  scrollTimer.value = setInterval(() => {
    if (!ordersContainer.value) return

    const container = ordersContainer.value
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    const scrollTop = container.scrollTop

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // 滚动到底部，回到顶部
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // 向下滚动一个订单的高度
      const itemHeight = 72 // 订单项高度
      container.scrollTo({ top: scrollTop + itemHeight, behavior: 'smooth' })
    }
  }, props.scrollInterval)
}

const stopAutoScroll = () => {
  if (scrollTimer.value) {
    clearInterval(scrollTimer.value)
    scrollTimer.value = null
  }
}

// 处理订单更新
const handleOrdersUpdate = async () => {
  // 标记新订单
  if (props.orders.length > 0) {
    const latestOrder = props.orders[0]
    newOrderIds.value.add(latestOrder.id)

    // 3秒后移除新订单标记
    setTimeout(() => {
      newOrderIds.value.delete(latestOrder.id)
    }, 3000)
  }

  // 重新开始自动滚动
  if (props.autoScroll) {
    await nextTick()
    startAutoScroll()
  }
}

// 处理点击事件
const handleOrderClick = (order: OrderData) => {
  Message.info(`查看订单详情: ${order.id}`)
}

// 监听订单变化
watch(
  () => props.orders,
  (newOrders, oldOrders) => {
    if (newOrders.length > oldOrders.length) {
      handleOrdersUpdate()
    }
  },
  { deep: true }
)

// 监听自动滚动变化
watch(
  () => props.autoScroll,
  (newValue) => {
    if (newValue) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
  }
)

// 生命周期
onMounted(() => {
  if (props.autoScroll) {
    startAutoScroll()
  }
})

onUnmounted(() => {
  stopAutoScroll()
})
</script>

<style lang="less" scoped>
.realtime-orders-list {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.orders-container {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-fill-2);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-fill-4);
    border-radius: 2px;

    &:hover {
      background: var(--color-fill-3);
    }
  }
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: var(--color-fill-1);
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: var(--color-fill-2);
    transform: translateX(2px);
  }

  &.is-new {
    animation: highlight 3s ease-out;
    border-left: 3px solid rgb(var(--arcoblue-6));
  }
}

.order-avatar {
  flex-shrink: 0;
}

.order-content {
  flex: 1;
  min-width: 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  .buyer-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-1);
  }

  .order-time {
    font-size: 11px;
    color: var(--color-text-3);
  }
}

.order-product {
  font-size: 12px;
  color: var(--color-text-2);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-details {
  display: flex;
  align-items: center;
  gap: 8px;

  .order-quantity {
    font-size: 11px;
    color: var(--color-text-3);
  }

  .order-price {
    font-size: 13px;
    font-weight: 600;
    color: rgb(var(--red-6));
  }
}

.orders-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
}

.empty-state {
  text-align: center;
  color: var(--color-text-3);

  p {
    margin-top: 8px;
    font-size: 14px;
  }
}

// 订单列表动画
.order-list-enter-active,
.order-list-leave-active {
  transition: all 0.5s ease;
}

.order-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.order-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// 高亮动画
@keyframes highlight {
  0% {
    background-color: rgba(var(--arcoblue-6), 0.1);
    box-shadow: 0 0 10px rgba(var(--arcoblue-6), 0.3);
  }
  100% {
    background-color: var(--color-fill-1);
    box-shadow: none;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .order-item {
    padding: 10px;
    gap: 10px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .order-details {
    flex-wrap: wrap;
  }
}

// 加载状态
:deep(.arco-spin) {
  width: 100%;
  height: 100%;
}
</style>
