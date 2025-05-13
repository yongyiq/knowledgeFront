<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前竞赛
const currentCompetitions = ref([
  {
    id: 1,
    title: '2023华为软件精英挑战赛',
    status: '报名中',
    startDate: '2023-12-01',
    endDate: '2024-04-15',
    participants: 1250,
    prize: '总奖金池50万元',
    image: 'https://via.placeholder.com/800x300?text=华为软件精英挑战赛',
    description: '华为软件精英挑战赛是华为面向全国高校开展的大型算法编程比赛，旨在选拔优秀的软件人才，提升学生的算法设计和编程能力。'
  },
  {
    id: 2,
    title: '华为云AI大赛',
    status: '进行中',
    startDate: '2023-11-15',
    endDate: '2024-03-20',
    participants: 980,
    prize: '总奖金池30万元',
    image: 'https://via.placeholder.com/800x300?text=华为云AI大赛',
    description: '华为云AI大赛聚焦人工智能领域的前沿技术，鼓励参赛者利用华为云AI服务和平台，解决实际场景中的问题，推动AI技术的创新应用。'
  },
  {
    id: 3,
    title: '华为ICT大赛',
    status: '即将开始',
    startDate: '2024-01-10',
    endDate: '2024-05-30',
    participants: 0,
    prize: '总奖金池40万元',
    image: 'https://via.placeholder.com/800x300?text=华为ICT大赛',
    description: '华为ICT大赛是面向全球高校学生的信息与通信技术大赛，旨在促进ICT技术创新与应用，培养具有实践能力和创新精神的ICT人才。'
  }
])

// 历届竞赛
const pastCompetitions = ref([
  {
    id: 4,
    title: '2022华为软件精英挑战赛',
    year: '2022',
    participants: 1500,
    winners: [
      { rank: '冠军', team: '清华大学-算法之光', members: '张三、李四、王五' },
      { rank: '亚军', team: '北京大学-代码先锋', members: '赵六、钱七、孙八' },
      { rank: '季军', team: '浙江大学-编程之星', members: '周九、吴十、郑十一' }
    ],
    summary: '2022年华为软件精英挑战赛以"智能调度"为主题，参赛选手需要设计高效的算法解决复杂的资源调度问题。',
    image: 'https://via.placeholder.com/400x200?text=2022华为软件精英挑战赛'
  },
  {
    id: 5,
    title: '2022华为云AI大赛',
    year: '2022',
    participants: 1200,
    winners: [
      { rank: '冠军', team: '复旦大学-AI创新团队', members: '张三、李四、王五' },
      { rank: '亚军', team: '上海交通大学-智能先锋', members: '赵六、钱七、孙八' },
      { rank: '季军', team: '南京大学-深度学习小组', members: '周九、吴十、郑十一' }
    ],
    summary: '2022年华为云AI大赛以"智慧城市"为主题，参赛选手需要利用AI技术解决城市管理和服务中的实际问题。',
    image: 'https://via.placeholder.com/400x200?text=2022华为云AI大赛'
  },
  {
    id: 6,
    title: '2022华为ICT大赛',
    year: '2022',
    participants: 1800,
    winners: [
      { rank: '冠军', team: '哈尔滨工业大学-网络精英', members: '张三、李四、王五' },
      { rank: '亚军', team: '西安电子科技大学-通信先锋', members: '赵六、钱七、孙八' },
      { rank: '季军', team: '电子科技大学-ICT创新团队', members: '周九、吴十、郑十一' }
    ],
    summary: '2022年华为ICT大赛以"数字化转型"为主题，参赛选手需要设计和实现面向企业数字化转型的ICT解决方案。',
    image: 'https://via.placeholder.com/400x200?text=2022华为ICT大赛'
  }
])

// 优秀作品
const excellentWorks = ref([
  {
    id: 7,
    title: '基于华为云的智能交通系统',
    team: '清华大学-算法之光',
    competition: '2022华为软件精英挑战赛',
    description: '利用华为云服务和AI技术，设计了一套智能交通系统，能够实时监控交通状况，优化交通信号灯控制，提高道路通行效率。',
    image: 'https://via.placeholder.com/300x200?text=智能交通系统'
  },
  {
    id: 8,
    title: '智慧校园管理平台',
    team: '复旦大学-AI创新团队',
    competition: '2022华为云AI大赛',
    description: '基于华为云和IoT技术，开发了一套智慧校园管理平台，实现了校园安防、能源管理、教室调度等功能的智能化和自动化。',
    image: 'https://via.placeholder.com/300x200?text=智慧校园管理平台'
  },
  {
    id: 9,
    title: '企业网络安全解决方案',
    team: '哈尔滨工业大学-网络精英',
    competition: '2022华为ICT大赛',
    description: '针对企业网络安全需求，设计了一套全面的安全解决方案，包括网络防护、数据加密、安全审计等模块，有效提升企业信息安全水平。',
    image: 'https://via.placeholder.com/300x200?text=企业网络安全解决方案'
  }
])

// 查看竞赛详情
const viewCompetition = (id: number) => {
  router.push(`/content/${id}`)
}

// 查看优秀作品
const viewWork = (id: number) => {
  router.push(`/content/${id}`)
}

// 当前活动标签
const activeTab = ref('current')
</script>

<template>
  <div class="competition-container container">
    <div class="page-header">
      <h1>竞赛专区</h1>
      <p>了解最新竞赛信息，查看历届竞赛回顾，展示优秀参赛作品</p>
    </div>

    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="当前竞赛" name="current">
        <div class="current-competitions">
          <el-card
            v-for="competition in currentCompetitions"
            :key="competition.id"
            class="competition-card"
            shadow="hover"
            @click="viewCompetition(competition.id)"
          >
            <div class="competition-image">
              <img :src="competition.image" :alt="competition.title" />
              <div class="competition-status" :class="competition.status">
                {{ competition.status }}
              </div>
            </div>
            <div class="competition-content">
              <h3 class="competition-title">{{ competition.title }}</h3>
              <div class="competition-meta">
                <div class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ competition.startDate }} 至 {{ competition.endDate }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><User /></el-icon>
                  <span>{{ competition.participants }} 人参与</span>
                </div>
                <div class="meta-item">
                  <el-icon><Trophy /></el-icon>
                  <span>{{ competition.prize }}</span>
                </div>
              </div>
              <p class="competition-description">{{ competition.description }}</p>
              <el-button type="primary">查看详情</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="历届竞赛" name="past">
        <div class="past-competitions">
          <el-collapse accordion>
            <el-collapse-item
              v-for="competition in pastCompetitions"
              :key="competition.id"
              :title="competition.title"
              :name="competition.id"
            >
              <div class="past-competition-content">
                <div class="past-competition-image">
                  <img :src="competition.image" :alt="competition.title" />
                </div>
                <div class="past-competition-info">
                  <div class="info-item">
                    <strong>举办年份：</strong>{{ competition.year }}
                  </div>
                  <div class="info-item">
                    <strong>参赛人数：</strong>{{ competition.participants }} 人
                  </div>
                  <div class="info-item">
                    <strong>竞赛简介：</strong>{{ competition.summary }}
                  </div>
                  <div class="winners-table">
                    <h4>获奖团队</h4>
                    <el-table :data="competition.winners" style="width: 100%">
                      <el-table-column prop="rank" label="名次" width="100" />
                      <el-table-column prop="team" label="团队名称" />
                      <el-table-column prop="members" label="成员" />
                    </el-table>
                  </div>
                  <el-button type="primary" @click.stop="viewCompetition(competition.id)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>

      <el-tab-pane label="优秀作品" name="works">
        <div class="excellent-works">
          <div class="works-grid">
            <el-card
              v-for="work in excellentWorks"
              :key="work.id"
              class="work-card"
              shadow="hover"
              @click="viewWork(work.id)"
            >
              <div class="work-image">
                <img :src="work.image" :alt="work.title" />
              </div>
              <div class="work-content">
                <h3 class="work-title">{{ work.title }}</h3>
                <div class="work-meta">
                  <div class="meta-item">
                    <strong>团队：</strong>{{ work.team }}
                  </div>
                  <div class="meta-item">
                    <strong>竞赛：</strong>{{ work.competition }}
                  </div>
                </div>
                <p class="work-description">{{ work.description }}</p>
                <el-button type="primary" text>查看详情</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.competition-container {
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

.main-tabs {
  margin-bottom: 30px;
}

.current-competitions {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.competition-card {
  cursor: pointer;
  overflow: hidden;
}

.competition-image {
  position: relative;
  height: 300px;
  overflow: hidden;
  margin-bottom: 20px;
}

.competition-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.competition-card:hover .competition-image img {
  transform: scale(1.05);
}

.competition-status {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

.competition-status.报名中 {
  background-color: #67c23a;
}

.competition-status.进行中 {
  background-color: #409eff;
}

.competition-status.即将开始 {
  background-color: #e6a23c;
}

.competition-content {
  padding: 0 20px 20px;
}

.competition-title {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5em;
}

.competition-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.competition-description {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
}

.past-competition-content {
  display: flex;
  gap: 30px;
}

.past-competition-image {
  width: 300px;
  flex-shrink: 0;
}

.past-competition-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.past-competition-info {
  flex: 1;
}

.info-item {
  margin-bottom: 10px;
  color: #666;
}

.winners-table {
  margin: 20px 0;
}

.winners-table h4 {
  margin-bottom: 10px;
  color: #333;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.work-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.work-image {
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.work-card:hover .work-image img {
  transform: scale(1.05);
}

.work-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.work-title {
  margin-bottom: 10px;
  color: #333;
}

.work-meta {
  margin-bottom: 10px;
  color: #666;
  font-size: 0.9em;
}

.work-description {
  margin-bottom: 15px;
  color: #666;
  flex: 1;
}

@media (max-width: 768px) {
  .past-competition-content {
    flex-direction: column;
  }

  .past-competition-image {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
