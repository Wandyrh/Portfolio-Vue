import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginDto, LoginUserResponseDTO } from '../types/auth'
import type { ApiResult } from '@/shared/types/api'
import { login as loginService } from '../services/authService'
import { getToken, setToken as saveToken, removeToken, isAuthenticated as checkToken } from '../services/tokenService'
import { useUsersStore } from '@/features/users/store/users'
import { useProductsStore } from '@/features/products/store/products'
import { useProductCategoriesStore } from '@/features/categories/store/productCategories'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(getToken())
  const expiresAt = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => {
    if (!token.value) return false
    if (!expiresAt.value) return checkToken()
    
    // Check if token has expired
    const expirationDate = new Date(expiresAt.value)
    const now = new Date()
    return now < expirationDate && checkToken()
  })

  // Actions
  async function login(credentials: LoginDto): Promise<ApiResult<LoginUserResponseDTO>> {
    loading.value = true
    error.value = null
    
    try {
      const result = await loginService(credentials)
      
      if (result.success && result.data) {
        token.value = result.data.accessToken
        expiresAt.value = result.data.expiresAt
        saveToken(result.data.accessToken)
      } else {
        error.value = result.message || 'Login failed'
      }
      
      return result
    } catch (e: any) {
      error.value = e.message || 'Login error'
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    // Clear auth state
    token.value = null
    expiresAt.value = null
    error.value = null
    
    // Clear entity stores
    try {
      const usersStore = useUsersStore()
      const productsStore = useProductsStore()
      const categoriesStore = useProductCategoriesStore()
      
      usersStore.$reset()
      productsStore.$reset()
      categoriesStore.$reset()
    } catch (error) {
      console.warn('Error resetting stores during logout:', error)
    }
    
    // Remove token from storage
    removeToken()
  }

  function checkAuth(): boolean {
    const storedToken = getToken()
    if (!storedToken) {
      token.value = null
      expiresAt.value = null
      return false
    }
    
    token.value = storedToken
    return isAuthenticated.value
  }

  function $reset(): void {
    token.value = null
    expiresAt.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    token,
    expiresAt,
    loading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    checkAuth,
    $reset
  }
})
