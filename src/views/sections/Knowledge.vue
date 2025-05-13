<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { knowledgeApi } from '@/api'
import type { Category, Article, ArticleListResponse } from '@/api/types/knowledge'

const router = useRouter()

// 加载状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 知识分类
const categories = ref<Category[]>([])

// 知识文章列表
const articles = ref<Article[]>([])

// 获取分类列表
const fetchCategories = async () => {
  try {
    loading.value = true
    const res = await knowledgeApi.getCategories()
    categories.value = res
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 获取文章列表
const fetchArticles = async () => {
  try {
    loading.value = true
    const res = await knowledgeApi.getArticles({
      page: currentPage.value - 1, // 后端分页从0开始
      size: pageSize.value,
      category: selectedCategory.value,
      keyword: searchKeyword.value
    }) as ArticleListResponse

    // 适配后端返回的数据格式
    articles.value = res.content
    total.value = res.totalElements
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}


// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类
const selectedCategory = ref('')

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchArticles()
}

// 处理分类选择
const handleCategorySelect = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1 // 重置到第一页
  fetchArticles()
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchArticles()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  fetchArticles()
}

// 跳转到文章详情页
const viewArticle = (id: number) => {
  router.push(`/content/${id}`)
}

// 清除筛选
const clearFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
  fetchArticles()
}

// 初始化数据
onMounted(() => {
  fetchCategories()
  fetchArticles()
})
</script>

<template>
  <div class="knowledge-container container">
    <div class="page-header">
      <h1>知识库</h1>
      <p>探索和学习各种技术知识，提升你的专业技能</p>
    </div>

    <div class="knowledge-content">
      <!-- 侧边栏 - 分类 -->
      <div class="sidebar">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索知识文章..."
            prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <div class="category-list">
          <h3>知识分类</h3>
          <el-divider />
          <ul>
            <li
              :class="{ active: selectedCategory === '' }"
              @click="clearFilters"
            >
              全部分类
            </li>
            <li
              v-for="category in categories"
              :key="category.id"
              :class="{ active: selectedCategory === category.name }"
              @click="handleCategorySelect(category.name)"
            >
              {{ category.name }} <span class="count">({{ category.count }})</span>
            </li>
          </ul>
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
          <el-button size="small" @click="clearFilters">清除全部</el-button>
        </div>

        <div class="article-list" v-loading="loading">
          <el-empty v-if="articles.length === 0" description="没有找到匹配的文章" />

          <el-card
            v-for="article in articles"
            :key="article.id"
            class="article-card"
            shadow="hover"
            @click="viewArticle(article.id)"
          >
            <div class="article-meta">
              <el-tag size="small">{{ article.category }}</el-tag>
              <span class="author">{{ article.createBy }}</span>
              <span class="date">{{ article.createTime }}</span>
              <span class="views"><el-icon><View /></el-icon> {{ article.viewCount }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-actions">
              <el-button type="primary" text>阅读全文</el-button>
            </div>
          </el-card>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="sizes, prev, pager, next, jumper, total"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-container {
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

.knowledge-content {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.search-box {
  margin-bottom: 20px;
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

.main-content {
  flex: 1;
}

.filter-info {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.article-list {
  margin-bottom: 30px;
}

.article-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.article-meta {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
}

.article-title {
  margin-bottom: 10px;
  color: #333;
}

.article-summary {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.article-actions {
  display: flex;
  justify-content: flex-end;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .knowledge-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
