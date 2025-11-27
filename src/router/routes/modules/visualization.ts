import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const VISUALIZATION: AppRouteRecordRaw = {
  path: '/visualization',
  name: 'visualization',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.visualization',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
  },
  children: [
    {
      path: 'data-analysis',
      name: 'DataAnalysis',
      component: () => import('@/views/visualization/data-analysis/index.vue'),
      meta: {
        locale: 'menu.visualization.dataAnalysis',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'multi-dimension-data-analysis',
      name: 'MultiDimensionDataAnalysis',
      component: () => import('@/views/visualization/multi-dimension-data-analysis/index.vue'),
      meta: {
        locale: 'menu.visualization.multiDimensionDataAnalysis',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'city-operation',
      name: 'CityOperation',
      component: () => import('@/views/visualization/city-operation/index.vue'),
      meta: {
        locale: 'menu.visualization.cityOperation',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
}

export default VISUALIZATION
