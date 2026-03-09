import { ref, computed } from 'vue'
import { PagedResult } from '../types/api'

export function usePagination<T>(
  fetchFn: (page: number, pageSize: number) => Promise<PagedResult<T>>,
  initialPageSize = 5
) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const pagedResult = ref<PagedResult<T> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const items = computed(() => pagedResult.value?.items ?? [])
  const totalPages = computed(() => pagedResult.value?.totalPages ?? 0)
  const totalItems = computed(() => pagedResult.value?.totalItems ?? 0)
  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPrevPage = computed(() => page.value > 1)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchFn(page.value, pageSize.value)
      pagedResult.value = result
    } catch (e: any) {
      error.value = e.message || 'Error loading data'
      pagedResult.value = null
    } finally {
      loading.value = false
    }
  }

  function goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
      fetch()
    }
  }

  function nextPage() {
    if (hasNextPage.value) {
      goToPage(page.value + 1)
    }
  }

  function prevPage() {
    if (hasPrevPage.value) {
      goToPage(page.value - 1)
    }
  }

  function refresh() {
    fetch()
  }

  return {
    page,
    pageSize,
    pagedResult,
    loading,
    error,
    items,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    fetch,
    goToPage,
    nextPage,
    prevPage,
    refresh
  }
}
