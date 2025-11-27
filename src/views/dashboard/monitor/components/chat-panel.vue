<template>
  <a-card
    class="general-card chat-panel"
    :title="$t('monitor.title.chatPanel')"
    :bordered="false"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{
      height: '100%',
      paddingTop: '16px',
      display: 'flex',
      flexFlow: 'column',
    }"
  >
    <a-space :size="8">
      <a-select style="width: 86px" default-value="all">
        <a-option value="all">
          {{ $t('monitor.chat.options.all') }}
        </a-option>
      </a-select>
      <a-input-search :placeholder="$t('monitor.chat.placeholder.searchCategory')" />
      <a-button type="text" @click="downloadChatHistory">
        <icon-download />
      </a-button>
    </a-space>
    <div class="chat-panel-content">
      <a-spin :loading="loading" style="width: 100%">
        <ChatList :render-list="chatData" />
      </a-spin>
    </div>
    <div class="chat-panel-footer">
      <a-space :size="8">
        <a-Input v-model="messageContent" placeholder="请输入消息内容">
          <template #suffix>
            <icon-face-smile-fill />
          </template>
        </a-Input>
        <a-button type="primary" @click="sendMessage">发送</a-button>
        <a-button @click="fetchData">{{ $t('monitor.chat.update') }}</a-button>
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { queryChatList, ChatRecord } from '@/api/message'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import ChatList from './chat-list.vue'

const { loading, setLoading } = useLoading(true)
const chatData = ref<ChatRecord[]>([])
const messageContent = ref('')

const fetchData = async () => {
  try {
    const { data } = await queryChatList()
    chatData.value = data
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const sendMessage = () => {
  if (!messageContent.value.trim()) {
    return
  }

  // 模拟发送消息
  const newMessage: ChatRecord = {
    id: chatData.value.length + 1,
    username: '我',
    content: messageContent.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    isCollect: false,
  }

  chatData.value.push(newMessage)
  messageContent.value = ''
}

// 下载聊天记录
const downloadChatHistory = () => {
  if (chatData.value.length === 0) {
    Message.info('没有聊天记录可以下载')
    return
  }

  // 格式化聊天记录
  const chatText = chatData.value.map((message) => `${message.time} ${message.username}: ${message.content}`).join('\n')

  // 创建Blob对象
  const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' })

  // 创建下载链接
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chat_history_${new Date().toLocaleDateString('zh-CN')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  Message.success('聊天记录已下载')
}

fetchData()
</script>

<style scoped lang="less">
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  // padding: 20px;
  background-color: var(--color-bg-2);

  &-content {
    flex: 1;
    margin: 20px 0;
  }
}
</style>
