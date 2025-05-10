import request from './request'

// 用户登录接口
export function login(data: {
  username: string
  password: string
}) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户注册接口
export function register(data: {
  username: string
  email: string
  password: string
}) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息接口
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 修改用户信息接口
export function updateUserInfo(data: {
  username?: string
  email?: string
  avatar?: string
  bio?: string
}) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

// 修改密码接口
export function changePassword(data: {
  oldPassword: string
  newPassword: string
}) {
  return request({
    url: '/user/change-password',
    method: 'put',
    data
  })
}

// 退出登录接口
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
