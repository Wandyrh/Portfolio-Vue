import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../features/auth/store/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../features/auth/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('../shared/components/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('../features/users/views/UsersView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'product-categories',
        name: 'ProductCategories',
        component: () => import('../features/categories/views/ProductCategoriesView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../features/products/views/ProductsView.vue'),
        meta: { requiresAuth: true },
      },
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

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  const authStore = useAuthStore();
  authStore.checkAuth();
  const authenticated = authStore.isAuthenticated;

  if (requiresAuth && !authenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    });
  } else if (to.name === 'Login' && authenticated) {
    next({ name: 'Users' });
  } else {
    next();
  }
});

export default router;
