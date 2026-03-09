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
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, meta }">
              <div v-if="errorMessage" class="alert alert-danger mb-3">{{ errorMessage }}</div>
              <div class="mb-3">
                <label for="email" class="form-label text-start">{{ $t('login.email') }}</label>
                <Field 
                  name="email" 
                  type="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.email, 'is-valid': meta.touched && !errors.email }"
                  id="email" 
                  :placeholder="$t('login.email')" 
                  :disabled="loading"
                  :validate-on-blur="true"
                  :validate-on-input="true"
                />
                <ErrorMessage name="email" class="invalid-feedback" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label text-start">{{ $t('login.password') }}</label>
                <Field 
                  name="password" 
                  type="password" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.password, 'is-valid': meta.touched && !errors.password }"
                  id="password"
                  :placeholder="$t('login.password')" 
                  :disabled="loading"
                  :validate-on-blur="true"
                  :validate-on-input="true"
                />
                <ErrorMessage name="password" class="invalid-feedback" />
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading || !meta.valid">
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
import { useAuthStore } from '../store/auth'
import { useValidation } from '@/shared/composables/useValidation'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { emailRule, passwordRuleSimple } = useValidation()

const schema = yup.object({
  email: emailRule(),
  password: passwordRuleSimple(),
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