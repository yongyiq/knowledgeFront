<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 导航菜单数据
const navItems = [
  { name: '首页', path: '/' },
  { name: '知识库', path: '/knowledge' },
  { name: '项目分享与讨论', path: '/projects' },
  { name: '华为竞赛专区', path: '/competition' },
  { name: '实用工具', path: '/tools' },
  { name: '华俱微信推文', path: '/wechat-articles' },
  { name: '师兄师姐说', path: '/experience' }
]

// 处理菜单选择事件
const handleSelect = (key: string) => {
  router.push(key)
}

// 计算当前活动路径
const activeIndex = computed(() => {
  return route.path
})
</script>

<template>
  <div class="app-container">
    <!-- 头部导航 -->
    <el-header class="header">
      <div class="logo-container" @click="router.push('/')" style="cursor: pointer">
        <img src="/vite.svg" alt="Logo" class="logo" />
        <h1 class="site-title">华为创新俱乐部</h1>
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
      <p>© {{ new Date().getFullYear() }} 华为创新俱乐部 版权所有</p>
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
