/**
 * API响应码常量
 */
export const ResultCode = {
  // 通用响应码
  SUCCESS: 200,
  FAIL: 201,
  PARAM_ERROR: 202,
  SERVICE_ERROR: 203,
  DATA_ERROR: 204,
  ILLEGAL_REQUEST: 205,
  REPEAT_SUBMIT: 206,
  DELETE_ERROR: 207,

  // 管理员账号相关响应码
  ADMIN_ACCOUNT_EXIST_ERROR: 301,
  ADMIN_CAPTCHA_CODE_ERROR: 302,
  ADMIN_CAPTCHA_CODE_EXPIRED: 303,
  ADMIN_CAPTCHA_CODE_NOT_FOUND: 304,
  ADMIN_LOGIN_AUTH: 305,
  ADMIN_ACCOUNT_NOT_EXIST_ERROR: 306,
  ADMIN_ACCOUNT_ERROR: 307,
  ADMIN_ACCOUNT_DISABLED_ERROR: 308,
  ADMIN_ACCESS_FORBIDDEN: 309,
  ADMIN_PASSWORD_ERROR: 310,

  // APP用户相关响应码
  APP_LOGIN_AUTH: 501,
  APP_LOGIN_PHONE_EMPTY: 502,
  APP_LOGIN_CODE_EMPTY: 503,
  APP_SEND_SMS_TOO_OFTEN: 504,
  APP_LOGIN_CODE_EXPIRED: 505,
  APP_LOGIN_CODE_ERROR: 506,
  APP_ACCOUNT_DISABLED_ERROR: 507,

  // Token相关响应码
  TOKEN_EXPIRED: 601,
  TOKEN_INVALID: 602
}

/**
 * 响应码消息映射
 */
export const ResultCodeMessage = {
  [ResultCode.SUCCESS]: "成功",
  [ResultCode.FAIL]: "失败",
  [ResultCode.PARAM_ERROR]: "参数不正确",
  [ResultCode.SERVICE_ERROR]: "服务异常",
  [ResultCode.DATA_ERROR]: "数据异常",
  [ResultCode.ILLEGAL_REQUEST]: "非法请求",
  [ResultCode.REPEAT_SUBMIT]: "重复提交",
  [ResultCode.DELETE_ERROR]: "请先删除子集",

  [ResultCode.ADMIN_ACCOUNT_EXIST_ERROR]: "账号已存在",
  [ResultCode.ADMIN_CAPTCHA_CODE_ERROR]: "验证码错误",
  [ResultCode.ADMIN_CAPTCHA_CODE_EXPIRED]: "验证码已过期",
  [ResultCode.ADMIN_CAPTCHA_CODE_NOT_FOUND]: "未输入验证码",
  [ResultCode.ADMIN_LOGIN_AUTH]: "未登录",
  [ResultCode.ADMIN_ACCOUNT_NOT_EXIST_ERROR]: "账号不存在",
  [ResultCode.ADMIN_ACCOUNT_ERROR]: "用户名或密码错误",
  [ResultCode.ADMIN_ACCOUNT_DISABLED_ERROR]: "该用户已被禁用",
  [ResultCode.ADMIN_ACCESS_FORBIDDEN]: "无访问权限",
  [ResultCode.ADMIN_PASSWORD_ERROR]: "密码错误",

  [ResultCode.APP_LOGIN_AUTH]: "未登录",
  [ResultCode.APP_LOGIN_PHONE_EMPTY]: "手机号码为空",
  [ResultCode.APP_LOGIN_CODE_EMPTY]: "验证码为空",
  [ResultCode.APP_SEND_SMS_TOO_OFTEN]: "验证法发送过于频繁",
  [ResultCode.APP_LOGIN_CODE_EXPIRED]: "验证码已过期",
  [ResultCode.APP_LOGIN_CODE_ERROR]: "验证码错误",
  [ResultCode.APP_ACCOUNT_DISABLED_ERROR]: "该用户已被禁用",

  [ResultCode.TOKEN_EXPIRED]: "token过期",
  [ResultCode.TOKEN_INVALID]: "token非法"
}

/**
 * 获取响应码对应的消息
 * @param code 响应码
 * @returns 响应消息
 */
export function getResultMessage(code: number): string {
  return ResultCodeMessage[code] || "未知错误";
}

/**
 * 需要重定向到登录页面的响应码
 */
export const REDIRECT_LOGIN_CODES = [
  ResultCode.ADMIN_LOGIN_AUTH,
  ResultCode.APP_LOGIN_AUTH,
  ResultCode.TOKEN_EXPIRED,
  ResultCode.TOKEN_INVALID
]
