import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import { ElMessage } from 'element-plus'
import { ResultCode, getResultMessage, REDIRECT_LOGIN_CODES } from './resultCode'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')

    console.log('Request URL:', config.url)
    console.log('Token exists:', !!token)
    console.log('Token value:', token)

    // 如果存在token，则添加到请求头
    if (token && config.headers) {
      // 根据后端要求调整格式
      // 尝试不使用 Bearer 前缀
      // config.headers['Authorization'] = token

      // 如果后端需要 Bearer 前缀，可以使用下面的形式
      config.headers['Authorization'] = `Bearer ${token}`

      console.log('Authorization header added:', config.headers['Authorization'])
    } else {
      console.log('No token found or headers not available')
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 根据后端API的响应结构进行调整
    // 响应结构为 { code: number, data: any, message: string }
    if (res.code !== ResultCode.SUCCESS) {
      // 使用后端返回的消息或根据响应码获取对应消息
      const errorMessage = res.message || getResultMessage(res.code) || '请求失败'
      ElMessage.error(errorMessage)

      // 处理需要重定向到登录页的响应码
      if (REDIRECT_LOGIN_CODES.includes(res.code)) {
        // 清除token和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // ElMessage.warning('登录已过期，请重新登录')
        router.push('/login')
      }

      return Promise.reject(new Error(errorMessage))
    }

    return res.data
  },
  (error) => {
    console.error('Response error:', error)

    // 处理HTTP错误状态
    if (error.response) {
      const { status, data } = error.response

      // 如果响应中包含了我们的自定义响应结构
      if (data && typeof data.code === 'number') {
        // 使用自定义的错误处理逻辑
        const errorMessage = data.message || getResultMessage(data.code) || '请求失败'
        ElMessage.error(errorMessage)

        // 处理需要重定向到登录页的响应码
        if (REDIRECT_LOGIN_CODES.includes(data.code)) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          // ElMessage.warning('登录已过期，请重新登录')
          router.push('/login')
        }
      } else {
        // 处理标准HTTP状态码
        switch (status) {
          case 401:
            ElMessage.warning('登录已过期，请重新登录')
            // 清除token并重定向到登录页
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            router.push('/login')
            break
          case 403:
            ElMessage.error('拒绝访问')
            break
          case 404:
            ElMessage.error('请求的资源不存在')
            break
          case 500:
            ElMessage.error('服务器错误')
            break
          default:
            ElMessage.error(data.message || `请求失败: ${status}`)
        }
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default service
