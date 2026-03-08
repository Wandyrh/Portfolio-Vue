<template>
  <div>
    <div class="title-row">
      <h2 class="title-main">
        <span class="icon-entity" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <polygon points="2,7 10,2 18,7 10,12" stroke="#42b883" stroke-width="2" fill="none"/>
            <polyline points="2,7 2,15 10,18 18,15 18,7" stroke="#42b883" stroke-width="2" fill="none"/>
            <line x1="10" y1="12" x2="10" y2="18" stroke="#42b883" stroke-width="2"/>
          </svg>
        </span>
        {{ $t('products.title') }}
      </h2>
      <button class="add-entity-btn" @click="productModal.openCreate()">
        <span class="icon-plus" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#42b883" />
            <path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        {{ $t('products.addProduct') }}
      </button>
    </div>
    <div v-if="loading">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ConfirmDialog
      :show="confirmDialog.isOpen.value"
      :title="$t('products.deleteProduct')"
      :message="confirmDialog.message.value"
      @confirm="confirmDialog.confirm"
      @cancel="confirmDialog.cancel"
    />
    <div v-if="productModal.isOpen.value">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ productModal.mode.value === 'edit' ? $t('products.editProduct') : $t('products.addProduct') }}
              </h5>
              <button type="button" class="btn-close" @click="productModal.close()"></button>
            </div>
            <div class="modal-body">
              <ProductForm
                :mode="productModal.mode.value"
                :product="productModal.mode.value === 'edit' ? productModal.selectedItem.value : null"
                :initial-values="productModal.mode.value === 'edit' && productModal.selectedItem.value ? {
                  categoryId: productModal.selectedItem.value.categoryId,
                  name: productModal.selectedItem.value.name,
                  description: productModal.selectedItem.value.description
                } : {
                  categoryId: '',
                  name: '',
                  description: ''
                }"
                @submit="handleProductFormSubmit"
                @cancel="productModal.close"
              />
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
                <th scope="col"><span class="th-bg">{{ $t('products.name') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('products.description') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('products.category') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('common.actions') }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in pagedResult?.items" :key="product.id" class="entity-row">
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.categoryName }}</td>
                <td class="actions-cell">
                  <button class="action-btn" :title="$t('common.edit')" @click="productModal.openEdit(product)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#42b883" stroke-width="1.5" fill="none" />
                      <path d="M14.06 6.44l1.5-1.5a1.5 1.5 0 0 1 2.12 2.12l-1.5 1.5-2.12-2.12z" stroke="#42b883" stroke-width="1.5" fill="none" />
                    </svg>
                  </button>
                  <button class="action-btn" :title="$t('common.delete')" @click="showDeleteConfirm(product)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M6 7v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" stroke="#e74c3c" stroke-width="1.5" fill="none" />
                      <path d="M9 10v4M11 10v4M4 7h12M8 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" stroke="#e74c3c" stroke-width="1.5" fill="none" />
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getProductsPaged,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productService'
import { ProductDto, CreateProductDto, UpdateProductDto } from '../types/product'
import ProductForm from '../components/ProductForm.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { PagedResult } from '../types/api'
import { useModal } from '../composables/useModal'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useCrud } from '../composables/useCrud'

const { t } = useI18n()

// Pagination state
const pagedResult = ref<PagedResult<ProductDto> | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const page = ref(1)
const pageSize = ref(5)

// Modal management
const productModal = useModal<ProductDto>()

// Confirm dialog management
const confirmDialog = useConfirmDialog()

// CRUD operations
const productCrud = useCrud<ProductDto, CreateProductDto, UpdateProductDto>(
  {
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct
  },
  {
    created: 'products.created',
    updated: 'products.updated',
    deleted: 'products.deleted',
    errorCreating: 'products.errorCreating',
    errorUpdating: 'products.errorUpdating',
    errorDeleting: 'products.errorDeleting'
  },
  fetchProducts
)

function showDeleteConfirm(product: ProductDto) {
  const message = t('products.confirmDelete', { name: product.name })
  confirmDialog.show(message, product, () => handleDelete(product))
}

async function handleDelete(product: ProductDto) {
  await productCrud.remove(product.id)
}

function handleProductFormSubmit(dto: UpdateProductDto | CreateProductDto) {
  if (productModal.mode.value === 'edit' && productModal.selectedItem.value) {
    handleEditProduct(dto as UpdateProductDto)
  } else {
    handleCreateProduct(dto as CreateProductDto)
  }
}

async function handleEditProduct(dto: UpdateProductDto) {
  await productCrud.update(dto.id, dto)
  productModal.close()
}

async function handleCreateProduct(dto: CreateProductDto) {
  await productCrud.create(dto)
  productModal.close()
}

async function fetchProducts() {
  loading.value = true
  error.value = null
  try {
    const params = `page=${page.value}&pageSize=${pageSize.value}`
    const result = await getProductsPaged(params)
    if (result.success && result.data) {
      pagedResult.value = result.data
    } else {
      error.value = result.message || t('products.failedToLoad')
    }
  } catch (e: any) {
    error.value = e.message || t('products.errorLoading')
  } finally {
    loading.value = false
  }
}

function goToPage(p: number) {
  if (pagedResult.value && p >= 1 && p <= pagedResult.value.totalPages) {
    page.value = p
    fetchProducts()
  }
}

onMounted(fetchProducts)
</script>