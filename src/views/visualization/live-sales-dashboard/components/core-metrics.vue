<template>
  <a-card class="general-card" :title="$t('liveSalesDashboard.coreMetrics.title')" :header-style="{ paddingBottom: '12px' }">
    <a-grid :cols="24" :col-gap="12" :row-gap="12">
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <MetricItem
          :title="$t('liveSalesDashboard.coreMetrics.realTimeOnline')"
          :value="coreMetrics.realTimeOnline"
          :growth="coreMetrics.growthRates.realTimeOnline"
          icon="icon-user"
          :card-style="{
            background: isDark ? 'linear-gradient(180deg, #284991 0%, #122B62 100%)' : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <MetricItem
          :title="$t('liveSalesDashboard.coreMetrics.totalViews')"
          :value="coreMetrics.totalViews"
          :growth="coreMetrics.growthRates.totalViews"
          icon="icon-eye"
          :card-style="{
            background: isDark ? 'linear-gradient(180deg, #3D492E 0%, #263827 100%)' : 'linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <MetricItem
          :title="$t('liveSalesDashboard.coreMetrics.totalSales')"
          :value="coreMetrics.totalSales"
          :growth="coreMetrics.growthRates.totalSales"
          icon="icon-dollar"
          :card-style="{
            background: isDark ? 'linear-gradient(180deg, #9A4A24 0%, #6E2E12 100%)' : 'linear-gradient(180deg, #FFF5F0 0%, #FFE8D8 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <MetricItem
          :title="$t('liveSalesDashboard.coreMetrics.totalOrders')"
          :value="coreMetrics.totalOrders"
          :growth="coreMetrics.growthRates.totalOrders"
          icon="icon-order"
          :card-style="{
            background: isDark ? 'linear-gradient(180deg, #294B94 0%, #0F275C 100%)' : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <MetricItem
          :title="$t('liveSalesDashboard.coreMetrics.avgOrderValue')"
          :value="coreMetrics.avgOrderValue"
          :growth="coreMetrics.growthRates.avgOrderValue"
          icon="icon-wallet"
          :card-style="{
            background: isDark ? 'linear-gradient(180deg, #312565 0%, #201936 100%)' : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <MetricItem
          :title="$t('liveSalesDashboard.coreMetrics.conversionRate')"
          :value="coreMetrics.conversionRate"
          :growth="coreMetrics.growthRates.conversionRate"
          icon="icon-conversion"
          :card-style="{
            background: isDark ? 'linear-gradient(180deg, #2D5B5D 0%, #153B3C 100%)' : 'linear-gradient(180deg, #F0FAF2 0%, #E6F8E8 100%)',
          }"
        />
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import useThemes from '@/hooks/themes'
import useLoading from '@/hooks/loading'
import { queryCoreMetrics } from '@/api/visualization'
import MetricItem from './metric-item.vue'

const { isDark } = useThemes()
const { loading, setLoading } = useLoading(true)
const coreMetrics = ref({
  realTimeOnline: 0,
  totalViews: 0,
  totalSales: 0,
  totalOrders: 0,
  avgOrderValue: 0,
  conversionRate: 0,
  growthRates: {
    realTimeOnline: 0,
    totalViews: 0,
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  },
})

const fetchData = async () => {
  try {
    const { data } = await queryCoreMetrics()
    coreMetrics.value = data
  } catch (err) {
    // console.error('Failed to fetch core metrics:', err)
  } finally {
    setLoading(false)
  }
}

onMounted(() => {
  fetchData()
  // 模拟实时数据更新
  setInterval(fetchData, 5000)
})
</script>
