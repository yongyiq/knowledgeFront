<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'
import type { LoginResponse } from '@/api/types'
import eventBus from '@/utils/eventBus'
import { hashPasswordSecure } from '@/utils/crypto'

const router = useRouter()
const route = useRoute()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)
const loginFormRef = ref()

// 登录方法
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true

      try {
        // 对密码进行哈希处理，使用更安全的PBKDF2算法
        const hashedPassword = hashPasswordSecure(loginForm.password)

        // 调用登录API，发送哈希后的密码
        const response = await login({
          username: loginForm.username,
          password: hashedPassword
        }) as LoginResponse

        // 存储token和用户信息
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify({
          id: response.userInfo.id,
          username: response.userInfo.username,
          avatar: response.userInfo.avatar || 'https://via.placeholder.com/100'
        }))

        ElMessage.success('登录成功')

        // 触发登录事件，通知App.vue更新用户状态
        eventBus.emit('login')

        // 如果有重定向地址，则跳转到该地址
        const redirectPath = route.query.redirect as string
        router.push(redirectPath || '/')

        loading.value = false
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码')
        loading.value = false
      }
    }
  })
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>登录华为俱乐部</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary">忘记密码？</el-link>
        </div>

        <el-button
          type="primary"
          :loading="loading"
          class="login-button"
          @click="handleLogin"
        >
          登录
        </el-button>

        <div class="register-link">
          还没有账号？ <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin-bottom: 10px;
  color: #333;
}

.login-header p {
  color: #666;
}

.login-form {
  margin-bottom: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  margin-bottom: 20px;
}

.register-link {
  text-align: center;
}
</style>
