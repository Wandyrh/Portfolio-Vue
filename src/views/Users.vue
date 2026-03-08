<template>
  <div>
    <div class="title-row">
      <h2 class="title-main">
        <span class="icon-entity" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" stroke="#42b883" stroke-width="2" fill="none" />
            <path d="M3 17c0-2.7614 3.134-5 7-5s7 2.2386 7 5" stroke="#42b883" stroke-width="2" fill="none" />
          </svg>
        </span>
        {{ $t('users.title') }}
      </h2>
      <button class="add-entity-btn" @click="userModal.openCreate()">
        <span class="icon-plus" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#42b883" />
            <path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        {{ $t('users.addUser') }}
      </button>
    </div>
    <div v-if="usersStore.loading">{{ $t('common.loading') }}</div>
    <div v-else-if="usersStore.error" class="error">{{ usersStore.error }}</div>

    <!-- User Modal -->
    <ConfirmDialog :show="confirmDialog.isOpen.value" :title="$t('users.deleteUser')" :message="confirmDialog.message.value" @confirm="confirmDialog.confirm"
      @cancel="confirmDialog.cancel" />
    <div v-if="userModal.isOpen.value">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ userModal.mode.value === 'edit' ? $t('users.editUser') : $t('users.addUser') }}
              </h5>
              <button type="button" class="btn-close" @click="userModal.close()"></button>
            </div>
            <div class="modal-body">
              <UserForm :mode="userModal.mode.value" :user="userModal.mode.value === 'edit' ? userModal.selectedItem.value : null" :initial-values="userModal.mode.value === 'edit' && userModal.selectedItem.value ? {
                firstName: userModal.selectedItem.value.firstName,
                lastName: userModal.selectedItem.value.lastName,
                email: userModal.selectedItem.value.email,
                phone: userModal.selectedItem.value.phone,
                password: ''
              } : {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: ''
              }" @submit="handleUserFormSubmit" @cancel="userModal.close()" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="entity-card">
        <div class="table-responsive">
          <table class="table table-hover align-middle entity-table">
            <thead>
              <tr>
                <th scope="col"><span class="th-bg">{{ $t('users.firstName') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('users.lastName') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('users.email') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('users.phone') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('common.actions') }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usersStore.users" :key="user.id" class="entity-row">
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td class="actions-cell">
                  <button class="action-btn" :title="$t('common.edit')" @click="userModal.openEdit(user)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#42b883" stroke-width="1.5"
                        fill="none" />
                      <path d="M14.06 6.44l1.5-1.5a1.5 1.5 0 0 1 2.12 2.12l-1.5 1.5-2.12-2.12z" stroke="#42b883"
                        stroke-width="1.5" fill="none" />
                    </svg>
                  </button>
                  <button class="action-btn" :title="$t('common.delete')" @click="showDeleteConfirm(user)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M6 7v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" stroke="#e74c3c" stroke-width="1.5"
                        fill="none" />
                      <path d="M9 10v4M11 10v4M4 7h12M8 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" stroke="#e74c3c"
                        stroke-width="1.5" fill="none" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="usersStore.pagedResult">
          <button :disabled="usersStore.page === 1" @click="usersStore.goToPage(usersStore.page - 1)">{{ $t('common.prev') }}</button>
          <span>{{ $t('common.page') }} {{ usersStore.page }} {{ $t('common.of') }} {{ usersStore.totalPages }}</span>
          <button :disabled="usersStore.page === usersStore.totalPages" @click="usersStore.goToPage(usersStore.page + 1)">{{ $t('common.next') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { UserDto, CreateUserDto, UpdateUserDto } from '../types/user'
import UserForm from '../components/UserForm.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useModal } from '../composables/useModal'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useUsersStore } from '../stores/users'

const { t } = useI18n()
const toast = useToast()
const usersStore = useUsersStore()

// Modal management
const userModal = useModal<UserDto>()

// Confirm dialog management
const confirmDialog = useConfirmDialog()

function showDeleteConfirm(user: UserDto) {
  const message = t('users.confirmDelete', { name: `${user.firstName} ${user.lastName}` })
  confirmDialog.show(message, user, () => handleDelete(user))
}

async function handleDelete(user: UserDto) {
  try {
    await usersStore.remove(user.id)
    toast.success(t('users.deleted'))
  } catch (e: any) {
    toast.error(t('users.errorDeleting'))
  }
}

function handleUserFormSubmit(dto: UpdateUserDto | CreateUserDto) {
  if (userModal.mode.value === 'edit' && userModal.selectedItem.value) {
    handleEditUser(dto as UpdateUserDto)
  } else {
    handleCreateUser(dto as CreateUserDto)
  }
}

async function handleEditUser(dto: UpdateUserDto) {
  try {
    await usersStore.update(dto.id, dto)
    toast.success(t('users.updated'))
    userModal.close()
  } catch (e: any) {
    toast.error(t('users.errorUpdating'))
  }
}

async function handleCreateUser(dto: CreateUserDto) {
  try {
    await usersStore.create(dto)
    toast.success(t('users.created'))
    userModal.close()
  } catch (e: any) {
    toast.error(t('users.errorCreating'))
  }
}

onMounted(usersStore.fetchUsers)
</script>
