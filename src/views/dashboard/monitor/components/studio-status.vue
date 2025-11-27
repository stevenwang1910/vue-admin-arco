<template>
  <a-card class="general-card" :title="$t('monitor.studioStatus.title.studioStatus')">
    <template #extra>
      <a-tag :color="statusColor">{{ statusText }}</a-tag>
    </template>
    <a-descriptions layout="horizontal" :data="dataStatus" :column="2">
      <template #label="{ label }">
        <span v-if="['mainstream', 'hotStandby', 'coldStandby'].includes(label)">
          <a-typography-text style="padding-right: 8px">
            {{ $t(`monitor.studioStatus.${label}`) }}
          </a-typography-text>
          {{ $t('monitor.studioStatus.bitRate') }}
        </span>
        <span v-else>{{ label }}</span>
      </template>
    </a-descriptions>
    <a-typography-title style="margin-bottom: 16px" :heading="6">
      {{ $t('monitor.studioStatus.title.pictureInfo') }}
    </a-typography-title>
    <a-descriptions layout="horizontal" :data="dataPicture" :column="2" />
  </a-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 实时监控数据
const mainstreamBitrate = ref(6.2)
const mainstreamFramerate = ref(60)
const hotStandbyBitrate = ref(6.0)
const hotStandbyFramerate = ref(60)
const coldStandbyBitrate = ref(5.8)
const coldStandbyFramerate = ref(59)
const lineStatus = ref('热备')
const cdnProvider = ref('KS')
const playProtocol = ref('FLV')
const pictureQuality = ref('原画')
const statusText = ref('流畅')
const statusColor = ref('green')

// 计算属性：状态数据
const dataStatus = computed(() => [
  {
    label: 'mainstream',
    value: `${mainstreamBitrate.value.toFixed(1)} Mbps`,
  },
  {
    label: t('monitor.studioStatus.frameRate'),
    value: mainstreamFramerate.value,
  },
  {
    label: 'hotStandby',
    value: `${hotStandbyBitrate.value.toFixed(1)} Mbps`,
  },
  {
    label: t('monitor.studioStatus.frameRate'),
    value: hotStandbyFramerate.value,
  },
  {
    label: 'coldStandby',
    value: `${coldStandbyBitrate.value.toFixed(1)} Mbps`,
  },
  {
    label: t('monitor.studioStatus.frameRate'),
    value: coldStandbyFramerate.value,
  },
])

// 计算属性：画面信息
const dataPicture = computed(() => [
  {
    label: t('monitor.studioStatus.line'),
    value: lineStatus.value,
  },
  {
    label: 'CDN',
    value: cdnProvider.value,
  },
  {
    label: t('monitor.studioStatus.play'),
    value: playProtocol.value,
  },
  {
    label: t('monitor.studioStatus.pictureQuality'),
    value: pictureQuality.value,
  },
])

// 更新监控数据
const updateMonitorData = () => {
  // 更新比特率
  mainstreamBitrate.value += (Math.random() - 0.5) * 0.2
  mainstreamBitrate.value = Math.max(1, Math.min(10, mainstreamBitrate.value))

  hotStandbyBitrate.value += (Math.random() - 0.5) * 0.2
  hotStandbyBitrate.value = Math.max(1, Math.min(10, hotStandbyBitrate.value))

  coldStandbyBitrate.value += (Math.random() - 0.5) * 0.2
  coldStandbyBitrate.value = Math.max(1, Math.min(10, coldStandbyBitrate.value))

  // 更新帧率
  mainstreamFramerate.value += Math.floor(Math.random() * 10 - 5)
  mainstreamFramerate.value = Math.max(30, Math.min(120, mainstreamFramerate.value))

  hotStandbyFramerate.value += Math.floor(Math.random() * 10 - 5)
  hotStandbyFramerate.value = Math.max(30, Math.min(120, hotStandbyFramerate.value))

  coldStandbyFramerate.value += Math.floor(Math.random() * 10 - 5)
  coldStandbyFramerate.value = Math.max(30, Math.min(120, coldStandbyFramerate.value))

  // 随机更新线路状态
  const lineStatuses = ['主备', '热备', '冷备']
  if (Math.random() > 0.95) {
    lineStatus.value = lineStatuses[Math.floor(Math.random() * lineStatuses.length)]
  }

  // 随机更新CDN提供商
  const cdnProviders = ['KS', 'Aliyun', 'Tencent', 'Wangsu']
  if (Math.random() > 0.98) {
    cdnProvider.value = cdnProviders[Math.floor(Math.random() * cdnProviders.length)]
  }

  // 随机更新播放协议
  const playProtocols = ['FLV', 'HLS', 'RTMP', 'WebRTC']
  if (Math.random() > 0.98) {
    playProtocol.value = playProtocols[Math.floor(Math.random() * playProtocols.length)]
  }

  // 随机更新画面质量
  const pictureQualities = ['原画', '蓝光', '超清', '高清', '标清']
  if (Math.random() > 0.95) {
    pictureQuality.value = pictureQualities[Math.floor(Math.random() * pictureQualities.length)]
  }

  // 更新状态文本和颜色
  const averageBitrate = (mainstreamBitrate.value + hotStandbyBitrate.value + coldStandbyBitrate.value) / 3
  const averageFramerate = (mainstreamFramerate.value + hotStandbyFramerate.value + coldStandbyFramerate.value) / 3

  if (averageBitrate > 5 && averageFramerate > 50) {
    statusText.value = '流畅'
    statusColor.value = 'green'
  } else if (averageBitrate > 3 && averageFramerate > 30) {
    statusText.value = '一般'
    statusColor.value = 'orange'
  } else {
    statusText.value = '卡顿'
    statusColor.value = 'red'
  }
}

let updateInterval: number | null = null

onMounted(() => {
  // 每2秒更新一次监控数据
  updateInterval = window.setInterval(updateMonitorData, 2000)
})

onUnmounted(() => {
  if (updateInterval) {
    window.clearInterval(updateInterval)
  }
})
</script>

<style scoped lang="less">
:deep(.arco-descriptions-item-label) {
  padding-right: 6px;
}
</style>
