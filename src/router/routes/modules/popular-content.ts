import type { RouteRecordNormalized } from 'vue-router'

const popularContentManagement: RouteRecordNormalized = {
  path: '/popular-content-management',
  name: 'PopularContentManagement',
  component: () => import('@/views/popular-content-management/index.vue'),
  meta: {
    title: 'Popular Content Management',
    requiresAuth: true,
  },
}

export default popularContentManagement
