import { ApiResult } from '../types/api';
import { LoginDto, LoginUserResponseDTO } from '../types/auth';
import { apiUrl } from '../utils/config';
import { removeToken } from './tokenService';
import { useUsersStore } from '../stores/users';
import { useProductsStore } from '../stores/products';
import { useProductCategoriesStore } from '../stores/productCategories';

export async function login(dto: LoginDto): Promise<ApiResult<LoginUserResponseDTO>> {
  const response = await fetch(apiUrl + '/Authentication/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  const data: ApiResult<LoginUserResponseDTO> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Network response was not ok');
  }

  return data;
}

export function logout(): void {  
  try {
    const usersStore = useUsersStore();
    const productsStore = useProductsStore();
    const categoriesStore = useProductCategoriesStore();
    
    usersStore.$reset();
    productsStore.$reset();
    categoriesStore.$reset();
  } catch (error) {    
    console.warn('Error resetting stores during logout:', error);
  }  
  
  removeToken();
}