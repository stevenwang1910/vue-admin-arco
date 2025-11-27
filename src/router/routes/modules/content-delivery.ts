import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const CONTENT_DELIVERY: AppRouteRecordRaw = {
  path: '/content-delivery',
  name: 'content-delivery',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.contentDelivery',
    requiresAuth: true,
    icon: 'icon-publish',
    order: 8,
  },
  children: [
    {
      path: 'content-list',
      name: 'ContentList',
      component: () => import('@/views/content-delivery/content-list/index.vue'),
      meta: {
        locale: 'menu.contentDelivery.contentList',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create-content',
      name: 'CreateContent',
      component: () => import('@/views/content-delivery/create-content/index.vue'),
      meta: {
        locale: 'menu.contentDelivery.createContent',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'edit-content/:id',
      name: 'EditContent',
      component: () => import('@/views/content-delivery/edit-content/index.vue'),
      meta: {
        locale: 'menu.contentDelivery.editContent',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'review-content',
      name: 'ReviewContent',
      component: () => import('@/views/content-delivery/review-content/index.vue'),
      meta: {
        locale: 'menu.contentDelivery.reviewContent',
        requiresAuth: true,
        roles: ['admin', 'editor'],
      },
    },
    {
      path: 'delivery-schedule',
      name: 'DeliverySchedule',
      component: () => import('@/views/content-delivery/delivery-schedule/index.vue'),
      meta: {
        locale: 'menu.contentDelivery.deliverySchedule',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'data-analysis',
      name: 'DataAnalysis',
      component: () => import('@/views/content-delivery/data-analysis/index.vue'),
      meta: {
        locale: 'menu.contentDelivery.dataAnalysis',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}

export default CONTENT_DELIVERY
