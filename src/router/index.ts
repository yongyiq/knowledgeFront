import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  // 二级页面 - 知识库
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('../views/sections/Knowledge.vue'),
    meta: {
      title: '知识库'
    }
  },
  // 二级页面 - 项目分享与讨论
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/sections/Projects.vue'),
    meta: {
      title: '项目分享与讨论'
    }
  },
  // 二级页面 - 华为竞赛专区
  {
    path: '/competition',
    name: 'Competition',
    component: () => import('../views/sections/Competition.vue'),
    meta: {
      title: '华为竞赛专区'
    }
  },
  // 二级页面 - 实用工具板块
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/sections/Tools.vue'),
    meta: {
      title: '实用工具'
    }
  },
  // 二级页面 - 华俱微信推文
  {
    path: '/wechat-articles',
    name: 'WechatArticles',
    component: () => import('../views/sections/WechatArticles.vue'),
    meta: {
      title: '华俱微信推文'
    }
  },
  // 二级页面 - 师兄师姐说（经验分享）
  {
    path: '/experience',
    name: 'Experience',
    component: () => import('../views/sections/Experience.vue'),
    meta: {
      title: '师兄师姐说'
    }
  },
  // 三级页面 - 内容详情页
  {
    path: '/content/:id',
    name: 'Content',
    component: () => import('../views/content/ContentDetail.vue'),
    meta: {
      title: '内容详情'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '华为创新俱乐部'}`
  next()
})

export default router
