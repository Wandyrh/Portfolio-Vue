import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProductDto, CreateProductDto, UpdateProductDto } from '@/types/product'
import type { PagedResult } from '@/types/api'
import {
  getProductsPaged,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/services/productService'

export const useProductsStore = defineStore('products', () => {
  // State
  const pagedResult = ref<PagedResult<ProductDto> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(5)

  // Getters
  const products = computed(() => pagedResult.value?.items || [])
  const totalPages = computed(() => pagedResult.value?.totalPages || 0)
  const totalItems = computed(() => pagedResult.value?.totalItems || 0)

  // Actions
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const params = `page=${page.value}&pageSize=${pageSize.value}`
      const result = await getProductsPaged(params)
      if (result.success && result.data) {
        pagedResult.value = result.data
      } else {
        error.value = result.message || 'Failed to load products'
      }
    } catch (e: any) {
      error.value = e.message || 'Error loading products'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: CreateProductDto) {
    await createProduct(dto)
    await fetchProducts()
  }

  async function update(id: string, dto: UpdateProductDto) {
    await updateProduct(id, dto)
    await fetchProducts()
  }

  async function remove(id: string) {
    await deleteProduct(id)
    await fetchProducts()
  }

  function goToPage(p: number) {
    if (p >= 1 && p <= totalPages.value) {
      page.value = p
      fetchProducts()
    }
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
      fetchProducts()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      fetchProducts()
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
    products,
    totalPages,
    totalItems,
    // Actions
    fetchProducts,
    create,
    update,
    remove,
    goToPage,
    nextPage,
    prevPage,
    $reset
  }
})
