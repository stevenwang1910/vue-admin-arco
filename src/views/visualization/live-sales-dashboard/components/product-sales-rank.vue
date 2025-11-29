<template>
  <a-card class="general-card" :title="$t('liveSalesDashboard.productSalesRank.title')" :header-style="{ paddingBottom: '12px' }">
    <a-table :columns="columns" :data="productList" bordered :pagination="false" :scroll="{ y: 240 }" row-key="ranking">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'ranking'">
          <a-tag :color="getRankColor(record.ranking)">{{ record.ranking }}</a-tag>
        </template>
        <template v-else-if="column.key === 'salesVolume'">
          <a-progress :percent="(record.salesVolume / maxSalesVolume) * 100" :show-text="false" size="small" />
          <span style="margin-left: 8px">{{ record.salesVolume }}</span>
        </template>
        <template v-else-if="column.key === 'salesAmount'">
          <span>¥{{ record.salesAmount }}</span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading'
import { ref, computed, onMounted } from 'vue'
import { queryProductSalesRank } from '@/api/visualization'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { loading, setLoading } = useLoading(true)
const productList = ref([])
const maxSalesVolume = ref(0)

const columns = [
  {
    title: $t('liveSalesDashboard.productSalesRank.ranking'),
    dataIndex: 'ranking',
    key: 'ranking',
    width: 80,
  },
  {
    title: $t('liveSalesDashboard.productSalesRank.productName'),
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: $t('liveSalesDashboard.productSalesRank.salesVolume'),
    dataIndex: 'salesVolume',
    key: 'salesVolume',
    width: 200,
  },
  {
    title: $t('liveSalesDashboard.productSalesRank.salesAmount'),
    dataIndex: 'salesAmount',
    key: 'salesAmount',
    width: 150,
  },
]

const getRankColor = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return 'gray'
}

const fetchData = async () => {
  try {
    setLoading(true)
    const { data } = await queryProductSalesRank()
    productList.value = data.list
    maxSalesVolume.value = Math.max(...data.list.map((item: any) => item.salesVolume))
  } catch (err) {
    // console.error('Failed to fetch product sales rank:', err)
  } finally {
    setLoading(false)
  }
}

onMounted(() => {
  fetchData()
  // 模拟数据更新
  setInterval(fetchData, 10000)
})
</script>
