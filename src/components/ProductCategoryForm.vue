<template>
  <Form :key="mode + (category && category.id ? category.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="category-form">
    <div class="mb-3">
      <label for="name" class="form-label">{{ $t('productCategories.name') }}</label>
      <Field name="name" type="text" class="form-control" id="name" />
      <ErrorMessage name="name" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">{{ $t('productCategories.description') }}</label>
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

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '../types/productCategory';

type ProductCategoryFormMode = 'create' | 'edit';

export default defineComponent({
  name: 'ProductCategoryForm',
  components: { Form, Field, ErrorMessage },
  props: {
    mode: {
      type: String as PropType<ProductCategoryFormMode>,
      required: true,
    },
    category: {
      type: Object as PropType<ProductCategoryDto | null>,
      default: null,
    },
    initialValues: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({
        name: '',
        description: '',
      }),
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const schema = computed(() =>
      yup.object({
        name: yup.string().required(t('productCategories.validation.nameRequired')),
        description: yup.string().required(t('productCategories.validation.descriptionRequired')),
      })
    );

    function onSubmit(values: Record<string, any>) {
      if (props.mode === 'edit' && props.category && props.category.id) {
        emit('submit', {
          id: props.category.id,
          name: values.name,
          description: values.description,
        } as UpdateProductCategoryDto);
      } else if (props.mode === 'create') {
        emit('submit', {
          name: values.name,
          description: values.description,
        } as CreateProductCategoryDto);
      }
    }

    const validationSchema = schema.value;
    return { validationSchema, onSubmit };
  },
});
</script>

<style scoped>
.category-form {
  min-width: 320px;
  max-width: 400px;
}
</style>