// 导出所有API服务
import * as authApi from './auth'
import { ResultCode, getResultMessage, REDIRECT_LOGIN_CODES } from './resultCode'

export {
  authApi,
  ResultCode,
  getResultMessage,
  REDIRECT_LOGIN_CODES
}

// 导出类型
export * from './types'
