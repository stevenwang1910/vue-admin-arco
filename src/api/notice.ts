import axios from 'axios'

// 公告数据类型定义
export interface Notice {
  id: string
  title: string
  content: string
  status: 'draft' | 'published'
  author: string
  publishTime: string | null
  createTime: string
  updateTime: string
  priority: 'low' | 'medium' | 'high'
}

// 公告列表请求参数
export interface NoticeListParams {
  page?: number
  pageSize?: number
  title?: string
  status?: string
  startTime?: string
  endTime?: string
}

// 公告列表响应数据
export interface NoticeListResponse {
  list: Notice[]
  total: number
  page: number
  pageSize: number
}

// 创建/更新公告请求参数
export interface CreateOrUpdateNoticeParams {
  id?: string
  title: string
  content: string
  status: 'draft' | 'published'
  priority?: 'low' | 'medium' | 'high'
}

// 获取公告列表
export function getNoticeList(params: NoticeListParams): Promise<NoticeListResponse> {
  return request({
    url: '/api/notice/list',
    method: 'post',
    data: params,
  })
}

// 获取公告详情
export function getNoticeDetail(id: string): Promise<Notice> {
  return request({
    url: '/api/notice/detail',
    method: 'post',
    data: { id },
  })
}

// 创建公告
export function createNotice(params: CreateOrUpdateNoticeParams): Promise<Notice> {
  return request({
    url: '/api/notice/create',
    method: 'post',
    data: params,
  })
}

// 更新公告
export function updateNotice(params: CreateOrUpdateNoticeParams): Promise<Notice> {
  return request({
    url: '/api/notice/update',
    method: 'post',
    data: params,
  })
}

// 发布公告
export function publishNotice(id: string): Promise<Notice> {
  return request({
    url: '/api/notice/publish',
    method: 'post',
    data: { id },
  })
}

// 撤销发布公告
export function unpublishNotice(id: string): Promise<Notice> {
  return request({
    url: '/api/notice/unpublish',
    method: 'post',
    data: { id },
  })
}

// 删除公告
export function deleteNotice(id: string): Promise<void> {
  return request({
    url: '/api/notice/delete',
    method: 'post',
    data: { id },
  })
}

// 批量删除公告
export function batchDeleteNotice(ids: string[]): Promise<void> {
  return request({
    url: '/api/notice/batch-delete',
    method: 'post',
    data: { ids },
  })
}
