<template>
  <div class="promotion-materials">
    <h1>推广素材库</h1>
    <a-card>
      <template #extra>
        <a-button type="primary">
          <icon-plus /> 上传素材
        </a-button>
      </template>
      <a-upload :action="'/api/upload'" list-type="picture" :file-list="fileList">
        <template #upload-button>
          <a-button type="primary">
            <icon-upload /> 选择文件
          </a-button>
        </template>
      </a-upload>
      <a-grid :columns="4" style="margin-top: 20px">
        <a-grid-item v-for="file in fileList" :key="file.uid">
          <a-card hoverable>
            <template #cover>
              <img :src="file.url" alt="" style="height: 150px; object-fit: cover" />
            </template>
            <template #actions>
              <a-button size="small" type="primary" style="margin-right: 8px">
                <icon-edit /> 编辑
              </a-button>
              <a-button size="small" status="danger">
                <icon-delete /> 删除
              </a-button>
            </template>
            <div class="material-info">
              <div class="material-name">{{ file.name }}</div>
              <div class="material-size">{{ file.size }}</div>
            </div>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconUpload, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'

interface FileItem {
  uid: string
  name: string
  size: string
  url: string
}

const fileList = ref<FileItem[]>([
  { uid: '1', name: 'banner1.jpg', size: '123KB', url: 'https://via.placeholder.com/300x200' },
  { uid: '2', name: 'poster1.png', size: '456KB', url: 'https://via.placeholder.com/300x200' },
  { uid: '3', name: 'video1.mp4', size: '789MB', url: 'https://via.placeholder.com/300x200' },
  { uid: '4', name: 'banner2.jpg', size: '234KB', url: 'https://via.placeholder.com/300x200' },
])
</script>

<style scoped>
.promotion-materials {
  padding: 20px;
}

.material-info {
  text-align: center;
  margin-top: 10px;
}

.material-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.material-size {
  font-size: 12px;
  color: #86909c;
}
</style>