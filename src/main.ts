import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/global.css';

import Toast, { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
} as PluginOptions);
app.mount('#app');
