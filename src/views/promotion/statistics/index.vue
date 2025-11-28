<template>
  <div class="promotion-statistics">
    <h1>推广数据统计</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 统计数据
const statisticsData = reactive({
  totalViews: 0,
  totalClicks: 0,
  conversionRate: 0,
  totalCost: 0,
  roi: 0,
})

// 获取统计数据
const fetchStatisticsData = () => {
  // 模拟API请求
  setTimeout(() => {
    statisticsData.totalViews = 12500
    statisticsData.totalClicks = 850
    statisticsData.conversionRate = 6.8
    statisticsData.totalCost = 12500
    statisticsData.roi = 2.5
  }, 1000)
}

// 页面挂载时获取数据
onMounted(() => {
  fetchStatisticsData()
})
</script>

<style scoped>
.promotion-statistics {
  padding: 20px;
}
</style>
