<template>
  <div class="promotion-create">
    <h1>创建推广活动</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  budget: 0,
  channels: [] as string[],
})

// 提交表单
const onSubmit = () => {
  console.log('提交表单', formData)
}
</script>

<style scoped>
.promotion-create {
  padding: 20px;
}
</style>
