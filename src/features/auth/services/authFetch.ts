import { getToken } from './tokenService'
import router from '@/router/index'
import { createApiError, isNetworkError, ApiError } from '@/shared/types/error'
import { useLoadingStore } from '@/shared/stores/loading'

export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const loadingStore = useLoadingStore()
  
  try {
    // Increment active requests counter
    loadingStore.incrementRequests()
    
    const token = getToken()
    const headers = new Headers(init.headers || {})
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    headers.set('Content-Type', 'application/json')
    
    const response = await fetch(input, { ...init, headers })
    
    if (response.status === 401 || response.status === 403) {
      const { useAuthStore } = await import('../store/auth')
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
      
      throw createApiError(response.status, undefined, response)
    }
    
    return response
  } catch (error) {
    if (isNetworkError(error)) {
      throw createApiError(0, 'Network connection error', error)
    }
    
    if (error instanceof ApiError) {
      throw error
    }
    
    throw createApiError(500, 'An unexpected error occurred', error)
  } finally {
    // Always decrement active requests counter
    loadingStore.decrementRequests()
  }
}
