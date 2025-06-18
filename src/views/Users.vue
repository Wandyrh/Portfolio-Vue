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
        Users
      </h2>
      <button class="add-entity-btn" @click="openUserModal">
        <span class="icon-plus" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#42b883" />
            <path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        Add User
      </button>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- User Modal -->
    <ConfirmDialog :show="showConfirmDialog" title="Delete User" :message="confirmMessage" @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser" />
    <div v-if="showUserModal">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ userModalMode === 'edit' ? 'Edit User' : 'Add User' }}
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
                <th scope="col"><span class="th-bg">First Name</span></th>
                <th scope="col"><span class="th-bg">Last Name</span></th>
                <th scope="col"><span class="th-bg">Email</span></th>
                <th scope="col"><span class="th-bg">Phone</span></th>
                <th scope="col"><span class="th-bg">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in pagedResult?.items" :key="user.id" class="entity-row">
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td class="actions-cell">
                  <button class="action-btn" title="Edit" @click="openEditUserModal(user)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#42b883" stroke-width="1.5"
                        fill="none" />
                      <path d="M14.06 6.44l1.5-1.5a1.5 1.5 0 0 1 2.12 2.12l-1.5 1.5-2.12-2.12z" stroke="#42b883"
                        stroke-width="1.5" fill="none" />
                    </svg>
                  </button>
                  <button class="action-btn" title="Delete" @click="showDeleteConfirm(user)">
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
          <button :disabled="page === 1" @click="goToPage(page - 1)">Prev</button>
          <span>Page {{ page }} of {{ pagedResult.totalPages }}</span>
          <button :disabled="page === pagedResult.totalPages" @click="goToPage(page + 1)">Next</button>
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

export default defineComponent({
  name: 'UsersView',
  setup() {
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
      confirmMessage.value = `Are you sure you want to delete ${user.firstName} ${user.lastName}?`;
      showConfirmDialog.value = true;
    }

    async function confirmDeleteUser() {
      if (!userToDelete.value) return;
      try {
        loading.value = true;
        error.value = null;
        await deleteUser(userToDelete.value.id);
        toast.success("User deleted");
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || 'Error deleting user';
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
        toast.success("User updated");
        closeUserModal();
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || 'Error updating user';
      } finally {
        loading.value = false;
      }
    }

    async function handleCreateUser(dto: CreateUserDto) {
      try {
        loading.value = true;
        error.value = null;
        await createUser(dto);
        toast.success("User created");
        closeUserModal();
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || 'Error creating user';
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
          error.value = result.message || 'Failed to load users';
        }
      } catch (e: any) {
        error.value = e.message || 'Error loading users';
      } finally {
        loading.value = false;
      }
    };

    async function handleDeleteUser(user: UserDto) {
      console.log('Deleting user:', user);
      if (!confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) return;
      try {
        loading.value = true;
        error.value = null;
        await deleteUser(user.id);
        fetchUsers();
      } catch (e: any) {
        error.value = e.message || 'Error deleting user';
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
