import { ElMessage } from 'element-plus'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// 处理token过期的响应
const handleTokenExpired = async (response: Response) => {
  // 检查HTTP状态码
  if (response.status === 401 || response.status === 403) {
    // 清除本地存储的token和用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    // 显示提示信息
    ElMessage.warning('登录已过期，请重新登录')

    // 跳转到登录页面
    router.push('/login')

    return true // 表示已处理token过期
  }

  // 检查响应体中的错误码（针对自定义错误格式）
  try {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.clone().json()
      if (data.code === 601 || data.message === 'token过期') {
        // 清除本地存储的token和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')

        // 显示提示信息
        ElMessage.warning('登录已过期，请重新登录')

        // 跳转到登录页面
        router.push('/login')

        return true // 表示已处理token过期
      }
    }
  } catch (error) {
    // 如果解析JSON失败，继续正常流程
    console.warn('Failed to parse response JSON:', error)
  }

  return false // 表示不是token过期问题
}

// 通用的fetch请求包装器，包含token过期处理
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      ...options.headers
    }
  })

  // 检查是否是token过期
  if (await handleTokenExpired(response)) {
    throw new Error('Token expired')
  }

  return response
}

export const chatAPI = {
  // 发送聊天消息
  async sendMessage(data: string | FormData, chatId?: string) {
    try {
      const url = new URL(`${BASE_URL}/ai/chat`)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetchWithAuth(url.toString(), {
        method: 'POST',
        headers: {
          ...(typeof data === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
        },
        body: data instanceof FormData ? data :
          new URLSearchParams({ prompt: data })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body?.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 获取聊天历史列表
  async getChatHistory(type: string = 'chat') {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/ai/history/${type}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const chatIds = await response.json()
      // 转换为前端需要的格式
      return chatIds.map((id: string) => ({
        id,
        title: type === 'pdf' ? `PDF对话 ${id.slice(-6)}` :
               type === 'service' ? `咨询 ${id.slice(-6)}` :
               type === 'game' ? `游戏 ${id.slice(-6)}` :
               `对话 ${id.slice(-6)}`
      }))
    } catch (error) {
      console.error('API Error:', error)
      return []
    }
  },

  // 获取特定对话的消息历史
  async getChatMessages(chatId: string, type: string = 'chat') {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/ai/history/${type}/${chatId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const messages = await response.json()
      // 添加时间戳
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString()
      }))
    } catch (error) {
      console.error('API Error:', error)
      return []
    }
  },

  // 发送游戏消息
  async sendGameMessage(prompt: string, chatId?: string) {
    try {
      const url = new URL(`${BASE_URL}/ai/game`)
      url.searchParams.append('prompt', prompt)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetchWithAuth(url.toString(), {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body?.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 发送客服消息
  async sendServiceMessage(prompt: string, chatId?: string) {
    try {
      const url = new URL(`${BASE_URL}/ai/service`)
      url.searchParams.append('prompt', prompt)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetchWithAuth(url.toString(), {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body?.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 发送 PDF 问答消息
  async sendPdfMessage(prompt: string, chatId?: string) {
    try {
      const url = new URL(`${BASE_URL}/ai/pdf/chat`)
      url.searchParams.append('prompt', prompt)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetchWithAuth(url.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(30000) // 30秒超时
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return response.body?.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 删除单个聊天记录
  async deleteChat(chatId: string, type: string = 'chat') {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/ai/delete/${type}/${chatId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Delete chat error:', error)
      throw error
    }
  },

  // 删除所有聊天记录
  async deleteAllChats(type: string = 'chat') {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/ai/delete/${type}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Delete all chats error:', error)
      throw error
    }
  }
}
