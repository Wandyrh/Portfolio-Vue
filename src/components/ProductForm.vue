<template>
  <Form :key="mode + (product && product.id ? product.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="product-form">
    <div class="mb-3">
      <label for="categoryId" class="form-label">{{ $t('products.category') }}</label>
      <Field as="select" name="categoryId" class="form-control" id="categoryId">
        <option value="">{{ $t('products.selectCategory') }}</option>
        <option v-for="cat in categories || []" :key="cat?.id" :value="cat?.id">{{ cat?.name }}</option>
      </Field>
      <ErrorMessage name="categoryId" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">{{ $t('products.name') }}</label>
      <Field name="name" type="text" class="form-control" id="name" />
      <ErrorMessage name="name" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">{{ $t('products.description') }}</label>
      <Field name="description" type="text" class="form-control" id="description" />
      <ErrorMessage name="description" class="text-danger" />
    </div>
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">{{ $t('common.cancel') }}</button>
      <button type="submit" class="btn btn-success">
        {{ mode === 'edit' ? $t('common.update') : $t('common.create') }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { ProductDto, CreateProductDto, UpdateProductDto } from '../types/product'
import { getProductCategories } from '../services/productCategoryService'
import { ProductCategoryDto } from '../types/productCategory'

type ProductFormMode = 'create' | 'edit'

interface Props {
  mode: ProductFormMode
  product?: ProductDto | null
  initialValues?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  initialValues: () => ({
    categoryId: '',
    name: '',
    description: '',
  })
})

const emit = defineEmits<{
  submit: [value: CreateProductDto | UpdateProductDto]
  cancel: []
}>()

const { t } = useI18n()
const categories = ref<ProductCategoryDto[]>([])

onMounted(async () => {
  const result = await getProductCategories()
  categories.value = result?.data ?? []
})

const validationSchema = computed(() =>
  yup.object({
    categoryId: yup.string().required(t('products.validation.categoryRequired')),
    name: yup.string().required(t('products.validation.nameRequired')),
    description: yup.string().required(t('products.validation.descriptionRequired')),
  })
)

function onSubmit(values: Record<string, any>) {
  if (props.mode === 'edit' && props.product && props.product.id) {
    emit('submit', {
      id: props.product.id,
      categoryId: values.categoryId,
      name: values.name,
      description: values.description,
    } as UpdateProductDto)
  } else if (props.mode === 'create') {
    emit('submit', {
      categoryId: values.categoryId,
      name: values.name,
      description: values.description,
    } as CreateProductDto)
  }
}
</script>

<style scoped>
.product-form {
  min-width: 320px;
  max-width: 400px;
}
</style>