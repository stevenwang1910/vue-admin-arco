<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '0' }" :body-style="{ padding: '17px 20px 21px 20px' }">
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <router-link to="/dashboard/data-management" class="view-more-link">
          {{ $t('workplace.viewMore') }}
          <icon-arrow-right style="margin-left: 4px; font-size: 12px" />
        </router-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group v-model:model-value="type" type="button" @change="typeChange as any">
          <a-radio value="text">
            {{ $t('workplace.popularContent.text') }}
          </a-radio>
          <a-radio value="image">
            {{ $t('workplace.popularContent.image') }}
          </a-radio>
          <a-radio value="video">
            {{ $t('workplace.popularContent.video') }}
          </a-radio>
        </a-radio-group>
        <transition name="content-list-transition">
          <a-table :data="renderList" :pagination="false" :bordered="false" :scroll="{ x: '100%', y: '264px' }">
            <template #columns>
              <a-table-column title="排名" data-index="key" width="60"></a-table-column>
              <a-table-column title="内容类型" data-index="type" width="80">
                <template #cell="{ record }">
                  <a-tag :color="typeColor(record.type)">{{ typeLabel(record.type) }}</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="内容标题" data-index="title">
                <template #cell="{ record }">
                  <a-typography-paragraph
                    :ellipsis="{
                      rows: 1,
                    }"
                  >
                    {{ record.title }}
                  </a-typography-paragraph>
                </template>
              </a-table-column>
              <a-table-column title="点击量" data-index="clickNumber" width="120"></a-table-column>
              <a-table-column
                title="日涨幅"
                data-index="increases"
                :sortable="{
                  sortDirections: ['ascend', 'descend'],
                }"
                width="100"
              >
                <template #cell="{ record }">
                  <div class="increases-cell">
                    <span>{{ record.increases }}%</span>
                    <icon-caret-up v-if="record.increases > 0" style="color: #f53f3f; font-size: 8px" />
                    <icon-caret-down v-if="record.increases < 0" style="color: #52c41a; font-size: 8px" />
                  </div>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </transition>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useLoading from '@/hooks/loading'
import { queryPopularList } from '@/api/dashboard'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import { useRouter } from 'vue-router'

const router = useRouter()
const type = ref('text')
const { loading, setLoading } = useLoading()
const renderList = ref<TableData[]>()

// Get type label
const typeLabel = (contentType: string) => {
  if (contentType === 'text') return '文本'
  if (contentType === 'image') return '图片'
  if (contentType === 'video') return '视频'
  return ''
}

// Get type color
const typeColor = (contentType: string) => {
  if (contentType === 'text') return 'blue'
  if (contentType === 'image') return 'purple'
  if (contentType === 'video') return 'cyan'
  return 'gray'
}

const fetchData = async (contentType: string) => {
  try {
    setLoading(true)
    const { data } = await queryPopularList({ type: contentType })
    // Add type field to each item
    renderList.value = data.map((item) => ({ ...item, type: contentType }))
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const typeChange = (contentType: string) => {
  fetchData(contentType)
}

fetchData('text')
</script>

<style scoped lang="less">
.general-card {
  min-height: 395px;
}
.view-more-link {
  display: flex;
  align-items: center;
  color: var(--color-text-2);
  text-decoration: none;
  font-size: 14px;
  &:hover {
    color: var(--color-primary);
  }
}
:deep(.arco-table-tr) {
  height: 44px;
  .arco-typography {
    margin-bottom: 0;
  }
}
.increases-cell {
  display: flex;
  align-items: center;
  span {
    margin-right: 4px;
  }
}
.content-list-transition-enter-from,
.content-list-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.content-list-transition-enter-active,
.content-list-transition-leave-active {
  transition: all 0.3s ease;
}
</style>
