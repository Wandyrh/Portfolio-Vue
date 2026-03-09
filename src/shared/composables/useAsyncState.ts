import { ref } from 'vue'

export function useAsyncState() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute<T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (err: any) => void
  ): Promise<T | null> {
    loading.value = true
    error.value = null
    try {
      const result = await asyncFn()
      if (onSuccess) {
        onSuccess(result)
      }
      return result
    } catch (e: any) {
      error.value = e.message || 'An error occurred'
      if (onError) {
        onError(e)
      }
      return null
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    clearError
  }
}
