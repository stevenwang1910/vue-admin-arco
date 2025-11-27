<template>
  <a-card class="general-card" :title="$t('monitor.title.quickOperation')">
    <a-space direction="vertical" fill :size="10">
      <a-button long @click="handleChangeClarity">
        {{ $t('monitor.quickOperation.changeClarity') }}
        <template #icon>
          <IconTags />
        </template>
      </a-button>
      <a-button long @click="handleSwitchStream">
        {{ $t('monitor.quickOperation.switchStream') }}
        <template #icon>
          <IconSwap />
        </template>
      </a-button>
      <a-button long @click="handleRemoveClarity">
        {{ $t('monitor.quickOperation.removeClarity') }}
        <template #icon>
          <IconStop />
        </template>
      </a-button>
      <a-button long @click="handlePushFlowGasket">
        {{ $t('monitor.quickOperation.pushFlowGasket') }}
        <template #icon>
          <IconArrowRight />
        </template>
      </a-button>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'

// 切换清晰度
const handleChangeClarity = () => {
  Message.info('切换清晰度功能已触发')
  // 这里可以添加实际的API调用逻辑
}

// 切换流
const handleSwitchStream = () => {
  Message.info('切换流功能已触发')
  // 这里可以添加实际的API调用逻辑
}

// 移除清晰度
const handleRemoveClarity = () => {
  Message.info('移除清晰度功能已触发')
  // 这里可以添加实际的API调用逻辑
}

// 推流垫片
const handlePushFlowGasket = () => {
  Message.info('推流垫片功能已触发')
  // 这里可以添加实际的API调用逻辑
}
</script>
