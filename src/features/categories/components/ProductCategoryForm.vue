<template>
  <Form :key="mode + (category && category.id ? category.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="category-form" v-slot="{ errors, meta }">
    <div class="mb-3">
      <label for="name" class="form-label">{{ $t('productCategories.name') }}</label>
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
      <label for="description" class="form-label">{{ $t('productCategories.description') }}</label>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '../types/productCategory'
import { useValidation } from '@/shared/composables/useValidation'

type ProductCategoryFormMode = 'create' | 'edit'

interface Props {
  mode: ProductCategoryFormMode
  category?: ProductCategoryDto | null
  initialValues?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
  initialValues: () => ({
    name: '',
    description: '',
  })
})

const emit = defineEmits<{
  submit: [value: CreateProductCategoryDto | UpdateProductCategoryDto]
  cancel: []
}>()

const { t } = useI18n()
const { requiredStringRule, descriptionRule } = useValidation()

const validationSchema = computed(() =>
  yup.object({
    name: requiredStringRule(t('productCategories.name')),
    description: descriptionRule(),
  })
)

function onSubmit(values: Record<string, any>) {
  if (props.mode === 'edit' && props.category && props.category.id) {
    emit('submit', {
      id: props.category.id,
      name: values.name,
      description: values.description,
    } as UpdateProductCategoryDto)
  } else if (props.mode === 'create') {
    emit('submit', {
      name: values.name,
      description: values.description,
    } as CreateProductCategoryDto)
  }
}
</script>

<style scoped>
.category-form {
  min-width: 320px;
  max-width: 400px;
}
</style>