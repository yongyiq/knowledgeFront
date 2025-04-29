<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 项目列表
const projects = ref([
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
])

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
  router.push(`/content/${id}`)
}

// 查看讨论详情
const viewDiscussion = (id: number) => {
  router.push(`/content/${id}`)
}

// 发布新项目或讨论
const createNew = () => {
  // 实际应用中可能会跳转到创建页面或打开对话框
  console.log('创建新' + (activeTab.value === 'projects' ? '项目' : '讨论'))
}
</script>

<template>
  <div class="projects-container container">
    <div class="page-header">
      <h1>项目分享与讨论</h1>
      <p>分享你的项目成果，参与技术讨论，共同进步</p>
    </div>

    <div class="action-bar">
      <el-button type="primary" @click="createNew">
        <el-icon><Plus /></el-icon>
        发布{{ activeTab === 'projects' ? '项目' : '讨论' }}
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="项目展示" name="projects">
        <div class="projects-grid">
          <el-card
            v-for="project in projects"
            :key="project.id"
            class="project-card"
            shadow="hover"
            @click="viewProject(project.id)"
          >
            <div class="project-image">
              <img :src="project.image" :alt="project.title" />
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="project-meta">
                <span class="author">{{ project.author }}</span>
                <span class="date">{{ project.date }}</span>
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
              <div class="project-stats">
                <span class="likes"><el-icon><ThumbsUp /></el-icon> {{ project.likes }}</span>
                <span class="comments"><el-icon><ChatDotRound /></el-icon> {{ project.comments }}</span>
              </div>
            </div>
          </el-card>
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
</style>
