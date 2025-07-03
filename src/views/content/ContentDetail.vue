<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { knowledgeApi, projectApi } from '@/api'
import type { Article } from '@/api/types/knowledge'
import type { Project } from '@/api/types/project'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { checkLogin } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

// 获取内容ID
const contentId = ref(route.params.id)

// 判断内容类型（文章或项目）
const contentType = computed(() => {
  return route.path.startsWith('/project/') ? 'project' : 'article'
})

// 页面标题
const pageTitle = computed(() => {
  return contentType.value === 'project' ? '项目详情' : '文章详情'
})

// 内容数据（文章或项目）
const content = ref<Article | Project>({
  id: Number(contentId.value),
  title: '',
  summary: '',
  createBy: '',
  createTime: '',
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  content: `
  <h2>JavaScript简介</h2>
  <p>JavaScript是一种具有函数优先特性的轻量级解释型或者说即时编译型的编程语言。虽然它是作为开发Web页面的脚本语言而出名，但是它也被用到了很多非浏览器环境中，例如Node.js、Apache CouchDB和Adobe Acrobat。JavaScript是一种基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式和声明式（如函数式编程）风格。</p>

  <h2>JavaScript的基本数据类型</h2>
  <p>JavaScript中有七种基本数据类型：</p>
  <ul>
    <li><strong>Number</strong>：用于任何类型的数字：整数或浮点数。</li>
    <li><strong>String</strong>：用于字符串：一个字符串可以包含一个或多个字符，没有单独的字符类型。</li>
    <li><strong>Boolean</strong>：用于 true 和 false。</li>
    <li><strong>null</strong>：用于未知的值 —— 只有一个 null 值的独立类型。</li>
    <li><strong>undefined</strong>：用于未定义的值 —— 只有一个 undefined 值的独立类型。</li>
    <li><strong>Symbol</strong>：用于唯一的标识符。</li>
    <li><strong>BigInt</strong>：用于任意长度的整数。</li>
  </ul>

  <h2>变量声明</h2>
  <p>在JavaScript中，可以使用var、let和const来声明变量：</p>
  <pre><code>
  // 使用var（旧方式）
  var message = 'Hello';

  // 使用let（新方式）
  let user = 'John';

  // 使用const（常量）
  const PI = 3.14;
  </code></pre>

  <h2>函数</h2>
  <p>函数是JavaScript中的主要构建块之一。函数是一段可以反复调用的代码块。下面是函数声明的例子：</p>
  <pre><code>
  // 函数声明
  function sayHello(name) {
    return "Hello, " + name + "!";
  }

  // 函数表达式
  const sayGoodbye = function(name) {
    return "Goodbye, " + name + "!";
  };

  // 箭头函数
  const square = (x) => x * x;
  </code></pre>

  <h2>对象</h2>
  <p>对象是JavaScript中最重要的数据类型之一。对象是属性的集合，每个属性都是一个键值对。下面是创建对象的例子：</p>
  <pre><code>
  // 对象字面量
  const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    fullName: function() {
      return this.firstName + " " + this.lastName;
    }
  };

  // 访问对象属性
  console.log(person.firstName); // John
  console.log(person["lastName"]); // Doe

  // 调用对象方法
  console.log(person.fullName()); // John Doe
  </code></pre>

  <h2>数组</h2>
  <p>数组是一种特殊类型的对象，用于存储有序的数据集合。下面是创建和操作数组的例子：</p>
  <pre><code>
  // 创建数组
  const fruits = ["Apple", "Banana", "Cherry"];

  // 访问数组元素
  console.log(fruits[0]); // Apple

  // 修改数组元素
  fruits[1] = "Blueberry";

  // 数组方法
  fruits.push("Date"); // 添加到末尾
  fruits.pop(); // 从末尾删除
  fruits.unshift("Apricot"); // 添加到开头
  fruits.shift(); // 从开头删除
  </code></pre>

  <h2>总结</h2>
  <p>JavaScript是一种功能强大的编程语言，它是Web开发的核心技术之一。本文介绍了JavaScript的基础知识，包括数据类型、变量、函数、对象和数组。掌握这些基础知识对于进一步学习JavaScript和Web开发至关重要。</p>
  `,
  tags: ['JavaScript', '前端', '编程语言', 'Web开发'],
  relatedArticles: [
    { id: 2, title: 'CSS布局技巧' },
    { id: 3, title: 'HTML5新特性' },
    { id: 4, title: 'Vue.js组件化开发实践' }
  ]
})

// 加载状态
const loading = ref(false)

// 相关文章
const relatedArticles = ref<Article[]>([])

// 文章标签
const articleTags = ref<string[]>([])

// 项目特有数据
const projectTeam = ref([])
const projectScreenshots = ref([])

// 评论内容
const commentContent = ref('')

// 获取内容详情
const fetchContentDetail = async () => {
  try {
    loading.value = true
    const loadingInstance = ElLoading.service({
      target: '.content-detail-container',
      text: '加载中...'
    })

    if (contentType.value === 'project') {
      // 获取项目详情
      const res = await projectApi.getProjectDetail(contentId.value) as Project
      content.value = res

      // 获取相关项目
      try {
        const relatedRes = await projectApi.getRelatedProjects(contentId.value, 3)
        relatedArticles.value = relatedRes || []
      } catch (relatedError) {
        console.error('Failed to fetch related projects:', relatedError)
        relatedArticles.value = []
      }

      // 获取项目标签
      try {
        const tagsRes = await projectApi.getProjectTags(contentId.value)
        articleTags.value = tagsRes || []
      } catch (tagError) {
        console.error('Failed to fetch project tags:', tagError)
        articleTags.value = []
      }
    } else {
      // 获取文章详情
      const res = await knowledgeApi.getArticleDetail(contentId.value) as Article
      content.value = res

      // 获取相关文章
      try {
        const relatedRes = await knowledgeApi.getRelatedArticles(contentId.value, 3)
        relatedArticles.value = relatedRes || []
      } catch (relatedError) {
        console.error('Failed to fetch related articles:', relatedError)
        relatedArticles.value = []
      }

      // 获取文章标签
      try {
        const tagsRes = await knowledgeApi.getArticleTags(contentId.value)
        articleTags.value = tagsRes || []
      } catch (tagError) {
        console.error('Failed to fetch article tags:', tagError)
        articleTags.value = []
      }
    }

    loadingInstance.close()
  } catch (error) {
    console.error('Failed to fetch content detail:', error)
    ElMessage.error(`获取${contentType.value === 'project' ? '项目' : '文章'}详情失败`)
  } finally {
    loading.value = false
  }
}

// 点赞内容
const handleLike = async () => {
  // 检查用户是否已登录
  if (!checkLogin('登录后才能点赞哦')) {
    return
  }

  try {
    if (content.value.isLiked) {
      if (contentType.value === 'project') {
        await projectApi.unlikeProject(contentId.value)
      } else {
        await knowledgeApi.unlikeArticle(contentId.value)
      }
      content.value.likeCount--
      content.value.isLiked = false
      ElMessage.success('取消点赞成功')
    } else {
      if (contentType.value === 'project') {
        await projectApi.likeProject(contentId.value)
      } else {
        await knowledgeApi.likeArticle(contentId.value)
      }
      content.value.likeCount++
      content.value.isLiked = true
      ElMessage.success('点赞成功')
    }
  } catch (error) {
    console.error('Failed to like/unlike content:', error)
    ElMessage.error('操作失败')
  }
}

// 收藏内容
const handleFavorite = async () => {
  // 检查用户是否已登录
  if (!checkLogin('登录后才能收藏哦')) {
    return
  }

  try {
    if (content.value.isFeatured === 1) {
      if (contentType.value === 'project') {
        await projectApi.unfavoriteProject(contentId.value)
      } else {
        await knowledgeApi.unfavoriteArticle(contentId.value)
      }
      content.value.isFeatured = 0
      ElMessage.success('取消收藏成功')
    } else {
      if (contentType.value === 'project') {
        await projectApi.favoriteProject(contentId.value)
      } else {
        await knowledgeApi.favoriteArticle(contentId.value)
      }
      content.value.isFeatured = 1
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('Failed to favorite/unfavorite content:', error)
    ElMessage.error('操作失败')
  }
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    contentId.value = newId
    fetchContentDetail()
    // 滚动到页面顶部
    window.scrollTo(0, 0)
  }
})

// 监听路由路径变化（文章/项目切换）
watch(() => route.path, () => {
  fetchContentDetail()
})

onMounted(() => {
  fetchContentDetail()
})

// 获取项目状态类型
const getStatusType = (status: string): '' | 'info' | 'success' | 'warning' | 'danger' => {
  switch (status) {
    case 'ongoing':
      return 'info'
    case 'progress':
      return 'warning'
    case 'completed':
      return 'success'
    case 'archived':
      return 'danger'
    default:
      return ''
  }
}

// 获取项目状态文本
const getStatusText = (status: string): string => {
  switch (status) {
    case 'ongoing':
      return '规划中'
    case 'progress':
      return '进行中'
    case 'completed':
      return '已完成'
    case 'archived':
      return '已归档'
    default:
      return '未知'
  }
}

// 打开外部链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="content-detail container">
    <el-button @click="goBack" class="back-button" icon="ArrowLeft">返回</el-button>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="skeleton-content">
          <el-skeleton-item variant="h1" style="width: 80%;" />
          <div class="skeleton-meta">
            <el-skeleton-item variant="text" style="width: 15%;" />
            <el-skeleton-item variant="text" style="width: 15%;" />
            <el-skeleton-item variant="text" style="width: 15%;" />
          </div>
          <el-skeleton-item variant="p" style="width: 100%;" />
          <el-skeleton-item variant="p" style="width: 100%;" />
          <el-skeleton-item variant="p" style="width: 100%;" />
          <el-skeleton-item variant="p" style="width: 100%;" />
          <el-skeleton-item variant="p" style="width: 100%;" />
        </div>
      </template>

      <template #default>
        <div class="article-header">
          <h1 class="article-title">{{ content.title }}</h1>
          <div class="article-meta">
            <el-tag v-if="contentType === 'article' && content.category" size="small">{{ content.category }}</el-tag>
            <el-tag v-if="contentType === 'project' && content.status" size="small" :type="getStatusType(content.status)">
              {{ getStatusText(content.status) }}
            </el-tag>
            <span class="author">{{ contentType === 'project' ? '创建者' : '作者' }}: {{ content.createBy }}</span>
            <span class="date">发布日期: {{ content.createTime }}</span>
            <span class="views"><el-icon><View /></el-icon> {{ content.viewCount }}</span>
          </div>
        </div>

        <el-divider />

        <!-- 项目截图展示 -->
        <div v-if="contentType === 'project' && projectScreenshots.length > 0" class="project-screenshots">
          <h3>项目截图</h3>
          <div class="screenshots-grid">
            <el-image
              v-for="(screenshot, index) in projectScreenshots"
              :key="index"
              :src="screenshot"
              :preview-src-list="projectScreenshots"
              :initial-index="index"
              fit="cover"
              class="screenshot-item"
            />
          </div>
        </div>

        <!-- 项目链接 -->
        <div v-if="contentType === 'project' && (content.repoUrl || content.demoUrl)" class="project-links">
          <h3>项目链接</h3>
          <div class="links-container">
            <el-button v-if="content.repoUrl" type="primary" @click="openLink(content.repoUrl)">
              <el-icon><Link /></el-icon>
              查看源码
            </el-button>
            <el-button v-if="content.demoUrl" type="success" @click="openLink(content.demoUrl)">
              <el-icon><View /></el-icon>
              在线演示
            </el-button>
          </div>
        </div>

        <div class="article-content">
          <MarkdownRenderer v-if="content.content" :content="content.content" />
        </div>

        <!-- 项目团队成员 -->
        <div v-if="contentType === 'project' && projectTeam.length > 0" class="project-team">
          <h3>团队成员</h3>
          <div class="team-grid">
            <div v-for="member in projectTeam" :key="member.name" class="team-member">
              <el-avatar :src="member.avatar" :size="60">{{ member.name.charAt(0) }}</el-avatar>
              <div class="member-info">
                <div class="member-name">{{ member.name }}</div>
                <div class="member-role">{{ member.role }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="article-tags" v-if="articleTags.length > 0">
          <span class="tag-label">标签:</span>
          <el-tag
            v-for="tag in articleTags"
            :key="tag"
            size="small"
            effect="plain"
            class="tag"
          >
            {{ tag }}
          </el-tag>
        </div>

        <el-divider />

        <div class="related-articles">
          <h3>相关{{ contentType === 'project' ? '项目' : '文章' }}</h3>
          <ul>
            <li v-for="relatedItem in relatedArticles" :key="relatedItem.id">
              <router-link :to="`/${contentType === 'project' ? 'project' : 'content'}/${relatedItem.id}`">
                {{ relatedItem.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="article-actions">
          <el-button type="primary" icon="ThumbsUp" @click="handleLike">
            {{ content.isLiked ? '已点赞' : '点赞' }} ({{ content.likeCount }})
          </el-button>
          <el-button icon="Share">分享</el-button>
          <el-button icon="Star" @click="handleFavorite">
            {{ content.isFeatured === 1 ? '已收藏' : '收藏' }}
          </el-button>
        </div>

        <div class="comments-section">
          <h3>评论 ({{ content.commentCount }})</h3>
          <el-input
            type="textarea"
            :rows="4"
            :placeholder="`写下你对这个${contentType === 'project' ? '项目' : '文章'}的评论...`"
          />
          <div class="comment-actions">
            <el-button type="primary">提交评论</el-button>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.content-detail {
  padding: 30px 0;
  max-width: 900px;
}

.back-button {
  margin-bottom: 20px;
}

.article-header {
  margin-bottom: 20px;
}

.article-title {
  margin-bottom: 15px;
  color: #333;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
  font-size: 0.9em;
}

.article-content {
  margin-bottom: 30px;
  line-height: 1.8;
}

.article-content h2 {
  margin: 25px 0 15px;
  color: #333;
}

.article-content p {
  margin-bottom: 15px;
}

.article-content ul {
  margin-bottom: 15px;
  padding-left: 20px;
}

.article-content pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 15px;
}

.article-content code {
  font-family: monospace;
}

.article-tags {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tag-label {
  margin-right: 10px;
  color: #666;
}

.tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.related-articles {
  margin-bottom: 30px;
}

.related-articles h3 {
  margin-bottom: 15px;
  color: #333;
}

.related-articles ul {
  list-style: none;
  padding: 0;
}

.related-articles li {
  margin-bottom: 10px;
}

.related-articles a {
  color: #409eff;
  cursor: pointer;
}

.related-articles a:hover {
  text-decoration: underline;
}

.article-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.comments-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.comment-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.skeleton-content {
  padding: 20px;
}

.skeleton-meta {
  display: flex;
  gap: 20px;
  margin: 15px 0 30px;
}

/* 项目特有样式 */
.project-screenshots {
  margin-bottom: 30px;
}

.project-screenshots h3 {
  margin-bottom: 15px;
  color: #333;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.screenshot-item {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
}

.project-links {
  margin-bottom: 30px;
}

.project-links h3 {
  margin-bottom: 15px;
  color: #333;
}

.links-container {
  display: flex;
  gap: 15px;
}

.project-team {
  margin-bottom: 30px;
}

.project-team h3 {
  margin-bottom: 15px;
  color: #333;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}

.member-info {
  flex: 1;
}

.member-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.member-role {
  color: #666;
  font-size: 0.9em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .screenshots-grid {
    grid-template-columns: 1fr;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .links-container {
    flex-direction: column;
  }
}
</style>
