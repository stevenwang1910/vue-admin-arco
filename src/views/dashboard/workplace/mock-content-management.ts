import Mock from 'mockjs'
import dayjs from 'dayjs'
import { successResponseWrap } from '@/utils/setup-mock'
import { ContentDataRecord, ContentStats, CategoryOption } from '@/api/content-management'

const categories = ['技术', '产品', '设计', '运营', '市场', '销售', '人力资源', '财务']
const statuses = ['published', 'draft', 'archived'] as const
const tags = ['Vue3', 'TypeScript', 'Arco Design', '前端开发', '后端开发', '数据库', '云服务', '人工智能']

const generateContentData = (count: number = 100): ContentDataRecord[] => {
  return Mock.mock({
    [`list|${count}`]: [
      {
        'id|+1': 1,
        title: '@ctitle(10, 30)',
        category: `@pick(${JSON.stringify(categories)})`,
        status: `@pick(${JSON.stringify(statuses)})`,
        author: '@cname',
        publishDate: '@datetime',
        'views|100-10000': 1,
        'likes|10-500': 1,
        'comments|0-100': 1,
        'tags|1-4': [`@pick(${JSON.stringify(tags)})`],
        content: '@cparagraph(3, 10)',
        createdAt: '@datetime',
        updatedAt: '@datetime',
      },
    ],
  }).list
}

const contentData = generateContentData(100)

export default {
  setup() {
    Mock.mock(new RegExp('/api/content/list'), (params: any) => {
      const {
        current = 1,
        pageSize = 10,
        title,
        category,
        status,
        author,
        startDate,
        endDate,
        sortField,
        sortOrder,
      } = JSON.parse(params.body || '{}')

      let filteredData = [...contentData]

      if (title) {
        filteredData = filteredData.filter((item) => item.title.includes(title))
      }

      if (category) {
        filteredData = filteredData.filter((item) => item.category === category)
      }

      if (status) {
        filteredData = filteredData.filter((item) => item.status === status)
      }

      if (author) {
        filteredData = filteredData.filter((item) => item.author.includes(author))
      }

      if (startDate && endDate) {
        filteredData = filteredData.filter((item) => {
          const publishDate = dayjs(item.publishDate)
          return publishDate.isAfter(dayjs(startDate)) && publishDate.isBefore(dayjs(endDate))
        })
      }

      if (sortField && sortOrder) {
        filteredData.sort((a, b) => {
          const aValue = a[sortField as keyof ContentDataRecord]
          const bValue = b[sortField as keyof ContentDataRecord]

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
          }

          return 0
        })
      }

      const total = filteredData.length
      const start = (current - 1) * pageSize
      const end = start + pageSize
      const list = filteredData.slice(start, end)

      return successResponseWrap({
        list,
        total,
        current,
        pageSize,
      })
    })

    Mock.mock(new RegExp('/api/content/categories'), () => {
      const categoryStats = categories.map((category) => ({
        value: category,
        label: category,
        count: contentData.filter((item) => item.category === category).length,
      }))
      return successResponseWrap(categoryStats)
    })

    Mock.mock(new RegExp('/api/content/stats'), () => {
      const stats: ContentStats = {
        totalContent: contentData.length,
        publishedContent: contentData.filter((item) => item.status === 'published').length,
        draftContent: contentData.filter((item) => item.status === 'draft').length,
        archivedContent: contentData.filter((item) => item.status === 'archived').length,
        totalViews: contentData.reduce((sum, item) => sum + item.views, 0),
        totalLikes: contentData.reduce((sum, item) => sum + item.likes, 0),
        totalComments: contentData.reduce((sum, item) => sum + item.comments, 0),
      }
      return successResponseWrap(stats)
    })

    Mock.mock(new RegExp('/api/content'), 'post', (params: any) => {
      const newContent = JSON.parse(params.body)
      const content: ContentDataRecord = {
        id: String(contentData.length + 1),
        ...newContent,
        views: 0,
        likes: 0,
        comments: 0,
        createdAt: dayjs().format(),
        updatedAt: dayjs().format(),
      }
      contentData.push(content)
      return successResponseWrap(content)
    })

    Mock.mock(new RegExp('/api/content/\\d+'), 'put', (params: any) => {
      const id = params.url.match(/\/content\/(\d+)/)?.[1]
      const updateData = JSON.parse(params.body)
      const index = contentData.findIndex((item) => item.id === id)

      if (index !== -1) {
        contentData[index] = {
          ...contentData[index],
          ...updateData,
          updatedAt: dayjs().format(),
        }
        return successResponseWrap(contentData[index])
      }

      return {
        status: 404,
        message: '内容未找到',
      }
    })

    Mock.mock(new RegExp('/api/content/\\d+'), 'delete', (params: any) => {
      const id = params.url.match(/\/content\/(\d+)/)?.[1]
      const index = contentData.findIndex((item) => item.id === id)

      if (index !== -1) {
        contentData.splice(index, 1)
        return successResponseWrap(true)
      }

      return {
        status: 404,
        message: '内容未找到',
      }
    })

    Mock.mock(new RegExp('/api/content/\\d+'), 'get', (params: any) => {
      const id = params.url.match(/\/content\/(\d+)/)?.[1]
      const content = contentData.find((item) => item.id === id)

      if (content) {
        return successResponseWrap(content)
      }

      return {
        status: 404,
        message: '内容未找到',
      }
    })
  },
}
