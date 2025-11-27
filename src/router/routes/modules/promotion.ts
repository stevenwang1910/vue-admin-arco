import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const PROMOTION: AppRouteRecordRaw = {
  path: '/promotion',
  name: 'promotion',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.promotion',
    requiresAuth: true,
    icon: 'icon-advertisement',
    order: 6,
  },
  children: [
    {
      path: 'create',
      name: 'PromotionCreate',
      component: () => import('@/views/promotion/create/index.vue'),
      meta: {
        locale: 'menu.promotion.create',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'statistics',
      name: 'PromotionStatistics',
      component: () => import('@/views/promotion/statistics/index.vue'),
      meta: {
        locale: 'menu.promotion.statistics',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'channels',
      name: 'PromotionChannels',
      component: () => import('@/views/promotion/channels/index.vue'),
      meta: {
        locale: 'menu.promotion.channels',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'materials',
      name: 'PromotionMaterials',
      component: () => import('@/views/promotion/materials/index.vue'),
      meta: {
        locale: 'menu.promotion.materials',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}

export default PROMOTION