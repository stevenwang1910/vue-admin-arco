<template>
  <div class="promotion-create">
    <h1>创建推广活动</h1>
    <a-form layout="vertical">
      <a-form-item label="活动名称">
        <a-input placeholder="请输入活动名称" />
      </a-form-item>
      <a-form-item label="活动描述">
        <a-textarea placeholder="请输入活动描述" :rows="3" />
      </a-form-item>
      <a-form-item label="活动开始时间">
        <a-date-picker show-time />
      </a-form-item>
      <a-form-item label="活动结束时间">
        <a-date-picker show-time />
      </a-form-item>
      <a-form-item label="推广渠道">
        <a-select mode="multiple" placeholder="请选择推广渠道">
          <a-option value="wechat">微信</a-option>
          <a-option value="weibo">微博</a-option>
          <a-option value="douyin">抖音</a-option>
          <a-option value="toutiao">今日头条</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="推广素材">
        <a-upload :action="'/api/upload'" list-type="picture-card">
          <template #upload-button>
            <icon-plus />
            <div style="margin-top: 8px">上传</div>
          </template>
        </a-upload>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" size="large">创建活动</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { IconPlus } from '@arco-design/web-vue/es/icon'
</script>

<style scoped>
.promotion-create {
  padding: 20px;
}
</style>