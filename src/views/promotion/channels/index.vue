<template>
  <div class="promotion-channels">
    <h1>推广渠道管理</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 渠道列表
const channels = ref([] as any[])

// 获取渠道列表
const fetchChannels = () => {
  // 模拟API请求
  setTimeout(() => {
    channels.value = [
      { id: 1, name: '微信', status: 'active', description: '微信公众号推广' },
      { id: 2, name: '微博', status: 'active', description: '微博推广' },
      { id: 3, name: '抖音', status: 'inactive', description: '抖音推广' },
      { id: 4, name: '快手', status: 'active', description: '快手推广' },
      { id: 5, name: 'B站', status: 'active', description: 'B站推广' },
    ]
  }, 1000)
}

// 页面挂载时获取数据
onMounted(() => {
  fetchChannels()
})
</script>

<style scoped>
.promotion-channels {
  padding: 20px;
}
</style>
