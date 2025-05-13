/**
 * 知识分类
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  count: number;
  parentId?: number;
  children?: Category[];
  createTime?: string;
  updateTime?: string;
}

/**
 * 知识文章
 */
export interface Article {
  id: number;
  title: string;
  summary: string;
  content?: string;
  category?: string;
  categoryId: number;
  createBy: string;  // 替代 author
  authorId: number;
  viewCount: number;  // 替代 views
  likeCount: number;  // 替代 likes
  commentCount: number;  // 替代 comments
  tags?: string[];
  coverImage?: string;
  isFeatured?: number;  // 替代 isFavorite，0为否，1为是
  isLiked?: boolean;
  status?: string;
  createTime: string;  // 替代 date
  updateTime?: string;
  updateBy?: string;
  delFlag?: number;
}

/**
 * 文章评论
 */
export interface Comment {
  id: number;
  content: string;
  articleId: number;
  userId: number;
  username: string;
  userAvatar?: string;
  parentId?: number;
  children?: Comment[];
  createTime: string;
  updateTime?: string;
  likes?: number;
  isLiked?: boolean;
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 文章列表响应
 */
export type ArticleListResponse = PageResponse<Article>;

/**
 * 评论列表响应
 */
export type CommentListResponse = PageResponse<Comment>;
