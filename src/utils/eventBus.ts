import mitt from 'mitt'

// 定义事件类型
export type Events = {
  'login': void; // 登录事件
  'logout': void; // 登出事件
  'update-user': void; // 更新用户信息事件
}

// 创建事件总线实例
const eventBus = mitt<Events>()

export default eventBus
