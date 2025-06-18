<template>
  <Form :key="mode + (user && user.id ? user.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="user-form">
    <div class="mb-3">
      <label for="firstName" class="form-label">First Name</label>
      <Field name="firstName" type="text" class="form-control" id="firstName" />
      <ErrorMessage name="firstName" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="lastName" class="form-label">Last Name</label>
      <Field name="lastName" type="text" class="form-control" id="lastName" />
      <ErrorMessage name="lastName" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <Field name="email" type="email" class="form-control" id="email" />
      <ErrorMessage name="email" class="text-danger" />
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">Phone</label>
      <Field name="phone" type="text" class="form-control" id="phone" />
      <ErrorMessage name="phone" class="text-danger" />
    </div>
    <div class="mb-3" v-if="mode === 'create'">
      <label for="password" class="form-label">Password</label>
      <Field name="password" type="password" class="form-control" id="password" />
      <ErrorMessage name="password" class="text-danger" />
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
import { defineComponent, PropType, watch, computed } from 'vue';
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
    const schema = computed(() =>
      yup.object({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        phone: yup.string().required('Phone is required'),
        ...(props.mode === 'create'
          ? { password: yup.string().min(6, 'Min 6 characters').required('Password is required') }
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