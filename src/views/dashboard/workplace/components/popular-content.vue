<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '0' }" :body-style="{ padding: '17px 20px 21px 20px' }">
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <a-link @click="handleViewMore">{{ $t('workplace.viewMore') }}</a-link>
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
        <a-table :data="renderList" :pagination="false" :bordered="false" :scroll="{ x: '100%', y: '264px' }">
          <template #columns>
            <a-table-column title="排名" data-index="key">
              <template #cell="{ record }">
                <div class="rank-cell">
                  <span class="rank-number">{{ record.key }}</span>
                  <icon-fire v-if="record.key <= 3" class="rank-icon" :style="{ color: getRankColor(record.key) }" />
                </div>
              </template>
            </a-table-column>
            <a-table-column title="内容标题" data-index="title">
              <template #cell="{ record }">
                <div class="content-cell">
                  <div class="content-type-badge" :class="`type-${type}`">
                    <icon-font v-if="type === 'text'" class="type-icon" />
                    <icon-image v-else-if="type === 'image'" class="type-icon" />
                    <icon-video v-else class="type-icon" />
                  </div>
                  <a-typography-paragraph
                    :ellipsis="{
                      rows: 1,
                    }"
                    class="content-title"
                  >
                    {{ record.title }}
                  </a-typography-paragraph>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="点击量" data-index="clickNumber">
              <template #cell="{ record }">
                <div class="click-cell">
                  <span class="click-number">{{ record.clickNumber }}</span>
                  <div class="click-bar" :style="{ width: getClickBarWidth(record.clickNumber) }"></div>
                </div>
              </template>
            </a-table-column>
            <a-table-column
              title="日涨幅"
              data-index="increases"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
            >
              <template #cell="{ record }">
                <div class="increases-cell" :class="{ 'is-positive': record.increases > 0, 'is-negative': record.increases < 0 }">
                  <span class="increases-value">{{ record.increases }}%</span>
                  <icon-caret-up v-if="record.increases > 0" class="increases-icon" />
                  <icon-caret-down v-else-if="record.increases < 0" class="increases-icon" />
                  <span v-else class="increases-icon">-</span>
                </div>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import { queryPopularList } from '@/api/dashboard'
import type { TableData } from '@arco-design/web-vue/es/table/interface'

const router = useRouter()
const type = ref('text')
const { loading, setLoading } = useLoading()
const renderList = ref<TableData[]>()
const fetchData = async (contentType: string) => {
  try {
    setLoading(true)
    const { data } = await queryPopularList({ type: contentType })
    renderList.value = data
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const getRankColor = (rank: number) => {
  const colors = {
    1: '#f53f3f',
    2: '#ff7d00',
    3: '#f7ba1e',
  }
  return colors[rank as keyof typeof colors] || '#999'
}

const getClickBarWidth = (clicks: number) => {
  const maxClicks = Math.max(...(renderList.value?.map((item) => item.clickNumber) || [clicks]))
  return `${Math.max((clicks / maxClicks) * 60, 8)}px`
}

const typeChange = (contentType: string) => {
  fetchData(contentType)
}

const handleViewMore = () => {
  router.push({ name: 'ContentManagement' })
}

fetchData('text')
</script>

<style scoped lang="less">
.general-card {
  min-height: 395px;
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

.rank-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .rank-number {
    font-weight: 600;
    font-size: 14px;
    color: var(--color-text-1);
  }

  .rank-icon {
    font-size: 16px;
  }
}

.content-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .content-type-badge {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.type-text {
      background-color: #e8f7ff;
      color: #165dff;
    }

    &.type-image {
      background-color: #fff3e0;
      color: #ff7d00;
    }

    &.type-video {
      background-color: #f3e5f5;
      color: #7816ff;
    }

    .type-icon {
      font-size: 14px;
    }
  }

  .content-title {
    margin: 0;
    font-weight: 500;
    color: var(--color-text-1);

    &:hover {
      color: #165dff;
      cursor: pointer;
    }
  }
}

.click-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .click-number {
    font-weight: 600;
    color: var(--color-text-1);
    min-width: 40px;
  }

  .click-bar {
    height: 4px;
    background: linear-gradient(90deg, #165dff 0%, #14c9c9 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
}

.increases-cell {
  display: flex;
  align-items: center;
  gap: 4px;

  &.is-positive {
    color: #00b42a;

    .increases-icon {
      color: #00b42a;
    }
  }

  &.is-negative {
    color: #f53f3f;

    .increases-icon {
      color: #f53f3f;
    }
  }

  .increases-value {
    font-weight: 600;
    min-width: 40px;
  }

  .increases-icon {
    font-size: 12px;
  }
}

.arco-card {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.arco-tabs {
  .arco-tabs-content {
    animation: fadeIn 0.3s ease;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .content-cell {
    .content-type-badge {
      width: 20px;
      height: 20px;

      .type-icon {
        font-size: 12px;
      }
    }
  }

  .click-cell {
    .click-bar {
      display: none;
    }
  }
}
</style>
