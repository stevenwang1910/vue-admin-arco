<template>
  <a-card class="general-card" :title="$t('monitor.title.studioInfo')">
    <a-form v-model="formData" layout="vertical" @submit="onSubmit">
      <a-form-item :label="$t('monitor.studioInfo.label.studioTitle')" required name="studioTitle">
        <a-input v-model="formData.studioTitle" :placeholder="`admin${$t('monitor.studioInfo.placeholder.studioTitle')}`" />
      </a-form-item>
      <a-form-item :label="$t('monitor.studioInfo.label.onlineNotification')" required name="onlineNotification">
        <a-textarea v-model="formData.onlineNotification" :rows="3" />
      </a-form-item>
      <a-form-item :label="$t('monitor.studioInfo.label.studioCategory')" required name="studioCategory">
        <a-select v-model="formData.studioCategory" placeholder="请选择直播分类">
          <a-option value="game">游戏直播</a-option>
          <a-option value="entertainment">娱乐直播</a-option>
          <a-option value="education">教育直播</a-option>
          <a-option value="technology">科技直播</a-option>
          <a-option value="other">其他</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('monitor.studioInfo.label.studioTag')" name="studioTag">
        <a-select v-model="formData.studioTag" placeholder="请选择直播标签" multiple>
          <a-option value="hot">热门</a-option>
          <a-option value="new">新品</a-option>
          <a-option value="recommended">推荐</a-option>
          <a-option value="exclusive">独家</a-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-space :size="12">
      <a-button type="primary" @click="onSubmit">
        {{ $t('monitor.studioInfo.btn.fresh') }}
      </a-button>
      <a-button @click="onReset">重置</a-button>
    </a-space>
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
  studioTag: [] as string[],
})

// 提交表单
const onSubmit = () => {
  // 这里可以添加表单验证逻辑
  if (!formData.value.studioTitle) {
    Message.error('请输入直播间标题')
    return
  }
  if (!formData.value.onlineNotification) {
    Message.error('请输入在线通知内容')
    return
  }
  if (!formData.value.studioCategory) {
    Message.error('请选择直播分类')
    return
  }

  // 模拟提交请求
  Message.loading('正在更新直播间信息...')
  setTimeout(() => {
    Message.success('直播间信息更新成功')
  }, 1000)
}

// 重置表单
const onReset = () => {
  formData.value = {
    studioTitle: '',
    onlineNotification: '',
    studioCategory: '',
    studioTag: [],
  }
  Message.info('表单已重置')
}
</script>
