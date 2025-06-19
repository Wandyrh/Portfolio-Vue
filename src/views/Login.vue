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
              <div v-if="successMessage" class="alert alert-success mb-3">{{ successMessage }}</div>
              <div class="mb-3">
                <label for="email" class="form-label text-start">{{ $t('login.email') }}</label>
                <Field name="email" type="email" class="form-control" id="email" :placeholder="$t('login.email')" />
                <ErrorMessage name="email" class="text-danger" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label text-start">{{ $t('login.password') }}</label>
                <Field name="password" type="password" class="form-control" id="password"
                  :placeholder="$t('login.password')" />
                <ErrorMessage name="password" class="text-danger" />
              </div>
              <button type="submit" class="btn btn-primary w-100">{{ $t('login.loginButton') }}</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { login } from '../services/authService';
import { setToken } from '../services/tokenService';
import LanguageSelector from '../components/LanguageSelector.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LoginPage',
  components: {
    Form,
    Field,
    ErrorMessage,
    LanguageSelector,
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const schema = yup.object({
      email: yup
        .string()
        .email(t('login.validation.emailInvalid'))
        .required(t('login.validation.emailRequired')),
      password: yup
        .string()
        .min(6, t('login.validation.passwordMin'))
        .required(t('login.validation.passwordRequired')),
    });

    const errorMessage = ref('');
    const successMessage = ref('');

    const onSubmit = async (values: Record<string, any>) => {
      errorMessage.value = '';
      successMessage.value = '';
      try {
        const result = await login({
          userName: values.email,
          password: values.password,
        });

        if (result.success && result.data) {
          setToken(result.data.accessToken);
          successMessage.value = t('login.success');
          router.push('/users');
        } else {
          errorMessage.value = result.message || t('login.error');
        }
      } catch (error) {
        if (error instanceof Error) {
          errorMessage.value = error.message;
        } else {
          errorMessage.value = t('login.error');
        }
      }
    };

    return {
      schema,
      onSubmit,
      errorMessage,
      successMessage,
    };
  },
});
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