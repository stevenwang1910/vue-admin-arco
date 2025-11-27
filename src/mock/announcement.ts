import setupMock, { failResponseWrap, successResponseWrap } from '@/utils/setup-mock'
import Mock from 'mockjs'
import { MockParams } from '@/types/mock'
import { isLogin } from '@/utils/auth'

const announcements = Mock.mock({
  'list|20-50': [
    {
      'id|+1': 1,
      title: '@ctitle(10, 20)',
      content: '@cparagraph(3, 10)',
      'status|1': ['draft', 'published'],
      publishTime() {
        return this.status === 'published' ? Mock.mock('@datetime') : null
      },
      creator: '@cname',
      createTime: '@datetime',
      updateTime: '@datetime',
    },
  ],
}).list as any[]

setupMock({
  setup() {
    // 获取公告列表
    Mock.mock(new RegExp('/api/announcement/list'), (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const { page = 1, pageSize = 10, title, status, startTime, endTime } = JSON.parse(params.body || '{}')

      let filteredList = [...announcements]

      // 按标题筛选
      if (title) {
        filteredList = filteredList.filter((item) => item.title.includes(title))
      }

      // 按状态筛选
      if (status) {
        filteredList = filteredList.filter((item) => item.status === status)
      }

      // 按时间范围筛选
      if (startTime && endTime) {
        filteredList = filteredList.filter((item) => {
          const createTime = new Date(item.createTime)
          return createTime >= new Date(startTime) && createTime <= new Date(endTime)
        })
      }

      // 分页
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + Number(pageSize)
      const paginatedList = filteredList.slice(startIndex, endIndex)

      return successResponseWrap({
        list: paginatedList,
        total: filteredList.length,
      })
    })

    // 获取公告详情
    Mock.mock(new RegExp('/api/announcement/\\d+'), (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const id = Number(params.url?.split('/').pop())
      const announcement = announcements.find((item) => item.id === id)
      if (!announcement) {
        return failResponseWrap(null, '公告不存在', 50000)
      }
      return successResponseWrap(announcement)
    })

    // 创建公告
    Mock.mock(new RegExp('/api/announcement/create'), (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const data = JSON.parse(params.body)
      const newAnnouncement = {
        id: announcements.length > 0 ? Math.max(...announcements.map((item) => item.id)) + 1 : 1,
        ...data,
        creator: 'admin', // 模拟当前登录用户
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }
      announcements.unshift(newAnnouncement)
      return successResponseWrap(newAnnouncement)
    })

    // 更新公告
    Mock.mock(new RegExp('/api/announcement/\\d+'), 'put', (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const id = Number(params.url?.split('/').pop())
      const data = JSON.parse(params.body)
      const index = announcements.findIndex((item) => item.id === id)
      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }
      announcements[index] = {
        ...announcements[index],
        ...data,
        updateTime: new Date().toISOString(),
      }
      return successResponseWrap(announcements[index])
    })

    // 删除公告
    Mock.mock(new RegExp('/api/announcement/delete'), 'delete', (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const { ids } = JSON.parse(params.body)
      announcements = announcements.filter((item) => !ids.includes(item.id))
      return successResponseWrap(true)
    })

    // 发布公告
    Mock.mock(new RegExp('/api/announcement/\\d+/publish'), (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const id = Number(params.url?.split('/').pop())
      const index = announcements.findIndex((item) => item.id === id)
      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }
      announcements[index] = {
        ...announcements[index],
        status: 'published',
        publishTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }
      return successResponseWrap(announcements[index])
    })

    // 撤销发布公告
    Mock.mock(new RegExp('/api/announcement/\\d+/unpublish'), (params: MockParams) => {
      if (!isLogin()) {
        return failResponseWrap(null, '未登录', 50008)
      }
      const id = Number(params.url?.split('/').pop())
      const index = announcements.findIndex((item) => item.id === id)
      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }
      announcements[index] = {
        ...announcements[index],
        status: 'draft',
        publishTime: null,
        updateTime: new Date().toISOString(),
      }
      return successResponseWrap(announcements[index])
    })
  },
})
