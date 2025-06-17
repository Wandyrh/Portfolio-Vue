<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-0">
    <div class="row w-100 justify-content-center m-0">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header text-center">
            <h3>Login</h3>
          </div>
          <div class="card-body">
            <Form @submit="onSubmit" :validation-schema="schema">
              <div v-if="errorMessage" class="alert alert-danger mb-3">{{ errorMessage }}</div>
              <div v-if="successMessage" class="alert alert-success mb-3">{{ successMessage }}</div>
              <div class="mb-3">
                <label for="email" class="form-label text-start">Email</label>
                <Field name="email" type="email" class="form-control" id="email" placeholder="Enter email" />
                <ErrorMessage name="email" class="text-danger" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label text-start">Password</label>
                <Field name="password" type="password" class="form-control" id="password"
                  placeholder="Enter password" />
                <ErrorMessage name="password" class="text-danger" />
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { login } from '../services/authService';
import { setToken } from '../services/tokenService';

export default defineComponent({
  name: 'LoginPage',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const schema = yup.object({
      email: yup.string().email('Email inválido').required('Email requerido'),
      password: yup.string().min(6, 'Mínimo 6 caracteres').required('Password requerido'),
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
          successMessage.value = 'Login successful!';
        } else {
          errorMessage.value = result.message || 'Login failed';
        }
      } catch (error) {       
        if (error instanceof Error) {
          errorMessage.value = error.message;
        } else {
          errorMessage.value = 'Error de red o servidor';
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

.form-label {
  text-align: left !important;
  display: block;
}
</style>