<template>
  <Form :key="mode + (user && user.id ? user.id : '')" @submit="onSubmit" :validation-schema="validationSchema"
    :initial-values="initialValues" class="user-form" v-slot="{ errors, meta }">
    <div class="mb-3">
      <label for="firstName" class="form-label">{{ $t('users.firstName') }}</label>
      <Field 
        name="firstName" 
        type="text" 
        class="form-control" 
        :class="{ 'is-invalid': errors.firstName, 'is-valid': meta.touched && !errors.firstName }"
        id="firstName"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="firstName" class="invalid-feedback" />
    </div>
    <div class="mb-3">
      <label for="lastName" class="form-label">{{ $t('users.lastName') }}</label>
      <Field 
        name="lastName" 
        type="text" 
        class="form-control" 
        :class="{ 'is-invalid': errors.lastName, 'is-valid': meta.touched && !errors.lastName }"
        id="lastName"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="lastName" class="invalid-feedback" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">{{ $t('users.email') }}</label>
      <Field 
        name="email" 
        type="email" 
        class="form-control" 
        :class="{ 'is-invalid': errors.email, 'is-valid': meta.touched && !errors.email }"
        id="email"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="email" class="invalid-feedback" />
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">{{ $t('users.phone') }}</label>
      <Field 
        name="phone" 
        type="text" 
        class="form-control" 
        :class="{ 'is-invalid': errors.phone, 'is-valid': meta.touched && !errors.phone }"
        id="phone"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="phone" class="invalid-feedback" />
    </div>
    <div class="mb-3" v-if="mode === 'create'">
      <label for="password" class="form-label">{{ $t('users.password') }}</label>
      <Field 
        name="password" 
        type="password" 
        class="form-control" 
        :class="{ 'is-invalid': errors.password, 'is-valid': meta.touched && !errors.password }"
        id="password"
        :validate-on-blur="true"
        :validate-on-input="true"
      />
      <ErrorMessage name="password" class="invalid-feedback" />
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
import { UserDto, CreateUserDto, UpdateUserDto } from '../types/user'
import { useValidation } from '@/shared/composables/useValidation'

type UserFormMode = 'create' | 'edit'

interface Props {
  mode: UserFormMode
  user?: UserDto | null
  initialValues?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  initialValues: () => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
})

const emit = defineEmits<{
  submit: [value: CreateUserDto | UpdateUserDto]
  cancel: []
}>()

const { t } = useI18n()
const { emailRule, passwordRuleSimple, nameRule, phoneRule } = useValidation()

const validationSchema = computed(() =>
  yup.object({
    firstName: nameRule(t('users.firstName')),
    lastName: nameRule(t('users.lastName')),
    email: emailRule(),
    phone: phoneRule(),
    ...(props.mode === 'create'
      ? { password: passwordRuleSimple() }
      : {}),
  })
)

function onSubmit(values: Record<string, any>) {
  if (props.mode === 'edit' && props.user && props.user.id) {
    emit('submit', {
      id: props.user.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
    } as UpdateUserDto)
  } else if (props.mode === 'create') {
    emit('submit', {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    } as CreateUserDto)
  }
}
</script>

<style scoped>
.user-form {
  min-width: 320px;
  max-width: 400px;
}
</style>