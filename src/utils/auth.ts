import { ElMessage } from 'element-plus'
import router from '@/router'

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('token')
}

/**
 * 检查登录状态，如果未登录则提示并跳转到登录页
 * @param message 提示消息
 * @param redirect 是否跳转到登录页
 * @returns 是否已登录
 */
export function checkLogin(message: string = '请先登录', redirect: boolean = true): boolean {
  if (!isLoggedIn()) {
    ElMessage.warning(message)
    if (redirect) {
      // 将当前页面路径作为参数传递给登录页，以便登录后返回
      const currentPath = router.currentRoute.value.fullPath
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
    return false
  }
  return true
}

/**
 * 获取当前登录用户信息
 * @returns 用户信息或null
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  }
  return null
}

/**
 * 获取用户token
 * @returns token或空字符串
 */
export function getToken(): string {
  return localStorage.getItem('token') || ''
}
