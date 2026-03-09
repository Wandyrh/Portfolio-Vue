import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserDto, CreateUserDto, UpdateUserDto } from '../types/user'
import type { PagedResult } from '@/shared/types/api'
import {
  getUsersPaged,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

export const useUsersStore = defineStore('users', () => {
  const pagedResult = ref<PagedResult<UserDto> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(5)

  const { handleError } = useErrorHandler()
  
  // Getters
  const users = computed(() => pagedResult.value?.items || [])
  const totalPages = computed(() => pagedResult.value?.totalPages || 0)
  const totalItems = computed(() => pagedResult.value?.totalItems || 0)

  // Actions
  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const result = await getUsersPaged(page.value, pageSize.value)
      if (result.success && result.data) {
        pagedResult.value = result.data
      } else {
        error.value = result.message || 'Failed to load users'
        handleError(new Error(error.value), { 
          showToast: false
        })
      }
    } catch (e: any) {
      error.value = e.message || 'Error loading users'
      handleError(e)
    } finally {
      loading.value = false
    }
  }

  async function create(dto: CreateUserDto) {
    try {
      await createUser(dto)
      await fetchUsers()
    } catch (e: any) {
      handleError(e)
      throw e
    }
  }

  async function update(id: string, dto: UpdateUserDto) {
    try {
      await updateUser(id, dto)
      await fetchUsers()
    } catch (e: any) {
      handleError(e)
      throw e
    }
  }

  async function remove(id: string) {
    try {
      await deleteUser(id)
      await fetchUsers()
    } catch (e: any) {
      handleError(e)
      throw e
    }
  }

  function goToPage(p: number) {
    if (p >= 1 && p <= totalPages.value) {
      page.value = p
      fetchUsers()
    }
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
      fetchUsers()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      fetchUsers()
    }
  }

  function $reset() {
    pagedResult.value = null
    loading.value = false
    error.value = null
    page.value = 1
    pageSize.value = 5
  }

  return {
    // State
    pagedResult,
    loading,
    error,
    page,
    pageSize,
    // Getters
    users,
    totalPages,
    totalItems,
    // Actions
    fetchUsers,
    create,
    update,
    remove,
    goToPage,
    nextPage,
    prevPage,
    $reset
  }
})
