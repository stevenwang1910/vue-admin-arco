import request from '@/hooks/request'

// Document API
export interface Document {
  id: string
  title: string
  content: string
  description?: string
  categoryId: string
  categoryName?: string
  tags: string[]
  format: 'markdown' | 'html' | 'plaintext'
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'protected'
  allowComments: boolean
  author: string
  authorId: string
  createdAt: string
  updatedAt: string
  version: string
}

export interface CreateDocumentRequest {
  title: string
  content: string
  description?: string
  categoryId: string
  tags: string[]
  format: 'markdown' | 'html' | 'plaintext'
  visibility: 'public' | 'private' | 'protected'
  allowComments: boolean
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {
  id: string
}

export interface DocumentQueryParams {
  page?: number
  pageSize?: number
  title?: string
  categoryId?: string
  status?: string
  author?: string
  visibility?: string
  tags?: string[]
  startDate?: string
  endDate?: string
}

export const getDocuments = (params: DocumentQueryParams) => {
  return request<{ data: Document[]; total: number }>({
    url: '/api/help-doc/documents',
    method: 'get',
    params,
  })
}

export const getDocumentById = (id: string) => {
  return request<Document>({
    url: `/api/help-doc/documents/${id}`,
    method: 'get',
  })
}

export const createDocument = (data: CreateDocumentRequest) => {
  return request<Document>({
    url: '/api/help-doc/documents',
    method: 'post',
    data,
  })
}

export const updateDocument = (id: string, data: UpdateDocumentRequest) => {
  return request<Document>({
    url: `/api/help-doc/documents/${id}`,
    method: 'put',
    data,
  })
}

export const deleteDocument = (id: string) => {
  return request({
    url: `/api/help-doc/documents/${id}`,
    method: 'delete',
  })
}

export const publishDocument = (id: string) => {
  return request({
    url: `/api/help-doc/documents/${id}/publish`,
    method: 'post',
  })
}

export const archiveDocument = (id: string) => {
  return request({
    url: `/api/help-doc/documents/${id}/archive`,
    method: 'post',
  })
}

export const exportDocument = (id: string, format: 'markdown' | 'html' | 'pdf') => {
  return request({
    url: `/api/help-doc/documents/${id}/export`,
    method: 'get',
    params: { format },
    responseType: 'blob',
  })
}

export const importDocument = (file: File, categoryId?: string) => {
  const formData = new FormData()
  formData.append('file', file)
  if (categoryId) {
    formData.append('categoryId', categoryId)
  }
  return request<Document>({
    url: '/api/help-doc/documents/import',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Version API
export interface DocumentVersion {
  id: string
  documentId: string
  version: string
  content: string
  changeLog?: string
  changeType: 'create' | 'update' | 'delete'
  author: string
  authorId: string
  createdAt: string
}

export interface VersionQueryParams {
  page?: number
  pageSize?: number
  documentId: string
  startDate?: string
  endDate?: string
}

export const getVersions = (params: VersionQueryParams) => {
  return request<{ data: DocumentVersion[]; total: number }>({
    url: '/api/help-doc/versions',
    method: 'get',
    params,
  })
}

export const getVersionById = (id: string) => {
  return request<DocumentVersion>({
    url: `/api/help-doc/versions/${id}`,
    method: 'get',
  })
}

export const restoreVersion = (id: string) => {
  return request({
    url: `/api/help-doc/versions/${id}/restore`,
    method: 'post',
  })
}

export const compareVersions = (version1Id: string, version2Id: string) => {
  return request<{ diff: string }>({
    url: '/api/help-doc/versions/compare',
    method: 'get',
    params: { version1Id, version2Id },
  })
}

// Category API
export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  parentName?: string
  order: number
  status: boolean
  documentCount: number
  children?: Category[]
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parentId?: string
  order?: number
  status?: boolean
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string
}

export interface CategoryQueryParams {
  page?: number
  pageSize?: number
  name?: string
  parentId?: string
  status?: boolean
}

export const getCategories = (params?: CategoryQueryParams) => {
  return request<Category[]>({
    url: '/api/help-doc/categories',
    method: 'get',
    params,
  })
}

export const getCategoryById = (id: string) => {
  return request<Category>({
    url: `/api/help-doc/categories/${id}`,
    method: 'get',
  })
}

export const createCategory = (data: CreateCategoryRequest) => {
  return request<Category>({
    url: '/api/help-doc/categories',
    method: 'post',
    data,
  })
}

export const updateCategory = (id: string, data: UpdateCategoryRequest) => {
  return request<Category>({
    url: `/api/help-doc/categories/${id}`,
    method: 'put',
    data,
  })
}

export const deleteCategory = (id: string) => {
  return request({
    url: `/api/help-doc/categories/${id}`,
    method: 'delete',
  })
}

export const moveCategory = (id: string, parentId?: string) => {
  return request({
    url: `/api/help-doc/categories/${id}/move`,
    method: 'post',
    data: { parentId },
  })
}

// Permission API
export interface Role {
  id: string
  name: string
  description?: string
  userCount: number
  permissions: {
    document: string[]
    category: string[]
    version: string[]
    user: string[]
    system: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissions?: {
    document: string[]
    category: string[]
    version: string[]
    user: string[]
    system: string[]
  }
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string
}

export interface RoleQueryParams {
  page?: number
  pageSize?: number
  name?: string
}

export const getRoles = (params?: RoleQueryParams) => {
  return request<{ data: Role[]; total: number }>({
    url: '/api/help-doc/roles',
    method: 'get',
    params,
  })
}

export const getRoleById = (id: string) => {
  return request<Role>({
    url: `/api/help-doc/roles/${id}`,
    method: 'get',
  })
}

export const createRole = (data: CreateRoleRequest) => {
  return request<Role>({
    url: '/api/help-doc/roles',
    method: 'post',
    data,
  })
}

export const updateRole = (id: string, data: UpdateRoleRequest) => {
  return request<Role>({
    url: `/api/help-doc/roles/${id}`,
    method: 'put',
    data,
  })
}

export const deleteRole = (id: string) => {
  return request({
    url: `/api/help-doc/roles/${id}`,
    method: 'delete',
  })
}

export const assignRoleToUser = (userId: string, roleId: string) => {
  return request({
    url: `/api/help-doc/users/${userId}/roles`,
    method: 'post',
    data: { roleId },
  })
}

// Backup API
export interface Backup {
  id: string
  type: 'full' | 'incremental' | 'documents' | 'settings'
  description?: string
  size: number
  status: 'running' | 'completed' | 'failed'
  createdAt: string
  createdBy: string
  fileUrl?: string
}

export interface CreateBackupRequest {
  type: 'full' | 'incremental' | 'documents' | 'settings'
  description?: string
}

export interface BackupQueryParams {
  page?: number
  pageSize?: number
  type?: string
  status?: string
  startDate?: string
  endDate?: string
}

export const getBackups = (params: BackupQueryParams) => {
  return request<{ data: Backup[]; total: number }>({
    url: '/api/help-doc/backups',
    method: 'get',
    params,
  })
}

export const getBackupById = (id: string) => {
  return request<Backup>({
    url: `/api/help-doc/backups/${id}`,
    method: 'get',
  })
}

export const createBackup = (data: CreateBackupRequest) => {
  return request<Backup>({
    url: '/api/help-doc/backups',
    method: 'post',
    data,
  })
}

export const downloadBackup = (id: string) => {
  return request({
    url: `/api/help-doc/backups/${id}/download`,
    method: 'get',
    responseType: 'blob',
  })
}

export const deleteBackup = (id: string) => {
  return request({
    url: `/api/help-doc/backups/${id}`,
    method: 'delete',
  })
}

export const restoreBackup = (id: string) => {
  return request({
    url: `/api/help-doc/backups/${id}/restore`,
    method: 'post',
  })
}

export const uploadBackup = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request<Backup>({
    url: '/api/help-doc/backups/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Restore History API
export interface RestoreHistory {
  id: string
  backupId: string
  status: 'running' | 'completed' | 'failed'
  result: 'success' | 'failed'
  startedAt: string
  completedAt?: string
  restoredBy: string
  logUrl?: string
}

export interface RestoreHistoryQueryParams {
  page?: number
  pageSize?: number
  status?: string
  result?: string
  startDate?: string
  endDate?: string
}

export const getRestoreHistory = (params: RestoreHistoryQueryParams) => {
  return request<{ data: RestoreHistory[]; total: number }>({
    url: '/api/help-doc/restore-history',
    method: 'get',
    params,
  })
}

export const getRestoreLog = (id: string) => {
  return request<string>({
    url: `/api/help-doc/restore-history/${id}/log`,
    method: 'get',
  })
}

// Settings API
export interface BackupSettings {
  autoBackup: boolean
  backupInterval: 'daily' | 'weekly' | 'monthly'
  backupTime: string
  backupRetention: number
  backupPath: string
  emailNotification: boolean
  notificationEmail?: string
}

export const getBackupSettings = () => {
  return request<BackupSettings>({
    url: '/api/help-doc/settings/backup',
    method: 'get',
  })
}

export const updateBackupSettings = (data: BackupSettings) => {
  return request({
    url: '/api/help-doc/settings/backup',
    method: 'put',
    data,
  })
}
