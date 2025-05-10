// API响应基础接口
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  ok?: boolean // 可选的成功标志
}

// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  role: string
  createTime: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// 注册响应接口
export interface RegisterResponse {
  message: string
}

// 用户统计数据接口
export interface UserStats {
  articles: number
  projects: number
  comments: number
  likes: number
}
