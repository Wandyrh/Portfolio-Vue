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
    <div v-if="categoriesStore.loading">{{ $t('common.loading') }}</div>
    <div v-else-if="categoriesStore.error" class="error">{{ categoriesStore.error }}</div>

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
              <tr v-for="category in categoriesStore.categories" :key="category.id" class="entity-row">
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
        <div class="pagination" v-if="categoriesStore.pagedResult">
          <button :disabled="categoriesStore.page === 1" @click="categoriesStore.goToPage(categoriesStore.page - 1)">{{ $t('common.prev') }}</button>
          <span>{{ $t('common.page') }} {{ categoriesStore.page }} {{ $t('common.of') }} {{ categoriesStore.totalPages }}</span>
          <button :disabled="categoriesStore.page === categoriesStore.totalPages" @click="categoriesStore.goToPage(categoriesStore.page + 1)">{{ $t('common.next') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '../types/productCategory'
import ProductCategoryForm from '../components/ProductCategoryForm.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import { useModal } from '@/shared/composables/useModal'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import { useProductCategoriesStore } from '../store/productCategories'

const { t } = useI18n()
const toast = useToast()
const categoriesStore = useProductCategoriesStore()

// Modal management
const categoryModal = useModal<ProductCategoryDto>()

// Confirm dialog management
const confirmDialog = useConfirmDialog()

function showDeleteConfirm(category: ProductCategoryDto) {
  confirmDialog.show(
    t('productCategories.confirmDelete', { name: category.name }),
    category,
    () => handleDelete(category)
  )
}

async function handleDelete(category: ProductCategoryDto) {
  try {
    await categoriesStore.remove(category.id)
    toast.success(t('productCategories.deleted'))
  } catch (e: any) {
    toast.error(t('productCategories.errorDeleting'))
  }
}

function handleCategoryFormSubmit(dto: UpdateProductCategoryDto | CreateProductCategoryDto) {
  if (categoryModal.mode.value === 'edit' && categoryModal.selectedItem.value) {
    handleEditCategory(dto as UpdateProductCategoryDto)
  } else {
    handleCreateCategory(dto as CreateProductCategoryDto)
  }
}

async function handleEditCategory(dto: UpdateProductCategoryDto) {
  try {
    await categoriesStore.update(categoryModal.selectedItem.value!.id, dto)
    toast.success(t('productCategories.updated'))
    categoryModal.close()
  } catch (e: any) {
    toast.error(t('productCategories.errorUpdating'))
  }
}

async function handleCreateCategory(dto: CreateProductCategoryDto) {
  try {
    await categoriesStore.create(dto)
    toast.success(t('productCategories.created'))
    categoryModal.close()
  } catch (e: any) {
    toast.error(t('productCategories.errorCreating'))
  }
}

onMounted(categoriesStore.fetchCategories)
</script>
