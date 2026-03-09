<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-0">
    <div class="language-selector-login">
      <LanguageSelector />
    </div>
    <div class="row w-100 justify-content-center m-0">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header text-center">
            <h3>{{ $t('login.title') }}</h3>
          </div>
          <div class="card-body">
            <Form @submit="onSubmit" :validation-schema="schema">
              <div v-if="errorMessage" class="alert alert-danger mb-3">{{ errorMessage }}</div>
              <div class="mb-3">
                <label for="email" class="form-label text-start">{{ $t('login.email') }}</label>
                <Field name="email" type="email" class="form-control" id="email" :placeholder="$t('login.email')" :disabled="loading" />
                <ErrorMessage name="email" class="text-danger" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label text-start">{{ $t('login.password') }}</label>
                <Field name="password" type="password" class="form-control" id="password"
                  :placeholder="$t('login.password')" :disabled="loading" />
                <ErrorMessage name="password" class="text-danger" />
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading">{{ $t('common.loading') }}</span>
                <span v-else>{{ $t('login.loginButton') }}</span>
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import LanguageSelector from '@/shared/components/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()

const schema = yup.object({
  email: yup
    .string()
    .email(t('login.validation.emailInvalid'))
    .required(t('login.validation.emailRequired')),
  password: yup
    .string()
    .min(6, t('login.validation.passwordMin'))
    .required(t('login.validation.passwordRequired')),
})

const errorMessage = computed(() => authStore.error)
const loading = computed(() => authStore.loading)

const onSubmit = async (values: Record<string, any>) => {
  try {
    const result = await authStore.login({
      userName: values.email,
      password: values.password,
    })

    if (result.success && result.data) {
      // Redirect to the original intended destination or default to /users
      const redirect = route.query.redirect as string
      router.push(redirect || '/users')
    }
  } catch (error) {
    // Error is already set in the store
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #42b883 !important;
  color: #fff !important;
}

.language-selector-login {
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 10;
}
</style>