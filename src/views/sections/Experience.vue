<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 经验分享列表
const experiences = ref([
  {
    id: 1,
    name: '张明',
    avatar: 'https://via.placeholder.com/100?text=ZM',
    title: '从校园到职场：我在华为的成长之路',
    position: '华为云计算工程师',
    graduation: '2020年毕业于北京大学计算机科学与技术专业',
    tags: ['职业发展', '华为', '云计算'],
    summary: '分享了从大学到华为工作的经历，包括校园招聘、入职培训、技术成长和职业发展等方面的经验和建议。',
    date: '2023-12-10',
    views: 1250
  },
  {
    id: 2,
    name: '李华',
    avatar: 'https://via.placeholder.com/100?text=LH',
    title: '如何准备华为的技术面试',
    position: '华为2012实验室算法工程师',
    graduation: '2021年毕业于清华大学人工智能专业',
    tags: ['面试经验', '算法', '技术准备'],
    summary: '详细介绍了华为技术岗位的面试流程、考察重点和准备方法，分享了个人的面试经历和成功经验。',
    date: '2023-12-05',
    views: 980
  },
  {
    id: 3,
    name: '王强',
    avatar: 'https://via.placeholder.com/100?text=WQ',
    title: '在华为参与开源项目的经验分享',
    position: '华为开源技术专家',
    graduation: '2019年毕业于上海交通大学软件工程专业',
    tags: ['开源项目', '技术贡献', '社区参与'],
    summary: '分享了在华为参与开源项目的经历，包括项目选择、代码贡献、社区交流和技术成长等方面的经验。',
    date: '2023-11-28',
    views: 850
  },
  {
    id: 4,
    name: '赵敏',
    avatar: 'https://via.placeholder.com/100?text=ZM',
    title: '从实习生到正式员工：我的华为实习经历',
    position: '华为消费者业务部产品经理',
    graduation: '2022年毕业于复旦大学计算机科学与技术专业',
    tags: ['实习经验', '校招', '产品管理'],
    summary: '分享了在华为实习的经历，包括实习岗位申请、日常工作、技能提升和转正经验，为在校生提供参考。',
    date: '2023-11-20',
    views: 920
  },
  {
    id: 5,
    name: '钱伟',
    avatar: 'https://via.placeholder.com/100?text=QW',
    title: '我的研究生学习和科研经验',
    position: '华为无线技术实验室研究员',
    graduation: '2018年毕业于哈尔滨工业大学通信工程专业',
    tags: ['研究生', '科研经验', '论文发表'],
    summary: '分享了研究生阶段的学习方法、科研经验和论文发表经历，以及如何将学术研究与工业应用相结合的体会。',
    date: '2023-11-15',
    views: 780
  },
  {
    id: 6,
    name: '孙丽',
    avatar: 'https://via.placeholder.com/100?text=SL',
    title: '如何平衡工作与生活：我的职场体验',
    position: '华为人力资源专员',
    graduation: '2020年毕业于武汉大学工商管理专业',
    tags: ['工作与生活平衡', '职场经验', '自我管理'],
    summary: '分享了在华为工作期间如何平衡工作与生活的经验，包括时间管理、压力调节和自我提升等方面的心得。',
    date: '2023-11-10',
    views: 650
  }
])

// 推荐导师
const mentors = ref([
  {
    id: 7,
    name: '陈博士',
    avatar: 'https://via.placeholder.com/100?text=CB',
    position: '华为高级技术专家',
    expertise: '人工智能、机器学习',
    experience: '10年+行业经验',
    contact: 'mentor_chen@example.com'
  },
  {
    id: 8,
    name: '林教授',
    avatar: 'https://via.placeholder.com/100?text=LJ',
    position: '某知名高校副教授，华为技术顾问',
    expertise: '通信技术、信号处理',
    experience: '15年+教学与研究经验',
    contact: 'mentor_lin@example.com'
  },
  {
    id: 9,
    name: '张总监',
    avatar: 'https://via.placeholder.com/100?text=ZZ',
    position: '华为产品部门总监',
    expertise: '产品管理、市场策略',
    experience: '12年+产品管理经验',
    contact: 'mentor_zhang@example.com'
  }
])

// 搜索关键词
const searchKeyword = ref('')

// 筛选后的经验分享列表
const filteredExperiences = computed(() => {
  if (!searchKeyword.value) return experiences.value

  return experiences.value.filter(exp =>
    exp.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    exp.summary.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    exp.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 查看经验分享详情
const viewExperience = (id: number) => {
  router.push(`/content/${id}`)
}

// 联系导师
const contactMentor = (email: string) => {
  window.location.href = `mailto:${email}`
}

// 提交经验分享
const submitExperience = () => {
  // 实际应用中可能会跳转到提交页面或打开对话框
  console.log('提交经验分享')
}
</script>

<template>
  <div class="experience-container container">
    <div class="page-header">
      <h1>师兄师姐说</h1>
      <p>分享学长学姐的经验和建议，助力你的学习和职业发展</p>
    </div>

    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索经验分享..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <div class="experience-content">
      <!-- 主内容区 - 经验分享列表 -->
      <div class="main-content">
        <div class="experiences-list">
          <el-empty v-if="filteredExperiences.length === 0" description="没有找到匹配的经验分享" />

          <el-card
            v-for="exp in filteredExperiences"
            :key="exp.id"
            class="experience-card"
            shadow="hover"
            @click="viewExperience(exp.id)"
          >
            <div class="experience-layout">
              <div class="author-info">
                <div class="avatar">
                  <img :src="exp.avatar" :alt="exp.name" />
                </div>
                <div class="author-details">
                  <h3 class="author-name">{{ exp.name }}</h3>
                  <p class="author-position">{{ exp.position }}</p>
                  <p class="author-graduation">{{ exp.graduation }}</p>
                </div>
              </div>
              <div class="experience-info">
                <h3 class="experience-title">{{ exp.title }}</h3>
                <div class="experience-tags">
                  <el-tag
                    v-for="tag in exp.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                    class="tag"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <p class="experience-summary">{{ exp.summary }}</p>
                <div class="experience-meta">
                  <span class="date">{{ exp.date }}</span>
                  <span class="views"><el-icon><View /></el-icon> {{ exp.views }}</span>
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

      <!-- 侧边栏 - 推荐导师和提交入口 -->
      <div class="sidebar">
        <div class="submit-experience">
          <h3>分享你的经验</h3>
          <p>如果你是学长学姐，欢迎分享你的经验和建议，帮助更多的同学。</p>
          <el-button type="primary" @click="submitExperience">提交经验分享</el-button>
        </div>

        <div class="mentors-section">
          <h3>推荐导师</h3>
          <el-divider />
          <div class="mentors-list">
            <el-card
              v-for="mentor in mentors"
              :key="mentor.id"
              class="mentor-card"
              shadow="hover"
            >
              <div class="mentor-info">
                <div class="mentor-avatar">
                  <img :src="mentor.avatar" :alt="mentor.name" />
                </div>
                <div class="mentor-details">
                  <h4 class="mentor-name">{{ mentor.name }}</h4>
                  <p class="mentor-position">{{ mentor.position }}</p>
                  <p class="mentor-expertise"><strong>专长：</strong>{{ mentor.expertise }}</p>
                  <p class="mentor-experience"><strong>经验：</strong>{{ mentor.experience }}</p>
                  <el-button
                    size="small"
                    type="primary"
                    @click.stop="contactMentor(mentor.contact)"
                  >
                    联系导师
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experience-container {
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

.experience-content {
  display: flex;
  gap: 30px;
}

.main-content {
  flex: 1;
}

.experiences-list {
  margin-bottom: 30px;
}

.experience-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.experience-layout {
  display: flex;
  gap: 20px;
}

.author-info {
  width: 200px;
  flex-shrink: 0;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  margin-bottom: 5px;
  color: #333;
}

.author-position {
  color: #409eff;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.author-graduation {
  color: #666;
  font-size: 0.8em;
}

.experience-info {
  flex: 1;
}

.experience-title {
  margin-bottom: 10px;
  color: #333;
}

.experience-tags {
  margin-bottom: 10px;
}

.tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.experience-summary {
  margin-bottom: 15px;
  color: #666;
  line-height: 1.6;
}

.experience-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.9em;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.submit-experience {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.submit-experience h3 {
  margin-bottom: 10px;
  color: #333;
}

.submit-experience p {
  margin-bottom: 15px;
  color: #666;
}

.mentors-section h3 {
  margin-bottom: 10px;
  color: #333;
}

.mentors-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mentor-card {
  cursor: default;
}

.mentor-info {
  display: flex;
  gap: 15px;
}

.mentor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.mentor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mentor-details {
  flex: 1;
}

.mentor-name {
  margin-bottom: 5px;
  color: #333;
}

.mentor-position {
  color: #409eff;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.mentor-expertise,
.mentor-experience {
  color: #666;
  font-size: 0.8em;
  margin-bottom: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .experience-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    order: -1;
    margin-bottom: 30px;
  }

  .experience-layout {
    flex-direction: column;
  }

  .author-info {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
