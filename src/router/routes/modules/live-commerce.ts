import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const LIVE_COMMERCE: AppRouteRecordRaw = {
  path: '/live-commerce',
  name: 'liveCommerce',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.liveCommerce',
    requiresAuth: true,
    icon: 'icon-video-camera',
    order: 1,
  },
  children: [
    {
      path: 'dashboard',
      name: 'LiveCommerceDashboard',
      component: () => import('@/views/live-commerce-dashboard/index.vue'),
      meta: {
        locale: 'menu.liveCommerce.dashboard',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}

export default LIVE_COMMERCE
