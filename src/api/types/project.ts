/**
 * 项目状态枚举
 */
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}



/**
 * 项目团队成员
 */
export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  avatar?: string;
  userId?: number;
}

/**
 * 项目截图
 */
export interface Screenshot {
  id?: number;
  url: string;
  description?: string;
}

/**
 * 项目信息
 */
export interface Project {
  id: number;
  title: string;
  summary: string;
  content?: string;
  categoryId?: number;
  createBy: string;
  authorId: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: string[];
  coverImage?: string;
  isFeatured?: number; // 0为否，1为是
  isLiked?: boolean;
  status: ProjectStatus | string;
  repoUrl?: string;
  demoUrl?: string;
  team?: TeamMember[];
  screenshots?: Screenshot[] | string[];
  createTime: string;
  updateTime?: string;
  updateBy?: string;
  delFlag?: number;
}

/**
 * 项目评论
 */
export interface ProjectComment {
  id: number;
  content: string;
  projectId: number;
  userId: number;
  username: string;
  userAvatar?: string;
  parentId?: number;
  children?: ProjectComment[];
  createTime: string;
  updateTime?: string;
  likes?: number;
  isLiked?: boolean;
}

/**
 * 分页响应
 */
export interface ProjectPageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 项目列表响应
 */
export type ProjectListResponse = ProjectPageResponse<Project>;

/**
 * 项目评论列表响应
 */
export type ProjectCommentListResponse = ProjectPageResponse<ProjectComment>;
