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
      <button class="add-entity-btn" @click="openUserModal">
        <span class="icon-plus" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#42b883" />
            <path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        {{ $t('users.addUser') }}
      </button>
    </div>
    <div v-if="loading">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- User Modal -->
    <ConfirmDialog :show="showConfirmDialog" :title="$t('users.deleteUser')" :message="confirmMessage" @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser" />
    <div v-if="showUserModal">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ userModalMode === 'edit' ? $t('users.editUser') : $t('users.addUser') }}
              </h5>
              <button type="button" class="btn-close" @click="closeUserModal"></button>
            </div>
            <div class="modal-body">
              <UserForm :mode="userModalMode" :user="userModalMode === 'edit' ? selectedUser : null" :initial-values="userModalMode === 'edit' && selectedUser ? {
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                phone: selectedUser.phone,
                password: ''
              } : {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: ''
              }" @submit="handleUserFormSubmit" @cancel="closeUserModal" />
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
              <tr v-for="user in pagedResult?.items" :key="user.id" class="entity-row">
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td class="actions-cell">
                  <button class="action-btn" :title="$t('common.edit')" @click="openEditUserModal(user)">
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
        <div class="pagination" v-if="pagedResult">
          <button :disabled="page === 1" @click="goToPage(page - 1)">{{ $t('common.prev') }}</button>
          <span>{{ $t('common.page') }} {{ page }} {{ $t('common.of') }} {{ pagedResult.totalPages }}</span>
          <button :disabled="page === pagedResult.totalPages" @click="goToPage(page + 1)">{{ $t('common.next') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getUsersPaged, createUser, updateUser, deleteUser } from '../services/userService';
import { UserDto, CreateUserDto, UpdateUserDto } from '../types/user';
import { PagedResult } from '../types/api';
import UserForm from '../components/UserForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'UsersView',
  setup() {
    const { t } = useI18n();
    const pagedResult = ref<PagedResult<UserDto> | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const page = ref(1);
    const pageSize = ref(5);

    const toast = useToast();

    // Confirm dialog state
    const showConfirmDialog = ref(false);
    const confirmMessage = ref('');
    const userToDelete = ref<UserDto | null>(null);

    function showDeleteConfirm(user: UserDto) {
      userToDelete.value = user;
      confirmMessage.value = `${t('users.confirmDelete', { name: user.firstName + ' ' + user.lastName })}`;
      showConfirmDialog.value = true;
    }

    async function confirmDeleteUser() {
      if (!userToDelete.value) return;
      try {
        loading.value = true;
        error.value = null;
        await deleteUser(userToDelete.value.id);
        toast.success(t('users.deleted'));
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || t('users.errorDeleting');
      } finally {
        loading.value = false;
        showConfirmDialog.value = false;
        userToDelete.value = null;
      }
    }

    function cancelDeleteUser() {
      showConfirmDialog.value = false;
      userToDelete.value = null;
    }

    const showUserModal = ref(false);
    const userModalMode = ref<'create' | 'edit'>('create');
    const selectedUser = ref<UserDto | null>(null);

    function openUserModal() {
      userModalMode.value = 'create';
      selectedUser.value = null;
      showUserModal.value = true;
    }
    function openEditUserModal(user: UserDto) {
      userModalMode.value = 'edit';
      selectedUser.value = user;
      showUserModal.value = true;
    }
    function closeUserModal() {
      showUserModal.value = false;
      selectedUser.value = null;
    }

    function handleUserFormSubmit(dto: UpdateUserDto | CreateUserDto) {
      if (userModalMode.value === 'edit') {
        handleEditUser(dto as UpdateUserDto)
      } else {
        handleCreateUser(dto as CreateUserDto);
      }
    }

    async function handleEditUser(dto: UpdateUserDto) {
      try {
        loading.value = true;
        error.value = null;
        await updateUser(dto.id, dto);
        toast.success(t('users.updated'));
        closeUserModal();
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || t('users.errorUpdating');
      } finally {
        loading.value = false;
      }
    }

    async function handleCreateUser(dto: CreateUserDto) {
      try {
        loading.value = true;
        error.value = null;
        await createUser(dto);
        toast.success(t('users.created'));
        closeUserModal();
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || t('users.errorCreating');
      } finally {
        loading.value = false;
      }
    }

    const fetchUsers = async () => {
      loading.value = true;
      error.value = null;
      try {
        const result = await getUsersPaged(page.value, pageSize.value);
        if (result.success && result.data) {
          pagedResult.value = result.data;
        } else {
          error.value = result.message || t('users.failedToLoad');
        }
      } catch (e: any) {
        error.value = e.message || t('users.errorLoading');
      } finally {
        loading.value = false;
      }
    };

    async function handleDeleteUser(user: UserDto) {
      console.log('Deleting user:', user);
      if (!confirm(t('users.confirmDelete', { name: user.firstName + ' ' + user.lastName }))) return;
      try {
        loading.value = true;
        error.value = null;
        await deleteUser(user.id);
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || t('users.errorDeleting');
      } finally {
        loading.value = false;
      }
    }

    onMounted(fetchUsers);

    const goToPage = (p: number) => {
      if (pagedResult.value && p >= 1 && p <= pagedResult.value.totalPages) {
        page.value = p;
        fetchUsers();
      }
    };

    return {
      pagedResult,
      loading,
      error,
      page,
      pageSize,
      goToPage,
      showUserModal,
      openUserModal,
      closeUserModal,
      handleCreateUser,
      handleEditUser,
      handleUserFormSubmit,
      showDeleteConfirm,
      handleDeleteUser,
      showConfirmDialog,
      confirmMessage,
      confirmDeleteUser,
      cancelDeleteUser,
      openEditUserModal,
      userModalMode,
      selectedUser,
    };

  },
  components: { UserForm, ConfirmDialog },
});
</script>
