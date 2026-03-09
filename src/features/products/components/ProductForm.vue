<template>
  <Form :key="mode + (product && product.id ? product.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="product-form" v-slot="{ errors, meta }">
    <div class="mb-3">
      <label for="categoryId" class="form-label">{{ $t('products.category') }}</label>
      <Field 
        as="select" 
        name="categoryId" 
        class="form-control" 
        :class="{ 'is-invalid': errors.categoryId, 'is-valid': meta.touched && !errors.categoryId }"
        id="categoryId"
        :validate-on-blur="true"
        :validate-on-change="true"
      >
        <option value="">{{ $t('products.selectCategory') }}</option>
        <option v-for="cat in categories || []" :key="cat?.id" :value="cat?.id">{{ cat?.name }}</option>
      </Field>
      <ErrorMessage name="categoryId" class="invalid-feedback" />
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">{{ $t('products.name') }}</label>
      <Field 
        name="name" 
        type="text" 
        class="form-control" 
        :class="{ 'is-invalid': errors.name, 'is-valid': meta.touched && !errors.name }"
        id="name"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="name" class="invalid-feedback" />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">{{ $t('products.description') }}</label>
      <Field 
        name="description" 
        as="textarea"
        rows="3"
        class="form-control" 
        :class="{ 'is-invalid': errors.description, 'is-valid': meta.touched && !errors.description }"
        id="description"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="description" class="invalid-feedback" />
    </div>
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">{{ $t('common.cancel') }}</button>
      <button type="submit" class="btn btn-success" :disabled="!meta.valid">
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
import { getProductCategories } from '@/features/categories/services/productCategoryService'
import { ProductCategoryDto } from '@/features/categories/types/productCategory'
import { useValidation } from '@/shared/composables/useValidation'

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
const { requiredStringRule, selectRule, descriptionRule } = useValidation()
const categories = ref<ProductCategoryDto[]>([])

onMounted(async () => {
  const result = await getProductCategories()
  categories.value = result?.data ?? []
})

const validationSchema = computed(() =>
  yup.object({
    categoryId: selectRule(t('products.category')),
    name: requiredStringRule(t('products.name')),
    description: descriptionRule(),
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