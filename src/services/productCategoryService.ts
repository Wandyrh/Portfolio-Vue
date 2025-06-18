import { ProductCategoryDto, CreateProductCategoryDto, UpdateProductCategoryDto } from '@/types/productCategory';
import { authFetch } from './authFetch';
import { apiUrl } from '../utils/config';
import { ApiResult } from '@/types/api';
import { PagedResult } from '../types/api';

const baseUrl = `${apiUrl}/ProductCategories`;

export const getProductCategories = async (): Promise<ProductCategoryDto[]> => {
  const response = await authFetch(baseUrl);
  return await response.json();
};

export const getProductCategory = async (id: string): Promise<ProductCategoryDto> => {
  const response = await authFetch(`${baseUrl}/${id}`);
  return await response.json();
};

export const createProductCategory = async (data: CreateProductCategoryDto): Promise<ProductCategoryDto> => {
  const response = await authFetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
};

export const updateProductCategory = async (id: string, data: UpdateProductCategoryDto): Promise<ProductCategoryDto> => {
  const response = await authFetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
};

export const deleteProductCategory = async (id: string): Promise<void> => {
  await authFetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
};

export const getProductCategoriesPaged = async (params: string): Promise<ApiResult<PagedResult<ProductCategoryDto>>> => {
  const response = await authFetch(`${baseUrl}/paged?${params}`);
  const data: ApiResult<PagedResult<ProductCategoryDto>> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
};