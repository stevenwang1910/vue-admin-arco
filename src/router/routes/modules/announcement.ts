import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const ANNOUNCEMENT: AppRouteRecordRaw = {
  path: '/announcement',
  name: 'announcement',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.announcement',
    icon: 'icon-notification',
    requiresAuth: true,
    order: 8,
  },
  children: [
    {
      path: 'list',
      name: 'AnnouncementList',
      component: () => import('@/views/announcement/list/index.vue'),
      meta: {
        locale: 'menu.announcement.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'edit/:id?',
      name: 'AnnouncementEdit',
      component: () => import('@/views/announcement/edit/index.vue'),
      meta: {
        locale: 'menu.announcement.edit',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
  ],
}

export default ANNOUNCEMENT
