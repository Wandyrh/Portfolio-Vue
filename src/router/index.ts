import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('../components/MainLayout.vue'),
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
      },
      {
        path: 'product-categories',
        name: 'ProductCategories',
        component: () => import('../views/ProductCategories.vue'),
      },
      // Add more authenticated child routes here
      {
        path: '',
        redirect: { name: 'Users' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;