import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/global.css'

import Toast, { PluginOptions, useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'
import { ApiError } from './types/error'

const pinia = createPinia()

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
} as PluginOptions)

app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error Handler]', {
    error: err,
    component: instance,
    info
  })
  
  const toast = useToast()
  
  if (err instanceof ApiError) {
    return
  }
  
  if (import.meta.env.DEV) {
    toast.error(`Vue Error: ${err instanceof Error ? err.message : String(err)}`)
  } else {
    toast.error('An unexpected error occurred')
  }
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason)
  
  const toast = useToast()
  
  if (event.reason instanceof ApiError) {
    event.preventDefault()
    return
  }
  
  if (import.meta.env.DEV) {
    toast.error(`Unhandled Promise: ${event.reason instanceof Error ? event.reason.message : String(event.reason)}`)
  } else {
    toast.error('An unexpected error occurred')
  }
  
  event.preventDefault()
})

app.mount('#app')

