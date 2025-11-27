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
      <a-button type="text">
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
        <a-Input v-model="messageContent">
          <template #suffix>
            <icon-face-smile-fill />
          </template>
        </a-Input>
        <a-button type="primary" @click="handleSendMessage">{{ $t('monitor.chat.send') }}</a-button>
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { queryChatList, sendMessage, ChatRecord } from '@/api/message'
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

const handleSendMessage = async () => {
  if (!messageContent.value.trim()) return
  try {
    const { data } = await sendMessage({ content: messageContent.value })
    chatData.value.push(data)
    messageContent.value = ''
  } catch (err) {
    // you can report use errorHandler or other
  }
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
