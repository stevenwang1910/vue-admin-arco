<template>
  <a-card :bordered="false" :body-style="{ padding: '20px' }">
    <a-tabs default-active-tab="liveMethod" @change="handleTabChange">
      <a-tab-pane key="liveMethod" :title="$t('monitor.tab.title.liveMethod')" />
      <a-tab-pane key="onlinePopulation" :title="$t('monitor.tab.title.onlinePopulation')" />
    </a-tabs>
    <div class="data-statistic-content">
      <a-radio-group :default-value="3" type="button" @change="handleRadioChange">
        <a-radio :value="1">{{ $t('monitor.liveMethod.normal') }}</a-radio>
        <a-radio :value="2">{{ $t('monitor.liveMethod.flowControl') }}</a-radio>
        <a-radio :value="3">{{ $t('monitor.liveMethod.video') }}</a-radio>
        <a-radio :value="4">{{ $t('monitor.liveMethod.web') }}</a-radio>
      </a-radio-group>

      <div class="data-statistic-list-wrapper">
        <div class="data-statistic-list-header">
          <a-button type="text" @click="handleEditCarousel">{{ $t('monitor.editCarousel') }}</a-button>
          <a-button @click="handleStartCarousel">{{ $t('monitor.startCarousel') }}</a-button>
        </div>
        <div class="data-statistic-list-content">
          <DataStatisticList />
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import DataStatisticList from './data-statistic-list.vue'

// 切换标签页
const handleTabChange = (key: string) => {
  Message.info(`切换到${key === 'liveMethod' ? '直播方式' : '在线人数'}标签页`)
  // 这里可以添加实际的API调用逻辑
}

// 切换直播方式
const handleRadioChange = (value: number) => {
  const liveMethods = ['正常', '限流', '视频', '网页']
  Message.info(`切换到${liveMethods[value - 1]}直播方式`)
  // 这里可以添加实际的API调用逻辑
}

// 编辑轮播
const handleEditCarousel = () => {
  Message.info('编辑轮播功能已触发')
  // 这里可以添加实际的API调用逻辑
}

// 开始轮播
const handleStartCarousel = () => {
  Message.info('开始轮播功能已触发')
  // 这里可以添加实际的API调用逻辑
}
</script>

<style scoped lang="less">
.data-statistic {
  &-content {
    padding: 20px 0;
  }

  &-list {
    &-header {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }

    &-content {
      margin-top: 16px;
    }
  }
}
</style>
