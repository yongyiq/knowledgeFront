<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import {projectApi, ProjectListResponse} from '@/api'
import type { Project, ProjectStatus } from '@/api/types/project'
import { checkLogin } from '@/utils/auth'

const router = useRouter()

// 加载状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const selectedStatus = ref('')

// 项目列表
const projects = ref<Project[]>([])

// 模拟数据，后续会替换为API数据
const mockProjects = ref([
  {
    id: 1,
    title: '智能家居控制系统',
    author: '张三',
    date: '2023-12-10',
    tags: ['IoT', 'Vue.js', 'Node.js'],
    likes: 45,
    comments: 12,
    summary: '基于树莓派和Vue.js的智能家居控制系统，支持远程控制、定时任务和场景模式。',
    image: 'https://via.placeholder.com/300x200?text=智能家居'
  },
  {
    id: 2,
    title: '校园二手交易平台',
    author: '李四',
    date: '2023-12-05',
    tags: ['微信小程序', '云开发', 'UI设计'],
    likes: 38,
    comments: 8,
    summary: '基于微信小程序的校园二手交易平台，支持发布、搜索、聊天和交易功能。',
    image: 'https://via.placeholder.com/300x200?text=二手交易'
  },
  {
    id: 3,
    title: '人脸识别考勤系统',
    author: '王五',
    date: '2023-11-28',
    tags: ['人工智能', 'Python', 'OpenCV'],
    likes: 56,
    comments: 15,
    summary: '基于OpenCV和深度学习的人脸识别考勤系统，支持实时识别、数据统计和异常提醒。',
    image: 'https://via.placeholder.com/300x200?text=人脸识别'
  },
  {
    id: 4,
    title: '在线协作文档编辑器',
    author: '赵六',
    date: '2023-11-20',
    tags: ['WebSocket', 'React', 'MongoDB'],
    likes: 42,
    comments: 10,
    summary: '支持多人实时协作的在线文档编辑器，基于WebSocket实现实时同步，支持Markdown语法。',
    image: 'https://via.placeholder.com/300x200?text=协作编辑器'
  },
  {
    id: 5,
    title: '校园导航AR应用',
    author: '钱七',
    date: '2023-11-15',
    tags: ['AR', 'Unity', '3D建模'],
    likes: 60,
    comments: 18,
    summary: '基于AR技术的校园导航应用，支持实景导航、建筑信息查询和校园活动提醒。',
    image: 'https://via.placeholder.com/300x200?text=AR导航'
  },
  {
    id: 6,
    title: '健康饮食推荐系统',
    author: '孙八',
    date: '2023-11-10',
    tags: ['推荐算法', 'Flask', 'Vue.js'],
    likes: 35,
    comments: 9,
    summary: '基于用户饮食习惯和健康状况的个性化饮食推荐系统，支持营养分析和食谱生成。',
    image: 'https://via.placeholder.com/300x200?text=健康饮食'
  }
]);



// 获取项目列表
const fetchProjects = async () => {
  try {
    loading.value = true
    const loadingInstance = ElLoading.service({
      target: '.projects-grid',
      text: '加载中...'
    })

    const res = await projectApi.getProjects({
      page: currentPage.value - 1, // 后端分页从0开始
      size: pageSize.value,
      keyword: searchKeyword.value,
      status: selectedStatus.value
    }) as ProjectListResponse

    // 适配后端返回的数据格式
    projects.value = res.content || []
    total.value = res.totalElements || 0

    loadingInstance.close()
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    ElMessage.error('获取项目列表失败')
    // 如果接口调用失败，使用模拟数据
    projects.value = mockProjects.value as unknown as Project[]
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchProjects()
}



// 处理状态选择
const handleStatusSelect = (status: string) => {
  selectedStatus.value = status
  currentPage.value = 1 // 重置到第一页
  fetchProjects()
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProjects()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  fetchProjects()
}

// 点赞项目
const handleLike = async (project: Project, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡，避免触发项目点击

  // 检查用户是否已登录
  if (!checkLogin('登录后才能点赞哦')) {
    return
  }

  try {
    if (project.isLiked) {
      await projectApi.unlikeProject(project.id)
      project.likeCount--
      project.isLiked = false
      ElMessage.success('取消点赞成功')
    } else {
      await projectApi.likeProject(project.id)
      project.likeCount++
      project.isLiked = true
      ElMessage.success('点赞成功')
    }
  } catch (error) {
    console.error('Failed to like/unlike project:', error)
    ElMessage.error('操作失败')
  }
}

// 收藏项目
const handleFavorite = async (project: Project, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡，避免触发项目点击

  // 检查用户是否已登录
  if (!checkLogin('登录后才能收藏哦')) {
    return
  }

  try {
    if (project.isFeatured === 1) {
      await projectApi.unfavoriteProject(project.id)
      project.isFeatured = 0
      ElMessage.success('取消收藏成功')
    } else {
      await projectApi.favoriteProject(project.id)
      project.isFeatured = 1
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('Failed to favorite/unfavorite project:', error)
    ElMessage.error('操作失败')
  }
}

// 清除筛选
const clearFilters = () => {
  searchKeyword.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  fetchProjects()
}

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

// 初始化数据
onMounted(() => {
  fetchProjects()
})

// 讨论话题
const discussions = ref([
  {
    id: 1,
    title: '如何选择适合自己的项目开发框架？',
    author: '张三',
    date: '2023-12-12',
    replies: 24,
    views: 156,
    lastReply: '2023-12-15'
  },
  {
    id: 2,
    title: '项目开发中的团队协作经验分享',
    author: '李四',
    date: '2023-12-08',
    replies: 18,
    views: 132,
    lastReply: '2023-12-14'
  },
  {
    id: 3,
    title: '如何提高代码质量和可维护性？',
    author: '王五',
    date: '2023-12-05',
    replies: 30,
    views: 210,
    lastReply: '2023-12-13'
  },
  {
    id: 4,
    title: '项目上线前的测试和优化策略',
    author: '赵六',
    date: '2023-12-01',
    replies: 15,
    views: 120,
    lastReply: '2023-12-10'
  },
  {
    id: 5,
    title: '如何有效管理项目进度和任务分配？',
    author: '钱七',
    date: '2023-11-28',
    replies: 22,
    views: 145,
    lastReply: '2023-12-08'
  }
])

// 当前活动标签
const activeTab = ref('projects')

// 查看项目详情
const viewProject = (id: number) => {
  router.push(`/project/${id}`)
}

// 查看讨论详情
const viewDiscussion = (id: number) => {
  router.push(`/content/${id}`)
}

// 发布新项目或讨论
const createNew = () => {
  // 检查用户是否已登录
  if (!checkLogin('登录后才能发布' + (activeTab.value === 'projects' ? '项目' : '讨论'))) {
    return
  }

  if (activeTab.value === 'projects') {
    router.push('/project/create')
  } else {
    router.push('/discussion/create')
  }
}
</script>

<template>
  <div class="projects-container container">
    <div class="page-header">
      <h1>项目分享与讨论</h1>
      <p>分享你的项目成果，参与技术讨论，共同进步</p>
    </div>

    <div class="action-bar">
      <div class="search-box">
        <el-input
            v-model="searchKeyword"
            placeholder="搜索项目..."
            prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-button type="primary" @click="createNew">
        <el-icon><Plus /></el-icon>
        发布{{ activeTab === 'projects' ? '项目' : '讨论' }}
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="项目展示" name="projects">
        <div class="filter-section">
          <div class="status-filters">
            <el-tag
                :effect="selectedStatus === '' ? 'dark' : 'plain'"
                @click="selectedStatus = ''; fetchProjects()"
                class="status-tag"
            >
              全部状态
            </el-tag>
            <el-tag
                :effect="selectedStatus === 'planning' ? 'dark' : 'plain'"
                @click="handleStatusSelect('planning')"
                class="status-tag"
                type="info"
            >
              规划中
            </el-tag>
            <el-tag
                :effect="selectedStatus === 'in_progress' ? 'dark' : 'plain'"
                @click="handleStatusSelect('in_progress')"
                class="status-tag"
                type="warning"
            >
              进行中
            </el-tag>
            <el-tag
                :effect="selectedStatus === 'completed' ? 'dark' : 'plain'"
                @click="handleStatusSelect('completed')"
                class="status-tag"
                type="success"
            >
              已完成
            </el-tag>
          </div>
        </div>

        <div class="projects-grid" v-loading="loading">
          <el-empty v-if="projects.length === 0" description="没有找到匹配的项目" />
          <el-card
              v-for="project in projects"
              :key="project.id"
              class="project-card"
              shadow="hover"
              @click="viewProject(project.id)"
          >
            <div class="project-image">
              <img :src="project.coverImage || 'https://via.placeholder.com/300x200?text=' + project.title" :alt="project.title" />
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="project-meta">
                <span class="author">{{ project.createBy }}</span>
                <span class="date">{{ project.createTime }}</span>
                <el-tag size="small" :type="getStatusType(project.status)" class="status-tag">
                  {{ getStatusText(project.status) }}
                </el-tag>
              </div>
              <p class="project-summary">{{ project.summary }}</p>
              <div class="project-tags">
                <el-tag
                    v-for="tag in project.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                    class="tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="project-actions">
                <el-button
                    type="text"
                    :icon="project.isLiked ? 'Star' : 'StarFilled'"
                    @click.stop="handleLike(project, $event)"
                >
                  {{ project.likeCount }}
                </el-button>
                <el-button
                    type="text"
                    :icon="project.isFeatured === 1 ? 'Collection' : 'CollectionTag'"
                    @click.stop="handleFavorite(project, $event)"
                >
                  {{ project.isFeatured === 1 ? '已收藏' : '收藏' }}
                </el-button>
                <span class="view-count">
                  <el-icon><View /></el-icon> {{ project.viewCount }}
                </span>
              </div>
              <div class="project-stats">
                <span class="comments"><el-icon><ChatDotRound /></el-icon> {{ project.commentCount }}</span>
              </div>
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
      </el-tab-pane>

      <el-tab-pane label="技术讨论" name="discussions">
        <div class="discussions-list">
          <el-table
              :data="discussions"
              style="width: 100%"
              @row-click="(row) => viewDiscussion(row.id)"
          >
            <el-table-column prop="title" label="话题" min-width="300">
              <template #default="scope">
                <div class="discussion-title">{{ scope.row.title }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="发起人" width="120" />
            <el-table-column prop="date" label="发布日期" width="120" />
            <el-table-column prop="replies" label="回复数" width="100" />
            <el-table-column prop="views" label="浏览数" width="100" />
            <el-table-column prop="lastReply" label="最后回复" width="120" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="50"
          :page-size="10"
      />
    </div>
  </div>
</template>

<style scoped>
.projects-container {
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

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.main-tabs {
  margin-bottom: 30px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-image {
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-title {
  margin-bottom: 10px;
  color: #333;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9em;
  color: #666;
}

.project-summary {
  margin-bottom: 15px;
  color: #666;
  flex: 1;
}

.project-tags {
  margin-bottom: 15px;
}

.tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.project-stats {
  display: flex;
  gap: 15px;
  color: #666;
}

.discussions-list {
  margin-bottom: 20px;
}

.discussion-title {
  color: #409eff;
  cursor: pointer;
}

.discussion-title:hover {
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.project-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-5px);
}

.filter-section {
  margin-bottom: 20px;
}

.status-filters {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-tag {
  cursor: pointer;
}

.project-actions {
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 15px;
}

.view-count {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
  font-size: 14px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-right: auto;
}
</style>
