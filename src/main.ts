import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/global.css';

import Toast, { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

const pinia = createPinia();

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
});

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(i18n);
app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
} as PluginOptions);

app.mount('#app');
