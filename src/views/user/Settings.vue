<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserInfo, updateUserInfo, changePassword } from '@/api/auth'
import type { UserInfo } from '@/api/types'
import eventBus from '@/utils/eventBus'
import { hashPasswordSecure } from '@/utils/crypto'

const router = useRouter()

// 用户信息表单
const userForm = reactive({
  username: '',
  nickname: '',
  email: '',
  bio: '',
  avatar: 'https://via.placeholder.com/150'
})

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 加载状态
const loading = ref(false)
const userFormRef = ref()
const passwordFormRef = ref()

// 当前活动标签
const activeTab = ref('profile')

// 安全设置
const securitySettings = reactive({
  twoFactorAuth: false
})

// 通知设置
const notificationSettings = reactive({
  systemNotifications: true,
  activityNotifications: true,
  commentReplies: true,
  privateMessages: true
})

// 加载用户数据
const fetchUserData = async () => {
  try {
    // 调用API获取用户信息
    const userData = await getUserInfo() as UserInfo

    // 更新用户表单数据
    userForm.username = userData.username
    userForm.nickname = userData.nickname || userData.username
    userForm.email = userData.email
    userForm.bio = userData.bio || ''
    userForm.avatar = userData.avatar || 'https://via.placeholder.com/150'
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    ElMessage.error('获取用户数据失败')
  }
}

onMounted(() => {
  // 检查是否已登录
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  // 从本地存储获取基本用户信息
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    userForm.username = user.username
    userForm.nickname = user.nickname || user.username
    userForm.avatar = user.avatar

    // 获取完整的用户数据
    fetchUserData()
  }
})

// 更新个人资料
const updateProfile = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true

      try {
        // 调用更新用户信息API
        await updateUserInfo({
          username: userForm.username,
          nickname: userForm.nickname,
          email: userForm.email,
          bio: userForm.bio,
          avatar: userForm.avatar
        })

        // 更新本地存储的用户信息
        const user = {
          id: 1, // 这里应该使用实际的用户ID
          username: userForm.username,
          nickname: userForm.nickname,
          avatar: userForm.avatar
        }
        localStorage.setItem('user', JSON.stringify(user))

        // 触发用户信息更新事件
        eventBus.emit('update-user')

        ElMessage.success('个人资料更新成功')
        loading.value = false
      } catch (error) {
        ElMessage.error('更新失败，请稍后再试')
        loading.value = false
      }
    }
  })
}

// 修改密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true

      try {
        // 对旧密码和新密码进行哈希处理，使用更安全的PBKDF2算法
        const hashedOldPassword = hashPasswordSecure(passwordForm.oldPassword)
        const hashedNewPassword = hashPasswordSecure(passwordForm.newPassword)

        // 调用修改密码API，发送哈希后的密码
        await changePassword({
          oldPassword: hashedOldPassword,
          newPassword: hashedNewPassword
        })

        ElMessage.success('密码修改成功')

        // 清空表单
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''

        loading.value = false
      } catch (error) {
        ElMessage.error('密码修改失败，请检查当前密码是否正确')
        loading.value = false
      }
    }
  })
}

// 返回个人中心
const goToProfile = () => {
  router.push('/profile')
}

// 上传头像
const handleAvatarSuccess = (response: any) => {
  userForm.avatar = response.url
}

// 上传前检查
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}
</script>

<template>
  <div class="settings-container container">
    <div class="settings-header">
      <h1>账号设置</h1>
      <el-button @click="goToProfile">返回个人中心</el-button>
    </div>

    <div class="settings-content">
      <el-tabs v-model="activeTab" tab-position="left">
        <el-tab-pane label="个人资料" name="profile">
          <h2>个人资料</h2>
          <el-form
            ref="userFormRef"
            :model="userForm"
            :rules="userRules"
            label-width="100px"
            class="user-form"
          >
            <el-form-item label="头像">
              <div class="avatar-uploader">
                <el-avatar :size="100" :src="userForm.avatar" />
                <div class="upload-btn">
                  <el-button size="small">更换头像</el-button>
                  <p class="upload-tip">支持 JPG、PNG 格式，不超过 2MB</p>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" />
              <div class="form-tip">用户名仅用于登录，只能包含字母、数字和下划线</div>
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="userForm.nickname" />
              <div class="form-tip">昵称将在前台展示</div>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" />
            </el-form-item>

            <el-form-item label="个人简介">
              <el-input
                v-model="userForm.bio"
                type="textarea"
                :rows="4"
                placeholder="介绍一下自己吧"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="updateProfile"
              >
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="password">
          <h2>修改密码</h2>
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入当前密码"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="updatePassword"
              >
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="账号安全" name="security">
          <h2>账号安全</h2>
          <div class="security-settings">
            <div class="security-item">
              <div class="security-info">
                <h3>登录邮箱</h3>
                <p>用于登录账号和接收通知</p>
              </div>
              <div class="security-status">
                <el-tag type="success">已绑定</el-tag>
                <el-button type="primary" text>修改</el-button>
              </div>
            </div>

            <el-divider />

            <div class="security-item">
              <div class="security-info">
                <h3>手机号码</h3>
                <p>用于账号安全验证和接收通知</p>
              </div>
              <div class="security-status">
                <el-tag type="info">未绑定</el-tag>
                <el-button type="primary" text>绑定</el-button>
              </div>
            </div>

            <el-divider />

            <div class="security-item">
              <div class="security-info">
                <h3>两步验证</h3>
                <p>增强账号安全性，登录时需要额外验证</p>
              </div>
              <div class="security-status">
                <el-switch v-model="securitySettings.twoFactorAuth" />
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notifications">
          <h2>通知设置</h2>
          <div class="notification-settings">
            <div class="notification-item">
              <div class="notification-info">
                <h3>系统通知</h3>
                <p>接收系统更新、维护等通知</p>
              </div>
              <div class="notification-status">
                <el-switch v-model="notificationSettings.systemNotifications" />
              </div>
            </div>

            <el-divider />

            <div class="notification-item">
              <div class="notification-info">
                <h3>活动通知</h3>
                <p>接收最新活动、竞赛等通知</p>
              </div>
              <div class="notification-status">
                <el-switch v-model="notificationSettings.activityNotifications" />
              </div>
            </div>

            <el-divider />

            <div class="notification-item">
              <div class="notification-info">
                <h3>评论回复</h3>
                <p>当有人回复你的评论时通知你</p>
              </div>
              <div class="notification-status">
                <el-switch v-model="notificationSettings.commentReplies" />
              </div>
            </div>

            <el-divider />

            <div class="notification-item">
              <div class="notification-info">
                <h3>私信通知</h3>
                <p>当收到新私信时通知你</p>
              </div>
              <div class="notification-status">
                <el-switch v-model="notificationSettings.privateMessages" />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 30px 0;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.settings-header h1 {
  margin: 0;
  color: #333;
}

.settings-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.settings-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 20px;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.user-form,
.password-form {
  max-width: 500px;
}

.security-item,
.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.security-info h3,
.notification-info h3 {
  margin: 0 0 5px;
  color: #333;
}

.security-info p,
.notification-info p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.security-status,
.notification-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

@media (max-width: 768px) {
  .settings-content {
    padding: 15px;
  }

  .security-item,
  .notification-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .security-status,
  .notification-status {
    align-self: flex-end;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>
