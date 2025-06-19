<template>
  <Form :key="mode + (user && user.id ? user.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="user-form">
    <div class="mb-3">
      <label for="firstName" class="form-label">{{ $t('users.firstName') }}</label>
      <Field name="firstName" type="text" class="form-control" id="firstName" />
      <ErrorMessage name="firstName" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="lastName" class="form-label">{{ $t('users.lastName') }}</label>
      <Field name="lastName" type="text" class="form-control" id="lastName" />
      <ErrorMessage name="lastName" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">{{ $t('users.email') }}</label>
      <Field name="email" type="email" class="form-control" id="email" />
      <ErrorMessage name="email" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">{{ $t('users.phone') }}</label>
      <Field name="phone" type="text" class="form-control" id="phone" />
      <ErrorMessage name="phone" class="text-danger" />
    </div>
    <div class="mb-3" v-if="mode === 'create'">
      <label for="password" class="form-label">{{ $t('users.password') }}</label>
      <Field name="password" type="password" class="form-control" id="password" />
      <ErrorMessage name="password" class="text-danger" />
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
import { defineComponent, PropType, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { UserDto, CreateUserDto, UpdateUserDto } from '../types/user';

type UserFormMode = 'create' | 'edit';

export default defineComponent({
  name: 'UserForm',
  components: { Form, Field, ErrorMessage },
  props: {
    mode: {
      type: String as PropType<UserFormMode>,
      required: true,
    },
    user: {
      type: Object as PropType<UserDto | null>,
      default: null,
    },
    initialValues: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
      }),
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const schema = computed(() =>
      yup.object({
      firstName: yup.string().required(t('users.validation.firstNameRequired')),
      lastName: yup.string().required(t('users.validation.lastNameRequired')),
      email: yup.string().email(t('users.validation.emailInvalid')).required(t('users.validation.emailRequired')),
      phone: yup.string().required(t('users.validation.phoneRequired')),
      ...(props.mode === 'create'
        ? { password: yup.string().min(6, t('users.validation.passwordMin')).required(t('users.validation.passwordRequired')) }
        : {}),
    })
    );


    watch(
      () => props.user,
      () => { },
      { immediate: true }
    );

    function onSubmit(values: Record<string, any>) {
      if (props.mode === 'edit' && props.user && props.user.id) {
        emit('submit', {
          id: props.user.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        } as UpdateUserDto);
      } else if (props.mode === 'create') {
        emit('submit', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        } as CreateUserDto);
      }
    }

    const validationSchema = schema.value;
    return { validationSchema, onSubmit };
  },
});
</script>

<style scoped>
.user-form {
  min-width: 320px;
  max-width: 400px;
}
</style>