// 导出所有API服务
import * as authApi from './auth'
import * as knowledgeApi from './knowledge'
import * as projectApi from './project'
import * as discussionApi from './discussion'
import { chatAPI } from './chat'
import { ResultCode, getResultMessage, REDIRECT_LOGIN_CODES } from './resultCode'

export {
  authApi,
  knowledgeApi,
  projectApi,
  discussionApi,
  chatAPI,
  ResultCode,
  getResultMessage,
  REDIRECT_LOGIN_CODES
}

// 导出类型
export * from './types/index'
