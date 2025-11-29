import Mock from 'mockjs'

// Mock popular list data
Mock.mock('/api/popular/list', 'get', (req) => {
  const type = req.url.split('=')[1] || 'text'

  const data = Mock.mock({
    'list|10-20': [
      {
        'key|+1': 1,
        type,
        title: '@ctitle(10, 20)',
        'clickNumber|1000-10000': 1,
        'increases|0-100.1': 1,
      },
    ],
  })

  return data.list
})
