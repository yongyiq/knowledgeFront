<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 知识分类
const categories = ref([
  { id: 1, name: '编程语言', count: 24 },
  { id: 2, name: '算法与数据结构', count: 18 },
  { id: 3, name: '前端开发', count: 32 },
  { id: 4, name: '后端开发', count: 27 },
  { id: 5, name: '移动开发', count: 15 },
  { id: 6, name: '人工智能', count: 20 },
  { id: 7, name: '云计算', count: 12 },
  { id: 8, name: '大数据', count: 9 }
])

// 知识文章列表
const articles = ref([
  {
    id: 1,
    title: 'JavaScript基础知识总结',
    category: '前端开发',
    author: '张三',
    date: '2023-12-15',
    views: 1250,
    summary: 'JavaScript是一种具有函数优先特性的轻量级解释型或者说即时编译型的编程语言。本文总结了JavaScript的基础知识，包括变量、数据类型、函数、对象等内容。'
  },
  {
    id: 2,
    title: 'Python入门指南',
    category: '编程语言',
    author: '李四',
    date: '2023-12-10',
    views: 980,
    summary: 'Python是一种广泛使用的解释型、高级编程语言，它的设计哲学强调代码的可读性和简洁的语法。本文介绍了Python的基本语法、数据类型、控制流等内容。'
  },
  {
    id: 3,
    title: '数据结构：链表详解',
    category: '算法与数据结构',
    author: '王五',
    date: '2023-12-05',
    views: 756,
    summary: '链表是一种常见的基础数据结构，是一种线性表，但是并不会按线性的顺序存储数据，而是在每一个节点里存到下一个节点的指针。本文详细介绍了链表的原理和实现。'
  },
  {
    id: 4,
    title: 'Vue.js组件化开发实践',
    category: '前端开发',
    author: '赵六',
    date: '2023-11-28',
    views: 1120,
    summary: 'Vue.js是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue被设计为可以自底向上逐层应用。本文介绍了Vue.js的组件化开发实践。'
  },
  {
    id: 5,
    title: 'Spring Boot入门教程',
    category: '后端开发',
    author: '钱七',
    date: '2023-11-20',
    views: 890,
    summary: 'Spring Boot是由Pivotal团队提供的全新框架，其设计目的是用来简化Spring应用的初始搭建以及开发过程。本文介绍了Spring Boot的基本使用方法。'
  },
  {
    id: 6,
    title: '机器学习算法概述',
    category: '人工智能',
    author: '孙八',
    date: '2023-11-15',
    views: 1350,
    summary: '机器学习是人工智能的一个分支，是一门多领域交叉学科，涉及概率论、统计学、逼近论、凸分析、计算复杂性理论等多门学科。本文概述了常见的机器学习算法。'
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

// 跳转到文章详情页
const viewArticle = (id: number) => {
  router.push(`/content/${id}`)
}

// 选择分类
const selectCategory = (category: string) => {
  selectedCategory.value = category
}

// 清除筛选
const clearFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
}
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
          />
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
              @click="selectCategory(category.name)"
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

        <div class="article-list">
          <el-empty v-if="filteredArticles.length === 0" description="没有找到匹配的文章" />

          <el-card
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
            shadow="hover"
            @click="viewArticle(article.id)"
          >
            <div class="article-meta">
              <el-tag size="small">{{ article.category }}</el-tag>
              <span class="author">{{ article.author }}</span>
              <span class="date">{{ article.date }}</span>
              <span class="views"><el-icon><View /></el-icon> {{ article.views }}</span>
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
