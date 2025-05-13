import request from './request'

/**
 * 获取知识分类列表
 * @param params 查询参数
 * @returns 分类列表
 */
export function getCategories(params?: any) {
  return request({
    url: '/knowledge/categories',
    method: 'get',
    params
  })
}

/**
 * 获取知识文章列表
 * @param params 查询参数，包括分页、分类、关键词等
 * @returns 文章列表
 */
export function getArticles(params: {
  page?: number;
  size?: number;
  category?: string;
  keyword?: string;
  sort?: string;
}) {
  return request({
    url: '/knowledge/articles',
    method: 'get',
    params
  })
}

/**
 * 获取文章详情
 * @param id 文章ID
 * @returns 文章详情
 */
export function getArticleDetail(id: number | string) {
  return request({
    url: `/knowledge/articles/${id}`,
    method: 'get'
  })
}

/**
 * 获取热门文章
 * @param limit 获取数量
 * @returns 热门文章列表
 */
export function getHotArticles(limit: number = 5) {
  return request({
    url: '/knowledge/articles/hot',
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取相关文章
 * @param id 当前文章ID
 * @param limit 获取数量
 * @returns 相关文章列表
 */
export function getRelatedArticles(id: number | string, limit: number = 3) {
  return request({
    url: `/knowledge/articles/${id}/related`,
    method: 'get',
    params: { limit }
  })
}

/**
 * 收藏文章
 * @param id 文章ID
 * @returns 操作结果
 */
export function favoriteArticle(id: number | string) {
  return request({
    url: `/knowledge/articles/${id}/favorite`,
    method: 'post'
  })
}

/**
 * 取消收藏文章
 * @param id 文章ID
 * @returns 操作结果
 */
export function unfavoriteArticle(id: number | string) {
  return request({
    url: `/knowledge/articles/${id}/favorite`,
    method: 'delete'
  })
}

/**
 * 点赞文章
 * @param id 文章ID
 * @returns 操作结果
 */
export function likeArticle(id: number | string) {
  return request({
    url: `/knowledge/articles/${id}/like`,
    method: 'post'
  })
}

/**
 * 取消点赞文章
 * @param id 文章ID
 * @returns 操作结果
 */
export function unlikeArticle(id: number | string) {
  return request({
    url: `/knowledge/articles/${id}/like`,
    method: 'delete'
  })
}

/**
 * 获取文章评论
 * @param id 文章ID
 * @param params 查询参数，包括分页等
 * @returns 评论列表
 */
export function getArticleComments(id: number | string, params?: {
  page?: number;
  size?: number;
}) {
  return request({
    url: `/knowledge/articles/${id}/comments`,
    method: 'get',
    params
  })
}

/**
 * 发表评论
 * @param id 文章ID
 * @param data 评论内容
 * @returns 操作结果
 */
export function addComment(id: number | string, data: {
  content: string;
  parentId?: number;
}) {
  return request({
    url: `/knowledge/articles/${id}/comments`,
    method: 'post',
    data
  })
}
