<template>
  <a-modal v-model:visible="visible" :title="modalTitle" :width="600" :mask-closable="false" @ok="handleSubmit" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" :rules="formRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" scroll-to-first-error>
      <a-form-item field="title" :label="$t('workplace.title')">
        <a-input v-model="formData.title" :placeholder="$t('workplace.titlePlaceholder')" :max-length="100" show-word-limit />
      </a-form-item>

      <a-form-item field="category" :label="$t('workplace.category')">
        <a-select v-model="formData.category" :placeholder="$t('workplace.categoryPlaceholder')" allow-clear>
          <a-option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="status" :label="$t('workplace.status')">
        <a-radio-group v-model="formData.status">
          <a-radio value="published">{{ $t('workplace.statusPublished') }}</a-radio>
          <a-radio value="draft">{{ $t('workplace.statusDraft') }}</a-radio>
          <a-radio value="archived">{{ $t('workplace.statusArchived') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="author" :label="$t('workplace.author')">
        <a-input v-model="formData.author" :placeholder="$t('workplace.authorPlaceholder')" :max-length="50" show-word-limit />
      </a-form-item>

      <a-form-item field="publishDate" :label="$t('workplace.publishDate')">
        <a-date-picker
          v-model="formData.publishDate"
          :placeholder="$t('workplace.publishDatePlaceholder')"
          style="width: 100%"
          format="YYYY-MM-DD"
        />
      </a-form-item>

      <a-form-item field="tags" :label="$t('workplace.tags')">
        <a-select v-model="formData.tags" :placeholder="$t('workplace.tagsPlaceholder')" multiple allow-clear allow-create>
          <a-option value="Vue3">Vue3</a-option>
          <a-option value="TypeScript">TypeScript</a-option>
          <a-option value="Arco Design">Arco Design</a-option>
          <a-option value="前端开发">前端开发</a-option>
          <a-option value="后端开发">后端开发</a-option>
          <a-option value="数据库">数据库</a-option>
          <a-option value="云服务">云服务</a-option>
          <a-option value="人工智能">人工智能</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="content" :label="$t('workplace.content')">
        <a-textarea
          v-model="formData.content"
          :placeholder="$t('workplace.contentPlaceholder')"
          :max-length="2000"
          show-word-limit
          :auto-size="{ minRows: 4, maxRows: 8 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { FormInstance } from '@arco-design/web-vue/es/form'
import dayjs from 'dayjs'
import { CreateContentData, UpdateContentData, CategoryOption } from '@/api/content-management'

interface Props {
  visible: boolean
  mode: 'create' | 'edit'
  data: any
  categories: CategoryOption[]
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: CreateContentData | UpdateContentData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<CreateContentData>({
  title: '',
  category: '',
  status: 'draft',
  author: '',
  content: '',
  tags: [],
  publishDate: ''
})

// 表单验证规则
const formRules = computed(() => ({
  title: [
    { required: true, message: t('workplace.titleRequired') },
    { min: 5, max: 100, message: t('workplace.titleLength') }
  ],
  category: [
    { required: true, message: t('workplace.categoryRequired') }
  ],
  status: [
    { required: true, message: t('workplace.statusRequired') }
  ],
  author: [
    { required: true, message: t('workplace.authorRequired') },
    { min: 2, max: 50, message: t('workplace.authorLength') }
  ],
  publishDate: [
    {
      validator: (value: any, callback: any) => {
        if (formData.status === 'published' && !value) {
          callback(t('workplace.publishDateRequired'))
        } else {
          callback()
        }
      }
    }
  ],
  content: [
    { required: true, message: t('workplace.contentRequired') },
    { min: 10, max: 2000, message: t('workplace.contentLength') }
  ],
  tags: [
    {
      validator: (value: any, callback: any) => {
        if (!value || value.length === 0) {
          callback(t('workplace.tagsRequired'))
        } else if (value.length > 10) {
          callback(t('workplace.tagsMax'))
        } else {
          callback()
        }
      }
    }
  ]
}))

// 模态框标题
const modalTitle = computed(() => {
  return props.mode === 'create' ? t('workplace.createContent') : t('workplace.editContent')
})

// 初始化表单数据
const initFormData = () => {
  if (props.mode === 'edit' && props.data) {
    Object.assign(formData, {
      title: props.data.title,
      category: props.data.category,
      status: props.data.status,
      author: props.data.author,
      content: props.data.content,
      tags: props.data.tags || [],
      publishDate: props.data.publishDate ? dayjs(props.data.publishDate) : ''
    })
  } else {
    Object.assign(formData, {
      title: '',
      category: '',
      status: 'draft',
      author: '',
      content: '',
      tags: [],
      publishDate: ''
    })
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) {
      return
    }

    const submitData = {
      ...formData,
      publishDate: formData.publishDate ? dayjs(formData.publishDate).format('YYYY-MM-DD') : undefined
    }

    emit('submit', submitData)
  } catch (error) {
    Message.error(t('workplace.formValidationError'))
  }
}

// 取消
const handleCancel = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
}

// 监听数据变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initFormData()
  }
})

watch(() => props.data, () => {
  initFormData()
}, { deep: true })
</script>

<style lang="less" scoped>
:deep(.arco-form-item-label) {
  font-weight: 500;
}

// 响应式设计
@media (max-width: 768px) {
  :deep(.arco-modal) {
    width: 95vw !important;
    max-width: 95vw;
    margin: 10px auto;
  }

  :deep(.arco-modal-body) {
    padding: 16px;
  }

  :deep(.arco-form-item) {
    margin-bottom: 16px;
  }

  :deep(.arco-form-item-label) {
    font-size: 13px;
  }

  :deep(.arco-input-wrapper) {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  :deep(.arco-modal) {
    width: 98vw !important;
    max-width: 98vw;
    margin: 5px auto;
  }

  :deep(.arco-modal-body) {
    padding: 12px;
  }

  :deep(.arco-form-item) {
    margin-bottom: 12px;
  }

  :deep(.arco-form-item-label) {
    font-size: 12px;
  }

  :deep(.arco-input-wrapper) {
    font-size: 12px;
  }

  :deep(.arco-btn) {
    padding: 6px 12px;
    font-size: 12px;
  }

  :deep(.arco-form-item-wrapper-col) {
    flex: 1;
  }

  :deep(.arco-col-12) {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
