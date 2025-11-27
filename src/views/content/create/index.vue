<template>
  <div class="content-create-page">
    <a-card title="创建内容">
      <a-form layout="vertical" :model="formData" @submit="handleSubmit">
        <a-form-item label="标题" required>
          <a-input v-model="formData.title" placeholder="请输入内容标题" />
        </a-form-item>
        <a-form-item label="类型" required>
          <a-select v-model="formData.type" placeholder="请选择内容类型">
            <a-option value="text">文本</a-option>
            <a-option value="image">图片</a-option>
            <a-option value="video">视频</a-option>
            <a-option value="richText">富媒体</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="内容" required>
          <a-textarea v-model="formData.content" placeholder="请输入内容" :rows="10" />
        </a-form-item>
        <a-form-item label="渠道" required>
          <a-select v-model="formData.channel" placeholder="请选择发布渠道">
            <a-option value="wechat">微信公众号</a-option>
            <a-option value="weibo">新浪微博</a-option>
            <a-option value="app">移动应用</a-option>
            <a-option value="website">官方网站</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布时间">
          <a-date-picker v-model="formData.scheduleTime" show-time placeholder="请选择发布时间" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="$router.back()">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { createContent } from '@/api/content'

const router = useRouter()

// 表单数据
const formData = reactive({
  title: '',
  type: '',
  content: '',
  channel: '',
  scheduleTime: null,
})

// 处理表单提交
const handleSubmit = async () => {
  try {
    const response = await createContent(formData)
    if (response.code === 20000) {
      Message.success('创建内容成功')
      router.push('/content/list')
    } else {
      Message.error(response.message)
    }
  } catch (error) {
    Message.error('创建内容失败')
  }
}
</script>

<style scoped>
.content-create-page {
  padding: 20px;
}
</style>
