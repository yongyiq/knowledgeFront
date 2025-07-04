<template>
  <div class="ai-chat" :class="{ dark: isDark }">
    <div class="chat-container">
      <div class="sidebar">
        <div class="history-header">
          <h2>聊天记录</h2>
          <div class="header-actions">
            <button class="new-chat" @click="startNewChat">
              <PlusIcon class="icon" />
              新对话
            </button>
            <button
              class="clear-all-btn"
              @click="clearAllChats"
              title="清空所有记录"
              v-if="chatHistory.length > 0"
            >
              <XMarkIcon class="icon" />
            </button>
          </div>
        </div>
        <div class="history-list">
          <div
            v-for="chat in chatHistory"
            :key="chat.id"
            class="history-item"
            :class="{ active: chat.id === currentChatId }"
          >
            <div class="history-content" @click="loadChat(chat.id)">
              <ChatBubbleLeftRightIcon class="icon" />
              <span class="title">{{ chat.title }}</span>
            </div>
            <button
              class="delete-btn"
              @click.stop="confirmDeleteChat(chat.id, chat.title)"
              title="删除对话"
            >
              <XMarkIcon class="delete-icon" />
            </button>
          </div>
        </div>
      </div>

      <div class="chat-main">
        <div class="messages" ref="messagesRef">
          <ChatMessage
            v-for="(message, index) in currentMessages"
            :key="index"
            :message="message"
            :is-stream="isStreaming && index === currentMessages.length - 1"
          />
        </div>

        <div class="input-area">
          <div v-if="selectedFiles.length > 0" class="selected-files">
            <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
              <div class="file-info">
                <DocumentIcon class="icon" />
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">({{ formatFileSize(file.size) }})</span>
              </div>
              <button class="remove-btn" @click="removeFile(index)">
                <XMarkIcon class="icon" />
              </button>
            </div>
          </div>

          <div class="input-row">
            <div class="file-upload">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                accept="image/*,audio/*,video/*"
                multiple
                class="hidden"
              >
              <button
                class="upload-btn"
                @click="triggerFileInput"
                :disabled="isStreaming"
              >
                <PaperClipIcon class="icon" />
              </button>
            </div>

            <textarea
              v-model="userInput"
              @keydown.enter.prevent="sendMessage"
              :placeholder="getPlaceholder()"
              rows="1"
              ref="inputRef"
            ></textarea>
            <button
              class="send-button"
              @click="sendMessage"
              :disabled="isStreaming || (!userInput.trim() && !selectedFiles.length)"
            >
              <PaperAirplaneIcon class="icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useDark } from '@vueuse/core'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PlusIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import ChatMessage from '@/components/ChatMessage.vue'
import { chatAPI } from '@/api/chat'
import { checkLogin } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const isDark = useDark()
const messagesRef = ref(null)
const inputRef = ref(null)
const userInput = ref('')
const isStreaming = ref(false)
const currentChatId = ref(null)
const currentMessages = ref([])
const chatHistory = ref([])
const fileInput = ref(null)
const selectedFiles = ref([])

// 自动调整输入框高度
const adjustTextareaHeight = () => {
  const textarea = inputRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  } else {
    textarea.style.height = '50px'
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 文件类型限制
const FILE_LIMITS = {
  image: {
    maxSize: 10 * 1024 * 1024,  // 单个文件 10MB
    maxFiles: 3,                 // 最多 3 个文件
    description: '图片文件'
  },
  audio: {
    maxSize: 10 * 1024 * 1024,  // 单个文件 10MB
    maxDuration: 180,           // 3分钟
    maxFiles: 3,                // 最多 3 个文件
    description: '音频文件'
  },
  video: {
    maxSize: 150 * 1024 * 1024, // 单个文件 150MB
    maxDuration: 40,            // 40秒
    maxFiles: 3,                // 最多 3 个文件
    description: '视频文件'
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 检查文件是否符合要求
const validateFile = async (file) => {
  const type = file.type.split('/')[0]
  const limit = FILE_LIMITS[type]

  if (!limit) {
    return { valid: false, error: '不支持的文件类型' }
  }

  if (file.size > limit.maxSize) {
    return { valid: false, error: `文件大小不能超过${limit.maxSize / 1024 / 1024}MB` }
  }

  if ((type === 'audio' || type === 'video') && limit.maxDuration) {
    try {
      const duration = await getMediaDuration(file)
      if (duration > limit.maxDuration) {
        return {
          valid: false,
          error: `${type === 'audio' ? '音频' : '视频'}时长不能超过${limit.maxDuration}秒`
        }
      }
    } catch (error) {
      return { valid: false, error: '无法读取媒体文件时长' }
    }
  }

  return { valid: true }
}

// 获取媒体文件时长
const getMediaDuration = (file) => {
  return new Promise((resolve, reject) => {
    const element = file.type.startsWith('audio/') ? new Audio() : document.createElement('video')
    element.preload = 'metadata'

    element.onloadedmetadata = () => {
      resolve(element.duration)
      URL.revokeObjectURL(element.src)
    }

    element.onerror = () => {
      reject(new Error('无法读取媒体文件'))
      URL.revokeObjectURL(element.src)
    }

    element.src = URL.createObjectURL(file)
  })
}

// 修改文件上传处理函数
const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  // 检查所有文件类型是否一致
  const firstFileType = files[0].type.split('/')[0]
  const hasInconsistentType = files.some(file => file.type.split('/')[0] !== firstFileType)

  if (hasInconsistentType) {
    alert('请选择相同类型的文件（图片、音频或视频）')
    event.target.value = ''
    return
  }

  // 验证所有文件
  for (const file of files) {
    const { valid, error } = await validateFile(file)
    if (!valid) {
      alert(error)
      event.target.value = ''
      selectedFiles.value = []
      return
    }
  }

  // 检查文件总大小
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const limit = FILE_LIMITS[firstFileType]
  if (totalSize > limit.maxSize * 3) { // 允许最多3个文件的总大小
    alert(`${firstFileType === 'image' ? '图片' : firstFileType === 'audio' ? '音频' : '视频'}文件总大小不能超过${(limit.maxSize * 3) / 1024 / 1024}MB`)
    event.target.value = ''
    selectedFiles.value = []
    return
  }

  selectedFiles.value = files
}

// 修改文件输入提示
const getPlaceholder = () => {
  if (selectedFiles.value.length > 0) {
    const type = selectedFiles.value[0].type.split('/')[0]
    const desc = FILE_LIMITS[type].description
    return `已选择 ${selectedFiles.value.length} 个${desc}，可继续输入消息...`
  }
  return '输入消息，可上传图片、音频或视频...'
}

// 修改发送消息函数
const sendMessage = async () => {
  // 检查登录状态
  if (!checkLogin('请先登录后再使用AI聊天功能')) {
    return
  }

  if (isStreaming.value) return
  if (!userInput.value.trim() && !selectedFiles.value.length) return

  const messageContent = userInput.value.trim()

  // 添加用户消息
  const userMessage = {
    role: 'user',
    content: messageContent,
    timestamp: new Date()
  }
  currentMessages.value.push(userMessage)

  // 清空输入
  userInput.value = ''
  adjustTextareaHeight()
  await scrollToBottom()

  // 准备发送数据
  const formData = new FormData()
  if (messageContent) {
    formData.append('prompt', messageContent)
  }
  selectedFiles.value.forEach(file => {
    formData.append('files', file)
  })

  // 添加助手消息占位
  const assistantMessage = {
    role: 'assistant',
    content: '',
    timestamp: new Date()
  }
  currentMessages.value.push(assistantMessage)
  isStreaming.value = true

  try {
    const reader = await chatAPI.sendMessage(formData, currentChatId.value)
    const decoder = new TextDecoder('utf-8')
    let accumulatedContent = ''  // 添加累积内容变量

    while (true) {
      try {
        const { value, done } = await reader.read()
        if (done) break

        // 累积新内容
        const chunk = decoder.decode(value)

        // 检查流式响应中是否包含token过期错误
        if (chunk.includes('"code":601') || chunk.includes('token过期')) {
          // 如果流式响应中包含token过期信息，停止处理并显示错误
          assistantMessage.content = '登录已过期，请重新登录后继续使用。'

          // 清除token并跳转登录页
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')

          // 显示提示并跳转
          ElMessage.warning('登录已过期，请重新登录')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
          break
        }

        accumulatedContent += chunk  // 追加新内容

        await nextTick(() => {
          // 更新消息，使用累积的内容
          const updatedMessage = {
            ...assistantMessage,
            content: accumulatedContent  // 使用累积的内容
          }
          const lastIndex = currentMessages.value.length - 1
          currentMessages.value.splice(lastIndex, 1, updatedMessage)
        })
        await scrollToBottom()
      } catch (readError) {
        console.error('读取流错误:', readError)
        break
      }
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    // 检查是否是token过期错误
    if (error.message === 'Token expired') {
      assistantMessage.content = '登录已过期，请重新登录后继续使用。'
    } else {
      assistantMessage.content = '抱歉，发生了错误，请稍后重试。'
    }
  } finally {
    isStreaming.value = false
    selectedFiles.value = [] // 清空已选文件
    fileInput.value.value = '' // 清空文件输入
    await scrollToBottom()
  }
}

// 加载特定对话
const loadChat = async (chatId) => {
  currentChatId.value = chatId
  try {
    const messages = await chatAPI.getChatMessages(chatId, 'chat')
    currentMessages.value = messages
  } catch (error) {
    console.error('加载对话消息失败:', error)
    currentMessages.value = []
  }
}

// 加载聊天历史
const loadChatHistory = async () => {
  try {
    const history = await chatAPI.getChatHistory('chat')
    chatHistory.value = history || []
    if (history && history.length > 0) {
      await loadChat(history[0].id)
    } else {
      startNewChat()
    }
  } catch (error) {
    console.error('加载聊天历史失败:', error)
    chatHistory.value = []
    startNewChat()
  }
}

// 开始新对话
const startNewChat = () => {
  const newChatId = Date.now().toString()
  currentChatId.value = newChatId
  currentMessages.value = []

  // 添加新对话到聊天历史列表
  const newChat = {
    id: newChatId,
    title: `对话 ${newChatId.slice(-6)}`
  }
  chatHistory.value = [newChat, ...chatHistory.value] // 将新对话添加到列表开头
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
  if (selectedFiles.value.length === 0) {
    fileInput.value.value = ''  // 清空文件输入
  }
}

// 确认删除聊天记录
const confirmDeleteChat = (chatId, chatTitle) => {
  if (confirm(`确定要删除对话"${chatTitle}"吗？此操作无法撤销。`)) {
    deleteChat(chatId)
  }
}

// 删除聊天记录
const deleteChat = async (chatId) => {
  try {
    // 调用后端删除API
    await chatAPI.deleteChat(chatId, 'chat')

    // 从本地聊天历史中移除
    chatHistory.value = chatHistory.value.filter(chat => chat.id !== chatId)

    // 如果删除的是当前对话，切换到新对话
    if (currentChatId.value === chatId) {
      if (chatHistory.value.length > 0) {
        // 切换到第一个可用的对话
        await loadChat(chatHistory.value[0].id)
      } else {
        // 没有其他对话，创建新对话
        startNewChat()
      }
    }

    console.log('对话删除成功')
  } catch (error) {
    console.error('删除对话失败:', error)
    alert('删除对话失败，请重试')
  }
}

// 清空所有聊天记录
const clearAllChats = async () => {
  if (confirm('确定要清空所有聊天记录吗？此操作无法撤销。')) {
    try {
      // 调用后端删除所有聊天记录API
      await chatAPI.deleteAllChats('chat')

      // 清空本地聊天历史
      chatHistory.value = []

      // 创建新对话
      startNewChat()

      console.log('所有聊天记录已清空')
    } catch (error) {
      console.error('清空聊天记录失败:', error)
      alert('清空聊天记录失败，请重试')
    }
  }
}

onMounted(() => {
  loadChatHistory()
  adjustTextareaHeight()
})
</script>

<style scoped>
.ai-chat {
  position: fixed;  /* 修改为固定定位 */
  top: 64px;       /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: var(--bg-color);
  overflow: hidden; /* 防止页面滚动 */

  .chat-container {
    flex: 1;
    display: flex;
    max-width: 1800px;
    width: 100%;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    gap: 1.5rem;
    height: 100%;    /* 确保容器占满高度 */
    overflow: hidden; /* 防止容器滚动 */
  }

  .sidebar {
    width: 300px;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    .history-header {
      flex-shrink: 0;  /* 防止头部压缩 */
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 1.25rem;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .new-chat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        background: #007CF0;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
        font-size: 0.875rem;
      }

      .new-chat:hover {
        background: #0066cc;
      }

      .new-chat .icon {
        width: 1rem;
        height: 1rem;
      }

      .clear-all-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 0.25rem;
        background: transparent;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.3s;
      }

      .clear-all-btn:hover {
        background: #ff4757;
        border-color: #ff4757;
        color: white;
      }

      .clear-all-btn .icon {
        width: 1rem;
        height: 1rem;
      }
    }

    .history-list {
      flex: 1;
      overflow-y: auto;  /* 允许历史记录滚动 */
      padding: 0 1rem 1rem;

      .history-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border-radius: 0.5rem;
        transition: background-color 0.3s;
        position: relative;
      }

      .history-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .history-item.active {
        background: rgba(0, 124, 240, 0.1);
      }

      .history-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        cursor: pointer;
        min-width: 0; /* 允许内容收缩 */
      }

      .history-item .icon {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }

      .history-item .title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.875rem;
      }

      .delete-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.25rem;
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s;
        margin-left: 0.5rem;
        flex-shrink: 0;
      }

      .history-item:hover .delete-btn {
        opacity: 1;
      }

      .delete-btn:hover {
        background: rgba(255, 71, 87, 0.1);
        color: #ff4757;
      }

      .delete-icon {
        width: 0.875rem;
        height: 0.875rem;
      }
    }
  }

  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;  /* 防止内容溢出 */

    .messages {
      flex: 1;
      overflow-y: auto;  /* 只允许消息区域滚动 */
      padding: 2rem;
    }

    .input-area {
      flex-shrink: 0;
      padding: 1.5rem 2rem;
      background: rgba(255, 255, 255, 0.98);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .selected-files {
        background: rgba(0, 0, 0, 0.02);
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid rgba(0, 0, 0, 0.1);

          .file-info {
            display: flex;
            align-items: center;
            gap: 0.25rem;

            .icon {
              width: 1rem;
              height: 1rem;
            }

            .file-name {
              font-size: 0.875rem;
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .file-size {
              font-size: 0.75rem;
              color: #666;
            }
          }

          .remove-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;

          }

          .remove-btn:hover {
            background: rgba(255, 0, 0, 0.1);

            .icon {
              width: 1rem;
              height: 1rem;
              color: #666;
            }
          }
        }
      }

      .input-row {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        background: white;
        border-radius: 1rem;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        .file-upload {
          .hidden {
            display: none;
          }

          .upload-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.5rem;
            background: rgba(0, 124, 240, 0.1);
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;

          }

          .upload-btn:hover:not(:disabled) {
            background: rgba(0, 124, 240, 0.2);
          }

          .upload-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;

            .icon {
              width: 1.25rem;
              height: 1.25rem;
              color: #007CF0;
            }
          }
        }

        textarea {
          flex: 1;
          border: none;
          outline: none;
          resize: none;
          font-size: 1rem;
          line-height: 1.5;
          min-height: 2.5rem;
          max-height: 8rem;
          overflow-y: auto;
          font-family: inherit;

        }

        textarea::placeholder {
          color: #999;
        }

        .send-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: #007CF0;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;

        }

        .send-button:hover:not(:disabled) {
          background: #0066cc;
        }

        .send-button:disabled {
          background: #ccc;
          cursor: not-allowed;

          .icon {
            width: 1.25rem;
            height: 1.25rem;
            color: white;
          }
        }
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat {
    .chat-container {
      padding: 1rem;
      gap: 1rem;
    }

    .sidebar {
      width: 250px;
    }
  }
}
</style>
