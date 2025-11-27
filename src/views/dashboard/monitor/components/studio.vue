<template>
  <a-card class="general-card" :title="$t('monitor.title.studioPreview')">
    <template #extra>
      <a-space :size="8">
        <a-switch v-model="isLive" checked-text="直播中" unchecked-text="已暂停" />
        <icon-more />
      </a-space>
    </template>
    <div class="studio-wrapper">
      <canvas ref="canvasRef" class="studio-preview" @click="togglePlay"></canvas>
      <div class="studio-overlay" v-if="!isPlaying">
        <a-button type="primary" size="large" @click="togglePlay">
          <template #icon>
            <icon-play-circle v-if="!isPlaying" />
            <icon-pause-circle v-else />
          </template>
        </a-button>
      </div>
      <div class="studio-bar">
        <div v-if="userInfo">
          <a-space :size="12">
            <a-avatar :size="24">
              <img :src="userInfo.avatar" />
            </a-avatar>
            <a-typography-text>{{ userInfo.name }} {{ $t('monitor.studioPreview.studio') }}</a-typography-text>
          </a-space>
        </div>
        <a-space :size="8">
          <a-badge :count="onlineUsers" :number-style="{ backgroundColor: '#52c41a' }">
            <a-typography-text type="secondary">
              {{ onlineUsers.toLocaleString() }} {{ $t('monitor.studioPreview.watching') }}
            </a-typography-text>
          </a-badge>
          <a-tag color="blue">{{ bitrate }} Mbps</a-tag>
          <a-tag color="green">{{ frameRate }} FPS</a-tag>
        </a-space>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '@/store'
import { IconPlayCircle, IconPauseCircle } from '@arco-design/web-vue/es/icon'

const userInfo = useUserStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isPlaying = ref(false)
const isLive = ref(true)
const onlineUsers = ref(36000)
const bitrate = ref(6.2)
const frameRate = ref(60)
let animationId: number | null = null
let videoData: number[] = []

// 生成模拟视频数据
const generateVideoData = () => {
  const data: number[] = []
  for (let i = 0; i < 100; i += 1) {
    data.push(Math.sin(i * 0.1) * 50 + 100 + Math.random() * 20)
  }
  return data
}

// 绘制视频数据可视化
const drawVideoData = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { width, height } = canvas

  // 清空画布
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  // 绘制网格
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1
  for (let i = 0; i < 10; i += 1) {
    const y = (height / 10) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // 绘制视频数据波形
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 2
  ctx.beginPath()
  const step = width / videoData.length
  for (let i = 0; i < videoData.length; i += 1) {
    const x = i * step
    const y = height - videoData[i]
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // 绘制动态光点
  ctx.fillStyle = '#ff0000'
  const currentIndex = Math.floor(Date.now() / 50) % videoData.length
  const x = currentIndex * step
  const y = height - videoData[currentIndex]
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.fill()
}

// 动画循环
const animate = () => {
  if (!isPlaying.value || !isLive.value) return

  // 更新视频数据
  videoData.shift()
  videoData.push(Math.sin(Date.now() * 0.001) * 50 + 100 + Math.random() * 20)

  // 更新在线用户数
  onlineUsers.value += Math.floor(Math.random() * 100 - 50)
  onlineUsers.value = Math.max(10000, onlineUsers.value)

  // 更新比特率
  bitrate.value += (Math.random() - 0.5) * 0.2
  bitrate.value = Math.max(1, Math.min(10, bitrate.value))

  // 更新帧率
  frameRate.value += Math.floor(Math.random() * 10 - 5)
  frameRate.value = Math.max(30, Math.min(120, frameRate.value))

  // 绘制
  drawVideoData()

  animationId = requestAnimationFrame(animate)
}

// 切换播放状态
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value && isLive.value) {
    animate()
  }
}

// 初始化画布
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  // 设置画布尺寸
  const container = canvas.parentElement
  if (container) {
    canvas.width = container.clientWidth
    canvas.height = 200
  }

  // 初始化视频数据
  videoData = generateVideoData()

  // 绘制初始画面
  drawVideoData()
}

// 窗口大小变化时重新初始化画布
const handleResize = () => {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
  // 自动播放
  setTimeout(() => {
    togglePlay()
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped lang="less">
.studio {
  &-wrapper {
    position: relative;
  }

  &-preview {
    display: block;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    cursor: pointer;
    background-color: #000;
  }

  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;

    .arco-btn {
      pointer-events: all;
    }
  }

  &-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  }
}
</style>
