import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const NOTICE: AppRouteRecordRaw = {
  path: '/notice',
  name: 'notice',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.notice',
    requiresAuth: true,
    icon: 'icon-notification',
    order: 6,
  },
  children: [
    {
      path: 'list',
      name: 'NoticeList',
      component: () => import('@/views/notice/list.vue'),
      meta: {
        locale: 'menu.notice.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'edit',
      name: 'NoticeEdit',
      component: () => import('@/views/notice/edit.vue'),
      meta: {
        locale: 'menu.notice.edit',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
  ],
}

export default NOTICE
