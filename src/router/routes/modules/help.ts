import type { RouteRecordNormalized } from 'vue-router'

const routes: RouteRecordNormalized = {
  path: '/help',
  name: 'help',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: 'menu.help',
    icon: 'icon-document',
    requiresAuth: true,
    order: 8,
  },
  children: [
    {
      path: 'document-list',
      name: 'help-document-list',
      component: () => import('@/views/help/document-list.vue'),
      meta: {
        locale: 'menu.help.documentList',
        requiresAuth: true,
      },
    },
    {
      path: 'document-edit/:id?',
      name: 'help-document-edit',
      component: () => import('@/views/help/document-edit.vue'),
      meta: {
        locale: 'menu.help.documentEdit',
        requiresAuth: true,
        hideInMenu: true,
      },
    },
    {
      path: 'category-management',
      name: 'help-category-management',
      component: () => import('@/views/help/category-management.vue'),
      meta: {
        locale: 'menu.help.categoryManagement',
        requiresAuth: true,
      },
    },
    {
      path: 'version-history/:id',
      name: 'help-version-history',
      component: () => import('@/views/help/version-history.vue'),
      meta: {
        locale: 'menu.help.versionHistory',
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
}

export default routes
