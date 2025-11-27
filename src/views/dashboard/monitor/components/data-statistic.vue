<template>
  <a-card :bordered="false" :body-style="{ padding: '20px' }">
    <a-tabs v-model:active-tab="activeTab">
      <a-tab-pane key="liveMethod" :title="$t('monitor.tab.title.liveMethod')">
        <div class="data-statistic-content">
          <a-radio-group v-model="liveMethod" type="button">
            <a-radio :value="1">{{ $t('monitor.liveMethod.normal') }}</a-radio>
            <a-radio :value="2">{{ $t('monitor.liveMethod.flowControl') }}</a-radio>
            <a-radio :value="3">{{ $t('monitor.liveMethod.video') }}</a-radio>
            <a-radio :value="4">{{ $t('monitor.liveMethod.web') }}</a-radio>
          </a-radio-group>

          <div class="data-statistic-list-wrapper">
            <div class="data-statistic-list-header">
              <a-button type="text" @click="editCarousel">{{ $t('monitor.editCarousel') }}</a-button>
              <a-button :disabled="!canStartCarousel" @click="startCarousel">{{ $t('monitor.startCarousel') }}</a-button>
            </div>
            <div class="data-statistic-list-content">
              <DataStatisticList :live-info="liveInfo" />
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="onlinePopulation" :title="$t('monitor.tab.title.onlinePopulation')">
        <div class="online-population-content">
          <canvas ref="populationCanvasRef" class="population-chart"></canvas>
          <div class="population-statistics">
            <a-statistic title="当前在线人数" :value="currentOnline" :value-style="{ color: '#3f51b5' }" />
            <a-statistic title="今日峰值" :value="todayPeak" :value-style="{ color: '#f5222d' }" />
            <a-statistic title="平均在线" :value="averageOnline" :value-style="{ color: '#52c41a' }" />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import DataStatisticList from './data-statistic-list.vue'

const activeTab = ref('liveMethod')
const liveMethod = ref(3)
const canStartCarousel = ref(true)
const currentOnline = ref(36000)
const todayPeak = ref(52000)
const averageOnline = ref(28000)
const populationCanvasRef = ref<HTMLCanvasElement | null>(null)
let populationAnimationId: number | null = null
let populationData: number[] = []

// 直播信息数据
const liveInfo = ref({
  name: '视频直播',
  duration: '00:05:19',
  status: -1,
  cover: 'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/c788fc704d32cf3b1136c7d45afc2669.png~tplv-uwbnlip3yd-webp.webp',
})

// 更新直播信息
const updateLiveInfo = (method: number) => {
  switch (method) {
    case 1:
      liveInfo.value = {
        name: '普通直播',
        duration: '00:10:30',
        status: 0,
        cover: 'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/c788fc704d32cf3b1136c7d45afc2669.png~tplv-uwbnlip3yd-webp.webp',
      }
      break
    case 2:
      liveInfo.value = {
        name: '控流直播',
        duration: '00:08:20',
        status: 1,
        cover: 'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/c788fc704d32cf3b1136c7d45afc2669.png~tplv-uwbnlip3yd-webp.webp',
      }
      break
    case 3:
      liveInfo.value = {
        name: '视频直播',
        duration: '00:05:19',
        status: -1,
        cover: 'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/c788fc704d32cf3b1136c7d45afc2669.png~tplv-uwbnlip3yd-webp.webp',
      }
      break
    case 4:
      liveInfo.value = {
        name: '网页开播',
        duration: '00:12:45',
        status: 0,
        cover: 'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/c788fc704d32cf3b1136c7d45afc2669.png~tplv-uwbnlip3yd-webp.webp',
      }
      break
    default:
      break
  }
  Message.info(`已切换到${liveInfo.value.name}`)
}

// 监听直播方式变化
watch(liveMethod, (newValue) => {
  updateLiveInfo(newValue)
})

// 生成模拟在线人数数据
const generatePopulationData = () => {
  const data: number[] = []
  for (let i = 0; i < 100; i += 1) {
    data.push(Math.sin(i * 0.05) * 10000 + 30000 + Math.random() * 5000)
  }
  return data
}

// 绘制在线人数图表
const drawPopulationChart = () => {
  const canvas = populationCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { width, height } = canvas

  // 清空画布
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)

  // 绘制网格
  ctx.strokeStyle = '#f0f0f0'
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i += 1) {
    const y = (height / 5) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // 绘制在线人数曲线
  ctx.strokeStyle = '#3f51b5'
  ctx.lineWidth = 2
  ctx.beginPath()
  const step = width / populationData.length
  for (let i = 0; i < populationData.length; i += 1) {
    const x = i * step
    const y = height - ((populationData[i] - 20000) / 30000) * height
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // 填充曲线下方区域
  ctx.fillStyle = 'rgba(63, 81, 181, 0.1)'
  ctx.beginPath()
  ctx.moveTo(0, height)
  for (let i = 0; i < populationData.length; i += 1) {
    const x = i * step
    const y = height - ((populationData[i] - 20000) / 30000) * height
    ctx.lineTo(x, y)
  }
  ctx.lineTo(width, height)
  ctx.closePath()
  ctx.fill()
}

// 动画循环
const animatePopulationChart = () => {
  if (activeTab.value !== 'onlinePopulation') return

  // 更新在线人数数据
  populationData.shift()
  populationData.push(Math.sin(Date.now() * 0.0005) * 10000 + 30000 + Math.random() * 5000)

  // 更新当前在线人数
  currentOnline.value = Math.floor(populationData[populationData.length - 1])

  // 绘制
  drawPopulationChart()

  populationAnimationId = requestAnimationFrame(animatePopulationChart)
}

// 编辑轮播
const editCarousel = () => {
  Message.info('编辑轮播功能已触发')
  // 模拟编辑轮播逻辑
  Modal.prompt({
    title: '编辑直播名称',
    message: '请输入新的直播名称：',
    inputValue: liveInfo.value.name,
    onOk: (value) => {
      liveInfo.value.name = value
      Message.success('直播名称已更新')
    },
  })
}

// 开始轮播
const startCarousel = () => {
  if (canStartCarousel.value) {
    Message.success('轮播已开始')
    canStartCarousel.value = false
    // 这里可以添加实际的开始轮播逻辑
  } else {
    Message.info('轮播已在进行中')
  }
}

// 初始化画布
const initPopulationCanvas = () => {
  const canvas = populationCanvasRef.value
  if (!canvas) return

  // 设置画布尺寸
  const container = canvas.parentElement
  if (container) {
    canvas.width = container.clientWidth
    canvas.height = 200
  }

  // 初始化在线人数数据
  populationData = generatePopulationData()

  // 绘制初始画面
  drawPopulationChart()
}

// 窗口大小变化时重新初始化画布
const handleResize = () => {
  if (activeTab.value === 'onlinePopulation') {
    initPopulationCanvas()
  }
}

// 监听标签页切换
const handleTabChange = () => {
  if (activeTab.value === 'onlinePopulation') {
    initPopulationCanvas()
    animatePopulationChart()
  } else if (populationAnimationId) {
    cancelAnimationFrame(populationAnimationId)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  activeTab.value = 'liveMethod'
  handleTabChange()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (populationAnimationId) {
    cancelAnimationFrame(populationAnimationId)
  }
})
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

.online-population {
  &-content {
    padding: 20px 0;
  }

  &-chart {
    display: block;
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }

  &-statistics {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .arco-statistic {
      margin-bottom: 16px;
    }
  }
}
</style>
