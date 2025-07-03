import request from './request'

/**
 * 获取讨论列表
 * @param params 查询参数，包括分页、关键词等
 * @returns 讨论列表
 */
export function getDiscussions(params: {
  page?: number;
  size?: number;
  keyword?: string;
  sort?: string;
}) {
  return request({
    url: '/discussion/list',
    method: 'get',
    params
  })
}

/**
 * 获取讨论详情
 * @param id 讨论ID
 * @returns 讨论详情
 */
export function getDiscussionDetail(id: number | string) {
  return request({
    url: `/discussion/${id}`,
    method: 'get'
  })
}

/**
 * 创建新讨论
 * @param data 讨论数据
 * @returns 创建结果
 */
export function createDiscussion(data: {
  title: string;
  content: string;
  tags?: string[];
}) {
  return request({
    url: '/discussion/create',
    method: 'post',
    data
  })
}

/**
 * 更新讨论
 * @param id 讨论ID
 * @param data 更新数据
 * @returns 更新结果
 */
export function updateDiscussion(id: number | string, data: {
  title?: string;
  content?: string;
  tags?: string[];
}) {
  return request({
    url: `/discussion/${id}/update`,
    method: 'put',
    data
  })
}

/**
 * 删除讨论
 * @param id 讨论ID
 * @returns 删除结果
 */
export function deleteDiscussion(id: number | string) {
  return request({
    url: `/discussion/${id}/delete`,
    method: 'delete'
  })
}

/**
 * 获取讨论回复
 * @param id 讨论ID
 * @param params 查询参数，包括分页等
 * @returns 回复列表
 */
export function getDiscussionReplies(id: number | string, params?: {
  page?: number;
  size?: number;
}) {
  return request({
    url: `/discussion/${id}/replies`,
    method: 'get',
    params
  })
}

/**
 * 添加讨论回复
 * @param id 讨论ID
 * @param data 回复内容
 * @returns 操作结果
 */
export function addDiscussionReply(id: number | string, data: {
  content: string;
  parentId?: number;
}) {
  return request({
    url: `/discussion/${id}/replies`,
    method: 'post',
    data
  })
}

/**
 * 点赞讨论
 * @param id 讨论ID
 * @returns 操作结果
 */
export function likeDiscussion(id: number | string) {
  return request({
    url: `/discussion/${id}/like`,
    method: 'post'
  })
}

/**
 * 取消点赞讨论
 * @param id 讨论ID
 * @returns 操作结果
 */
export function unlikeDiscussion(id: number | string) {
  return request({
    url: `/discussion/${id}/like`,
    method: 'delete'
  })
}

/**
 * 收藏讨论
 * @param id 讨论ID
 * @returns 操作结果
 */
export function favoriteDiscussion(id: number | string) {
  return request({
    url: `/discussion/${id}/favorite`,
    method: 'post'
  })
}

/**
 * 取消收藏讨论
 * @param id 讨论ID
 * @returns 操作结果
 */
export function unfavoriteDiscussion(id: number | string) {
  return request({
    url: `/discussion/${id}/favorite`,
    method: 'delete'
  })
}

/**
 * 获取热门讨论
 * @param limit 获取数量
 * @returns 热门讨论列表
 */
export function getHotDiscussions(limit: number = 5) {
  return request({
    url: '/discussion/hot',
    method: 'get',
    params: { limit }
  })
}
