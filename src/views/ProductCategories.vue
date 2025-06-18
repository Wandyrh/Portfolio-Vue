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
        Product Categories
      </h2>
      <button class="add-entity-btn" @click="openCategoryModal">
        <span class="icon-plus" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#42b883" />
            <path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        Add Category
      </button>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="showConfirmDialog"
      title="Delete Category"
      :message="confirmMessage"
      @confirm="confirmDeleteCategory"
      @cancel="cancelDeleteCategory"
    />
    <div v-if="showCategoryModal">
      <div class="modal-backdrop fade show custom-modal-backdrop"></div>
      <div class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ categoryModalMode === 'edit' ? 'Edit Category' : 'Add Category' }}
              </h5>
              <button type="button" class="btn-close" @click="closeCategoryModal"></button>
            </div>
            <div class="modal-body">
              <ProductCategoryForm
                :mode="categoryModalMode"
                :category="categoryModalMode === 'edit' ? selectedCategory : null"
                :initial-values="categoryModalMode === 'edit' && selectedCategory ? {
                  name: selectedCategory.name,
                  description: selectedCategory.description
                } : {
                  name: '',
                  description: ''
                }"
                @submit="handleCategoryFormSubmit"
                @cancel="closeCategoryModal"
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
                <th scope="col"><span class="th-bg">Name</span></th>
                <th scope="col"><span class="th-bg">Description</span></th>
                <th scope="col"><span class="th-bg">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in pagedResult?.items" :key="category.id" class="entity-row">
                <td>{{ category.name }}</td>
                <td>{{ category.description }}</td>
                <td class="actions-cell">
                  <button class="action-btn" title="Edit" @click="openEditCategoryModal(category)">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#42b883" stroke-width="1.5" fill="none" />
                      <path d="M14.06 6.44l1.5-1.5a1.5 1.5 0 0 1 2.12 2.12l-1.5 1.5-2.12-2.12z" stroke="#42b883" stroke-width="1.5" fill="none" />
                    </svg>
                  </button>
                  <button class="action-btn" title="Delete" @click="showDeleteConfirm(category)">
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
          <button :disabled="page === 1" @click="goToPage(page - 1)">Prev</button>
          <span>Page {{ page }} of {{ pagedResult.totalPages }}</span>
          <button :disabled="page === pagedResult.totalPages" @click="goToPage(page + 1)">Next</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  getProductCategoriesPaged,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} from '../services/productCategoryService';
import { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '../types/productCategory';
import ProductCategoryForm from '../components/ProductCategoryForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { useToast } from 'vue-toastification';

interface PagedResult<T> {
  items: T[];
  totalPages: number;
  totalItems: number;
}

export default defineComponent({
  name: 'ProductCategoriesView',
  setup() {
    const pagedResult = ref<PagedResult<ProductCategoryDto> | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const page = ref(1);
    const pageSize = ref(5);

    const toast = useToast();

    // Confirm dialog state
    const showConfirmDialog = ref(false);
    const confirmMessage = ref('');
    const categoryToDelete = ref<ProductCategoryDto | null>(null);

    function showDeleteConfirm(category: ProductCategoryDto) {
      categoryToDelete.value = category;
      confirmMessage.value = `Are you sure you want to delete "${category.name}"?`;
      showConfirmDialog.value = true;
    }

    async function confirmDeleteCategory() {
      if (!categoryToDelete.value) return;
      try {
        loading.value = true;
        error.value = null;
        await deleteProductCategory(categoryToDelete.value.id);
        toast.success("Category deleted");
        fetchCategories();
      } catch (e: any) {
        error.value = e.message || 'Error deleting category';
      } finally {
        loading.value = false;
        showConfirmDialog.value = false;
        categoryToDelete.value = null;
      }
    }

    function cancelDeleteCategory() {
      showConfirmDialog.value = false;
      categoryToDelete.value = null;
    }

    const showCategoryModal = ref(false);
    const categoryModalMode = ref<'create' | 'edit'>('create');
    const selectedCategory = ref<ProductCategoryDto | null>(null);

    function openCategoryModal() {
      categoryModalMode.value = 'create';
      selectedCategory.value = null;
      showCategoryModal.value = true;
    }
    function openEditCategoryModal(category: ProductCategoryDto) {
      categoryModalMode.value = 'edit';
      selectedCategory.value = category;
      showCategoryModal.value = true;
    }
    function closeCategoryModal() {
      showCategoryModal.value = false;
      selectedCategory.value = null;
    }

    function handleCategoryFormSubmit(dto: UpdateProductCategoryDto | CreateProductCategoryDto) {
      if (categoryModalMode.value === 'edit') {
        handleEditCategory(dto as UpdateProductCategoryDto)
      } else {
        handleCreateCategory(dto as CreateProductCategoryDto);
      }
    }

    async function handleEditCategory(dto: UpdateProductCategoryDto) {
      try {
        loading.value = true;
        error.value = null;
        await updateProductCategory(dto.id, dto);
        toast.success("Category updated");
        closeCategoryModal();
        fetchCategories();
      } catch (e: any) {
        error.value = e.message || 'Error updating category';
      } finally {
        loading.value = false;
      }
    }

    async function handleCreateCategory(dto: CreateProductCategoryDto) {
      try {
        loading.value = true;
        error.value = null;
        await createProductCategory(dto);
        toast.success("Category created");
        closeCategoryModal();
        fetchCategories();
      } catch (e: any) {
        error.value = e.message || 'Error creating category';
      } finally {
        loading.value = false;
      }
    }

    const fetchCategories = async () => {
      loading.value = true;
      error.value = null;
      try {
        const params = `page=${page.value}&pageSize=${pageSize.value}`;
        const result = await getProductCategoriesPaged(params);
        if (result.success && result.data) {
          pagedResult.value = result.data;
        } else {
          error.value = result.message || 'Failed to load categories';
        }
      } catch (e: any) {
        error.value = e.message || 'Error loading categories';
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchCategories);

    const goToPage = (p: number) => {
      if (pagedResult.value && p >= 1 && p <= pagedResult.value.totalPages) {
        page.value = p;
        fetchCategories();
      }
    };

    return {
      pagedResult,
      loading,
      error,
      page,
      pageSize,
      goToPage,
      showCategoryModal,
      openCategoryModal,
      closeCategoryModal,
      handleCreateCategory,
      handleEditCategory,
      handleCategoryFormSubmit,
      showDeleteConfirm,
      showConfirmDialog,
      confirmMessage,
      confirmDeleteCategory,
      cancelDeleteCategory,
      openEditCategoryModal,
      categoryModalMode,
      selectedCategory,
    };
  },
  components: { ProductCategoryForm, ConfirmDialog },
});
</script>
