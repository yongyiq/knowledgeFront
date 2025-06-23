import request from './request'

/**
 * 获取项目分类列表
 * @param params 查询参数
 * @returns 分类列表
 */
export function getProjectCategories(params?: any) {
  return request({
    url: '/project/categories',
    method: 'get',
    params
  })
}

/**
 * 获取项目列表
 * @param params 查询参数，包括分页、分类、关键词等
 * @returns 项目列表
 */
export function getProjects(params: {
  page?: number;
  size?: number;
  keyword?: string;
  sort?: string;
  status?: string; // 项目特有：状态过滤
}) {
  return request({
    url: '/project/list',
    method: 'get',
    params
  })
}

/**
 * 获取项目详情
 * @param id 项目ID
 * @returns 项目详情
 */
export function getProjectDetail(id: number | string) {
  return request({
    url: `/project/${id}`,
    method: 'get'
  })
}

/**
 * 获取热门项目
 * @param limit 获取数量
 * @returns 热门项目列表
 */
export function getHotProjects(limit: number = 5) {
  return request({
    url: '/project/hot',
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取相关项目
 * @param id 当前项目ID
 * @param limit 获取数量
 * @returns 相关项目列表
 */
export function getRelatedProjects(id: number | string, limit: number = 3) {
  return request({
    url: `/project/${id}/related`,
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取项目标签
 * @param id 项目ID
 * @returns 标签数组
 */
export function getProjectTags(id: number | string) {
  return request({
    url: `/project/${id}/tags`,
    method: 'get'
  })
}

/**
 * 点赞项目
 * @param id 项目ID
 * @returns 操作结果
 */
export function likeProject(id: number | string) {
  return request({
    url: `/project/${id}/like`,
    method: 'post'
  })
}

/**
 * 取消点赞项目
 * @param id 项目ID
 * @returns 操作结果
 */
export function unlikeProject(id: number | string) {
  return request({
    url: `/project/${id}/like`,
    method: 'delete'
  })
}

/**
 * 收藏项目
 * @param id 项目ID
 * @returns 操作结果
 */
export function favoriteProject(id: number | string) {
  return request({
    url: `/project/${id}/favorite`,
    method: 'post'
  })
}

/**
 * 取消收藏项目
 * @param id 项目ID
 * @returns 操作结果
 */
export function unfavoriteProject(id: number | string) {
  return request({
    url: `/project/${id}/favorite`,
    method: 'delete'
  })
}

/**
 * 获取项目评论
 * @param id 项目ID
 * @param params 查询参数，包括分页等
 * @returns 评论列表
 */
export function getProjectComments(id: number | string, params?: {
  page?: number;
  size?: number;
}) {
  return request({
    url: `/project/${id}/comments`,
    method: 'get',
    params
  })
}

/**
 * 添加项目评论
 * @param id 项目ID
 * @param data 评论内容
 * @returns 操作结果
 */
export function addProjectComment(id: number | string, data: {
  content: string;
  parentId?: number;
}) {
  return request({
    url: `/project/${id}/comments`,
    method: 'post',
    data
  })
}

/**
 * 获取项目团队成员
 * @param id 项目ID
 * @returns 团队成员列表
 */
export function getProjectTeam(id: number | string) {
  return request({
    url: `/project/${id}/team`,
    method: 'get'
  })
}

/**
 * 获取项目截图
 * @param id 项目ID
 * @returns 截图URL列表
 */
export function getProjectScreenshots(id: number | string) {
  return request({
    url: `/project/${id}/screenshots`,
    method: 'get'
  })
}

/**
 * 创建新项目
 * @param data 项目数据
 * @returns 创建结果
 */
export function createProject(data: {
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  tags?: string[];
  status?: string;
  repoUrl?: string;
  demoUrl?: string;
  team?: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  screenshots?: string[];
}) {
  return request({
    url: '/project/create',
    method: 'post',
    data
  })
}

/**
 * 更新项目
 * @param id 项目ID
 * @param data 更新数据
 * @returns 更新结果
 */
export function updateProject(id: number | string, data: {
  title?: string;
  summary?: string;
  content?: string;
  categoryId?: number;
  tags?: string[];
  status?: string;
  repoUrl?: string;
  demoUrl?: string;
  team?: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  screenshots?: string[];
}) {
  return request({
    url: `/project/${id}/update`,
    method: 'put',
    data
  })
}

/**
 * 删除项目
 * @param id 项目ID
 * @returns 删除结果
 */
export function deleteProject(id: number | string) {
  return request({
    url: `/project/${id}/delete`,
    method: 'delete'
  })
}
