<template>
  <div class="container">
    <Breadcrumb :items="['menu.announcement', 'menu.announcement.list', isEdit ? 'menu.announcement.edit' : 'menu.announcement.create']" />
    <a-card class="edit-card">
      <a-form ref="formRef" :model="formData" layout="vertical" :rules="formRules" @submit.prevent="handleSubmit">
        <a-form-item field="title" label="公告标题">
          <a-input v-model="formData.title" placeholder="请输入公告标题" maxlength="100" show-word-limit />
        </a-form-item>
        <a-form-item field="content" label="公告内容">
          <a-textarea v-model="formData.content" placeholder="请输入公告内容" :rows="10" maxlength="1000" show-word-limit />
        </a-form-item>
        <a-form-item field="status" label="发布状态">
          <a-radio-group v-model="formData.status">
            <a-radio value="draft">草稿</a-radio>
            <a-radio value="published">已发布</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              {{ isEdit ? '保存修改' : '创建公告' }}
            </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { FormInstance } from '@arco-design/web-vue/es/form/interface'

import { getAnnouncementById, createAnnouncement, updateAnnouncement } from '@/api/announcement'
import type { Announcement } from '@/api/announcement'
import useLoading from '@/hooks/loading'

const router = useRouter()
const route = useRoute()
const { loading, setLoading } = useLoading()

const formRef = ref<FormInstance>()
const isEdit = computed(() => !!route.params.id)

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 5, max: 100, message: '公告标题长度在 5 到 100 个字符之间', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '公告内容长度在 10 到 1000 个字符之间', trigger: 'blur' },
  ],
}

// 获取公告详情
const fetchAnnouncementDetail = async (id: number) => {
  try {
    setLoading(true)
    const { data } = await getAnnouncementById(id)
    formData.title = data.title
    formData.content = data.content
    formData.status = data.status
  } catch (error) {
    Message.error('获取公告详情失败')
  } finally {
    setLoading(false)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  const validateResult = await formRef.value.validate()
  if (!validateResult) return

  try {
    setLoading(true)
    if (isEdit.value) {
      await updateAnnouncement(Number(route.params.id), formData)
      Message.success('保存修改成功')
    } else {
      await createAnnouncement(formData)
      Message.success('创建公告成功')
    }
    router.push('/announcement/list')
  } catch (error) {
    Message.error(isEdit.value ? '保存修改失败' : '创建公告失败')
  } finally {
    setLoading(false)
  }
}

// 取消操作
const handleCancel = () => {
  router.push('/announcement/list')
}

// 页面挂载时，如果是编辑模式则获取公告详情
onMounted(() => {
  if (isEdit.value) {
    fetchAnnouncementDetail(Number(route.params.id))
  }
})
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.edit-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
