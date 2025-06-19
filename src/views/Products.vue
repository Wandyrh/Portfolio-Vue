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
      <button class="add-entity-btn" @click="openProductModal">
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
      :show="showConfirmDialog"
      :title="$t('products.deleteProduct')"
      :message="confirmMessage"
      @confirm="confirmDeleteProduct"
      @cancel="cancelDeleteProduct"
    />
    <div v-if="showProductModal">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ productModalMode === 'edit' ? $t('products.editProduct') : $t('products.addProduct') }}
              </h5>
              <button type="button" class="btn-close" @click="closeProductModal"></button>
            </div>
            <div class="modal-body">
              <ProductForm
                :mode="productModalMode"
                :product="productModalMode === 'edit' ? selectedProduct : null"
                :initial-values="productModalMode === 'edit' && selectedProduct ? {
                  categoryId: selectedProduct.categoryId,
                  name: selectedProduct.name,
                  description: selectedProduct.description
                } : {
                  categoryId: '',
                  name: '',
                  description: ''
                }"
                @submit="handleProductFormSubmit"
                @cancel="closeProductModal"
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
                  <button class="action-btn" :title="$t('common.edit')" @click="openEditProductModal(product)">
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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getProductsPaged,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productService';
import { ProductDto, CreateProductDto, UpdateProductDto } from '../types/product';
import ProductForm from '../components/ProductForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { useToast } from 'vue-toastification';

import { PagedResult } from '../types/api';

export default defineComponent({
  name: 'ProductsView',
  setup() {
    const { t } = useI18n();
    const pagedResult = ref<PagedResult<ProductDto> | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const page = ref(1);
    const pageSize = ref(5);

    const toast = useToast();

    // Confirm dialog state
    const showConfirmDialog = ref(false);
    const confirmMessage = ref('');
    const productToDelete = ref<ProductDto | null>(null);

    function showDeleteConfirm(product: ProductDto) {
      productToDelete.value = product;
      confirmMessage.value = t('products.confirmDelete', { name: product.name });
      showConfirmDialog.value = true;
    }

    async function confirmDeleteProduct() {
      if (!productToDelete.value) return;
      try {
        loading.value = true;
        error.value = null;
        await deleteProduct(productToDelete.value.id);
        toast.success(t('products.deleted'));
        fetchProducts();
      } catch (e: any) {
        error.value = e.message || t('products.errorDeleting');
      } finally {
        loading.value = false;
        showConfirmDialog.value = false;
        productToDelete.value = null;
      }
    }

    function cancelDeleteProduct() {
      showConfirmDialog.value = false;
      productToDelete.value = null;
    }

    const showProductModal = ref(false);
    const productModalMode = ref<'create' | 'edit'>('create');
    const selectedProduct = ref<ProductDto | null>(null);

    function openProductModal() {
      productModalMode.value = 'create';
      selectedProduct.value = null;
      showProductModal.value = true;
    }
    function openEditProductModal(product: ProductDto) {
      productModalMode.value = 'edit';
      selectedProduct.value = product;
      showProductModal.value = true;
    }
    function closeProductModal() {
      showProductModal.value = false;
      selectedProduct.value = null;
    }

    function handleProductFormSubmit(dto: UpdateProductDto | CreateProductDto) {
      if (productModalMode.value === 'edit') {
        handleEditProduct(dto as UpdateProductDto)
      } else {
        handleCreateProduct(dto as CreateProductDto);
      }
    }

    async function handleEditProduct(dto: UpdateProductDto) {
      try {
        loading.value = true;
        error.value = null;
        await updateProduct(dto.id, dto);
        toast.success(t('products.updated'));
        closeProductModal();
        fetchProducts();
      } catch (e: any) {
        error.value = e.message || t('products.errorUpdating');
      } finally {
        loading.value = false;
      }
    }

    async function handleCreateProduct(dto: CreateProductDto) {
      try {
        loading.value = true;
        error.value = null;
        await createProduct(dto);
        toast.success(t('products.created'));
        closeProductModal();
        fetchProducts();
      } catch (e: any) {
        error.value = e.message || t('products.errorCreating');
      } finally {
        loading.value = false;
      }
    }

    const fetchProducts = async () => {
      loading.value = true;
      error.value = null;
      try {
        const params = `page=${page.value}&pageSize=${pageSize.value}`;
        const result = await getProductsPaged(params);
        if (result.success && result.data) {
          pagedResult.value = result.data;
        } else {
          error.value = result.message || t('products.failedToLoad');
        }
      } catch (e: any) {
        error.value = e.message || t('products.errorLoading');
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchProducts);

    const goToPage = (p: number) => {
      if (pagedResult.value && p >= 1 && p <= pagedResult.value.totalPages) {
        page.value = p;
        fetchProducts();
      }
    };

    return {
      pagedResult,
      loading,
      error,
      page,
      pageSize,
      goToPage,
      showProductModal,
      openProductModal,
      closeProductModal,
      handleCreateProduct,
      handleEditProduct,
      handleProductFormSubmit,
      showDeleteConfirm,
      showConfirmDialog,
      confirmMessage,
      confirmDeleteProduct,
      cancelDeleteProduct,
      openEditProductModal,
      productModalMode,
      selectedProduct,
    };
  },
  components: { ProductForm, ConfirmDialog },
});
</script>