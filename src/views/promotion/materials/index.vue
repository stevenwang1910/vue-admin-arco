<template>
  <div class="promotion-materials">
    <h1>推广素材库</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 素材列表
const materials = ref([] as any[])

// 获取素材列表
const fetchMaterials = () => {
  // 模拟API请求
  setTimeout(() => {
    materials.value = [
      { id: 1, name: ' banner1', type: 'image', url: 'https://example.com/banner1.jpg', description: '首页 banner' },
      { id: 2, name: ' banner2', type: 'image', url: 'https://example.com/banner2.jpg', description: '活动 banner' },
      { id: 3, name: '视频1', type: 'video', url: 'https://example.com/video1.mp4', description: '产品介绍视频' },
      { id: 4, name: '文案1', type: 'text', content: '这是一篇推广文案', description: '微信公众号文案' },
      { id: 5, name: '海报1', type: 'image', url: 'https://example.com/poster1.jpg', description: '活动海报' },
    ]
  }, 1000)
}

// 页面挂载时获取数据
onMounted(() => {
  fetchMaterials()
})
</script>

<style scoped>
.promotion-materials {
  padding: 20px;
}
</style>
