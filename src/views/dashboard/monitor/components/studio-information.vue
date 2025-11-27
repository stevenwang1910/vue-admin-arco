<template>
  <a-card class="general-card" :title="$t('monitor.title.studioInfo')">
    <a-form :model="formData" layout="vertical">
      <a-form-item :label="$t('monitor.studioInfo.label.studioTitle')" required>
        <a-input v-model="formData.studioTitle" :placeholder="`admin${$t('monitor.studioInfo.placeholder.studioTitle')}`" />
      </a-form-item>
      <a-form-item :label="$t('monitor.studioInfo.label.onlineNotification')" required>
        <a-textarea v-model="formData.onlineNotification" />
      </a-form-item>
      <a-form-item :label="$t('monitor.studioInfo.label.studioCategory')" required>
        <a-input-search v-model="formData.studioCategory" />
      </a-form-item>
      <a-form-item :label="$t('monitor.studioInfo.label.studioTag')" required>
        <a-input-search v-model="formData.studioTag" />
      </a-form-item>
    </a-form>
    <a-button type="primary" @click="handleSubmit">{{ $t('monitor.studioInfo.btn.fresh') }}</a-button>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'

// 表单数据模型
const formData = ref({
  studioTitle: '',
  onlineNotification: '',
  studioCategory: '',
  studioTag: '',
})

// 提交表单
const handleSubmit = () => {
  Message.info('更新工作室信息功能已触发')
  // 这里可以添加实际的API调用逻辑
  console.log('表单数据:', formData.value)
}
</script>
