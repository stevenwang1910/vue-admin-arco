<template>
  <a-card class="general-card" :title="$t('monitor.title.studioPreview')">
    <template #extra>
      <icon-more />
    </template>
    <div class="studio-wrapper">
      <canvas ref="canvasRef" class="studio-preview"></canvas>
      <div class="studio-bar">
        <div v-if="userInfo">
          <a-space :size="12">
            <a-avatar :size="24">
              <img :src="userInfo.avatar" />
            </a-avatar>
            <a-typography-text>{{ userInfo.name }} {{ $t('monitor.studioPreview.studio') }}</a-typography-text>
          </a-space>
        </div>
        <a-typography-text type="secondary">{{ watchingCount }} {{ $t('monitor.studioPreview.watching') }}</a-typography-text>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store'

const userInfo = useUserStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const watchingCount = ref(36000)
let animationId: number | null = null
let timerId: number | null = null
const dataPoints: number[] = []

// 生成随机视频数据
const generateDataPoint = () => {
  return Math.random() * 100
}

// 模拟从服务器获取在线人数
const fetchWatchingCount = async () => {
  try {
    // 这里应该是实际的 API 调用
    // const { data } = await queryWatchingCount()
    // watchingCount.value = data
    // 暂时模拟数据
    watchingCount.value += Math.floor(Math.random() * 10) - 5
    if (watchingCount.value < 0) watchingCount.value = 0
  } catch (err) {
    // you can report use errorHandler or other
  }
}

// 绘制视频数据可视化
const drawVisualization = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布大小
  const width = canvas.offsetWidth
  const height = canvas.offsetHeight
  canvas.width = width
  canvas.height = height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 绘制背景
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  // 生成新的数据点
  dataPoints.push(generateDataPoint())
  if (dataPoints.length > width / 2) {
    dataPoints.shift()
  }

  // 绘制波形图
  ctx.beginPath()
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 2
  ctx.moveTo(0, height / 2)
  for (let i = 0; i < dataPoints.length; i++) {
    const x = i * 2
    const y = height / 2 + (dataPoints[i] - 50) * 2
    ctx.lineTo(x, y)
  }
  ctx.stroke()

  // 绘制频谱图
  ctx.fillStyle = '#00ff00'
  for (let i = 0; i < dataPoints.length; i++) {
    const x = i * 2
    const barHeight = dataPoints[i] * 2
    const barWidth = 1
    ctx.fillRect(x, height - barHeight, barWidth, barHeight)
  }

  // 绘制文字信息
  ctx.fillStyle = '#fff'
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('实时视频数据可视化', width / 2, 30)

  animationId = requestAnimationFrame(drawVisualization)
}

onMounted(() => {
  drawVisualization()
  // 每 5 秒更新一次在线人数
  timerId = window.setInterval(fetchWatchingCount, 5000)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  if (timerId !== null) {
    clearInterval(timerId)
  }
})
</script>

<style scoped lang="less">
.studio {
  &-preview {
    display: block;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    height: 300px;
    background-color: #000;
  }

  &-bar {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
}
</style>
