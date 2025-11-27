import setupMock, { failResponseWrap, successResponseWrap } from '@/utils/setup-mock'
import Mock from 'mockjs'

import { MockParams } from '@/types/mock'

// 模拟公告数据
let notices = [
  {
    id: '1',
    title: '系统维护通知',
    content:
      '<p>尊敬的用户，为了提供更好的服务，我们将于2023年12月31日22:00-24:00进行系统维护。维护期间可能会影响部分功能的使用，请您提前做好准备。</p>',
    status: 'published',
    author: '管理员',
    publishTime: '2023-12-30 10:00:00',
    createTime: '2023-12-30 09:30:00',
    updateTime: '2023-12-30 10:00:00',
    priority: 'high',
  },
  {
    id: '2',
    title: '新功能上线公告',
    content: '<p>亲爱的用户，我们很高兴地宣布，系统新增了数据分析功能。您可以在"数据可视化"模块中查看详细的数据分析报告。</p>',
    status: 'published',
    author: '产品经理',
    publishTime: '2023-12-28 14:30:00',
    createTime: '2023-12-28 10:00:00',
    updateTime: '2023-12-28 14:30:00',
    priority: 'medium',
  },
  {
    id: '3',
    title: '用户反馈收集',
    content: '<p>为了不断改进我们的产品，现向广大用户收集反馈意见。如果您有任何建议或问题，请通过客服渠道与我们联系。</p>',
    status: 'draft',
    author: '客服部',
    publishTime: null,
    createTime: '2023-12-25 16:00:00',
    updateTime: '2023-12-25 16:00:00',
    priority: 'low',
  },
]

setupMock({
  setup() {
    // 获取公告列表
    Mock.mock(new RegExp('/api/notice/list'), (params: MockParams) => {
      const { page = 1, pageSize = 10, title, status, startTime, endTime } = JSON.parse(params.body)

      let filteredNotices = [...notices]

      // 按标题筛选
      if (title) {
        filteredNotices = filteredNotices.filter((notice) => notice.title.toLowerCase().includes(title.toLowerCase()))
      }

      // 按状态筛选
      if (status) {
        filteredNotices = filteredNotices.filter((notice) => notice.status === status)
      }

      // 按时间范围筛选
      if (startTime && endTime) {
        filteredNotices = filteredNotices.filter((notice) => {
          const createTime = new Date(notice.createTime)
          return createTime >= new Date(startTime) && createTime <= new Date(endTime)
        })
      }

      // 分页
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedNotices = filteredNotices.slice(startIndex, endIndex)

      return successResponseWrap({
        list: paginatedNotices,
        total: filteredNotices.length,
        page,
        pageSize,
      })
    })

    // 获取公告详情
    Mock.mock(new RegExp('/api/notice/detail'), (params: MockParams) => {
      const { id } = JSON.parse(params.body)
      const foundNotice = notices.find((notice) => notice.id === id)

      if (!foundNotice) {
        return failResponseWrap(null, '公告不存在', 50000)
      }

      return successResponseWrap(foundNotice)
    })

    // 创建公告
    Mock.mock(new RegExp('/api/notice/create'), (params: MockParams) => {
      const { title, content, status, priority } = JSON.parse(params.body)

      if (!title || !content) {
        return failResponseWrap(null, '标题和内容不能为空', 50000)
      }

      const newNotice = {
        id: Mock.Random.id(),
        title,
        content,
        status,
        author: '当前用户', // 实际应用中从登录信息获取
        publishTime: status === 'published' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        priority: priority || 'medium',
      }

      notices.unshift(newNotice)

      return successResponseWrap(newNotice)
    })

    // 更新公告
    Mock.mock(new RegExp('/api/notice/update'), (params: MockParams) => {
      const { id, title, content, status, priority } = JSON.parse(params.body)

      if (!id || !title || !content) {
        return failResponseWrap(null, 'ID、标题和内容不能为空', 50000)
      }

      const index = notices.findIndex((notice) => notice.id === id)

      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }

      notices[index] = {
        ...notices[index],
        title,
        content,
        status,
        priority: priority || 'medium',
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        publishTime:
          status === 'published' && notices[index].status !== 'published'
            ? new Date().toISOString().slice(0, 19).replace('T', ' ')
            : notices[index].publishTime,
      }

      return successResponseWrap(notices[index])
    })

    // 发布公告
    Mock.mock(new RegExp('/api/notice/publish'), (params: MockParams) => {
      const { id } = JSON.parse(params.body)

      if (!id) {
        return failResponseWrap(null, 'ID不能为空', 50000)
      }

      const index = notices.findIndex((notice) => notice.id === id)

      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }

      notices[index] = {
        ...notices[index],
        status: 'published',
        publishTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      return successResponseWrap(notices[index])
    })

    // 撤销发布公告
    Mock.mock(new RegExp('/api/notice/unpublish'), (params: MockParams) => {
      const { id } = JSON.parse(params.body)

      if (!id) {
        return failResponseWrap(null, 'ID不能为空', 50000)
      }

      const index = notices.findIndex((notice) => notice.id === id)

      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }

      notices[index] = {
        ...notices[index],
        status: 'draft',
        publishTime: null,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      return successResponseWrap(notices[index])
    })

    // 删除公告
    Mock.mock(new RegExp('/api/notice/delete'), (params: MockParams) => {
      const { id } = JSON.parse(params.body)

      if (!id) {
        return failResponseWrap(null, 'ID不能为空', 50000)
      }

      const index = notices.findIndex((notice) => notice.id === id)

      if (index === -1) {
        return failResponseWrap(null, '公告不存在', 50000)
      }

      notices.splice(index, 1)

      return successResponseWrap(null)
    })

    // 批量删除公告
    Mock.mock(new RegExp('/api/notice/batch-delete'), (params: MockParams) => {
      const { ids } = JSON.parse(params.body)

      if (!ids || ids.length === 0) {
        return failResponseWrap(null, '请选择要删除的公告', 50000)
      }

      notices = notices.filter((notice) => !ids.includes(notice.id))

      return successResponseWrap(null)
    })
  },
})
