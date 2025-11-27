<template>
  <div class="promotion-channels">
    <h1>推广渠道管理</h1>
    <a-card>
      <template #extra>
        <a-button type="primary">
          <icon-plus /> 添加渠道
        </a-button>
      </template>
      <a-table :columns="columns" :data="channels" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button size="small" type="primary" style="margin-right: 8px">
              <icon-edit /> 编辑
            </a-button>
            <a-button size="small" status="danger">
              <icon-delete /> 删除
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'

interface Channel {
  id: number
  name: string
  platform: string
  status: string
  createTime: string
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '渠道名称', key: 'name', width: 150 },
  { title: '平台', key: 'platform', width: 120 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 200 },
]

const channels = ref<Channel[]>([
  { id: 1, name: '微信公众号', platform: '微信', status: '启用', createTime: '2023-01-01 10:00:00' },
  { id: 2, name: '微博官方账号', platform: '微博', status: '启用', createTime: '2023-01-02 14:30:00' },
  { id: 3, name: '抖音企业号', platform: '抖音', status: '禁用', createTime: '2023-01-03 09:15:00' },
  { id: 4, name: '今日头条', platform: '字节跳动', status: '启用', createTime: '2023-01-04 16:45:00' },
])
</script>

<style scoped>
.promotion-channels {
  padding: 20px;
}
</style>