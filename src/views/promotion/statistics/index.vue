<template>
  <div class="promotion-statistics">
    <h1>推广数据统计</h1>
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card hoverable>
          <template #extra>
            <icon-arrow-rise />
          </template>
          <div class="stat-card">
            <div class="stat-number">12,345</div>
            <div class="stat-label">总曝光量</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <template #extra>
            <icon-eye />
          </template>
          <div class="stat-card">
            <div class="stat-number">4,567</div>
            <div class="stat-label">总点击量</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <template #extra>
            <icon-user-add />
          </template>
          <div class="stat-card">
            <div class="stat-number">789</div>
            <div class="stat-label">总转化量</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <template #extra>
            <icon-settings />
          </template>
          <div class="stat-card">
            <div class="stat-number">6.4%</div>
            <div class="stat-label">转化率</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-col :span="12">
        <a-card title="曝光趋势">
          <div style="height: 300px">
            <!-- 这里可以添加图表组件 -->
            <p>曝光趋势图表</p>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="渠道效果">
          <div style="height: 300px">
            <!-- 这里可以添加图表组件 -->
            <p>渠道效果图表</p>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRise, IconEye, IconSettings, IconUserAdd } from '@arco-design/web-vue/es/icon'
</script>

<style scoped>
.promotion-statistics {
  padding: 20px;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #165dff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #86909c;
}
</style>
