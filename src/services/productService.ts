import { ProductDto, CreateProductDto, UpdateProductDto } from '@/types/product';
import { authFetch } from './authFetch';
import { apiUrl } from '../utils/config';
import { ApiResult, PagedResult } from '../types/api';

const baseUrl = `${apiUrl}/Products`;

export const getProducts = async (): Promise<ProductDto[]> => {
  const response = await authFetch(baseUrl);
  return await response.json();
};

export const getProduct = async (id: string): Promise<ProductDto> => {
  const response = await authFetch(`${baseUrl}/${id}`);
  return await response.json();
};

export const createProduct = async (data: CreateProductDto): Promise<ProductDto> => {
  const response = await authFetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
};

export const updateProduct = async (id: string, data: UpdateProductDto): Promise<ProductDto> => {
  const response = await authFetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  await authFetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
};

export const getProductsPaged = async (params: string): Promise<ApiResult<PagedResult<ProductDto>>> => {
  const response = await authFetch(`${baseUrl}/paged?${params}`);
  const data: ApiResult<PagedResult<ProductDto>> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
};