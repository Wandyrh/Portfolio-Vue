<template>
  <div>
    <div class="title-row">
      <h2 class="title-main">
        <span class="icon-entity" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path d="M3 7l7-4 7 4v6c0 3.3137-2.6863 6-6 6s-6-2.6863-6-6V7z" stroke="#42b883" stroke-width="2" fill="none"/>
            <circle cx="10" cy="11" r="2.5" stroke="#42b883" stroke-width="2" fill="none"/>
          </svg>
        </span>
        {{ $t('productCategories.title') }}
      </h2>
      <button class="add-entity-btn" @click="categoryModal.openCreate()">
        <span class="icon-plus" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#42b883" />
            <path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        {{ $t('productCategories.addCategory') }}
      </button>
    </div>
    <div v-if="loading">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="confirmDialog.isOpen.value"
      :title="$t('productCategories.deleteCategory')"
      :message="confirmDialog.message.value"
      @confirm="confirmDialog.confirm"
      @cancel="confirmDialog.cancel"
    />
    <div v-if="categoryModal.isOpen.value">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ categoryModal.mode.value === 'edit' ? $t('productCategories.editCategory') : $t('productCategories.addCategory') }}
              </h5>
              <button type="button" class="btn-close" @click="categoryModal.close"></button>
            </div>
            <div class="modal-body">
              <ProductCategoryForm
                :mode="categoryModal.mode.value"
                :category="categoryModal.mode.value === 'edit' ? categoryModal.selectedItem.value : null"
                :initial-values="categoryModal.mode.value === 'edit' && categoryModal.selectedItem.value ? {
                  name: categoryModal.selectedItem.value.name,
                  description: categoryModal.selectedItem.value.description
                } : {
                  name: '',
                  description: ''
                }"
                @submit="handleCategoryFormSubmit"
                @cancel="categoryModal.close"
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
                <th scope="col"><span class="th-bg">{{ $t('productCategories.name') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('productCategories.description') }}</span></th>
                <th scope="col"><span class="th-bg">{{ $t('common.actions') }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in pagedResult?.items" :key="category.id" class="entity-row">
                <td>{{ category.name }}</td>
                <td>{{ category.description }}</td>
                <td class="actions-cell">
                  <button class="action-btn" :title="$t('common.edit')" @click="categoryModal.openEdit(category)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#42b883" stroke-width="1.5" fill="none" />
                      <path d="M14.06 6.44l1.5-1.5a1.5 1.5 0 0 1 2.12 2.12l-1.5 1.5-2.12-2.12z" stroke="#42b883" stroke-width="1.5" fill="none" />
                    </svg>
                  </button>
                  <button class="action-btn" :title="$t('common.delete')" @click="showDeleteConfirm(category)">
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
  getProductCategoriesPaged,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} from '../services/productCategoryService'
import { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '../types/productCategory'
import ProductCategoryForm from '../components/ProductCategoryForm.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { PagedResult } from '../types/api'
import { useModal } from '../composables/useModal'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useCrud } from '../composables/useCrud'

const { t } = useI18n()

// Pagination state
const pagedResult = ref<PagedResult<ProductCategoryDto> | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const page = ref(1)
const pageSize = ref(5)

// Modal management
const categoryModal = useModal<ProductCategoryDto>()

// Confirm dialog management
const confirmDialog = useConfirmDialog()

// Pagination fetch function
const fetchCategories = async () => {
  loading.value = true
  error.value = null
  try {
    const params = `page=${page.value}&pageSize=${pageSize.value}`
    const result = await getProductCategoriesPaged(params)
    if (result.success && result.data) {
      pagedResult.value = result.data
    } else {
      error.value = result.message || t('productCategories.failedToLoad')
    }
  } catch (e: any) {
    error.value = e.message || t('productCategories.errorLoading')
  } finally {
    loading.value = false
  }
}

// CRUD operations
const categoryCrud = useCrud<ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto>(
  {
    create: createProductCategory,
    update: updateProductCategory,
    delete: deleteProductCategory
  },
  {
    created: 'productCategories.created',
    updated: 'productCategories.updated',
    deleted: 'productCategories.deleted',
    errorCreating: 'productCategories.errorCreating',
    errorUpdating: 'productCategories.errorUpdating',
    errorDeleting: 'productCategories.errorDeleting'
  },
  fetchCategories
)

function showDeleteConfirm(category: ProductCategoryDto) {
  confirmDialog.show(
    t('productCategories.confirmDelete', { name: category.name }),
    category,
    () => categoryCrud.remove(category.id)
  )
}

function handleCategoryFormSubmit(dto: UpdateProductCategoryDto | CreateProductCategoryDto) {
  if (categoryModal.mode.value === 'edit' && categoryModal.selectedItem.value) {
    categoryCrud.update(categoryModal.selectedItem.value.id, dto as UpdateProductCategoryDto)
    categoryModal.close()
  } else {
    categoryCrud.create(dto as CreateProductCategoryDto)
    categoryModal.close()
  }
}

const goToPage = (p: number) => {
  if (pagedResult.value && p >= 1 && p <= pagedResult.value.totalPages) {
    page.value = p
    fetchCategories()
  }
}

onMounted(fetchCategories)
</script>
