import Mock from 'mockjs'

// 模拟内容列表数据
Mock.mock('/content/list', 'get', (config) => {
  const { page = 1, pageSize = 10 } = config.params || {}
  const total = 50
  const list = []
  for (let i = 0; i < pageSize && (page - 1) * pageSize + i < total; i++) {
    list.push({
      id: Mock.Random.id(),
      title: Mock.Random.ctitle(5, 20),
      type: Mock.Random.pick(['text', 'image', 'video', 'richText']),
      status: Mock.Random.pick(['draft', 'pending', 'approved', 'rejected', 'published']),
      channel: Mock.Random.pick(['wechat', 'weibo', 'app', 'website']),
      createTime: Mock.Random.datetime(),
      updateTime: Mock.Random.datetime(),
      author: Mock.Random.cname(),
      views: Mock.Random.integer(0, 10000),
      clicks: Mock.Random.integer(0, 1000),
      conversions: Mock.Random.integer(0, 100),
    })
  }
  return {
    code: 20000,
    message: 'success',
    data: {
      list,
      total,
      page,
      pageSize,
    },
  }
})

// 模拟创建内容数据
Mock.mock('/content/create', 'post', (config) => {
  const { title, type, content, channel, audience, scheduleTime } = JSON.parse(config.body)
  return {
    code: 20000,
    message: 'success',
    data: {
      id: Mock.Random.id(),
      title,
      type,
      content,
      channel,
      audience,
      scheduleTime,
      status: scheduleTime ? 'scheduled' : 'pending',
      createTime: Mock.Random.datetime(),
      updateTime: Mock.Random.datetime(),
      author: Mock.Random.cname(),
    },
  }
})

// 模拟获取内容详情数据
Mock.mock(/\/content\/detail\/\w+/, 'get', (config) => {
  const id = config.url.match(/\/content\/detail\/(\w+)/)[1]
  return {
    code: 20000,
    message: 'success',
    data: {
      id,
      title: Mock.Random.ctitle(5, 20),
      type: Mock.Random.pick(['text', 'image', 'video', 'richText']),
      content: Mock.Random.cparagraph(1, 10),
      channel: Mock.Random.pick(['wechat', 'weibo', 'app', 'website']),
      audience: {
        age: [18, 35],
        gender: Mock.Random.pick(['male', 'female', 'all']),
        region: Mock.Random.province(),
      },
      scheduleTime: Mock.Random.datetime(),
      status: Mock.Random.pick(['draft', 'pending', 'approved', 'rejected', 'published']),
      createTime: Mock.Random.datetime(),
      updateTime: Mock.Random.datetime(),
      author: Mock.Random.cname(),
      views: Mock.Random.integer(0, 10000),
      clicks: Mock.Random.integer(0, 1000),
      conversions: Mock.Random.integer(0, 100),
    },
  }
})

// 模拟更新内容数据
Mock.mock(/\/content\/update\/\w+/, 'put', (config) => {
  const id = config.url.match(/\/content\/update\/(\w+)/)[1]
  const { title, type, content, channel, audience, scheduleTime } = JSON.parse(config.body)
  return {
    code: 20000,
    message: 'success',
    data: {
      id,
      title,
      type,
      content,
      channel,
      audience,
      scheduleTime,
      status: scheduleTime ? 'scheduled' : 'pending',
      updateTime: Mock.Random.datetime(),
    },
  }
})

// 模拟删除内容数据
Mock.mock(/\/content\/delete\/\w+/, 'delete', (config) => {
  const id = config.url.match(/\/content\/delete\/(\w+)/)[1]
  return {
    code: 20000,
    message: 'success',
    data: {
      id,
    },
  }
})

// 模拟提交审核数据
Mock.mock(/\/content\/audit\/submit\/\w+/, 'post', (config) => {
  const id = config.url.match(/\/content\/audit\/submit\/(\w+)/)[1]
  return {
    code: 20000,
    message: 'success',
    data: {
      id,
      status: 'pending',
    },
  }
})

// 模拟审核内容数据
Mock.mock(/\/content\/audit\/\w+/, 'put', (config) => {
  const id = config.url.match(/\/content\/audit\/(\w+)/)[1]
  const { status, comment } = JSON.parse(config.body)
  return {
    code: 20000,
    message: 'success',
    data: {
      id,
      status,
      comment,
      auditTime: Mock.Random.datetime(),
      auditor: Mock.Random.cname(),
    },
  }
})

// 模拟排期内容数据
Mock.mock(/\/content\/schedule\/\w+/, 'put', (config) => {
  const id = config.url.match(/\/content\/schedule\/(\w+)/)[1]
  const { scheduleTime } = JSON.parse(config.body)
  return {
    code: 200,
    message: 'success',
    data: {
      id,
      scheduleTime,
      status: 'scheduled',
    },
  }
})

// 模拟发布内容数据
Mock.mock(/\/content\/publish\/\w+/, 'post', (config) => {
  const id = config.url.match(/\/content\/publish\/(\w+)/)[1]
  return {
    code: 200,
    message: 'success',
    data: {
      id,
      status: 'published',
      publishTime: Mock.Random.datetime(),
    },
  }
})

// 模拟获取内容分析数据
Mock.mock(/\/content\/analytics\/\w+/, 'get', (config) => {
  const id = config.url.match(/\/content\/analytics\/(\w+)/)[1]
  const { startDate, endDate } = config.params || {}
  const days = []
  const views = []
  const clicks = []
  const conversions = []
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.unshift(date.toISOString().split('T')[0])
    views.unshift(Mock.Random.integer(0, 1000))
    clicks.unshift(Mock.Random.integer(0, 100))
    conversions.unshift(Mock.Random.integer(0, 10))
  }
  return {
    code: 200,
    message: 'success',
    data: {
      id,
      dateRange: [startDate || days[0], endDate || days[days.length - 1]],
      trends: {
        days,
        views,
        clicks,
        conversions,
      },
      summary: {
        totalViews: views.reduce((a, b) => a + b, 0),
        totalClicks: clicks.reduce((a, b) => a + b, 0),
        totalConversions: conversions.reduce((a, b) => a + b, 0),
        clickThroughRate: `${((clicks.reduce((a, b) => a + b, 0) / views.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%`,
        conversionRate: `${((conversions.reduce((a, b) => a + b, 0) / clicks.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%`,
      },
    },
  }
})

// 模拟获取投放渠道列表
Mock.mock('/content/channels', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: [
      { id: 'wechat', name: '微信公众号' },
      { id: 'weibo', name: '新浪微博' },
      { id: 'app', name: '移动应用' },
      { id: 'website', name: '官方网站' },
    ],
  }
})

// 模拟获取内容类型列表
Mock.mock('/content/types', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: [
      { id: 'text', name: '文本' },
      { id: 'image', name: '图片' },
      { id: 'video', name: '视频' },
      { id: 'richText', name: '富媒体' },
    ],
  }
})
