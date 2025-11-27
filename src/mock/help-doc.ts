import Mock from 'mockjs'

// Mock data for documents
const documents = Mock.mock({
  'list|15': [
    {
      id: function id() {
        return this.$index + 1
      },
      title: '@ctitle(10, 20)',
      content: '@cparagraph(5, 10)',
      description: '@csentence(20, 50)',
      'categoryId|1-4': 1,
      categoryName: function categoryName() {
        const categories = ['技术文档', '用户指南', 'API文档', '常见问题']
        return categories[this.categoryId - 1]
      },
      tags: function tags() {
        const allTags = ['Vue', 'TypeScript', 'Arco Design', 'JavaScript', 'CSS', 'HTML']
        const tagCount = Mock.Random.integer(1, 3)
        const selectedTags = []
        for (let i = 0; i < tagCount; i += 1) {
          const randomIndex = Mock.Random.integer(0, allTags.length - 1)
          selectedTags.push(allTags[randomIndex])
          allTags.splice(randomIndex, 1)
        }
        return selectedTags
      },
      'format|1': ['markdown', 'html', 'plaintext'],
      'status|1': ['published', 'draft', 'archived'],
      'visibility|1': ['public', 'private', 'protected'],
      'allowComments|1': true,
      author: 'Admin',
      authorId: '1',
      createdAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
      updatedAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
      version: function version() {
        return `1.${Mock.Random.integer(0, 10)}.0`
      },
    },
  ],
}).list

// Mock data for versions
const versions = Mock.mock({
  'list|20': [
    {
      id: function id() {
        return this.$index + 1
      },
      'documentId|1-15': 1,
      version: function version() {
        return `1.${Mock.Random.integer(0, 5)}.0`
      },
      content: '@cparagraph(5, 10)',
      changeLog: '@csentence(10, 30)',
      'changeType|1': ['create', 'update', 'delete'],
      author: 'Admin',
      authorId: '1',
      createdAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
}).list

// Mock data for categories
const categories = [
  {
    id: '1',
    name: '技术文档',
    description: '技术相关的文档',
    parentId: null,
    order: 1,
    status: true,
    documentCount: 8,
    children: [
      {
        id: '11',
        name: '前端开发',
        description: '前端开发相关的文档',
        parentId: '1',
        order: 1,
        status: true,
        documentCount: 5,
        children: [],
      },
      {
        id: '12',
        name: '后端开发',
        description: '后端开发相关的文档',
        parentId: '1',
        order: 2,
        status: true,
        documentCount: 3,
        children: [],
      },
    ],
  },
  {
    id: '2',
    name: '用户指南',
    description: '用户使用指南',
    parentId: null,
    order: 2,
    status: true,
    documentCount: 5,
    children: [
      {
        id: '21',
        name: '快速开始',
        description: '快速开始使用指南',
        parentId: '2',
        order: 1,
        status: true,
        documentCount: 2,
        children: [],
      },
      {
        id: '22',
        name: '高级功能',
        description: '高级功能使用指南',
        parentId: '2',
        order: 2,
        status: true,
        documentCount: 3,
        children: [],
      },
    ],
  },
  {
    id: '3',
    name: 'API文档',
    description: 'API接口文档',
    parentId: null,
    order: 3,
    status: true,
    documentCount: 2,
    children: [],
  },
]

// Mock data for roles
const roles = [
  {
    id: 'admin',
    name: '管理员',
    description: '拥有系统的所有权限',
    userCount: 1,
    permissions: {
      document: ['view', 'create', 'edit', 'delete', 'publish', 'archive'],
      category: ['view', 'create', 'edit', 'delete'],
      version: ['view', 'compare', 'restore'],
      user: ['view', 'create', 'edit', 'delete', 'assignRoles'],
      system: ['backup', 'restore', 'settings'],
    },
    createdAt: '2023-01-01 00:00:00',
    updatedAt: '2023-01-01 00:00:00',
  },
  {
    id: 'editor',
    name: '编辑',
    description: '可以创建、编辑和发布文档',
    userCount: 5,
    permissions: {
      document: ['view', 'create', 'edit', 'publish', 'archive'],
      category: ['view'],
      version: ['view', 'compare'],
      user: [],
      system: [],
    },
    createdAt: '2023-01-01 00:00:00',
    updatedAt: '2023-01-01 00:00:00',
  },
  {
    id: 'viewer',
    name: '查看者',
    description: '只能查看文档和版本历史',
    userCount: 10,
    permissions: {
      document: ['view'],
      category: ['view'],
      version: ['view'],
      user: [],
      system: [],
    },
    createdAt: '2023-01-01 00:00:00',
    updatedAt: '2023-01-01 00:00:00',
  },
]

// Mock data for backups
const backups = Mock.mock({
  'list|10': [
    {
      id: function id() {
        return this.$index + 1
      },
      'type|1': ['full', 'incremental', 'documents', 'settings'],
      description: '@csentence(10, 30)',
      size: function size() {
        return Mock.Random.integer(100 * 1024, 1000 * 1024 * 1024) // 100KB - 1GB
      },
      'status|1': ['completed', 'running', 'failed'],
      createdAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
      createdBy: 'Admin',
      fileUrl: '/backup/file.zip',
    },
  ],
}).list

// Mock data for restore history
const restoreHistory = Mock.mock({
  'list|8': [
    {
      id: function id() {
        return this.$index + 1
      },
      'backupId|1-10': 1,
      'status|1': ['completed', 'running', 'failed'],
      'result|1': ['success', 'failed'],
      startedAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
      completedAt: function completedAt() {
        return this.status === 'completed' ? Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') : null
      },
      restoredBy: 'Admin',
      logUrl: '/restore/log.txt',
    },
  ],
}).list

// Mock data for backup settings
const backupSettings = {
  autoBackup: true,
  backupInterval: 'daily',
  backupTime: '02:00',
  backupRetention: 30,
  backupPath: '/backup',
  emailNotification: false,
  notificationEmail: '',
}

// Mock API for documents
Mock.mock(/\/api\/help-doc\/documents/, 'get', (options) => {
  const { page = 1, pageSize = 10, title, categoryId, status } = JSON.parse(options.body || '{}')
  let filteredDocuments = [...documents]

  if (title) {
    filteredDocuments = filteredDocuments.filter((doc) => doc.title.includes(title))
  }

  if (categoryId) {
    filteredDocuments = filteredDocuments.filter((doc) => doc.categoryId.toString() === categoryId)
  }

  if (status) {
    filteredDocuments = filteredDocuments.filter((doc) => doc.status === status)
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + parseInt(pageSize, 10)
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex)

  return {
    code: 200,
    message: 'success',
    data: {
      data: paginatedDocuments,
      total: filteredDocuments.length,
    },
  }
})

Mock.mock(/\/api\/help-doc\/documents\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0], 10)
  const document = documents.find((doc) => doc.id === id)

  if (!document) {
    return {
      code: 404,
      message: 'Document not found',
    }
  }

  return {
    code: 200,
    message: 'success',
    data: document,
  }
})

Mock.mock(/\/api\/help-doc\/documents/, 'post', (options) => {
  const newDocument = JSON.parse(options.body)
  const document = {
    id: documents.length + 1,
    ...newDocument,
    author: 'Admin',
    authorId: '1',
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    version: '1.0.0',
  }

  documents.push(document)

  return {
    code: 200,
    message: 'success',
    data: document,
  }
})

Mock.mock(/\/api\/help-doc\/documents\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0], 10)
  const updatedDocument = JSON.parse(options.body)
  const index = documents.findIndex((doc) => doc.id === id)

  if (index === -1) {
    return {
      code: 404,
      message: 'Document not found',
    }
  }

  documents[index] = {
    ...documents[index],
    ...updatedDocument,
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }

  return {
    code: 200,
    message: 'success',
    data: documents[index],
  }
})

Mock.mock(/\/api\/help-doc\/documents\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0], 10)
  const index = documents.findIndex((doc) => doc.id === id)

  if (index === -1) {
    return {
      code: 404,
      message: 'Document not found',
    }
  }

  documents.splice(index, 1)

  return {
    code: 200,
    message: 'success',
  }
})

// Mock API for versions
Mock.mock(/\/api\/help-doc\/versions/, 'get', (options) => {
  const { page = 1, pageSize = 10, documentId } = JSON.parse(options.body || '{}')
  let filteredVersions = [...versions]

  if (documentId) {
    filteredVersions = filteredVersions.filter((version) => version.documentId.toString() === documentId)
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + parseInt(pageSize, 10)
  const paginatedVersions = filteredVersions.slice(startIndex, endIndex)

  return {
    code: 200,
    message: 'success',
    data: {
      data: paginatedVersions,
      total: filteredVersions.length,
    },
  }
})

// Mock API for categories
Mock.mock(/\/api\/help-doc\/categories/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: categories,
  }
})

// Mock API for roles
Mock.mock(/\/api\/help-doc\/roles/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      data: roles,
      total: roles.length,
    },
  }
})

// Mock API for backups
Mock.mock(/\/api\/help-doc\/backups/, 'get', (options) => {
  const { page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + parseInt(pageSize, 10)
  const paginatedBackups = backups.slice(startIndex, endIndex)

  return {
    code: 200,
    message: 'success',
    data: {
      data: paginatedBackups,
      total: backups.length,
    },
  }
})

// Mock API for restore history
Mock.mock(/\/api\/help-doc\/restore-history/, 'get', (options) => {
  const { page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + parseInt(pageSize, 10)
  const paginatedRestoreHistory = restoreHistory.slice(startIndex, endIndex)

  return {
    code: 200,
    message: 'success',
    data: {
      data: paginatedRestoreHistory,
      total: restoreHistory.length,
    },
  }
})

// Mock API for backup settings
Mock.mock(/\/api\/help-doc\/settings\/backup/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: backupSettings,
  }
})

Mock.mock(/\/api\/help-doc\/settings\/backup/, 'put', (options) => {
  const updatedSettings = JSON.parse(options.body)
  Object.assign(backupSettings, updatedSettings)

  return {
    code: 200,
    message: 'success',
  }
})

export default {
  documents,
  versions,
  categories,
  roles,
  backups,
  restoreHistory,
  backupSettings,
}
