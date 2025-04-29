<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #409eff;
}

h2 {
  font-size: 2rem;
  margin: 0 0 20px;
  color: #333;
}

p {
  margin-bottom: 30px;
  color: #666;
}
</style>
