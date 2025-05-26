/**
 * 聊天消息类型
 */
export interface ChatMessage {
  id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  chatId?: string;
  isStreaming?: boolean;
}

/**
 * 聊天会话
 */
export interface ChatSession {
  id: string;
  title: string;
  type: 'chat' | 'game' | 'service' | 'pdf';
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 聊天类型
 */
export enum ChatType {
  CHAT = 'chat',
  GAME = 'game', 
  SERVICE = 'service',
  PDF = 'pdf'
}

/**
 * 流式响应状态
 */
export interface StreamStatus {
  isStreaming: boolean;
  error?: string;
  completed: boolean;
}
