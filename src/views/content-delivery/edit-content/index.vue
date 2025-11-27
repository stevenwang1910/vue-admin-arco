<template>
  <div class="edit-content-page">
    <a-page-header title="编辑内容" :sub-title="'编辑现有内容投放'">
      <template #extra>
        <a-space>
          <a-button @click="handleSaveDraft">保存草稿</a-button>
          <a-button type="primary" @click="handleSubmitReview">提交审核</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card class="mt-4">
      <a-form layout="vertical" :model="formData">
        <a-tabs v-model:active="activeTab" type="line">
          <!-- 基本信息 -->
          <a-tab-pane key="basic" title="基本信息">
            <a-form-item label="内容标题" field="title" :rules="[{ required: true, message: '请输入内容标题' }]">
              <a-input v-model="formData.title" placeholder="请输入内容标题" />
            </a-form-item>

            <a-form-item label="内容副标题" field="subtitle">
              <a-input v-model="formData.subtitle" placeholder="请输入内容副标题" />
            </a-form-item>

            <a-form-item label="内容类型" field="type" :rules="[{ required: true, message: '请选择内容类型' }]">
              <a-select v-model="formData.type" placeholder="请选择内容类型" @change="handleTypeChange" disabled>
                <a-option value="text">文本</a-option>
                <a-option value="image">图片</a-option>
                <a-option value="video">视频</a-option>
                <a-option value="rich_media">富媒体</a-option>
              </a-select>
            </a-form-item>

            <!-- 文本内容 -->
            <a-form-item
              label="文本内容"
              field="textContent"
              :rules="[{ required: true, message: '请输入文本内容' }]"
              v-if="formData.type === 'text'"
            >
              <a-textarea v-model="formData.textContent" placeholder="请输入文本内容" :rows="10" />
            </a-form-item>

            <!-- 图片内容 -->
            <a-form-item
              label="图片内容"
              field="imageContent"
              :rules="[{ required: true, message: '请上传图片' }]"
              v-if="formData.type === 'image'"
            >
              <a-upload
                v-model="formData.imageContent"
                action="/api/upload"
                :multiple="false"
                accept="image/*"
                list-type="picture-card"
              >
                <template #upload-button>
                  <div v-if="!formData.imageContent.length">
                    <icon-plus />
                    <div style="margin-top: 8px">上传图片</div>
                  </div>
                </template>
                <template #item="{ file }">
                  <div class="image-item">
                    <a-image :src="file.url" :preview-src-list="[file.url]" />
                    <div class="image-item-actions">
                      <a-button
                        size="small"
                        status="danger"
                        @click="handleRemoveImage"
                      >
                        <template #icon>
                          <icon-delete />
                        </template>
                      </a-button>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-form-item>

            <!-- 视频内容 -->
            <a-form-item
              label="视频内容"
              field="videoContent"
              :rules="[{ required: true, message: '请上传视频' }]"
              v-if="formData.type === 'video'"
            >
              <a-upload
                v-model="formData.videoContent"
                action="/api/upload"
                :multiple="false"
                accept="video/*"
                list-type="text"
              >
                <template #upload-button>
                  <a-button type="primary">
                    <template #icon>
                      <icon-upload />
                    </template>
                    上传视频
                  </a-button>
                </template>
              </a-upload>
            </a-form-item>

            <!-- 富媒体内容 -->
            <a-form-item
              label="富媒体内容"
              field="richMediaContent"
              :rules="[{ required: true, message: '请输入富媒体内容' }]"
              v-if="formData.type === 'rich_media'"
            >
              <a-textarea v-model="formData.richMediaContent" placeholder="请输入富媒体内容（支持HTML）" :rows="10" />
            </a-form-item>

            <a-form-item label="缩略图" field="thumbnail">
              <a-upload
                v-model="formData.thumbnail"
                action="/api/upload"
                :multiple="false"
                accept="image/*"
                list-type="picture-card"
              >
                <template #upload-button>
                  <div v-if="!formData.thumbnail.length">
                    <icon-plus />
                    <div style="margin-top: 8px">上传缩略图</div>
                  </div>
                </template>
                <template #item="{ file }">
                  <div class="image-item">
                    <a-image :src="file.url" :preview-src-list="[file.url]" />
                    <div class="image-item-actions">
                      <a-button
                        size="small"
                        status="danger"
                        @click="handleRemoveThumbnail"
                      >
                        <template #icon>
                          <icon-delete />
                        </template>
                      </a-button>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-form-item>
          </a-tab-pane>

          <!-- 投放规则 -->
          <a-tab-pane key="delivery" title="投放规则">
            <a-form-item label="投放渠道" field="channels" :rules="[{ required: true, message: '请选择投放渠道' }]">
              <a-checkbox-group v-model="formData.channels">
                <a-space wrap>
                  <a-checkbox value="app">APP</a-checkbox>
                  <a-checkbox value="web">Web</a-checkbox>
                  <a-checkbox value="wechat">微信</a-checkbox>
                  <a-checkbox value="weibo">微博</a-checkbox>
                  <a-checkbox value="douyin">抖音</a-checkbox>
                  <a-checkbox value="xiaohongshu">小红书</a-checkbox>
                </a-space>
              </a-checkbox-group>
            </a-form-item>

            <a-form-item label="投放时间段" field="deliveryTime">
              <a-date-picker
                v-model="formData.deliveryTime"
                type="datetimerange"
                placeholder="请选择投放时间段"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item label="目标受众" field="audience">
              <a-collapse v-model:active-name="activeAudienceTabs" :bordered="false">
                <a-collapse-item name="age" header="年龄范围">
                  <a-space>
                    <a-input-number v-model="formData.audience.age.min" placeholder="最小年龄" :min="0" :max="100" style="width: 100px" />
                    <span>至</span>
                    <a-input-number v-model="formData.audience.age.max" placeholder="最大年龄" :min="0" :max="100" style="width: 100px" />
                  </a-space>
                </a-collapse-item>

                <a-collapse-item name="gender" header="性别">
                  <a-radio-group v-model="formData.audience.gender">
                    <a-space>
                      <a-radio value="all">全部</a-radio>
                      <a-radio value="male">男性</a-radio>
                      <a-radio value="female">女性</a-radio>
                    </a-space>
                  </a-radio-group>
                </a-collapse-item>

                <a-collapse-item name="region" header="地区">
                  <a-select v-model="formData.audience.region" placeholder="请选择地区" style="width: 100%">
                    <a-option value="beijing">北京</a-option>
                    <a-option value="shanghai">上海</a-option>
                    <a-option value="guangzhou">广州</a-option>
                    <a-option value="shenzhen">深圳</a-option>
                    <a-option value="hangzhou">杭州</a-option>
                  </a-select>
                </a-collapse-item>

                <a-collapse-item name="interests" header="兴趣标签">
                  <a-checkbox-group v-model="formData.audience.interests">
                    <a-space wrap>
                      <a-checkbox value="tech">科技</a-checkbox>
                      <a-checkbox value="finance">金融</a-checkbox>
                      <a-checkbox value="health">健康</a-checkbox>
                      <a-checkbox value="education">教育</a-checkbox>
                      <a-checkbox value="entertainment">娱乐</a-checkbox>
                      <a-checkbox value="sports">体育</a-checkbox>
                    </a-space>
                  </a-checkbox-group>
                </a-collapse-item>
              </a-collapse>
            </a-form-item>
          </a-tab-pane>

          <!-- 高级设置 -->
          <a-tab-pane key="advanced" title="高级设置">
            <a-form-item label="内容标签" field="tags">
              <a-input-tag v-model="formData.tags" placeholder="请输入标签" />
            </a-form-item>

            <a-form-item label="优先级" field="priority">
              <a-select v-model="formData.priority" placeholder="请选择优先级">
                <a-option value="low">低</a-option>
                <a-option value="medium">中</a-option>
                <a-option value="high">高</a-option>
              </a-select>
            </a-form-item>

            <a-form-item label="最大曝光量" field="maxImpressions">
              <a-input-number v-model="formData.maxImpressions" placeholder="请输入最大曝光量" :min="0" style="width: 100%" />
            </a-form-item>

            <a-form-item label="每日曝光上限" field="dailyImpressionsLimit">
              <a-input-number v-model="formData.dailyImpressionsLimit" placeholder="请输入每日曝光上限" :min="0" style="width: 100%" />
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from '@arco-design/web-vue'
import { IconPlus, IconUpload, IconDelete } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const route = useRoute()

// 活跃标签
const activeTab = ref('basic')

// 活跃受众标签
const activeAudienceTabs = ref(['age', 'gender', 'region', 'interests'])

// 表单数据
const formData = reactive({
  id: 0,
  title: '',
  subtitle: '',
  type: '',
  textContent: '',
  imageContent: [],
  videoContent: [],
  richMediaContent: '',
  thumbnail: [],
  channels: [],
  deliveryTime: [],
  audience: {
    age: {
      min: 0,
      max: 100,
    },
    gender: 'all',
    region: '',
    interests: [],
  },
  tags: [],
  priority: 'medium',
  maxImpressions: 0,
  dailyImpressionsLimit: 0,
})

// 获取内容详情
const getContentDetail = async () => {
  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const contentId = parseInt(route.params.id as string)
    // 模拟数据
    formData.id = contentId
    formData.title = '测试文本内容'
    formData.subtitle = '这是一个测试文本内容的副标题'
    formData.type = 'text'
    formData.textContent = '这是测试文本内容的具体内容...'
    formData.thumbnail = [{ url: 'https://picsum.photos/200/200' }]
    formData.channels = ['app', 'web']
    formData.deliveryTime = [new Date('2025-11-20 10:00:00'), new Date('2025-11-30 23:59:59')]
    formData.audience = {
      age: {
        min: 18,
        max: 45,
      },
      gender: 'all',
      region: 'beijing',
      interests: ['tech', 'finance'],
    }
    formData.tags = ['测试', '文本']
    formData.priority = 'medium'
    formData.maxImpressions = 100000
    formData.dailyImpressionsLimit = 10000
  } catch (error) {
    message.error('获取内容详情失败')
  }
}

// 内容类型变化
const handleTypeChange = (type: string) => {
  // 清空其他类型的内容
  if (type !== 'text') formData.textContent = ''
  if (type !== 'image') formData.imageContent = []
  if (type !== 'video') formData.videoContent = []
  if (type !== 'rich_media') formData.richMediaContent = ''
}

// 移除图片
const handleRemoveImage = () => {
  formData.imageContent = []
}

// 移除缩略图
const handleRemoveThumbnail = () => {
  formData.thumbnail = []
}

// 保存草稿
const handleSaveDraft = () => {
  message.success('草稿保存成功')
  router.push('/content-delivery/content-list')
}

// 提交审核
const handleSubmitReview = () => {
  message.success('提交审核成功')
  router.push('/content-delivery/content-list')
}

onMounted(() => {
  getContentDetail()
})
</script>

<style scoped>
.edit-content-page {
  padding: 24px;
}

.image-item {
  position: relative;
  width: 148px;
  height: 148px;
}

.image-item-actions {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-item-actions {
  opacity: 1;
}
</style>