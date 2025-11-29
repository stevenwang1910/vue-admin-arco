<template>
  <div class="container">
    <Breadcrumb :items="['menu.visualization', 'menu.visualization.liveSalesDashboard']" />
    <a-space direction="vertical" :size="12" fill>
      <a-space direction="vertical" :size="16" fill>
        <!-- 核心指标概览 -->
        <div class="space-unit">
          <CoreMetrics />
        </div>
        <!-- 数据可视化图表 -->
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 16 }">
              <SalesTrend />
            </a-grid-item>
            <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }">
              <ProductSalesRank />
            </a-grid-item>
          </a-grid>
        </div>
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }">
              <UserPortrait />
            </a-grid-item>
            <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }">
              <SalesByCategory />
            </a-grid-item>
          </a-grid>
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import CoreMetrics from './components/core-metrics.vue'
import SalesTrend from './components/sales-trend.vue'
import ProductSalesRank from './components/product-sales-rank.vue'
import UserPortrait from './components/user-portrait.vue'
import SalesByCategory from './components/sales-by-category.vue'
</script>

<script lang="ts">
export default {
  name: 'LiveSalesDashboard',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  margin-bottom: 20px;
}

.space-unit {
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

.title-fix {
  margin: 0 0 12px 0;
  font-size: 14;
}
:deep(.section-title) {
  margin: 0 0 12px 0;
  font-size: 14px;
}
</style>
