<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 轮播图数据
const carouselItems = ref([
  {
    id: 1,
    title: '华为创新俱乐部活动',
    image: 'https://via.placeholder.com/1200x400?text=华为创新俱乐部活动',
    description: '最新活动和公告'
  },
  {
    id: 2,
    title: '技术分享会',
    image: 'https://via.placeholder.com/1200x400?text=技术分享会',
    description: '定期技术分享和交流'
  },
  {
    id: 3,
    title: '竞赛信息',
    image: 'https://via.placeholder.com/1200x400?text=竞赛信息',
    description: '最新竞赛信息和报名通道'
  }
])

// 板块数据
const sections = ref([
  {
    id: 1,
    title: '知识库',
    icon: 'Reading',
    path: '/knowledge',
    description: '技术文档、学习资料、教程分享'
  },
  {
    id: 2,
    title: '项目分享与讨论',
    icon: 'ChatDotRound',
    path: '/projects',
    description: '项目展示、技术讨论、问题解答'
  },
  {
    id: 3,
    title: '华为竞赛专区',
    icon: 'Trophy',
    path: '/competition',
    description: '竞赛信息、历届题目、优秀作品'
  },
  {
    id: 4,
    title: '实用工具',
    icon: 'Tools',
    path: '/tools',
    description: '开发工具、学习资源、效率提升'
  },
  {
    id: 5,
    title: '华俱微信推文',
    icon: 'ChatLineRound',
    path: '/wechat-articles',
    description: '微信公众号精选文章'
  },
  {
    id: 6,
    title: '师兄师姐说',
    icon: 'User',
    path: '/experience',
    description: '学长学姐经验分享、职业发展'
  }
])

// 跳转到对应板块
const navigateToSection = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="carousel-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in carouselItems" :key="item.id">
          <div class="carousel-content" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="carousel-text">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 欢迎信息 -->
    <div class="welcome-section container">
      <h2 class="section-title">欢迎来到华为创新俱乐部</h2>
      <p class="section-description">
        华为创新俱乐部是一个技术交流、学习分享的平台，为广大学生提供华为相关的技术资源、竞赛信息和交流机会。
      </p>
    </div>

    <!-- 板块导航 -->
    <div class="sections-grid container">
      <el-card
        v-for="section in sections"
        :key="section.id"
        class="section-card"
        shadow="hover"
        @click="navigateToSection(section.path)"
      >
        <div class="section-icon">
          <el-icon :size="40"><component :is="section.icon" /></el-icon>
        </div>
        <h3>{{ section.title }}</h3>
        <p>{{ section.description }}</p>
      </el-card>
    </div>

    <!-- 最新动态 -->
    <div class="news-section container">
      <h2 class="section-title">最新动态</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in 4"
          :key="index"
          :timestamp="'2023-' + (12 - index) + '-' + (30 - index * 5)"
          placement="top"
        >
          <el-card>
            <h4>活动 {{ activity }}</h4>
            <p>这里是活动 {{ activity }} 的简要描述，包括时间、地点和主要内容。</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding-bottom: 40px;
}

.carousel-section {
  margin-bottom: 40px;
}

.carousel-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-text {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  max-width: 80%;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: #409eff;
}

.section-description {
  max-width: 800px;
  margin: 0 auto;
  color: #666;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.section-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
}

.section-icon {
  margin-bottom: 20px;
  color: #409eff;
}

.section-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.section-card p {
  color: #666;
  font-size: 14px;
}

.news-section {
  margin-top: 40px;
}
</style>
