<template>
  <Form :key="mode + (product && product.id ? product.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="product-form">
    <div class="mb-3">
      <label for="categoryId" class="form-label">Category</label>
      <Field as="select" name="categoryId" class="form-control" id="categoryId">
        <option value="">Select a category</option>
        <option v-for="cat in categories || []" :key="cat?.id" :value="cat?.id">{{ cat?.name }}</option>
      </Field>
      <ErrorMessage name="categoryId" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <Field name="name" type="text" class="form-control" id="name" />
      <ErrorMessage name="name" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <Field name="description" type="text" class="form-control" id="description" />
      <ErrorMessage name="description" class="text-danger" />
    </div>
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn-success">
        {{ mode === 'edit' ? 'Update' : 'Create' }}
      </button>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ProductDto, CreateProductDto, UpdateProductDto } from '../types/product';
import { getProductCategories } from '../services/productCategoryService';
import { ProductCategoryDto } from '../types/productCategory';

type ProductFormMode = 'create' | 'edit';

export default defineComponent({
  name: 'ProductForm',
  components: { Form, Field, ErrorMessage },
  props: {
    mode: {
      type: String as PropType<ProductFormMode>,
      required: true,
    },
    product: {
      type: Object as PropType<ProductDto | null>,
      default: null,
    },
    initialValues: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({
        categoryId: '',
        name: '',
        description: '',
      }),
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const categories = ref<ProductCategoryDto[]>([]);

    onMounted(async () => {
      const result = await getProductCategories();
      categories.value = result?.data ?? [];
    });

    const schema = computed(() =>
      yup.object({
        categoryId: yup.string().required('Category is required'),
        name: yup.string().required('Name is required'),
        description: yup.string().required('Description is required'),
      })
    );

    function onSubmit(values: Record<string, any>) {
      if (props.mode === 'edit' && props.product && props.product.id) {
        emit('submit', {
          id: props.product.id,
          categoryId: values.categoryId,
          name: values.name,
          description: values.description,
        } as UpdateProductDto);
      } else if (props.mode === 'create') {
        emit('submit', {
          categoryId: values.categoryId,
          name: values.name,
          description: values.description,
        } as CreateProductDto);
      }
    }

    const validationSchema = schema.value;
    return { validationSchema, onSubmit, categories };
  },
});
</script>

<style scoped>
.product-form {
  min-width: 320px;
  max-width: 400px;
}
</style>