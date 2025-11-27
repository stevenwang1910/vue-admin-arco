import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const HELP_DOC: AppRouteRecordRaw = {
  path: '/help-doc',
  name: 'help-doc',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.helpDoc',
    requiresAuth: true,
    icon: 'icon-book',
    order: 8,
  },
  children: [
    {
      path: 'document-list',
      name: 'DocumentList',
      component: () => import('@/views/help-doc/document-list/index.vue'),
      meta: {
        locale: 'menu.helpDoc.documentList',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'document-editor/:id?',
      name: 'DocumentEditor',
      component: () => import('@/views/help-doc/document-editor/index.vue'),
      meta: {
        locale: 'menu.helpDoc.documentEditor',
        requiresAuth: true,
        roles: ['admin', 'editor'],
        hideInMenu: true,
      },
    },
    {
      path: 'category-management',
      name: 'CategoryManagement',
      component: () => import('@/views/help-doc/category-management/index.vue'),
      meta: {
        locale: 'menu.helpDoc.categoryManagement',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'version-history/:id',
      name: 'VersionHistory',
      component: () => import('@/views/help-doc/version-history/index.vue'),
      meta: {
        locale: 'menu.helpDoc.versionHistory',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'permission-management',
      name: 'PermissionManagement',
      component: () => import('@/views/help-doc/permission-management/index.vue'),
      meta: {
        locale: 'menu.helpDoc.permissionManagement',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'backup-restore',
      name: 'BackupRestore',
      component: () => import('@/views/help-doc/backup-restore/index.vue'),
      meta: {
        locale: 'menu.helpDoc.backupRestore',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
}

export default HELP_DOC
