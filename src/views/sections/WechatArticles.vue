<script setup lang="ts">
import {computed, ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 文章分类
const categories = ref([
  { id: 1, name: '技术分享', count: 28 },
  { id: 2, name: '活动通知', count: 15 },
  { id: 3, name: '竞赛资讯', count: 22 },
  { id: 4, name: '学习资源', count: 18 },
  { id: 5, name: '行业动态', count: 12 }
])

// 文章列表
const articles = ref([
  {
    id: 1,
    title: '华为鲲鹏处理器技术解析',
    category: '技术分享',
    date: '2023-12-15',
    author: '华为创新俱乐部技术团队',
    cover: 'https://via.placeholder.com/800x400?text=华为鲲鹏处理器',
    summary: '本文深入解析华为鲲鹏处理器的架构设计、性能特点和应用场景，帮助读者了解国产芯片的发展现状和未来趋势。',
    views: 1250,
    likes: 320
  },
  {
    id: 2,
    title: '2024年华为软件精英挑战赛报名开始',
    category: '活动通知',
    date: '2023-12-10',
    author: '华为创新俱乐部竞赛组',
    cover: 'https://via.placeholder.com/800x400?text=华为软件精英挑战赛',
    summary: '2024年华为软件精英挑战赛正式启动报名，本文介绍了比赛主题、赛制安排、奖项设置和报名方式，欢迎同学们踊跃参与。',
    views: 980,
    likes: 245
  },
  {
    id: 3,
    title: 'HarmonyOS开发入门指南',
    category: '技术分享',
    date: '2023-12-05',
    author: '华为创新俱乐部开发组',
    cover: 'https://via.placeholder.com/800x400?text=HarmonyOS开发',
    summary: '本文介绍了HarmonyOS的基本概念、开发环境搭建和简单应用开发流程，帮助开发者快速入门HarmonyOS应用开发。',
    views: 1120,
    likes: 290
  },
  {
    id: 4,
    title: '华为云技术沙龙活动回顾',
    category: '活动通知',
    date: '2023-11-28',
    author: '华为创新俱乐部活动组',
    cover: 'https://via.placeholder.com/800x400?text=华为云技术沙龙',
    summary: '本文回顾了上周举办的华为云技术沙龙活动，包括嘉宾分享内容、互动环节和参与者反馈，分享了活动的精彩瞬间和技术亮点。',
    views: 850,
    likes: 180
  },
  {
    id: 5,
    title: '人工智能在通信领域的应用前景',
    category: '行业动态',
    date: '2023-11-20',
    author: '华为创新俱乐部研究组',
    cover: 'https://via.placeholder.com/800x400?text=AI在通信领域的应用',
    summary: '本文分析了人工智能技术在通信领域的应用现状和未来发展趋势，探讨了AI如何提升网络性能、优化资源配置和改善用户体验。',
    views: 920,
    likes: 210
  },
  {
    id: 6,
    title: '华为开发者大会2023亮点解读',
    category: '行业动态',
    date: '2023-11-15',
    author: '华为创新俱乐部技术团队',
    cover: 'https://via.placeholder.com/800x400?text=华为开发者大会',
    summary: '本文解读了华为开发者大会2023的主要亮点，包括新产品发布、技术创新和生态合作，帮助读者了解华为最新的技术动向和战略规划。',
    views: 1050,
    likes: 260
  },
  {
    id: 7,
    title: '5G技术发展与应用场景分析',
    category: '技术分享',
    date: '2023-11-10',
    author: '华为创新俱乐部研究组',
    cover: 'https://via.placeholder.com/800x400?text=5G技术',
    summary: '本文分析了5G技术的发展历程、关键技术和典型应用场景，探讨了5G如何赋能各行各业，推动数字经济发展。',
    views: 980,
    likes: 230
  },
  {
    id: 8,
    title: '华为算法竞赛备赛指南',
    category: '竞赛资讯',
    date: '2023-11-05',
    author: '华为创新俱乐部竞赛组',
    cover: 'https://via.placeholder.com/800x400?text=算法竞赛备赛',
    summary: '本文提供了华为算法竞赛的备赛建议，包括学习路线、刷题策略、团队协作和心态调整，帮助参赛选手更好地准备比赛。',
    views: 890,
    likes: 200
  }
])

// 推荐文章
const featuredArticles = ref([
  {
    id: 1,
    title: '华为鲲鹏处理器技术解析',
    category: '技术分享',
    cover: 'https://via.placeholder.com/800x400?text=华为鲲鹏处理器'
  },
  {
    id: 3,
    title: 'HarmonyOS开发入门指南',
    category: '技术分享',
    cover: 'https://via.placeholder.com/800x400?text=HarmonyOS开发'
  },
  {
    id: 5,
    title: '人工智能在通信领域的应用前景',
    category: '行业动态',
    cover: 'https://via.placeholder.com/800x400?text=AI在通信领域的应用'
  }
])

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类
const selectedCategory = ref('')

// 筛选后的文章列表
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    // 根据关键词筛选
    const matchKeyword = searchKeyword.value === '' || 
                         article.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    // 根据分类筛选
    const matchCategory = selectedCategory.value === '' || article.category === selectedCategory.value
    
    return matchKeyword && matchCategory
  })
})

// 查看文章详情
const viewArticle = (id: number) => {
  router.push(`/content/${id}`)
}

// 选择分类
const selectCategory = (category: string) => {
  selectedCategory.value = category === selectedCategory.value ? '' : category
}
</script>

<template>
  <div class="wechat-articles-container container">
    <div class="page-header">
      <h1>华俱微信推文</h1>
      <p>精选华为创新俱乐部微信公众号文章，获取最新技术资讯和活动信息</p>
    </div>

    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <!-- 推荐文章轮播 -->
    <div class="featured-section" v-if="!searchKeyword && !selectedCategory">
      <h2 class="section-title">推荐文章</h2>
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="article in featuredArticles" :key="article.id">
          <div 
            class="featured-article" 
            :style="{ backgroundImage: `url(${article.cover})` }"
            @click="viewArticle(article.id)"
          >
            <div class="featured-content">
              <el-tag size="small">{{ article.category }}</el-tag>
              <h3>{{ article.title }}</h3>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="articles-content">
      <!-- 侧边栏 - 分类 -->
      <div class="sidebar">
        <div class="category-list">
          <h3>文章分类</h3>
          <el-divider />
          <ul>
            <li 
              :class="{ active: selectedCategory === '' }"
              @click="selectedCategory = ''"
            >
              全部分类
            </li>
            <li 
              v-for="category in categories" 
              :key="category.id"
              :class="{ active: selectedCategory === category.name }"
              @click="selectCategory(category.name)"
            >
              {{ category.name }} <span class="count">({{ category.count }})</span>
            </li>
          </ul>
        </div>

        <div class="qrcode-section">
          <h3>关注我们</h3>
          <el-divider />
          <div class="qrcode">
            <img src="https://via.placeholder.com/200x200?text=扫码关注" alt="微信公众号二维码" />
            <p>扫码关注华为创新俱乐部微信公众号</p>
          </div>
        </div>
      </div>

      <!-- 主内容区 - 文章列表 -->
      <div class="main-content">
        <div class="filter-info" v-if="selectedCategory || searchKeyword">
          <el-tag v-if="selectedCategory" closable @close="selectedCategory = ''">
            分类: {{ selectedCategory }}
          </el-tag>
          <el-tag v-if="searchKeyword" closable @close="searchKeyword = ''">
            关键词: {{ searchKeyword }}
          </el-tag>
        </div>

        <div class="articles-list">
          <el-empty v-if="filteredArticles.length === 0" description="没有找到匹配的文章" />
          
          <el-card 
            v-for="article in filteredArticles" 
            :key="article.id" 
            class="article-card"
            shadow="hover"
            @click="viewArticle(article.id)"
          >
            <div class="article-layout">
              <div class="article-cover">
                <img :src="article.cover" :alt="article.title" />
              </div>
              <div class="article-content">
                <div class="article-meta">
                  <el-tag size="small">{{ article.category }}</el-tag>
                  <span class="date">{{ article.date }}</span>
                </div>
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-summary">{{ article.summary }}</p>
                <div class="article-footer">
                  <span class="author">{{ article.author }}</span>
                  <div class="stats">
                    <span class="views"><el-icon><View /></el-icon> {{ article.views }}</span>
                    <span class="likes"><el-icon><Star /></el-icon> {{ article.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="50"
            :page-size="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wechat-articles-container {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin-bottom: 10px;
  color: #333;
}

.page-header p {
  color: #666;
}

.search-section {
  margin-bottom: 30px;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}

.featured-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
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

.featured-article {
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.featured-article::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.featured-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  color: white;
}

.featured-content h3 {
  margin-top: 10px;
  font-size: 1.5em;
}

.articles-content {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.category-list h3 {
  margin-bottom: 10px;
}

.category-list ul {
  list-style: none;
  padding: 0;
}

.category-list li {
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
}

.category-list li:hover {
  color: #409eff;
  padding-left: 5px;
}

.category-list li.active {
  color: #409eff;
  font-weight: bold;
}

.count {
  color: #999;
  font-size: 0.9em;
}

.qrcode-section {
  margin-top: 30px;
}

.qrcode-section h3 {
  margin-bottom: 10px;
}

.qrcode {
  text-align: center;
}

.qrcode img {
  width: 100%;
  max-width: 200px;
  margin-bottom: 10px;
}

.qrcode p {
  font-size: 0.9em;
  color: #666;
}

.main-content {
  flex: 1;
}

.filter-info {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.articles-list {
  margin-bottom: 30px;
}

.article-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.article-layout {
  display: flex;
  gap: 20px;
}

.article-cover {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.date {
  color: #999;
  font-size: 0.9em;
}

.article-title {
  margin-bottom: 10px;
  color: #333;
}

.article-summary {
  color: #666;
  margin-bottom: 10px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 0.9em;
}

.stats {
  display: flex;
  gap: 15px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .articles-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-bottom: 30px;
  }

  .article-layout {
    flex-direction: column;
  }

  .article-cover {
    width: 100%;
    height: 200px;
  }
}
</style>
