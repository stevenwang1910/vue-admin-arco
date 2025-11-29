import axios from 'axios'

export interface ContentDataRecord {
  id: string
  title: string
  category: string
  status: 'published' | 'draft' | 'archived'
  author: string
  publishDate: string
  views: number
  likes: number
  comments: number
  tags: string[]
  content: string
  createdAt: string
  updatedAt: string
}

export interface ContentListParams {
  current: number
  pageSize: number
  title?: string
  category?: string
  status?: string
  author?: string
  startDate?: string
  endDate?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ContentListResponse {
  list: ContentDataRecord[]
  total: number
  current: number
  pageSize: number
}

export interface CreateContentData {
  title: string
  category: string
  status: 'published' | 'draft' | 'archived'
  author: string
  content: string
  tags: string[]
  publishDate?: string
}

export interface UpdateContentData extends Partial<CreateContentData> {
  id: string
}

export interface CategoryOption {
  value: string
  label: string
  count: number
}

export interface ContentStats {
  totalContent: number
  publishedContent: number
  draftContent: number
  archivedContent: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

export function queryContentList(params: ContentListParams) {
  return axios.get<ContentListResponse>('/api/content/list', { params })
}

export function createContent(data: CreateContentData) {
  return axios.post<ContentDataRecord>('/api/content', data)
}

export function updateContent(data: UpdateContentData) {
  return axios.put<ContentDataRecord>(`/api/content/${data.id}`, data)
}

export function deleteContent(id: string) {
  return axios.delete(`/api/content/${id}`)
}

export function getContentById(id: string) {
  return axios.get<ContentDataRecord>(`/api/content/${id}`)
}

export function getContentCategories() {
  return axios.get<CategoryOption[]>('/api/content/categories')
}

export function getContentStats() {
  return axios.get<ContentStats>('/api/content/stats')
}
