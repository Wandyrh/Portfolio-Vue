import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '@/types/productCategory'
import type { PagedResult } from '@/types/api'
import {
  getProductCategoriesPaged,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} from '@/services/productCategoryService'

export const useProductCategoriesStore = defineStore('productCategories', () => {
  // State
  const pagedResult = ref<PagedResult<ProductCategoryDto> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(5)

  // Getters
  const categories = computed(() => pagedResult.value?.items || [])
  const totalPages = computed(() => pagedResult.value?.totalPages || 0)
  const totalItems = computed(() => pagedResult.value?.totalItems || 0)

  // Actions
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const params = `page=${page.value}&pageSize=${pageSize.value}`
      const result = await getProductCategoriesPaged(params)
      if (result.success && result.data) {
        pagedResult.value = result.data
      } else {
        error.value = result.message || 'Failed to load categories'
      }
    } catch (e: any) {
      error.value = e.message || 'Error loading categories'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: CreateProductCategoryDto) {
    await createProductCategory(dto)
    await fetchCategories()
  }

  async function update(id: string, dto: UpdateProductCategoryDto) {
    await updateProductCategory(id, dto)
    await fetchCategories()
  }

  async function remove(id: string) {
    await deleteProductCategory(id)
    await fetchCategories()
  }

  function goToPage(p: number) {
    if (p >= 1 && p <= totalPages.value) {
      page.value = p
      fetchCategories()
    }
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
      fetchCategories()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      fetchCategories()
    }
  }

  return {
    // State
    pagedResult,
    loading,
    error,
    page,
    pageSize,
    // Getters
    categories,
    totalPages,
    totalItems,
    // Actions
    fetchCategories,
    create,
    update,
    remove,
    goToPage,
    nextPage,
    prevPage
  }
})
