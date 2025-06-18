import { ApiResult } from '../types/api';
import { apiUrl } from '../utils/config';
import { UserDto, CreateUserDto, UpdateUserDto } from '../types/user';
import { authFetch } from './authFetch';
 
export async function getUsers(): Promise<ApiResult<UserDto[]>> {
  const response = await authFetch(apiUrl + '/Users');
  const data: ApiResult<UserDto[]> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
}
 
export async function getUser(id: string): Promise<ApiResult<UserDto>> {
  const response = await authFetch(apiUrl + `/Users/${id}`);
  const data: ApiResult<UserDto> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
}
 
export async function createUser(dto: CreateUserDto): Promise<ApiResult<UserDto>> {
  const response = await authFetch(apiUrl + '/Users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const data: ApiResult<UserDto> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
}
 
export async function updateUser(id: string, dto: UpdateUserDto): Promise<ApiResult<UserDto>> {
  const response = await authFetch(apiUrl + `/Users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const data: ApiResult<UserDto> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
}
 
export async function deleteUser(id: string): Promise<ApiResult<null>> {
  const response = await authFetch(apiUrl + `/Users/${id}`, {
    method: 'DELETE',
  });
  const data: ApiResult<null> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
}
 
import { PagedResult } from '../types/api';

export async function getUsersPaged(page: number, pageSize: number): Promise<ApiResult<PagedResult<UserDto>>> {
  const response = await authFetch(apiUrl + `/Users/paged?page=${page}&pageSize=${pageSize}`);
  const data: ApiResult<PagedResult<UserDto>> = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Network response was not ok');
  return data;
}