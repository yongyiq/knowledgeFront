<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserInfo, logout } from '@/api/auth'
import type { UserInfo as UserInfoType, UserStats } from '@/api/types'
import eventBus from '@/utils/eventBus'

const router = useRouter()

// 用户信息
const userInfo = ref({
  id: 1,
  username: 'demo_user',
  email: 'demo@example.com',
  avatar: 'https://via.placeholder.com/150',
  bio: '华为技术爱好者，专注于前端开发和人工智能应用。',
  role: 'user',
  joinDate: '2023-01-15'
})

// 用户统计数据
const userStats = ref({
  articles: 5,
  projects: 2,
  comments: 12,
  likes: 45
})

// 用户活动
const userActivities = ref([
  {
    id: 1,
    type: 'article',
    title: '发布了文章《Vue3 组合式API最佳实践》',
    date: '2023-12-10'
  },
  {
    id: 2,
    type: 'comment',
    title: '评论了文章《华为云服务器部署指南》',
    date: '2023-12-08'
  },
  {
    id: 3,
    type: 'project',
    title: '分享了项目《智能家居控制系统》',
    date: '2023-12-05'
  },
  {
    id: 4,
    type: 'like',
    title: '点赞了文章《5G技术发展与应用场景分析》',
    date: '2023-12-01'
  }
])

// 用户收藏
const userFavorites = ref([
  {
    id: 1,
    type: 'article',
    title: 'HarmonyOS开发入门指南',
    date: '2023-12-05'
  },
  {
    id: 2,
    type: 'project',
    title: '校园导航AR应用',
    date: '2023-11-15'
  },
  {
    id: 3,
    type: 'article',
    title: '华为开发者大会2023亮点解读',
    date: '2023-11-15'
  }
])

// 当前活动标签
const activeTab = ref('activities')

// 加载用户数据
const fetchUserData = async () => {
  try {
    // 调用API获取用户信息
    const userData = await getUserInfo() as UserInfoType

    // 更新用户信息
    userInfo.value = {
      ...userData,
      joinDate: new Date(userData.createTime).toLocaleDateString()
    }

    // 获取用户统计数据
    // 这里可以添加获取用户统计数据的API调用
    // const statsData = await getUserStats() as UserStats
    // userStats.value = statsData

    // 获取用户活动和收藏
    // 这里可以添加获取用户活动和收藏的API调用
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    ElMessage.error('获取用户数据失败')
  }
}

onMounted(() => {
  // 检查是否已登录
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
  } else {
    // 从本地存储获取用户信息
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userInfo.value.username = user.username
      userInfo.value.avatar = user.avatar

      // 获取完整的用户数据
      fetchUserData()
    }
  }
})

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

      ElMessage.success('已退出登录')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      ElMessage.error('退出登录失败')
    }
  }).catch(() => {
    // 取消退出
  })
}

// 跳转到设置页面
const goToSettings = () => {
  router.push('/settings')
}
</script>

<template>
  <div class="profile-container container">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar-container">
          <el-avatar :size="100" :src="userInfo.avatar" />
        </div>
        <div class="user-details">
          <h1>{{ userInfo.username }}</h1>
          <p class="user-bio">{{ userInfo.bio }}</p>
          <p class="user-meta">
            <el-tag size="small">{{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}</el-tag>
            <span class="join-date">加入时间: {{ userInfo.joinDate }}</span>
          </p>
        </div>
      </div>
      <div class="user-actions">
        <el-button @click="goToSettings">编辑资料</el-button>
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
      </div>
    </div>

    <div class="user-stats">
      <div class="stat-item">
        <h3>{{ userStats.articles }}</h3>
        <p>文章</p>
      </div>
      <div class="stat-item">
        <h3>{{ userStats.projects }}</h3>
        <p>项目</p>
      </div>
      <div class="stat-item">
        <h3>{{ userStats.comments }}</h3>
        <p>评论</p>
      </div>
      <div class="stat-item">
        <h3>{{ userStats.likes }}</h3>
        <p>获赞</p>
      </div>
    </div>

    <div class="profile-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="最近活动" name="activities">
          <div class="activities-list">
            <el-timeline>
              <el-timeline-item
                v-for="activity in userActivities"
                :key="activity.id"
                :timestamp="activity.date"
                placement="top"
              >
                <el-card>
                  <div class="activity-content">
                    <el-icon v-if="activity.type === 'article'"><Document /></el-icon>
                    <el-icon v-else-if="activity.type === 'comment'"><ChatDotRound /></el-icon>
                    <el-icon v-else-if="activity.type === 'project'"><Folder /></el-icon>
                    <el-icon v-else-if="activity.type === 'like'"><Star /></el-icon>
                    <span>{{ activity.title }}</span>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的收藏" name="favorites">
          <div class="favorites-list">
            <el-empty v-if="userFavorites.length === 0" description="暂无收藏内容" />

            <el-card
              v-for="favorite in userFavorites"
              :key="favorite.id"
              class="favorite-item"
              shadow="hover"
            >
              <div class="favorite-content">
                <div class="favorite-info">
                  <el-tag size="small" effect="plain">
                    {{ favorite.type === 'article' ? '文章' : favorite.type === 'project' ? '项目' : '工具' }}
                  </el-tag>
                  <h3>{{ favorite.title }}</h3>
                  <span class="favorite-date">收藏于 {{ favorite.date }}</span>
                </div>
                <div class="favorite-actions">
                  <el-button type="primary" text>查看</el-button>
                  <el-button type="danger" text>取消收藏</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 30px 0;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-container {
  margin-right: 20px;
}

.user-details h1 {
  margin: 0 0 10px;
  color: #333;
}

.user-bio {
  margin-bottom: 10px;
  color: #666;
  max-width: 500px;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #999;
}

.join-date {
  font-size: 0.9em;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  margin: 0 0 5px;
  color: #409eff;
  font-size: 1.8em;
}

.stat-item p {
  margin: 0;
  color: #666;
}

.profile-content {
  margin-bottom: 30px;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-item {
  margin-bottom: 15px;
}

.favorite-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-info h3 {
  margin: 10px 0 5px;
  color: #333;
}

.favorite-date {
  color: #999;
  font-size: 0.9em;
}

.favorite-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
  }

  .user-info {
    margin-bottom: 20px;
  }

  .user-stats {
    flex-wrap: wrap;
    gap: 20px;
  }

  .stat-item {
    width: 45%;
  }

  .favorite-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .favorite-actions {
    margin-top: 10px;
  }
}
</style>
