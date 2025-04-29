<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 工具分类
const categories = ref([
  { id: 1, name: '开发工具', icon: 'Tools' },
  { id: 2, name: '学习资源', icon: 'Reading' },
  { id: 3, name: '效率提升', icon: 'Histogram' },
  { id: 4, name: '设计资源', icon: 'Picture' },
  { id: 5, name: '在线服务', icon: 'Service' }
])

// 工具列表
const tools = ref([
  {
    id: 1,
    name: 'VS Code',
    category: '开发工具',
    description: '轻量级但功能强大的代码编辑器，支持多种编程语言和丰富的插件扩展。',
    url: 'https://code.visualstudio.com/',
    icon: 'https://via.placeholder.com/50?text=VS',
    tags: ['编辑器', '开发环境', '插件']
  },
  {
    id: 2,
    name: 'GitHub',
    category: '开发工具',
    description: '基于Git的代码托管平台，提供版本控制、协作开发和项目管理功能。',
    url: 'https://github.com/',
    icon: 'https://via.placeholder.com/50?text=GH',
    tags: ['代码托管', '版本控制', '开源']
  },
  {
    id: 3,
    name: 'Coursera',
    category: '学习资源',
    description: '提供来自全球顶尖大学和机构的在线课程，涵盖计算机科学、数据科学等多个领域。',
    url: 'https://www.coursera.org/',
    icon: 'https://via.placeholder.com/50?text=CO',
    tags: ['在线课程', '证书', '学习平台']
  },
  {
    id: 4,
    name: 'LeetCode',
    category: '学习资源',
    description: '提供编程题目和竞赛平台，帮助用户提升算法和数据结构能力，准备技术面试。',
    url: 'https://leetcode.com/',
    icon: 'https://via.placeholder.com/50?text=LC',
    tags: ['算法', '面试准备', '编程练习']
  },
  {
    id: 5,
    name: 'Notion',
    category: '效率提升',
    description: '集笔记、知识库、任务管理于一体的协作工具，支持多种内容格式和灵活的页面组织。',
    url: 'https://www.notion.so/',
    icon: 'https://via.placeholder.com/50?text=NO',
    tags: ['笔记', '知识管理', '协作']
  },
  {
    id: 6,
    name: 'Trello',
    category: '效率提升',
    description: '基于看板的项目管理工具，帮助团队组织任务、跟踪进度和协作。',
    url: 'https://trello.com/',
    icon: 'https://via.placeholder.com/50?text=TR',
    tags: ['项目管理', '看板', '团队协作']
  },
  {
    id: 7,
    name: 'Figma',
    category: '设计资源',
    description: '基于浏览器的协作设计工具，支持UI设计、原型制作和设计系统管理。',
    url: 'https://www.figma.com/',
    icon: 'https://via.placeholder.com/50?text=FI',
    tags: ['UI设计', '原型', '协作']
  },
  {
    id: 8,
    name: 'Unsplash',
    category: '设计资源',
    description: '提供免费高质量图片的网站，可用于各种设计和开发项目。',
    url: 'https://unsplash.com/',
    icon: 'https://via.placeholder.com/50?text=UN',
    tags: ['图片资源', '免费', '设计素材']
  },
  {
    id: 9,
    name: 'AWS',
    category: '在线服务',
    description: '亚马逊云服务平台，提供计算、存储、数据库等云服务，支持应用部署和扩展。',
    url: 'https://aws.amazon.com/',
    icon: 'https://via.placeholder.com/50?text=AWS',
    tags: ['云服务', '服务器', '数据库']
  },
  {
    id: 10,
    name: 'Vercel',
    category: '在线服务',
    description: '面向前端开发者的部署和托管平台，支持静态网站和Serverless函数。',
    url: 'https://vercel.com/',
    icon: 'https://via.placeholder.com/50?text=VE',
    tags: ['部署', '托管', '前端']
  }
])

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类
const selectedCategory = ref('')

// 筛选后的工具列表
const filteredTools = computed(() => {
  return tools.value.filter(tool => {
    // 根据关键词筛选
    const matchKeyword = searchKeyword.value === '' ||
                         tool.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))

    // 根据分类筛选
    const matchCategory = selectedCategory.value === '' || tool.category === selectedCategory.value

    return matchKeyword && matchCategory
  })
})

// 选择分类
const selectCategory = (category: string) => {
  selectedCategory.value = category === selectedCategory.value ? '' : category
}

// 打开工具链接
const openToolLink = (url: string) => {
  window.open(url, '_blank')
}

// 查看工具详情
const viewToolDetail = (id: number) => {
  router.push(`/content/${id}`)
}
</script>

<template>
  <div class="tools-container container">
    <div class="page-header">
      <h1>实用工具</h1>
      <p>发现和使用各种提升开发效率和学习体验的实用工具</p>
    </div>

    <div class="search-box">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索工具..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <div class="categories-section">
      <el-row :gutter="20">
        <el-col
          v-for="category in categories"
          :key="category.id"
          :xs="12"
          :sm="8"
          :md="4"
          :lg="4"
        >
          <div
            class="category-card"
            :class="{ active: selectedCategory === category.name }"
            @click="selectCategory(category.name)"
          >
            <el-icon :size="30"><component :is="category.icon" /></el-icon>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="tools-section">
      <div class="filter-info" v-if="selectedCategory || searchKeyword">
        <el-tag v-if="selectedCategory" closable @close="selectedCategory = ''">
          分类: {{ selectedCategory }}
        </el-tag>
        <el-tag v-if="searchKeyword" closable @close="searchKeyword = ''">
          关键词: {{ searchKeyword }}
        </el-tag>
      </div>

      <div class="tools-grid">
        <el-empty v-if="filteredTools.length === 0" description="没有找到匹配的工具" />

        <el-card
          v-for="tool in filteredTools"
          :key="tool.id"
          class="tool-card"
          shadow="hover"
        >
          <div class="tool-header">
            <div class="tool-icon">
              <img :src="tool.icon" :alt="tool.name" />
            </div>
            <div class="tool-title">
              <h3>{{ tool.name }}</h3>
              <el-tag size="small" effect="plain">{{ tool.category }}</el-tag>
            </div>
          </div>
          <p class="tool-description">{{ tool.description }}</p>
          <div class="tool-tags">
            <el-tag
              v-for="tag in tool.tags"
              :key="tag"
              size="small"
              effect="plain"
              class="tag"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="tool-actions">
            <el-button type="primary" @click="openToolLink(tool.url)">访问网站</el-button>
            <el-button @click="viewToolDetail(tool.id)">查看详情</el-button>
          </div>
        </el-card>
      </div>
    </div>

    <div class="submit-tool">
      <h3>推荐工具</h3>
      <p>如果你有好用的工具想要分享给大家，请点击下方按钮提交。</p>
      <el-button type="primary">提交工具</el-button>
    </div>
  </div>
</template>

<style scoped>
.tools-container {
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

.search-box {
  margin-bottom: 30px;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}

.categories-section {
  margin-bottom: 30px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  height: 120px;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-card.active {
  background-color: #409eff;
  color: white;
}

.category-name {
  margin-top: 10px;
  font-weight: 500;
}

.filter-info {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.tool-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.tool-icon {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.tool-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tool-title {
  flex: 1;
}

.tool-title h3 {
  margin: 0 0 5px;
  color: #333;
}

.tool-description {
  margin-bottom: 15px;
  color: #666;
  flex: 1;
}

.tool-tags {
  margin-bottom: 15px;
}

.tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.tool-actions {
  display: flex;
  gap: 10px;
}

.submit-tool {
  text-align: center;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.submit-tool h3 {
  margin-bottom: 10px;
  color: #333;
}

.submit-tool p {
  margin-bottom: 20px;
  color: #666;
}
</style>
