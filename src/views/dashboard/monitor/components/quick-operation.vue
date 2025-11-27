<template>
  <a-card class="general-card" :title="$t('monitor.title.quickOperation')">
    <a-space direction="vertical" fill :size="10">
      <a-button long @click="changeClarity">
        {{ $t('monitor.quickOperation.changeClarity') }}
        <template #icon>
          <IconTags />
        </template>
      </a-button>
      <a-button long @click="switchStream">
        {{ $t('monitor.quickOperation.switchStream') }}
        <template #icon>
          <IconSwap />
        </template>
      </a-button>
      <a-button long @click="removeClarity">
        {{ $t('monitor.quickOperation.removeClarity') }}
        <template #icon>
          <IconStop />
        </template>
      </a-button>
      <a-button long @click="pushFlowGasket">
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
import { IconTags, IconSwap, IconStop, IconArrowRight } from '@arco-design/web-vue/es/icon'

// 切换清晰度
const changeClarity = () => {
  Message.info('切换清晰度功能已触发')
  // 这里可以添加实际的切换清晰度逻辑
}

// 切换流
const switchStream = () => {
  Message.info('切换流功能已触发')
  // 这里可以添加实际的切换流逻辑
}

// 移除清晰度
const removeClarity = () => {
  Message.info('移除清晰度功能已触发')
  // 这里可以添加实际的移除清晰度逻辑
}

// 推流垫片
const pushFlowGasket = () => {
  Message.info('推流垫片功能已触发')
  // 这里可以添加实际的推流垫片逻辑
}
</script>
