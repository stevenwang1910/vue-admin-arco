import request from '@/hooks/request'

// 文档相关API

// 获取文档列表
export const getDocumentList = (params?: any) => {
  return request({
    url: '/api/help/documents',
    method: 'get',
    params,
  })
}

// 获取文档详情
export const getDocumentDetail = (id: number) => {
  return request({
    url: `/api/help/documents/${id}`,
    method: 'get',
  })
}

// 创建文档
export const createDocument = (data: any) => {
  return request({
    url: '/api/help/documents',
    method: 'post',
    data,
  })
}

// 更新文档
export const updateDocument = (id: number, data: any) => {
  return request({
    url: `/api/help/documents/${id}`,
    method: 'put',
    data,
  })
}

// 删除文档
export const deleteDocument = (id: number) => {
  return request({
    url: `/api/help/documents/${id}`,
    method: 'delete',
  })
}

// 分类相关API

// 获取分类列表
export const getCategoryList = (params?: any) => {
  return request({
    url: '/api/help/categories',
    method: 'get',
    params,
  })
}

// 获取分类详情
export const getCategoryDetail = (id: number) => {
  return request({
    url: `/api/help/categories/${id}`,
    method: 'get',
  })
}

// 创建分类
export const createCategory = (data: any) => {
  return request({
    url: '/api/help/categories',
    method: 'post',
    data,
  })
}

// 更新分类
export const updateCategory = (id: number, data: any) => {
  return request({
    url: `/api/help/categories/${id}`,
    method: 'put',
    data,
  })
}

// 删除分类
export const deleteCategory = (id: number) => {
  return request({
    url: `/api/help/categories/${id}`,
    method: 'delete',
  })
}

// 版本相关API

// 获取版本历史
export const getVersionHistory = (documentId: number, params?: any) => {
  return request({
    url: `/api/help/documents/${documentId}/versions`,
    method: 'get',
    params,
  })
}

// 获取版本详情
export const getVersionDetail = (documentId: number, versionId: number) => {
  return request({
    url: `/api/help/documents/${documentId}/versions/${versionId}`,
    method: 'get',
  })
}

// 恢复版本
export const restoreVersion = (documentId: number, versionId: number) => {
  return request({
    url: `/api/help/documents/${documentId}/versions/${versionId}/restore`,
    method: 'post',
  })
}

// 搜索相关API

// 搜索文档
export const searchDocuments = (params?: any) => {
  return request({
    url: '/api/help/search',
    method: 'get',
    params,
  })
}
