import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { isAuthenticated } from '../services/tokenService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('../components/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'product-categories',
        name: 'ProductCategories',
        component: () => import('../views/ProductCategories.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/Products.vue'),
        meta: { requiresAuth: true },
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

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const authenticated = isAuthenticated();

  if (requiresAuth && !authenticated) {
    // Save the intended destination to redirect after login
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    });
  } else if (to.name === 'Login' && authenticated) {
    // If already authenticated and trying to access login, redirect to home
    next({ name: 'Users' });
  } else {
    next();
  }
});

export default router;