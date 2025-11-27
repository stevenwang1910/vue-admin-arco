<template>
  <div class="container">
    <Breadcrumb :items="['menu.notice', 'menu.notice.list', pageTitle]" />
    <a-card class="general-card" :title="pageTitle">
      <a-form
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        :label-col-props="{ span: 4 }"
        :wrapper-col-props="{ span: 20 }"
        label-align="left"
      >
        <a-form-item field="title" :label="$t('notice.form.title')">
          <a-input
            v-model="formModel.title"
            :placeholder="$t('notice.form.title.placeholder')"
            :disabled="isView"
            maxlength="100"
            show-word-limit
          />
        </a-form-item>
        <a-form-item field="priority" :label="$t('notice.form.priority')">
          <a-select
            v-model="formModel.priority"
            :options="priorityOptions"
            :placeholder="$t('notice.form.selectDefault')"
            :disabled="isView"
          />
        </a-form-item>
        <a-form-item field="status" :label="$t('notice.form.status')">
          <a-select v-model="formModel.status" :options="statusOptions" :placeholder="$t('notice.form.selectDefault')" :disabled="isView" />
        </a-form-item>
        <a-form-item field="content" :label="$t('notice.form.content')">
          <div v-if="isView" class="view-content" v-html="formModel.content"></div>
          <a-textarea
            v-else
            v-model="formModel.content"
            :placeholder="$t('notice.form.content.placeholder')"
            :rows="15"
            :disabled="isView"
          />
        </a-form-item>
        <a-form-item wrapper-col-props="{ offset: 4, span: 20 }">
          <a-space>
            <a-button type="primary" @click="handleSubmit" :disabled="isView || loading" :loading="loading">
              {{ $t('notice.operation.save') }}
            </a-button>
            <a-button @click="handleCancel" :disabled="loading">
              {{ $t('notice.operation.cancel') }}
            </a-button>
            <a-button v-if="isView" @click="handleEdit" :disabled="loading">
              {{ $t('notice.operation.edit') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { createNotice, updateNotice, getNoticeDetail, Notice, CreateOrUpdateNoticeParams } from '@/api/notice'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 加载状态
const loading = ref(false)

// 是否为查看模式
const isView = ref(route.query.view === 'true')

// 公告ID
const noticeId = ref(route.query.id as string)

// 页面标题
const pageTitle = computed(() => {
  if (isView.value) {
    return t('notice.page.view')
  } else if (noticeId.value) {
    return t('notice.page.edit')
  } else {
    return t('notice.page.create')
  }
})

// 表单数据
const formModel = reactive<CreateOrUpdateNoticeParams>({
  title: '',
  content: '',
  status: 'draft',
  priority: 'medium',
})

// 表单规则
const formRules = {
  title: [
    { required: true, message: t('notice.form.title.required'), trigger: 'blur' },
    { max: 100, message: t('notice.form.title.maxLength'), trigger: 'blur' },
  ],
  content: [
    { required: true, message: t('notice.form.content.required'), trigger: 'blur' },
    { min: 10, message: t('notice.form.content.minLength'), trigger: 'blur' },
  ],
}

// 优先级选项
const priorityOptions = computed<SelectOptionData[]>(() => [
  { label: t('notice.priority.low'), value: 'low' },
  { label: t('notice.priority.medium'), value: 'medium' },
  { label: t('notice.priority.high'), value: 'high' },
])

// 状态选项
const statusOptions = computed<SelectOptionData[]>(() => [
  { label: t('notice.status.draft'), value: 'draft' },
  { label: t('notice.status.published'), value: 'published' },
])

// 获取公告详情
const fetchNoticeDetail = async (id: string) => {
  try {
    loading.value = true
    const notice = await getNoticeDetail(id)
    formModel.title = notice.title
    formModel.content = notice.content
    formModel.status = notice.status
    formModel.priority = notice.priority
  } catch (error) {
    Message.error(t('notice.message.fetchFailed'))
    router.push('/notice/list')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const params: CreateOrUpdateNoticeParams = {
      ...formModel,
    }

    if (noticeId.value) {
      params.id = noticeId.value
      await updateNotice(params)
      Message.success(t('notice.message.updateSuccess'))
    } else {
      await createNotice(params)
      Message.success(t('notice.message.createSuccess'))
    }

    router.push('/notice/list')
  } catch (error) {
    console.error('提交失败:', error)
    Message.error(t('notice.message.submitFailed'))
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  router.push('/notice/list')
}

// 切换到编辑模式
const handleEdit = () => {
  isView.value = false
  router.replace({ query: { id: noticeId.value } })
}

// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    isView.value = newQuery.view === 'true'
    const id = newQuery.id as string

    if (id && id !== noticeId.value) {
      noticeId.value = id
      fetchNoticeDetail(id)
    }
  },
  { immediate: true }
)

// 初始化数据
onMounted(() => {
  if (noticeId.value) {
    fetchNoticeDetail(noticeId.value)
  }
})
</script>

<style scoped>
.container {
  padding: 16px;
}

.general-card {
  margin-bottom: 16px;
}

.view-content {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-fill-0);
  line-height: 1.8;
  min-height: 300px;
}

.view-content p {
  margin-bottom: 12px;
}

.view-content p:last-child {
  margin-bottom: 0;
}
</style>
