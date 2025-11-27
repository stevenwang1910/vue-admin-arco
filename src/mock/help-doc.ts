import { MockMethod } from 'vite-plugin-mock'

export default [
  // 获取文档列表
  {
    url: '/api/help/documents',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, categoryId, keyword } = query
      const mockDocuments = [
        {
          id: 1,
          title: 'Vue 3 入门指南',
          content:
            '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。\n\n## 主要特性\n\n- 组合式 API\n- 响应式系统改进\n- 更好的性能\n- 更小的体积\n\n## 快速开始\n\n```bash\nnpm create vue@latest\n```',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['Vue', '前端', '框架'],
          status: 'published',
          author: '张三',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: '2023-01-02T15:30:00Z',
          version: 1,
        },
        {
          id: 2,
          title: 'TypeScript 基础教程',
          content:
            '# TypeScript 基础教程\n\nTypeScript 是 JavaScript 的超集，添加了类型系统。\n\n## 主要特性\n\n- 静态类型检查\n- 接口\n- 类\n- 泛型\n\n## 快速开始\n\n```bash\nnpm install typescript --save-dev\n```',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['TypeScript', '前端', '类型系统'],
          status: 'published',
          author: '李四',
          createdAt: '2023-01-03T09:15:00Z',
          updatedAt: '2023-01-04T14:45:00Z',
          version: 2,
        },
        {
          id: 3,
          title: 'Node.js 入门教程',
          content:
            '# Node.js 入门教程\n\nNode.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。\n\n## 主要特性\n\n- 非阻塞 I/O\n- 事件驱动\n- 跨平台\n\n## 快速开始\n\n```bash\nnpm init\n```',
          categoryId: 2,
          categoryName: '后端开发',
          tags: ['Node.js', '后端', 'JavaScript'],
          status: 'published',
          author: '王五',
          createdAt: '2023-01-05T11:30:00Z',
          updatedAt: '2023-01-06T16:15:00Z',
          version: 1,
        },
      ]

      let filteredDocuments = [...mockDocuments]

      // 分类筛选
      if (categoryId) {
        filteredDocuments = filteredDocuments.filter((doc) => doc.categoryId === parseInt(categoryId as string))
      }

      // 关键词搜索
      if (keyword) {
        filteredDocuments = filteredDocuments.filter(
          (doc) => doc.title.includes(keyword as string) || doc.content.includes(keyword as string)
        )
      }

      // 分页
      const total = filteredDocuments.length
      const startIndex = (parseInt(page as string) - 1) * parseInt(pageSize as string)
      const endIndex = startIndex + parseInt(pageSize as string)
      const documents = filteredDocuments.slice(startIndex, endIndex)

      return {
        code: 200,
        data: {
          documents,
          total,
        },
      }
    },
  },

  // 获取文档详情
  {
    url: '/api/help/documents/:id',
    method: 'get',
    response: ({ params }) => {
      const { id } = params
      const mockDocuments = [
        {
          id: 1,
          title: 'Vue 3 入门指南',
          content:
            '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。\n\n## 主要特性\n\n- 组合式 API\n- 响应式系统改进\n- 更好的性能\n- 更小的体积\n\n## 快速开始\n\n```bash\nnpm create vue@latest\n```',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['Vue', '前端', '框架'],
          status: 'published',
          author: '张三',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: '2023-01-02T15:30:00Z',
          version: 1,
        },
        {
          id: 2,
          title: 'TypeScript 基础教程',
          content:
            '# TypeScript 基础教程\n\nTypeScript 是 JavaScript 的超集，添加了类型系统。\n\n## 主要特性\n\n- 静态类型检查\n- 接口\n- 类\n- 泛型\n\n## 快速开始\n\n```bash\nnpm install typescript --save-dev\n```',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['TypeScript', '前端', '类型系统'],
          status: 'published',
          author: '李四',
          createdAt: '2023-01-03T09:15:00Z',
          updatedAt: '2023-01-04T14:45:00Z',
          version: 2,
        },
        {
          id: 3,
          title: 'Node.js 入门教程',
          content:
            '# Node.js 入门教程\n\nNode.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。\n\n## 主要特性\n\n- 非阻塞 I/O\n- 事件驱动\n- 跨平台\n\n## 快速开始\n\n```bash\nnpm init\n```',
          categoryId: 2,
          categoryName: '后端开发',
          tags: ['Node.js', '后端', 'JavaScript'],
          status: 'published',
          author: '王五',
          createdAt: '2023-01-05T11:30:00Z',
          updatedAt: '2023-01-06T16:15:00Z',
          version: 1,
        },
      ]

      const document = mockDocuments.find((doc) => doc.id === parseInt(id as string))

      if (document) {
        return {
          code: 200,
          data: document,
        }
      } else {
        return {
          code: 404,
          message: '文档不存在',
        }
      }
    },
  },

  // 创建文档
  {
    url: '/api/help/documents',
    method: 'post',
    response: ({ body }) => {
      const { title, content, categoryId, tags } = body

      return {
        code: 200,
        data: {
          id: Date.now(),
          title,
          content,
          categoryId,
          categoryName: categoryId === 1 ? '前端开发' : '后端开发',
          tags,
          status: 'draft',
          author: '当前用户',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      }
    },
  },

  // 更新文档
  {
    url: '/api/help/documents/:id',
    method: 'put',
    response: ({ params, body }) => {
      const { id } = params
      const { title, content, categoryId, tags, status } = body

      return {
        code: 200,
        data: {
          id: parseInt(id as string),
          title,
          content,
          categoryId,
          categoryName: categoryId === 1 ? '前端开发' : '后端开发',
          tags,
          status,
          author: '当前用户',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: new Date().toISOString(),
          version: 2,
        },
      }
    },
  },

  // 删除文档
  {
    url: '/api/help/documents/:id',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
      }
    },
  },

  // 获取分类列表
  {
    url: '/api/help/categories',
    method: 'get',
    response: () => {
      const mockCategories = [
        { id: 1, name: '前端开发', description: '前端开发相关文档' },
        { id: 2, name: '后端开发', description: '后端开发相关文档' },
        { id: 3, name: '数据库', description: '数据库相关文档' },
        { id: 4, name: '运维', description: '运维相关文档' },
      ]

      return {
        code: 200,
        data: mockCategories,
      }
    },
  },

  // 创建分类
  {
    url: '/api/help/categories',
    method: 'post',
    response: ({ body }) => {
      const { name, description } = body

      return {
        code: 200,
        data: {
          id: Date.now(),
          name,
          description,
        },
      }
    },
  },

  // 更新分类
  {
    url: '/api/help/categories/:id',
    method: 'put',
    response: ({ params, body }) => {
      const { id } = params
      const { name, description } = body

      return {
        code: 200,
        data: {
          id: parseInt(id as string),
          name,
          description,
        },
      }
    },
  },

  // 删除分类
  {
    url: '/api/help/categories/:id',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
      }
    },
  },

  // 获取版本历史
  {
    url: '/api/help/documents/:id/versions',
    method: 'get',
    response: ({ params }) => {
      const { id } = params
      const mockVersions = [
        {
          id: 1,
          documentId: parseInt(id as string),
          version: 1,
          title: 'Vue 3 入门指南',
          content: '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。',
          author: '张三',
          createdAt: '2023-01-01T10:00:00Z',
        },
        {
          id: 2,
          documentId: parseInt(id as string),
          version: 2,
          title: 'Vue 3 入门指南',
          content:
            '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。\n\n## 主要特性\n\n- 组合式 API\n- 响应式系统改进\n- 更好的性能\n- 更小的体积',
          author: '张三',
          createdAt: '2023-01-02T15:30:00Z',
        },
        {
          id: 3,
          documentId: parseInt(id as string),
          version: 3,
          title: 'Vue 3 入门指南',
          content:
            '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。\n\n## 主要特性\n\n- 组合式 API\n- 响应式系统改进\n- 更好的性能\n- 更小的体积\n\n## 快速开始\n\n```bash\nnpm create vue@latest\n```',
          author: '张三',
          createdAt: '2023-01-03T09:15:00Z',
        },
      ]

      return {
        code: 200,
        data: mockVersions,
      }
    },
  },

  // 恢复版本
  {
    url: '/api/help/documents/:id/versions/:version/restore',
    method: 'post',
    response: ({ params }) => {
      const { id, version } = params

      return {
        code: 200,
        data: {
          id: parseInt(id as string),
          title: 'Vue 3 入门指南',
          content:
            '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。\n\n## 主要特性\n\n- 组合式 API\n- 响应式系统改进\n- 更好的性能\n- 更小的体积\n\n## 快速开始\n\n```bash\nnpm create vue@latest\n```',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['Vue', '前端', '框架'],
          status: 'published',
          author: '张三',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: new Date().toISOString(),
          version: parseInt(version as string),
        },
      }
    },
  },

  // 搜索文档
  {
    url: '/api/help/search',
    method: 'get',
    response: ({ query }) => {
      const { keyword } = query
      const mockDocuments = [
        {
          id: 1,
          title: 'Vue 3 入门指南',
          content: '# Vue 3 入门指南\n\nVue 3 是一款渐进式 JavaScript 框架，用于构建用户界面。',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['Vue', '前端', '框架'],
          status: 'published',
          author: '张三',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: '2023-01-02T15:30:00Z',
          version: 1,
        },
        {
          id: 2,
          title: 'TypeScript 基础教程',
          content: '# TypeScript 基础教程\n\nTypeScript 是 JavaScript 的超集，添加了类型系统。',
          categoryId: 1,
          categoryName: '前端开发',
          tags: ['TypeScript', '前端', '类型系统'],
          status: 'published',
          author: '李四',
          createdAt: '2023-01-03T09:15:00Z',
          updatedAt: '2023-01-04T14:45:00Z',
          version: 2,
        },
      ]

      let filteredDocuments = [...mockDocuments]

      // 关键词搜索
      if (keyword) {
        filteredDocuments = filteredDocuments.filter(
          (doc) => doc.title.includes(keyword as string) || doc.content.includes(keyword as string)
        )
      }

      return {
        code: 200,
        data: filteredDocuments,
      }
    },
  },
] as MockMethod[]
