import request from '@/hooks/request'

// 获取内容列表
export function getContentList(params?: any) {
  return request({
    url: '/content/list',
    method: 'get',
    params,
  })
}

// 创建内容
export function createContent(data: any) {
  return request({
    url: '/content/create',
    method: 'post',
    data,
  })
}

// 获取内容详情
export function getContentDetail(id: string) {
  return request({
    url: `/content/detail/${id}`,
    method: 'get',
  })
}

// 更新内容
export function updateContent(id: string, data: any) {
  return request({
    url: `/content/update/${id}`,
    method: 'put',
    data,
  })
}

// 删除内容
export function deleteContent(id: string) {
  return request({
    url: `/content/delete/${id}`,
    method: 'delete',
  })
}

// 提交审核
export function submitAudit(id: string) {
  return request({
    url: `/content/audit/submit/${id}`,
    method: 'post',
  })
}

// 审核内容
export function auditContent(id: string, data: any) {
  return request({
    url: `/content/audit/${id}`,
    method: 'put',
    data,
  })
}

// 排期内容
export function scheduleContent(id: string, data: any) {
  return request({
    url: `/content/schedule/${id}`,
    method: 'put',
    data,
  })
}

// 发布内容
export function publishContent(id: string) {
  return request({
    url: `/content/publish/${id}`,
    method: 'post',
  })
}

// 获取内容分析数据
export function getContentAnalytics(id: string, params?: any) {
  return request({
    url: `/content/analytics/${id}`,
    method: 'get',
    params,
  })
}

// 获取投放渠道列表
export function getChannels() {
  return request({
    url: '/content/channels',
    method: 'get',
  })
}

// 获取内容类型列表
export function getContentTypes() {
  return request({
    url: '/content/types',
    method: 'get',
  })
}
