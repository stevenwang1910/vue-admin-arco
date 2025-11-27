import type { TableData } from '@arco-design/web-vue/es/table/interface'
import axios from 'axios'

export interface Announcement {
  id: number
  title: string
  content: string
  status: 'draft' | 'published'
  publishTime: string | null
  creator: string
  createTime: string
  updateTime: string
}

export interface AnnouncementQueryParams {
  page?: number
  pageSize?: number
  title?: string
  status?: 'draft' | 'published'
  startTime?: string
  endTime?: string
}

export interface AnnouncementListResponse {
  list: Announcement[]
  total: number
}

export function getAnnouncementList(params: AnnouncementQueryParams) {
  return axios.get<AnnouncementListResponse>('/api/announcement/list', { params })
}

export function getAnnouncementById(id: number) {
  return axios.get<Announcement>(`/api/announcement/${id}`)
}

export function createAnnouncement(data: Omit<Announcement, 'id' | 'createTime' | 'updateTime' | 'creator'>) {
  return axios.post<Announcement>('/api/announcement/create', data)
}

export function updateAnnouncement(id: number, data: Omit<Announcement, 'id' | 'createTime' | 'updateTime' | 'creator'>) {
  return axios.put<Announcement>(`/api/announcement/${id}`, data)
}

export function deleteAnnouncement(ids: number[]) {
  return axios.delete<boolean>('/api/announcement/delete', { data: { ids } })
}

export function publishAnnouncement(id: number) {
  return axios.post<Announcement>(`/api/announcement/${id}/publish`)
}

export function unpublishAnnouncement(id: number) {
  return axios.post<Announcement>(`/api/announcement/${id}/unpublish`)
}
