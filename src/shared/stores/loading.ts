import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const loadingProgress = ref(0)  

  const activeRequests = ref(0)

  function startLoading(message = '') {
    isLoading.value = true
    loadingMessage.value = message
    loadingProgress.value = 0
  }

  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = ''
    loadingProgress.value = 100    

    setTimeout(() => {
      if (!isLoading.value) {
        loadingProgress.value = 0
      }
    }, 300)
  }

  function setProgress(progress: number) {
    loadingProgress.value = Math.min(100, Math.max(0, progress))
  }

  function incrementRequests() {
    activeRequests.value++
    if (activeRequests.value === 1) {
      startLoading()
    }
  }

  function decrementRequests() {
    activeRequests.value = Math.max(0, activeRequests.value - 1)
    if (activeRequests.value === 0) {
      stopLoading()
    }
  }

  return {
    isLoading,
    loadingMessage,
    loadingProgress,
    activeRequests,
    startLoading,
    stopLoading,
    setProgress,
    incrementRequests,
    decrementRequests
  }
})
