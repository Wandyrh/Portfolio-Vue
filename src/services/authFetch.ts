import { getToken, removeToken } from './tokenService';
import router from '../router/index';

export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 || response.status === 403) {
    removeToken();
    router.push('/login');
  }
  return response;
}