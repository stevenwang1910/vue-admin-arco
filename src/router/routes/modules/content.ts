import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const CONTENT: AppRouteRecordRaw = {
  path: '/content',
  name: 'content',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.content',
    requiresAuth: true,
    icon: 'icon-content',
    order: 6,
  },
  children: [
    {
      path: 'list',
      name: 'ContentList',
      component: () => import('@/views/content/list/index.vue'),
      meta: {
        locale: 'menu.content.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create',
      name: 'ContentCreate',
      component: () => import('@/views/content/create/index.vue'),
      meta: {
        locale: 'menu.content.create',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'edit/:id',
      name: 'ContentEdit',
      component: () => import('@/views/content/edit/index.vue'),
      meta: {
        locale: 'menu.content.edit',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'audit',
      name: 'ContentAudit',
      component: () => import('@/views/content/audit/index.vue'),
      meta: {
        locale: 'menu.content.audit',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'schedule',
      name: 'ContentSchedule',
      component: () => import('@/views/content/schedule/index.vue'),
      meta: {
        locale: 'menu.content.schedule',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'analytics',
      name: 'ContentAnalytics',
      component: () => import('@/views/content/analytics/index.vue'),
      meta: {
        locale: 'menu.content.analytics',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}

export default CONTENT
