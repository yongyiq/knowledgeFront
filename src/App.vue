<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logout } from '@/api/auth'
import eventBus from '@/utils/eventBus'

const router = useRouter()
const route = useRoute()

// 导航菜单数据
const navItems = [
  { name: '首页', path: '/' },
  { name: '知识库', path: '/knowledge' },
  { name: '项目分享与讨论', path: '/projects' },
  { name: '竞赛专区', path: '/competition' },
  { name: '实用工具', path: '/tools' },
  { name: '师兄师姐说', path: '/experience' },
  { name: 'AI 聊天', path: '/ai-chat' }
]

// 用户登录状态
const isLoggedIn = ref(false)
const userInfo = ref({
  username: '',
  nickname: '',
  avatar: ''
})

// 处理菜单选择事件
const handleSelect = (key: string) => {
  router.push(key)
}

// 计算当前活动路径
const activeIndex = computed(() => {
  return route.path
})

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userInfo.value.username = user.username
      userInfo.value.nickname = user.nickname || user.username
      userInfo.value.avatar = user.avatar
    }
  } else {
    isLoggedIn.value = false
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 调用退出登录API
      await logout()

      // 清除本地存储的用户信息和token
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // 触发退出事件
      eventBus.emit('logout')
      isLoggedIn.value = false

      ElMessage.success('已退出登录')

      // 如果当前页面需要登录权限，跳转到首页
      if (route.meta.requiresAuth) {
        router.push('/')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      ElMessage.error('退出登录失败')
    }
  }).catch(() => {
    // 取消退出
  })
}

// 监听登录事件
const setupEventListeners = () => {
  // 监听登录事件
  eventBus.on('login', () => {
    checkLoginStatus()
  })

  // 监听退出事件
  eventBus.on('logout', () => {
    isLoggedIn.value = false
    userInfo.value = { username: '', nickname: '', avatar: '' }
  })

  // 监听用户信息更新事件
  eventBus.on('update-user', () => {
    checkLoginStatus()
  })
}

// 组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus()
  setupEventListeners()

  // 监听存储变化，处理在其他标签页登录/退出的情况
  window.addEventListener('storage', () => {
    checkLoginStatus()
  })
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  eventBus.off('login')
  eventBus.off('logout')
  eventBus.off('update-user')
})
</script>

<template>
  <div class="app-container">
    <!-- 头部导航 -->
    <el-header class="header">
      <div class="logo-container" @click="router.push('/')" style="cursor: pointer">
        <img src="/vite.svg" alt="Logo" class="logo" />
        <h1 class="site-title">知识改变世界</h1>
      </div>
      <el-menu
        mode="horizontal"
        :router="true"
        :default-active="activeIndex"
        class="nav-menu"
        @select="handleSelect"
      >
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
          {{ item.name }}
        </el-menu-item>
      </el-menu>

      <!-- 用户信息/登录按钮 -->
      <div class="user-section">
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click">
            <div class="user-info-dropdown">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="username">{{ userInfo.nickname || userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  <el-icon><User /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/settings')">
                  <el-icon><Setting /></el-icon> 账号设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" @click="router.push('/login')">登录</el-button>
          <el-button @click="router.push('/register')">注册</el-button>
        </template>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <p>© {{ new Date().getFullYear() }} yongyiq 版权所有</p>
    </el-footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.site-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
}

.nav-menu {
  border-bottom: none;
  flex: 1;
  justify-content: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
}

.footer {
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px 0;
  color: #666;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
