import { getToken } from './tokenService';
import router from '../router/index';

export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 || response.status === 403) {
    // Import dynamically to avoid circular dependency
    const { useAuthStore } = await import('../stores/auth');
    const authStore = useAuthStore();
    authStore.logout();
    router.push('/login');
  }
  return response;
}