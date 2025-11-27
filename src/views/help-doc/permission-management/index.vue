<template>
  <div class="permission-management-container">
    <a-page-header title="{{ $t('menu.helpDoc.permissionManagement') }}">
      <template #extra>
        <a-button type="primary" @click="handleAddRole">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('helpDoc.addRole') }}
        </a-button>
      </template>
    </a-page-header>

    <a-card>
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="role-list-container">
            <a-list
              :data-source="roles"
              :loading="loading"
              :locale="{ emptyText: $t('helpDoc.noRoles') }"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  :class="{ active: selectedRoleId === item.id }"
                  @click="handleSelectRole(item)"
                >
                  <a-list-item-meta>
                    <template #title>
                      <span class="role-name">{{ item.name }}</span>
                    </template>
                    <template #description>
                      <span class="role-description">{{ item.description }}</span>
                    </template>
                  </a-list-item-meta>
                  <template #extra>
                    <a-badge :count="item.userCount" :number-style="{ backgroundColor: '#52c41a' }" />
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-col>

        <a-col :span="16">
          <div class="permission-detail-container">
            <div v-if="selectedRole" class="role-detail">
              <div class="role-header">
                <h3>{{ selectedRole.name }}</h3>
                <p>{{ selectedRole.description }}</p>
                <a-space>
                  <a-button size="small" @click="handleEditRole">
                    {{ $t('helpDoc.edit') }}
                  </a-button>
                  <a-button size="small" status="danger" @click="handleDeleteRole" v-if="selectedRole.id !== 'admin'">
                    {{ $t('helpDoc.delete') }}
                  </a-button>
                </a-space>
              </div>

              <a-divider />

              <div class="permission-settings">
                <h4>{{ $t('helpDoc.permissionSettings') }}</h4>

                <a-collapse v-model:active-name="activePermissionGroups" :bordered="false">
                  <a-collapse-item name="document" header="{{ $t('helpDoc.documentPermissions') }}">
                    <a-space direction="vertical" style="width: 100%">
                      <a-checkbox-group v-model="selectedPermissions.document">
                        <a-space direction="vertical">
                          <a-checkbox value="view">{{ $t('helpDoc.viewDocuments') }}</a-checkbox>
                          <a-checkbox value="create">{{ $t('helpDoc.createDocuments') }}</a-checkbox>
                          <a-checkbox value="edit">{{ $t('helpDoc.editDocuments') }}</a-checkbox>
                          <a-checkbox value="delete">{{ $t('helpDoc.deleteDocuments') }}</a-checkbox>
                          <a-checkbox value="publish">{{ $t('helpDoc.publishDocuments') }}</a-checkbox>
                          <a-checkbox value="archive">{{ $t('helpDoc.archiveDocuments') }}</a-checkbox>
                        </a-space>
                      </a-checkbox-group>
                    </a-space>
                  </a-collapse-item>

                  <a-collapse-item name="category" header="{{ $t('helpDoc.categoryPermissions') }}">
                    <a-space direction="vertical" style="width: 100%">
                      <a-checkbox-group v-model="selectedPermissions.category">
                        <a-space direction="vertical">
                          <a-checkbox value="view">{{ $t('helpDoc.viewCategories') }}</a-checkbox>
                          <a-checkbox value="create">{{ $t('helpDoc.createCategories') }}</a-checkbox>
                          <a-checkbox value="edit">{{ $t('helpDoc.editCategories') }}</a-checkbox>
                          <a-checkbox value="delete">{{ $t('helpDoc.deleteCategories') }}</a-checkbox>
                        </a-space>
                      </a-checkbox-group>
                    </a-space>
                  </a-collapse-item>

                  <a-collapse-item name="version" header="{{ $t('helpDoc.versionPermissions') }}">
                    <a-space direction="vertical" style="width: 100%">
                      <a-checkbox-group v-model="selectedPermissions.version">
                        <a-space direction="vertical">
                          <a-checkbox value="view">{{ $t('helpDoc.viewVersions') }}</a-checkbox>
                          <a-checkbox value="compare">{{ $t('helpDoc.compareVersions') }}</a-checkbox>
                          <a-checkbox value="restore">{{ $t('helpDoc.restoreVersions') }}</a-checkbox>
                        </a-space>
                      </a-checkbox-group>
                    </a-space>
                  </a-collapse-item>

                  <a-collapse-item name="user" header="{{ $t('helpDoc.userPermissions') }}">
                    <a-space direction="vertical" style="width: 100%">
                      <a-checkbox-group v-model="selectedPermissions.user">
                        <a-space direction="vertical">
                          <a-checkbox value="view">{{ $t('helpDoc.viewUsers') }}</a-checkbox>
                          <a-checkbox value="create">{{ $t('helpDoc.createUsers') }}</a-checkbox>
                          <a-checkbox value="edit">{{ $t('helpDoc.editUsers') }}</a-checkbox>
                          <a-checkbox value="delete">{{ $t('helpDoc.deleteUsers') }}</a-checkbox>
                          <a-checkbox value="assignRoles">{{ $t('helpDoc.assignRoles') }}</a-checkbox>
                        </a-space>
                      </a-checkbox-group>
                    </a-space>
                  </a-collapse-item>

                  <a-collapse-item name="system" header="{{ $t('helpDoc.systemPermissions') }}">
                    <a-space direction="vertical" style="width: 100%">
                      <a-checkbox-group v-model="selectedPermissions.system">
                        <a-space direction="vertical">
                          <a-checkbox value="backup">{{ $t('helpDoc.backupData') }}</a-checkbox>
                          <a-checkbox value="restore">{{ $t('helpDoc.restoreData') }}</a-checkbox>
                          <a-checkbox value="settings">{{ $t('helpDoc.manageSettings') }}</a-checkbox>
                        </a-space>
                      </a-checkbox-group>
                    </a-space>
                  </a-collapse-item>
                </a-collapse>

                <a-space style="margin-top: 24px">
                  <a-button type="primary" @click="handleSavePermissions">
                    {{ $t('helpDoc.savePermissions') }}
                  </a-button>
                  <a-button @click="handleResetPermissions">
                    {{ $t('helpDoc.reset') }}
                  </a-button>
                </a-space>
              </div>
            </div>

            <div v-else class="no-role-selected">
              {{ $t('helpDoc.selectRoleToManage') }}
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- Add/Edit Role Modal -->
    <a-modal
      v-model:visible="roleModalVisible"
      :title="isEditRole ? $t('helpDoc.editRole') : $t('helpDoc.addRole')"
      @ok="handleRoleModalConfirm"
      @cancel="handleRoleModalCancel"
    >
      <a-form layout="vertical">
        <a-form-item field="name" label="{{ $t('helpDoc.roleName') }}" :rules="[{ required: true }]">
          <a-input v-model="roleFormData.name" placeholder="{{ $t('helpDoc.enterRoleName') }}" />
        </a-form-item>

        <a-form-item field="description" label="{{ $t('helpDoc.description') }}">
          <a-textarea v-model="roleFormData.description" :rows="3" placeholder="{{ $t('helpDoc.enterDescription') }}" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

// State
const loading = ref(false)
const roles = ref<any[]>([])
const selectedRoleId = ref<string>('')
const activePermissionGroups = ref<string[]>(['document', 'category', 'version'])

const roleModalVisible = ref(false)
const isEditRole = ref(false)
const roleFormData = ref({
  name: '',
  description: '',
})

const selectedPermissions = ref({
  document: [] as string[],
  category: [] as string[],
  version: [] as string[],
  user: [] as string[],
  system: [] as string[],
})

// Computed
const selectedRole = computed(() => {
  return roles.value.find((role) => role.id === selectedRoleId.value)
})

// Methods
const fetchRoles = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300))
    roles.value = [
      {
        id: 'admin',
        name: '管理员',
        description: '拥有系统的所有权限',
        userCount: 1,
        permissions: {
          document: ['view', 'create', 'edit', 'delete', 'publish', 'archive'],
          category: ['view', 'create', 'edit', 'delete'],
          version: ['view', 'compare', 'restore'],
          user: ['view', 'create', 'edit', 'delete', 'assignRoles'],
          system: ['backup', 'restore', 'settings'],
        },
      },
      {
        id: 'editor',
        name: '编辑',
        description: '可以创建、编辑和发布文档',
        userCount: 5,
        permissions: {
          document: ['view', 'create', 'edit', 'publish', 'archive'],
          category: ['view'],
          version: ['view', 'compare'],
          user: [],
          system: [],
        },
      },
      {
        id: 'viewer',
        name: '查看者',
        description: '只能查看文档和版本历史',
        userCount: 10,
        permissions: {
          document: ['view'],
          category: ['view'],
          version: ['view'],
          user: [],
          system: [],
        },
      },
    ]
  } catch (error) {
    message.error($t('helpDoc.fetchRolesFailed'))
  } finally {
    loading.value = false
  }
}

const handleSelectRole = (role: any) => {
  selectedRoleId.value = role.id
  selectedPermissions.value = { ...role.permissions }
}

const handleAddRole = () => {
  isEditRole.value = false
  roleFormData.value = {
    name: '',
    description: '',
  }
  roleModalVisible.value = true
}

const handleEditRole = () => {
  if (selectedRole.value) {
    isEditRole.value = true
    roleFormData.value = {
      name: selectedRole.value.name,
      description: selectedRole.value.description,
    }
    roleModalVisible.value = true
  }
}

const handleDeleteRole = () => {
  // TODO: Implement delete role functionality
  message.success($t('helpDoc.roleDeleted'))
  selectedRoleId.value = ''
  fetchRoles()
}

const handleRoleModalConfirm = () => {
  // TODO: Implement add/edit role functionality
  message.success(isEditRole.value ? $t('helpDoc.roleUpdated') : $t('helpDoc.roleAdded'))
  roleModalVisible.value = false
  fetchRoles()
}

const handleRoleModalCancel = () => {
  roleModalVisible.value = false
}

const handleSavePermissions = () => {
  // TODO: Implement save permissions functionality
  message.success($t('helpDoc.permissionsSaved'))
}

const handleResetPermissions = () => {
  if (selectedRole.value) {
    selectedPermissions.value = { ...selectedRole.value.permissions }
  }
}

// Lifecycle
onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.permission-management-container {
  padding: 20px;
}

.role-list-container {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 16px;
  height: 600px;
  overflow-y: auto;
}

.role-list-container .a-list-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.role-list-container .a-list-item:hover {
  background-color: #f5f5f5;
}

.role-list-container .a-list-item.active {
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
}

.role-name {
  font-weight: 600;
  font-size: 14px;
}

.role-description {
  font-size: 12px;
  color: #999;
}

.permission-detail-container {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 24px;
  min-height: 600px;
}

.no-role-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}

.role-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.role-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.role-header p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.permission-settings h4 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}
</style>
