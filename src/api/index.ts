// 导出所有API服务
import * as authApi from './auth'
import * as knowledgeApi from './knowledge'
import * as projectApi from './project'
import { ResultCode, getResultMessage, REDIRECT_LOGIN_CODES } from './resultCode'

export {
  authApi,
  knowledgeApi,
  projectApi,
  ResultCode,
  getResultMessage,
  REDIRECT_LOGIN_CODES
}

// 导出类型
export * from './types/index'
