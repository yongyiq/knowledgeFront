const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const chatAPI = {
  // 发送聊天消息
  async sendMessage(data: string | FormData, chatId?: string) {
    try {
      const url = new URL(`${BASE_URL}/ai/chat`)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
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
      const response = await fetch(`${BASE_URL}/ai/history/${type}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
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
      const response = await fetch(`${BASE_URL}/ai/history/${type}/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
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

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
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

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
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

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
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
      const response = await fetch(`${BASE_URL}/ai/delete/${type}/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
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
      const response = await fetch(`${BASE_URL}/ai/delete/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
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
