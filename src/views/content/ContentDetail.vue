<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { knowledgeApi } from '@/api'
import type { Article } from '@/api/types/knowledge'

const route = useRoute()
const router = useRouter()

// 获取内容ID
const contentId = route.params.id

// 文章内容
const article = ref<Article>({
  id: Number(contentId),
  title: '',
  summary: '',
  category: '',
  categoryId: 0,
  createBy: '',
  authorId: 0,
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

// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    loading.value = true
    const loadingInstance = ElLoading.service({
      target: '.content-detail-container',
      text: '加载中...'
    })

    const res = await knowledgeApi.getArticleDetail(contentId) as Article
    article.value = res

    // 获取相关文章
    const relatedRes = await knowledgeApi.getRelatedArticles(contentId, 3)
    relatedArticles.value = relatedRes

    loadingInstance.close()
  } catch (error) {
    console.error('Failed to fetch article detail:', error)
    ElMessage.error('获取文章详情失败')
  } finally {
    loading.value = false
  }
}

// 点赞文章
const handleLike = async () => {
  try {
    if (article.value.isLiked) {
      await knowledgeApi.unlikeArticle(contentId)
      article.value.likeCount--
      article.value.isLiked = false
      ElMessage.success('取消点赞成功')
    } else {
      await knowledgeApi.likeArticle(contentId)
      article.value.likeCount++
      article.value.isLiked = true
      ElMessage.success('点赞成功')
    }
  } catch (error) {
    console.error('Failed to like/unlike article:', error)
    ElMessage.error('操作失败')
  }
}

// 收藏文章
const handleFavorite = async () => {
  try {
    if (article.value.isFeatured === 1) {
      await knowledgeApi.unfavoriteArticle(contentId)
      article.value.isFeatured = 0
      ElMessage.success('取消收藏成功')
    } else {
      await knowledgeApi.favoriteArticle(contentId)
      article.value.isFeatured = 1
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('Failed to favorite/unfavorite article:', error)
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchArticleDetail()
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到相关文章
const viewRelatedArticle = (id: number) => {
  router.push(`/content/${id}`)
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
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <el-tag size="small">{{ article.category }}</el-tag>
            <span class="author">作者: {{ article.createBy }}</span>
            <span class="date">发布日期: {{ article.createTime }}</span>
            <span class="views"><el-icon><View /></el-icon> {{ article.viewCount }}</span>
          </div>
        </div>

        <el-divider />

        <div class="article-content" v-html="article.content"></div>

        <div class="article-tags">
          <span class="tag-label">标签:</span>
          <el-tag
            v-for="tag in article.tags"
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
          <h3>相关文章</h3>
          <ul>
            <li v-for="relatedArticle in relatedArticles" :key="relatedArticle.id">
              <a @click.prevent="viewRelatedArticle(relatedArticle.id)">
                {{ relatedArticle.title }}
              </a>
            </li>
          </ul>
        </div>

        <div class="article-actions">
          <el-button type="primary" icon="ThumbsUp" @click="handleLike">
            {{ article.isLiked ? '已点赞' : '点赞' }} ({{ article.likeCount }})
          </el-button>
          <el-button icon="Share">分享</el-button>
          <el-button icon="Star" @click="handleFavorite">
            {{ article.isFeatured === 1 ? '已收藏' : '收藏' }}
          </el-button>
        </div>

        <div class="comments-section">
          <h3>评论 ({{ article.commentCount }})</h3>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="写下你的评论..."
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
</style>
